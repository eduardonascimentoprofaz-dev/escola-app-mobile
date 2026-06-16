import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronRight } from "lucide-react";

export default function AlunosListaPage() {
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notasMap, setNotasMap] = useState<Record<number, any[]>>({});

  const turmasQuery = trpc.turmas.list.useQuery();
  const alunosQuery = trpc.alunos.listByTurma.useQuery(selectedTurmaId || 0, {
    enabled: !!selectedTurmaId,
  });
  const materiasQuery = trpc.materias.list.useQuery();

  // Buscar notas para cada aluno quando a turma muda
  useEffect(() => {
    const fetchAllNotas = async () => {
      if (!alunosQuery.data) return;
      const map: Record<number, any[]> = {};
      
      for (const aluno of alunosQuery.data) {
        try {
          const notas = await (trpc.notas.getByAluno as any)(aluno.id);
          map[aluno.id] = notas;
        } catch (error) {
          map[aluno.id] = [];
        }
      }
      
      setNotasMap(map);
    };

    fetchAllNotas();
  }, [alunosQuery.data]);

  // Calcular média final por aluno
  const alunosComMedia = useMemo(() => {
    if (!alunosQuery.data || !materiasQuery.data) return [];

    return alunosQuery.data.map((aluno) => {
      const notas = notasMap[aluno.id] || [];

      // Calcular média por matéria
      const mediasPorMateria: Record<number, number> = {};
      materiasQuery.data?.forEach((materia) => {
        const notasMateria = notas.filter((n: any) => n.materiaId === materia.id);
        if (notasMateria.length > 0) {
          const medias = notasMateria
            .filter((n: any) => n.media)
            .map((n: any) => Number(n.media));
          if (medias.length > 0) {
            mediasPorMateria[materia.id] = medias.reduce((a: number, b: number) => a + b, 0) / medias.length;
          }
        }
      });

      // Calcular média final
      const mediasArray = Object.values(mediasPorMateria);
      const mediaFinal = mediasArray.length > 0 ? mediasArray.reduce((a: number, b: number) => a + b, 0) / mediasArray.length : null;

      return {
        ...aluno,
        mediaFinal,
        status: mediaFinal !== null ? (mediaFinal >= 6 ? "aprovado" : "reprovado") : "sem_notas",
      };
    });
  }, [alunosQuery.data, materiasQuery.data, notasMap]);

  // Filtrar alunos por busca
  const alunosFiltrados = useMemo(() => {
    if (!searchTerm) return alunosComMedia;
    return alunosComMedia.filter(
      (aluno) =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.numero.toString().includes(searchTerm)
    );
  }, [alunosComMedia, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "bg-green-100 text-green-800";
      case "reprovado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aprovado":
        return "✓ Aprovado";
      case "reprovado":
        return "✗ Reprovado";
      default:
        return "Sem notas";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Selecione uma turma e busque por aluno</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="turmaSelect">Turma</Label>
              <Select value={selectedTurmaId?.toString() || ""} onValueChange={(value) => setSelectedTurmaId(value ? parseInt(value) : null)}>
                <SelectTrigger id="turmaSelect">
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmasQuery.data?.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id.toString()}>
                      {turma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Buscar Aluno</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nome ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alunos */}
      {selectedTurmaId && (
        <Card className="bg-white shadow-md border-0">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Alunos da Turma</CardTitle>
            <CardDescription>Total: {alunosFiltrados.length} aluno(s) encontrado(s)</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {alunosQuery.isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : alunosFiltrados.length > 0 ? (
              <div className="space-y-3">
                {alunosFiltrados.map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-gray-600">Nº {aluno.numero}</span>
                        <h3 className="font-semibold text-gray-900">{aluno.nome}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(aluno.status)}`}>
                          {getStatusLabel(aluno.status)}
                        </span>
                        {aluno.mediaFinal !== null && (
                          <span className={`text-sm font-semibold ${
                            aluno.status === "aprovado" ? "text-green-600" : "text-red-600"
                          }`}>
                            Média: {aluno.mediaFinal.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? "Nenhum aluno encontrado com esse termo" : "Nenhum aluno cadastrado nesta turma"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resumo de Estatísticas */}
      {selectedTurmaId && alunosComMedia.length > 0 && (
        <Card className="bg-white shadow-md border-0">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Estatísticas da Turma</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-semibold">Aprovados</p>
                <p className="text-2xl font-bold text-green-700">
                  {alunosComMedia.filter((a) => a.status === "aprovado").length}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 font-semibold">Reprovados</p>
                <p className="text-2xl font-bold text-red-700">
                  {alunosComMedia.filter((a) => a.status === "reprovado").length}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold">Sem Notas</p>
                <p className="text-2xl font-bold text-gray-700">
                  {alunosComMedia.filter((a) => a.status === "sem_notas").length}
                </p>
              </div>
            </div>

            {/* Média Geral */}
            {alunosComMedia.some((a) => a.mediaFinal !== null) && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-600 font-semibold mb-2">Média Geral da Turma</p>
                <p className="text-3xl font-bold text-indigo-700">
                  {(
                    alunosComMedia
                      .filter((a) => a.mediaFinal !== null)
                      .reduce((sum, a) => sum + (a.mediaFinal || 0), 0) / alunosComMedia.filter((a) => a.mediaFinal !== null).length
                  ).toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
