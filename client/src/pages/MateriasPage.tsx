import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function MateriasPage() {
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
  });

  const materiasQuery = trpc.materias.list.useQuery();
  const createMateriaMutation = trpc.materias.create.useMutation({
    onSuccess: () => {
      toast.success("Matéria criada com sucesso!");
      setFormData({ nome: "", codigo: "" });
      materiasQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao criar matéria: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome) {
      toast.error("Preencha o nome da matéria");
      return;
    }

    createMateriaMutation.mutate(formData);
  };

  // Matérias padrão sugeridas
  const materiasDefault = [
    { nome: "Português", codigo: "PT" },
    { nome: "Matemática", codigo: "MT" },
    { nome: "História", codigo: "HT" },
    { nome: "Ciências", codigo: "CN" },
    { nome: "Geografia", codigo: "GG" },
    { nome: "Arte", codigo: "AT" },
    { nome: "Educação Física", codigo: "EF" },
    { nome: "Ensino Religioso", codigo: "ER" },
    { nome: "Inglês", codigo: "IN" },
  ];

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Cadastrar Nova Matéria</CardTitle>
          <CardDescription>Adicione uma nova matéria ao sistema</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome da Matéria</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Português"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="codigo">Código (opcional)</Label>
                <Input
                  id="codigo"
                  placeholder="Ex: PT"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  maxLength={5}
                />
              </div>
            </div>

            <Button type="submit" disabled={createMateriaMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              {createMateriaMutation.isPending ? "Criando..." : "Criar Matéria"}
            </Button>
          </form>

          {/* Matérias Sugeridas */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Matérias Sugeridas:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {materiasDefault.map((mat) => (
                <Button
                  key={mat.codigo}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ nome: mat.nome, codigo: mat.codigo })}
                  className="text-xs"
                >
                  {mat.nome}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Matérias */}
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Matérias Cadastradas</CardTitle>
          <CardDescription>Total: {materiasQuery.data?.length || 0} matéria(s)</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {materiasQuery.isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : materiasQuery.data && materiasQuery.data.length > 0 ? (
            <div className="space-y-3">
              {materiasQuery.data.map((materia) => (
                <div key={materia.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                  <div>
                    <p className="font-semibold text-gray-900">{materia.nome}</p>
                    {materia.codigo && <p className="text-sm text-gray-600">Código: {materia.codigo}</p>}
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma matéria cadastrada. Crie uma para começar!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
