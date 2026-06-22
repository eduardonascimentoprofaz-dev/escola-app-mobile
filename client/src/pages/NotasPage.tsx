import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, AlertCircle, Download } from "lucide-react";
import { exportarBoletimAluno, exportarNotasPorBimestre } from "@/lib/pdfExport";

interface NotaFormData {
  alunoId: number;
  materiaId: number;
  bimestre: number;
  n1: string;
  n2: string;
  n3: string;
}

interface NotaDataFromAPI {
  id: number;
  alunoId: number;
  materiaId: number;
  bimestre: number;
  n1: string | null;
  n2: string | null;
  n3: string | null;
  media: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function NotasPage() {
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
  const [selectedAlunoId, setSelectedAlunoId] = useState<number | null>(null);
  const [selectedBimestre, setSelectedBimestre] = useState<number>(1);
  const [selectedBimestreExport, setSelectedBimestreExport] = useState<number>(1);
  const [notasForm, setNotasForm] = useState<Record<number, NotaFormData>>({});
  const [notasTurmaMap, setNotasTurmaMap] = useState<Record<number, any[]>>({});
  
  const utils = trpc.useUtils();

  const turmasQuery = trpc.turmas.list.useQuery();
  const alunosQuery = trpc.alunos.listByTurma.useQuery(selectedTurmaId || 0, {
    enabled: !!selectedTurmaId,
  });
  const materiasQuery = trpc.materias.list.useQuery();
  const notasQuery = trpc.notas.getByAluno.useQuery(selectedAlunoId || 0, {
    enabled: !!selectedAlunoId,
  });

  const createNotaMutation = trpc.notas.create.useMutation({
    onSuccess: () => {
      toast.success("Nota criada com sucesso!");
      if (selectedAlunoId) {
        notasQuery.refetch();
      }
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar nota: ${error.message}`);
    },
  });

  const updateNotaMutation = trpc.notas.update.useMutation({
    onSuccess: () => {
      toast.success("Nota atualizada com sucesso!");
      if (selectedAlunoId) {
        notasQuery.refetch();
      }
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar nota: ${error.message}`);
    },
  });

  // Calcular média por matéria e por bimestre
  const mediasPorMateria = useMemo(() => {
    if (!notasQuery.data) return {};

    const medias: Record<number, { bimestres: number[]; media: number | null }> = {};

    materiasQuery.data?.forEach((materia) => {
      const notasMateria = notasQuery.data.filter((n) => n.materiaId === materia.id);
      const bimestres = notasMateria
        .filter((n) => n.media)
        .map((n) => Number(n.media))
        .sort((a, b) => a - b);

      if (bimestres.length > 0) {
        const media = bimestres.reduce((a, b) => a + b, 0) / bimestres.length;
        medias[materia.id] = { bimestres, media };
      } else {
        medias[materia.id] = { bimestres: [], media: null };
      }
    });

    return medias;
  }, [notasQuery.data, materiasQuery.data]);

  // Calcular média final (média de todas as matérias)
  const mediaFinal = useMemo(() => {
    const medias = Object.values(mediasPorMateria)
      .filter((m) => m.media !== null)
      .map((m) => m.media as number);

    if (medias.length === 0) return null;
    return medias.reduce((a, b) => a + b, 0) / medias.length;
  }, [mediasPorMateria]);

  const handleSaveNota = (materiaId: number) => {
    if (!selectedAlunoId) {
      toast.error("Selecione um aluno");
      return;
    }

    const n1Str = notasForm[materiaId]?.n1 || "";
    const n2Str = notasForm[materiaId]?.n2 || "";
    const n3Str = notasForm[materiaId]?.n3 || "";

    // Validar que pelo menos uma nota foi preenchida
    if (!n1Str && !n2Str && !n3Str) {
      toast.error("Preencha pelo menos uma nota");
      return;
    }

    const n1 = n1Str ? parseFloat(n1Str) : undefined;
    const n2 = n2Str ? parseFloat(n2Str) : undefined;
    const n3 = n3Str ? parseFloat(n3Str) : undefined;

    // Validar valores
    if ((n1 !== undefined && (n1 < 0 || n1 > 10)) ||
        (n2 !== undefined && (n2 < 0 || n2 > 10)) ||
        (n3 !== undefined && (n3 < 0 || n3 > 10))) {
      toast.error("As notas devem estar entre 0 e 10");
      return;
    }

    // Verificar se já existe nota para este aluno, matéria e bimestre
    const notaExistente = notasQuery.data?.find(
      (n) => n.alunoId === selectedAlunoId && n.materiaId === materiaId && n.bimestre === selectedBimestre
    );

    if (notaExistente) {
      updateNotaMutation.mutate({
        id: notaExistente.id,
        n1,
        n2,
        n3,
      });
    } else {
      createNotaMutation.mutate({
        alunoId: selectedAlunoId,
        materiaId,
        bimestre: selectedBimestre,
        n1,
        n2,
        n3,
      });
    }
  };

