import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function AlunosPage() {
  const [formData, setFormData] = useState({
    numero: "",
    nome: "",
    turmaId: "",
  });

  const turmasQuery = trpc.turmas.list.useQuery();
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
  const alunosQuery = trpc.alunos.listByTurma.useQuery(selectedTurmaId || 0, {
    enabled: !!selectedTurmaId,
  });

  const createAlunoMutation = trpc.alunos.create.useMutation({
    onSuccess: () => {
      toast.success("Aluno criado com sucesso!");
      setFormData({ numero: "", nome: "", turmaId: "" });
      if (selectedTurmaId) {
        alunosQuery.refetch();
      }
    },
    onError: (error) => {
      toast.error(`Erro ao criar aluno: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero || !formData.nome || !formData.turmaId) {
      toast.error("Preencha todos os campos");
      return;
    }

    createAlunoMutation.mutate({
      numero: parseInt(formData.numero),
      nome: formData.nome,
      turmaId: parseInt(formData.turmaId),
    });
  };

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Cadastrar Novo Aluno</CardTitle>
          <CardDescription>Adicione um novo aluno ao sistema</CardDescription>
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
                <Select value={formData.turmaId} onValueChange={(value) => setFormData({ ...formData, turmaId: value })}>
                  <SelectTrigger id="turmaId">
                    <SelectValue placeholder="Selecione a turma" />
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
            </div>

            <Button type="submit" disabled={createAlunoMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              {createAlunoMutation.isPending ? "Criando..." : "Criar Aluno"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Seletor de Turma para Visualização */}
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Alunos por Turma</CardTitle>
          <CardDescription>Selecione uma turma para visualizar seus alunos</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
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

          {/* Lista de Alunos */}
          {selectedTurmaId && (
            <>
              {alunosQuery.isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : alunosQuery.data && alunosQuery.data.length > 0 ? (
                <div className="space-y-3">
                  {alunosQuery.data.map((aluno) => (
                    <div key={aluno.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                      <div>
                        <p className="font-semibold text-gray-900">Nº {aluno.numero} - {aluno.nome}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
