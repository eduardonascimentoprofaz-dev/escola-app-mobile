import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronRight } from "lucide-react";

type Turma = { id: string; nome: string };
type Materia = { id: string; nome: string };
type Aluno = { id: string; numero: number; nome: string; turmaId: string };
type Nota = {
  id: string;
  alunoId: string;
  materiaId: string;
  bimestre: number;
  n1: string;
  n2: string;
  n3: string;
  media: number;
};

const TURMAS_KEY = "escola_app_turmas";
const MATERIAS_KEY = "escola_app_materias";
const ALUNOS_KEY = "escola_app_alunos";
const NOTAS_KEY = "escola_app_notas";

function carregar<T>(key: string): T[] {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export default function AlunosListaPage() {
  const [selectedTurmaId, setSelectedTurmaId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [turmas] = useState<Turma[]>(carregar<Turma>(TURMAS_KEY));
  const [materias] = useState<Materia[]>(carregar<Materia>(MATERIAS_KEY));
  const [alunos] = useState<Aluno[]>(carregar<Aluno>(ALUNOS_KEY));
  const [notas] = useState<Nota[]>(carregar<Nota>(NOTAS_KEY));

  const alunosDaTurma = useMemo(() => {
    return alunos.filter((aluno) => aluno.turmaId === selectedTurmaId);
  }, [alunos, selectedTurmaId]);

  const alunosComMedia = useMemo(() => {
    return alunosDaTurma.map((aluno) => {
      const notasAluno = notas.filter((nota) => nota.alunoId === aluno.id);

      const mediasPorMateria: Record<string, number> = {};

      materias.forEach((materia) => {
        const notasMateria = notasAluno.filter((nota) => nota.materiaId === materia.id);

        if (notasMateria.length > 0) {
          mediasPorMateria[materia.id] =
            notasMateria.reduce((total, nota) => total + nota.media, 0) / notasMateria.length;
        }
      });

      const mediasArray = Object.values(mediasPorMateria);

      const mediaFinal =
        mediasArray.length > 0
          ? mediasArray.reduce((a, b) => a + b, 0) / mediasArray.length
          : null;

      return {
        ...aluno,
        mediaFinal,
        status:
          mediaFinal !== null
            ? mediaFinal >= 6
              ? "aprovado"
              : "reprovado"
            : "sem_notas",
      };
    });
  }, [alunosDaTurma, materias, notas]);

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
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Selecione uma turma e busque por aluno</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="turmaSelect">Turma</Label>
              <Select value={selectedTurmaId} onValueChange={setSelectedTurmaId}>
                <SelectTrigger id="turmaSelect">
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
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

      {selectedTurmaId && (
        <Card className="bg-white shadow-md border-0">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Alunos da Turma</CardTitle>
            <CardDescription>Total: {alunosFiltrados.length} aluno(s) encontrado(s)</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {alunosFiltrados.length > 0 ? (
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
                          <span
                            className={`text-sm font-semibold ${
                              aluno.status === "aprovado" ? "text-green-600" : "text-red-600"
                            }`}
                          >
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

            {alunosComMedia.some((a) => a.mediaFinal !== null) && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-600 font-semibold mb-2">Média Geral da Turma</p>
                <p className="text-3xl font-bold text-indigo-700">
                  {(
                    alunosComMedia
                      .filter((a) => a.mediaFinal !== null)
                      .reduce((sum, a) => sum + (a.mediaFinal || 0), 0) /
                    alunosComMedia.filter((a) => a.mediaFinal !== null).length
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