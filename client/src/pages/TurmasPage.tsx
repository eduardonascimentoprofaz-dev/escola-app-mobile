import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function TurmasPage() {
  const [formData, setFormData] = useState({
    nome: "",
    anoEscolar: "",
    turma: "",
    periodo: "",
  });

  const turmasQuery = trpc.turmas.list.useQuery();
  const createTurmaMutation = trpc.turmas.create.useMutation({
    onSuccess: () => {
      toast.success("Turma criada com sucesso!");
      setFormData({ nome: "", anoEscolar: "", turma: "", periodo: "" });
      turmasQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao criar turma: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.anoEscolar || !formData.turma || !formData.periodo) {
      toast.error("Preencha todos os campos");
      return;
    }

    createTurmaMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Cadastrar Nova Turma</CardTitle>
          <CardDescription>Adicione uma nova turma ao sistema</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="anoEscolar">Ano Escolar</Label>
                <Select value={formData.anoEscolar} onValueChange={(value) => setFormData({ ...formData, anoEscolar: value })}>
                  <SelectTrigger id="anoEscolar">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1º Ano">1º Ano</SelectItem>
                    <SelectItem value="2º Ano">2º Ano</SelectItem>
                    <SelectItem value="3º Ano">3º Ano</SelectItem>
                    <SelectItem value="4º Ano">4º Ano</SelectItem>
                    <SelectItem value="5º Ano">5º Ano</SelectItem>
                    <SelectItem value="6º Ano">6º Ano</SelectItem>
                    <SelectItem value="7º Ano">7º Ano</SelectItem>
                    <SelectItem value="8º Ano">8º Ano</SelectItem>
                    <SelectItem value="9º Ano">9º Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="turma">Turma</Label>
                <Select value={formData.turma} onValueChange={(value) => setFormData({ ...formData, turma: value })}>
                  <SelectTrigger id="turma">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="periodo">Período</Label>
                <Select value={formData.periodo} onValueChange={(value) => setFormData({ ...formData, periodo: value })}>
                  <SelectTrigger id="periodo">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                    <SelectItem value="Noite">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nome">Nome da Turma</Label>
                <Input
                  id="nome"
                  placeholder="Ex: 5º Ano A - Manhã"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" disabled={createTurmaMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              {createTurmaMutation.isPending ? "Criando..." : "Criar Turma"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Turmas */}
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Turmas Cadastradas</CardTitle>
          <CardDescription>Total: {turmasQuery.data?.length || 0} turma(s)</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {turmasQuery.isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : turmasQuery.data && turmasQuery.data.length > 0 ? (
            <div className="space-y-3">
              {turmasQuery.data.map((turma) => (
                <div key={turma.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                  <div>
                    <p className="font-semibold text-gray-900">{turma.nome}</p>
                    <p className="text-sm text-gray-600">{turma.anoEscolar} - Turma {turma.turma} - {turma.periodo}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma turma cadastrada. Crie uma para começar!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
