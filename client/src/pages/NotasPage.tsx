import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, AlertCircle } from "lucide-react";

type Turma = { id: string; nome: string };
type Materia = { id: string; nome: string; codigo?: string };
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

function salvar<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

function gerarId() {
  return crypto.randomUUID();
}

function calcularMedia(n1: string, n2: string, n3: string) {
  const valores = [n1, n2, n3]
    .filter((n) => n !== "")
    .map(Number);

  if (valores.length === 0) return 0;

  return valores.reduce((a, b) => a + b, 0) / valores.length;
}

export default function NotasPage() {
  const [turmas] = useState<Turma[]>(carregar<Turma>(TURMAS_KEY));
  const [materias] = useState<Materia[]>(carregar<Materia>(MATERIAS_KEY));
  const [alunos] = useState<Aluno[]>(carregar<Aluno>(ALUNOS_KEY));
  const [notas, setNotas] = useState<Nota[]>(carregar<Nota>(NOTAS_KEY));

  const [selectedTurmaId, setSelectedTurmaId] = useState("");
  const [selectedAlunoId, setSelectedAlunoId] = useState("");
  const [selectedBimestre, setSelectedBimestre] = useState("1");

  const [notasForm, setNotasForm] = useState<Record<string, { n1: string; n2: string; n3: string }>>({});

  const alunosDaTurma = alunos.filter((aluno) => aluno.turmaId === selectedTurmaId);

  const notasAluno = notas.filter((nota) => nota.alunoId === selectedAlunoId);

  const salvarNota = (materiaId: string) => {
    if (!selectedAlunoId) {
      toast.error("Selecione um aluno");
      return;
    }

    const form = notasForm[materiaId] || { n1: "", n2: "", n3: "" };

    if (!form.n1 && !form.n2 && !form.n3) {
      toast.error("Preencha pelo menos uma nota");
      return;
    }

    const valores = [form.n1, form.n2, form.n3].filter(Boolean).map(Number);
    if (valores.some((v) => v < 0 || v > 10)) {
      toast.error("As notas devem estar entre 0 e 10");
      return;
    }

    const bimestre = Number(selectedBimestre);
    const media = calcularMedia(form.n1, form.n2, form.n3);

    const existente = notas.find(
      (n) =>
        n.alunoId === selectedAlunoId &&
        n.materiaId === materiaId &&
        n.bimestre === bimestre
    );

    let novaLista: Nota[];

    if (existente) {
      novaLista = notas.map((n) =>
        n.id === existente.id
          ? { ...n, n1: form.n1, n2: form.n2, n3: form.n3, media }
          : n
      );
      toast.success("Nota atualizada no aparelho!");
    } else {
      novaLista = [
        ...notas,
        {
          id: gerarId(),
          alunoId: selectedAlunoId,
          materiaId,
          bimestre,
          n1: form.n1,
          n2: form.n2,
          n3: form.n3,
          media,
        },
      ];
      toast.success("Nota salva no aparelho!");
    }

    setNotas(novaLista);
    salvar(NOTAS_KEY, novaLista);
  };

  const mediasPorMateria = useMemo(() => {
    const resultado: Record<string, number | null> = {};

    materias.forEach((materia) => {
      const notasMateria = notasAluno.filter((n) => n.materiaId === materia.id);

      if (notasMateria.length === 0) {
        resultado[materia.id] = null;
        return;
      }

      const media =
        notasMateria.reduce((total, nota) => total + nota.media, 0) / notasMateria.length;

      resultado[materia.id] = media;
    });

    return resultado;
  }, [materias, notasAluno]);

  const mediaFinal = useMemo(() => {
    const medias = Object.values(mediasPorMateria).filter(
      (m): m is number => m !== null
    );

    if (medias.length === 0) return null;

    return medias.reduce((a, b) => a + b, 0) / medias.length;
  }, [mediasPorMateria]);

  const getMediaColor = (media: number | null) => {
    if (media === null) return "text-gray-500";
    return media >= 6 ? "text-green-600 font-semibold" : "text-red-600 font-semibold";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Seleção de Aluno</CardTitle>
          <CardDescription>Escolha uma turma e um aluno para registrar notas</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Turma</Label>
              <Select
                value={selectedTurmaId}
                onValueChange={(value) => {
                  setSelectedTurmaId(value);
                  setSelectedAlunoId("");
                }}
              >
                <SelectTrigger>
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
              <Label>Aluno</Label>
              <Select value={selectedAlunoId} onValueChange={setSelectedAlunoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunosDaTurma.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      Nº {aluno.numero} - {aluno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label>Bimestre</Label>
              <Select value={selectedBimestre} onValueChange={setSelectedBimestre}>
                <SelectTrigger>
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

      {selectedAlunoId && (
        <>
          <Card className="bg-white shadow-md border-0">
            <CardHeader className="border-b border-gray-100">
              <CardTitle>Grade de Notas - {selectedBimestre}º Bimestre</CardTitle>
              <CardDescription>Registre as notas N1, N2 e N3 para cada matéria</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-4">
                {materias.map((materia) => {
                  const notaExistente = notas.find(
                    (n) =>
                      n.alunoId === selectedAlunoId &&
                      n.materiaId === materia.id &&
                      n.bimestre === Number(selectedBimestre)
                  );

                  const valores = notasForm[materia.id] || {
                    n1: notaExistente?.n1 || "",
                    n2: notaExistente?.n2 || "",
                    n3: notaExistente?.n3 || "",
                  };

                  return (
                    <div key={materia.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{materia.nome}</h3>
                        {notaExistente && (
                          <span className={`text-lg ${getMediaColor(notaExistente.media)}`}>
                            Média: {notaExistente.media.toFixed(1)}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {["n1", "n2", "n3"].map((campo, index) => (
                          <div key={campo}>
                            <Label className="text-xs">N{index + 1}</Label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              placeholder="0.0"
                              value={valores[campo as "n1" | "n2" | "n3"]}
                              onChange={(e) =>
                                setNotasForm({
                                  ...notasForm,
                                  [materia.id]: {
                                    ...valores,
                                    [campo]: e.target.value,
                                  },
                                })
                              }
                              className="text-center"
                            />
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => salvarNota(materia.id)}
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

          <Card className="bg-white shadow-md border-0">
            <CardHeader className="border-b border-gray-100">
              <CardTitle>Resumo de Desempenho</CardTitle>
              <CardDescription>Média por matéria e média final</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-3">
                {materias.map((materia) => {
                  const media = mediasPorMateria[materia.id];

                  return (
                    <div key={materia.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-900">{materia.nome}</span>

                      {media !== null ? (
                        <span className={`text-lg font-bold ${getMediaColor(media)}`}>
                          {media.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Sem notas</span>
                      )}
                    </div>
                  );
                })}

                {mediaFinal !== null && (
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
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}