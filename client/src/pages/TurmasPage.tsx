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

const STORAGE_KEY = "escola_app_turmas";

function carregarTurmas(): Turma[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function salvarTurmas(turmas: Turma[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(turmas));
}

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>(carregarTurmas());

  const [formData, setFormData] = useState({
    nome: "",
    anoEscolar: "",
    turma: "",
    periodo: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.anoEscolar || !formData.turma || !formData.periodo) {
      toast.error("Preencha todos os campos");
      return;
    }

    const novaTurma: Turma = {
      id: crypto.randomUUID(),
      ...formData,
    };

    const novaLista = [...turmas, novaTurma];
    setTurmas(novaLista);
    salvarTurmas(novaLista);

    toast.success("Turma salva no aparelho!");
    setFormData({ nome: "", anoEscolar: "", turma: "", periodo: "" });
  };

  const excluirTurma = (id: string) => {
    const novaLista = turmas.filter((turma) => turma.id !== id);
    setTurmas(novaLista);
    salvarTurmas(novaLista);
    toast.success("Turma removida!");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Cadastrar Nova Turma</CardTitle>
          <CardDescription>Os dados serão salvos no próprio aparelho</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="anoEscolar">Ano Escolar</Label>
                <Select
                  value={formData.anoEscolar}
                  onValueChange={(value) => setFormData({ ...formData, anoEscolar: value })}
                >
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
                <Select
                  value={formData.turma}
                  onValueChange={(value) => setFormData({ ...formData, turma: value })}
                >
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
                <Select
                  value={formData.periodo}
                  onValueChange={(value) => setFormData({ ...formData, periodo: value })}
                >
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

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Turma
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Turmas Cadastradas</CardTitle>
          <CardDescription>Total: {turmas.length} turma(s)</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {turmas.length > 0 ? (
            <div className="space-y-3">
              {turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{turma.nome}</p>
                    <p className="text-sm text-gray-600">
                      {turma.anoEscolar} - Turma {turma.turma} - {turma.periodo}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => excluirTurma(turma.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
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