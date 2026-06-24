import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Turma = {
  id: string;
  nome: string;
  anoEscolar: string;
  turma: string;
  periodo: string;
};

type Aluno = {
  id: string;
  numero: number;
  nome: string;
  turmaId: string;
};

const TURMAS_KEY = "escola_app_turmas";
const ALUNOS_KEY = "escola_app_alunos";

function carregarTurmas(): Turma[] {
  return JSON.parse(localStorage.getItem(TURMAS_KEY) || "[]");
}

function carregarAlunos(): Aluno[] {
  return JSON.parse(localStorage.getItem(ALUNOS_KEY) || "[]");
}

function salvarAlunos(alunos: Aluno[]) {
  localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));
}

export default function AlunosPage() {
  const [turmas] = useState<Turma[]>(carregarTurmas());
  const [alunos, setAlunos] = useState<Aluno[]>(carregarAlunos());
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>("");

  const [formData, setFormData] = useState({
    numero: "",
    nome: "",
    turmaId: "",
  });

  const alunosFiltrados = selectedTurmaId
    ? alunos.filter((aluno) => aluno.turmaId === selectedTurmaId)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.numero || !formData.nome || !formData.turmaId) {
      toast.error("Preencha todos os campos");
      return;
    }

    const novoAluno: Aluno = {
      id: crypto.randomUUID(),
      numero: Number(formData.numero),
      nome: formData.nome,
      turmaId: formData.turmaId,
    };

    const novaLista = [...alunos, novoAluno];
    setAlunos(novaLista);
    salvarAlunos(novaLista);

    toast.success("Aluno salvo no aparelho!");
    setFormData({ numero: "", nome: "", turmaId: "" });
  };

  const excluirAluno = (id: string) => {
    const novaLista = alunos.filter((aluno) => aluno.id !== id);
    setAlunos(novaLista);
    salvarAlunos(novaLista);
    toast.success("Aluno removido!");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Cadastrar Novo Aluno</CardTitle>
          <CardDescription>Os dados serão salvos no próprio aparelho</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="numero">Número do Aluno</Label>
                <Input
                  id="numero"
                  type="number"
                  placeholder="Ex: 1"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  min="1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  placeholder="Ex: João Silva"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div className="sm:col-span-3">
                <Label htmlFor="turmaId">Turma</Label>
                <Select
                  value={formData.turmaId}
                  onValueChange={(value) => setFormData({ ...formData, turmaId: value })}
                >
                  <SelectTrigger id="turmaId">
                    <SelectValue placeholder="Selecione a turma" />
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
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Aluno
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Alunos por Turma</CardTitle>
          <CardDescription>Selecione uma turma para visualizar seus alunos</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="mb-6">
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

          {selectedTurmaId && (
            <>
              {alunosFiltrados.length > 0 ? (
                <div className="space-y-3">
                  {alunosFiltrados.map((aluno) => (
                    <div
                      key={aluno.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          Nº {aluno.numero} - {aluno.nome}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => excluirAluno(aluno.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum aluno cadastrado nesta turma</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}