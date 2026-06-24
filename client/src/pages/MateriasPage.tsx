import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Materia = {
  id: string;
  nome: string;
  codigo: string;
};

const STORAGE_KEY = "escola_app_materias";

function carregarMaterias(): Materia[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function salvarMaterias(materias: Materia[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
}

export default function MateriasPage() {
  const [materias, setMaterias] = useState<Materia[]>(carregarMaterias());

  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome) {
      toast.error("Preencha o nome da matéria");
      return;
    }

    const novaMateria: Materia = {
      id: crypto.randomUUID(),
      nome: formData.nome,
      codigo: formData.codigo,
    };

    const novaLista = [...materias, novaMateria];
    setMaterias(novaLista);
    salvarMaterias(novaLista);

    toast.success("Matéria salva no aparelho!");
    setFormData({ nome: "", codigo: "" });
  };

  const excluirMateria = (id: string) => {
    const novaLista = materias.filter((materia) => materia.id !== id);
    setMaterias(novaLista);
    salvarMaterias(novaLista);
    toast.success("Matéria removida!");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Cadastrar Nova Matéria</CardTitle>
          <CardDescription>Os dados serão salvos no próprio aparelho</CardDescription>
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

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Matéria
            </Button>
          </form>

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

      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Matérias Cadastradas</CardTitle>
          <CardDescription>Total: {materias.length} matéria(s)</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {materias.length > 0 ? (
            <div className="space-y-3">
              {materias.map((materia) => (
                <div
                  key={materia.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{materia.nome}</p>
                    {materia.codigo && (
                      <p className="text-sm text-gray-600">Código: {materia.codigo}</p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => excluirMateria(materia.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
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