  const getMediaColor = (media: number | null) => {
    if (media === null) return "text-gray-500";
    return media >= 6 ? "text-green-600 font-semibold" : "text-red-600 font-semibold";
  };

  return (
    <div className="space-y-6">
      {/* Seleção de Turma e Aluno */}
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Seleção de Aluno</CardTitle>
          <CardDescription>Escolha uma turma e um aluno para registrar notas</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="turmaSelect">Turma</Label>
              <Select value={selectedTurmaId?.toString() || ""} onValueChange={(value) => {
                setSelectedTurmaId(value ? parseInt(value) : null);
                setSelectedAlunoId(null);
              }}>
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
              <Label htmlFor="alunoSelect">Aluno</Label>
              <Select value={selectedAlunoId?.toString() || ""} onValueChange={(value) => setSelectedAlunoId(value ? parseInt(value) : null)}>
                <SelectTrigger id="alunoSelect">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunosQuery.data?.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id.toString()}>
                      Nº {aluno.numero} - {aluno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="bimestreSelect">Bimestre</Label>
              <Select value={selectedBimestre.toString()} onValueChange={(value) => setSelectedBimestre(parseInt(value))}>
                <SelectTrigger id="bimestreSelect">
                  <SelectValue placeholder="Selecione o bimestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1º Bimestre</SelectItem>
                  <SelectItem value="2">2º Bimestre</SelectItem>
                  <SelectItem value="3">3º Bimestre</SelectItem>
                  <SelectItem value="4">4º Bimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exportação por Bimestre */}
      {selectedTurmaId && (
        <Card className="bg-white shadow-md border-0">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-indigo-900">Exportar Notas por Bimestre</CardTitle>
            <CardDescription>Gere um relatório consolidado de todas as notas da turma para um bimestre específico</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="bimestreExportSelect">Selecione o Bimestre</Label>
                <Select value={selectedBimestreExport.toString()} onValueChange={(value) => setSelectedBimestreExport(parseInt(value))}>
                  <SelectTrigger id="bimestreExportSelect">
                    <SelectValue placeholder="Selecione o bimestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Bimestre</SelectItem>
                    <SelectItem value="2">2º Bimestre</SelectItem>
                    <SelectItem value="3">3º Bimestre</SelectItem>
                    <SelectItem value="4">4º Bimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={async () => {
                  const turma = turmasQuery.data?.find((t) => t.id === selectedTurmaId);
                  
                  if (turma && selectedTurmaId && alunosQuery.data) {
                    try {
                      // Buscar notas reais da turma
                      const notasReais = await utils.notas.getByTurmaAndBimestre.fetch({
                        turmaId: selectedTurmaId,
                        bimestre: selectedBimestreExport,
                      });
                      
                      // Construir mapa de notas
                      const notasMap: Record<number, any[]> = {};
                      alunosQuery.data.forEach((aluno) => {
                        notasMap[aluno.id] = notasReais.filter((nota: any) => nota.alunoId === aluno.id);
                      });
                      
                      exportarNotasPorBimestre(
                        turma,
                        selectedBimestreExport,
                        alunosQuery.data,
                        materiasQuery.data || [],
                        notasMap
                      );
                      toast.success(`Relatório do ${selectedBimestreExport}º bimestre exportado com sucesso!`);
                    } catch (error) {
                      toast.error('Erro ao exportar relatório');
                      console.error(error);
                    }
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                Exportar Bimestre
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grade de Notas */}
      {selectedAlunoId && (
        <>
          <Card className="bg-white shadow-md border-0">
            <CardHeader className="border-b border-gray-100">
              <CardTitle>Grade de Notas - {selectedBimestre}º Bimestre</CardTitle>
              <CardDescription>Registre as notas N1, N2 e N3 para cada matéria</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {materiasQuery.data?.map((materia) => {
                  const notaExistente = notasQuery.data?.find(
                    (n) => n.alunoId === selectedAlunoId && n.materiaId === materia.id && n.bimestre === selectedBimestre
                  );

                  return (
                    <div key={materia.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{materia.nome}</h3>
                        {notaExistente && (
                          <span className={`text-lg ${getMediaColor(Number(notaExistente.media || 0))}`}>
                            Média: {notaExistente.media}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {["n1", "n2", "n3"].map((campo, idx) => (
                          <div key={campo}>
                            <Label htmlFor={`${materia.id}-${campo}`} className="text-xs">
                              N{idx + 1}
                            </Label>
                            <Input
                              id={`${materia.id}-${campo}`}
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              placeholder="0.0"
                              value={notasForm[materia.id]?.[campo as keyof NotaFormData] !== undefined ? notasForm[materia.id]?.[campo as keyof NotaFormData] : (notaExistente ? String(notaExistente[campo as keyof typeof notaExistente] || "") : "")}
                              onChange={(e) => {
                                setNotasForm({
                                  ...notasForm,
                                  [materia.id]: {
                                    ...notasForm[materia.id],
                                    [campo]: e.target.value,
                                    alunoId: selectedAlunoId,
                                    materiaId: materia.id,
                                    bimestre: selectedBimestre,
                                  },
                                });
                              }}
                              className="text-center"
                            />
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleSaveNota(materia.id)}
                        disabled={createNotaMutation.isPending || updateNotaMutation.isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        size="sm"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Notas
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resumo de Médias */}
          <Card className="bg-white shadow-md border-0">
            <CardHeader className="border-b border-gray-100">
              <CardTitle>Resumo de Desempenho</CardTitle>
              <CardDescription>Média por matéria e média final</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {materiasQuery.data?.map((materia) => {
                  const media = mediasPorMateria[materia.id];
                  const mediaValue = media?.media;

                  return (
                    <div key={materia.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-900">{materia.nome}</span>
                      <div className="flex items-center gap-3">
                        {media?.bimestres.length ? (
                          <>
                            <span className="text-xs text-gray-600">
                              Bimestres: {media.bimestres.map((b) => b.toFixed(1)).join(", ")}
                            </span>
                            <span className={`text-lg font-bold px-3 py-1 rounded ${
                              mediaValue && mediaValue >= 6
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {mediaValue?.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">Sem notas</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Média Final */}
                {mediaFinal !== null && (
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-lg">Média Final</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                            mediaFinal >= 6
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {mediaFinal.toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2">
                            {mediaFinal >= 6 ? (
                              <div className="text-green-600">
                                <div className="text-2xl">✓</div>
                                <p className="text-xs font-semibold">Aprovado</p>
                              </div>
                            ) : (
                              <div className="text-red-600">
                                <AlertCircle className="w-6 h-6" />
                                <p className="text-xs font-semibold">Reprovado</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botão de Exportação */}
                    {selectedAlunoId && alunosQuery.data && notasQuery.data && (
                      <Button
                        onClick={() => {
                          const aluno = alunosQuery.data?.find((a) => a.id === selectedAlunoId);
                          const turma = turmasQuery.data?.find((t) => t.id === selectedTurmaId);
                          if (aluno && turma) {
                            const notasFormatadas = (notasQuery.data || []).map((n: any) => ({
                              ...n,
                              n1: n.n1 || 0,
                              n2: n.n2 || 0,
                              n3: n.n3 || 0,
                              media: n.media || 0,
                            }));
                            exportarBoletimAluno(aluno, turma, materiasQuery.data || [], notasFormatadas);
                            toast.success("Boletim exportado com sucesso!");
                          }
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Exportar Boletim em PDF
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
