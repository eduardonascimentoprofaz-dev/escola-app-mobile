import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface ParsedData {
  data: any[][];
  sheetName: string;
  rowCount: number;
}

export default function ImportacaoPage() {
  const [importType, setImportType] = useState<"alunos" | "notas">("alunos");
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState<{
    imported: number;
    total: number;
    errors: string[];
  } | null>(null);

  const turmasQuery = trpc.turmas.list.useQuery();
  const parseXLSXMutation = trpc.import.parseXLSX.useMutation();
  const importarAlunosMutation = trpc.import.importarAlunos.useMutation();
  const importarNotasMutation = trpc.import.importarNotas.useMutation();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Por favor, selecione um arquivo XLSX ou XLS");
      return;
    }

    setFileLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const base64 = content.split(",")[1] || content;

        const result = await parseXLSXMutation.mutateAsync({
          fileContent: base64,
        });

        if (result.success) {
          setParsedData(result as ParsedData);
          toast.success(`Arquivo carregado: ${result.rowCount} linhas encontradas`);
        } else {
          toast.error(`Erro ao processar arquivo: ${result.error}`);
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error(`Erro ao ler arquivo: ${error.message}`);
    } finally {
      setFileLoading(false);
    }
  };

  const handleImportAlunos = async () => {
    if (!parsedData || !selectedTurmaId) {
      toast.error("Selecione uma turma e carregue um arquivo");
      return;
    }

    setImportLoading(true);
    try {
      // Extrair dados do arquivo (esperado: número, nome)
      const alunosData = parsedData.data.slice(1).map((row: any[]) => ({
        numero: row[0],
        nome: row[1],
      }));

      const result = await importarAlunosMutation.mutateAsync({
        turmaId: selectedTurmaId,
        alunos: alunosData,
      });

      setImportProgress({
        imported: result.imported,
        total: result.total,
        errors: result.errors,
      });

      if (result.imported > 0) {
        toast.success(`${result.imported} aluno(s) importado(s) com sucesso!`);
      }
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} erro(s) durante importação`);
      }
    } catch (error: any) {
      toast.error(`Erro ao importar: ${error.message}`);
    } finally {
      setImportLoading(false);
    }
  };

  const handleImportNotas = async () => {
    if (!parsedData || !selectedTurmaId) {
      toast.error("Selecione uma turma e carregue um arquivo");
      return;
    }

    setImportLoading(true);
    try {
      // Extrair dados do arquivo (esperado: número_aluno, nome_aluno, materia, bimestre, n1, n2, n3)
      const notasData = parsedData.data.slice(1).map((row: any[]) => ({
        alunoNumero: row[0],
        alunoNome: row[1],
        materiaNome: row[2],
        bimestre: row[3],
        n1: row[4],
        n2: row[5],
        n3: row[6],
      }));

      const result = await importarNotasMutation.mutateAsync({
        turmaId: selectedTurmaId,
        notas: notasData,
      });

      setImportProgress({
        imported: result.imported,
        total: result.total,
        errors: result.errors,
      });

      if (result.imported > 0) {
        toast.success(`${result.imported} nota(s) importada(s) com sucesso!`);
      }
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} erro(s) durante importação`);
      }
    } catch (error: any) {
      toast.error(`Erro ao importar: ${error.message}`);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Importar Dados</CardTitle>
          <CardDescription>Importe alunos e notas a partir de arquivos XLSX</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={importType} onValueChange={(v) => setImportType(v as "alunos" | "notas")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alunos">Importar Alunos</TabsTrigger>
              <TabsTrigger value="notas">Importar Notas</TabsTrigger>
            </TabsList>

            {/* TAB: Importar Alunos */}
            <TabsContent value="alunos" className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Formato esperado:</strong> Coluna A = Número do Aluno, Coluna B = Nome do Aluno
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="turmaSelect">Turma</Label>
                  <Select value={selectedTurmaId?.toString() || ""} onValueChange={(v) => setSelectedTurmaId(v ? parseInt(v) : null)}>
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
                  <Label htmlFor="fileInput">Arquivo XLSX</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fileInput"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      disabled={fileLoading}
                      className="flex-1"
                    />
                    {fileLoading && <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />}
                  </div>
                </div>

                {parsedData && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Arquivo carregado: <strong>{parsedData.rowCount} linhas</strong>
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleImportAlunos}
                  disabled={!parsedData || !selectedTurmaId || importLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {importLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Alunos
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* TAB: Importar Notas */}
            <TabsContent value="notas" className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Formato esperado:</strong> A = Número Aluno, B = Nome Aluno, C = Matéria, D = Bimestre, E = N1, F = N2, G = N3
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="turmaNSelect">Turma</Label>
                  <Select value={selectedTurmaId?.toString() || ""} onValueChange={(v) => setSelectedTurmaId(v ? parseInt(v) : null)}>
                    <SelectTrigger id="turmaNSelect">
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
                  <Label htmlFor="fileInputNotas">Arquivo XLSX</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fileInputNotas"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      disabled={fileLoading}
                      className="flex-1"
                    />
                    {fileLoading && <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />}
                  </div>
                </div>

                {parsedData && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Arquivo carregado: <strong>{parsedData.rowCount} linhas</strong>
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleImportNotas}
                  disabled={!parsedData || !selectedTurmaId || importLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {importLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Notas
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Resultado da Importação */}
      {importProgress && (
        <Card className="bg-white shadow-md border-0">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Resultado da Importação</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-semibold">Importados</p>
                  <p className="text-3xl font-bold text-green-700">{importProgress.imported}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold">Total</p>
                  <p className="text-3xl font-bold text-gray-700">{importProgress.total}</p>
                </div>
              </div>

              {importProgress.errors.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-600 font-semibold mb-2">Erros ({importProgress.errors.length})</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {importProgress.errors.slice(0, 5).map((error, idx) => (
                      <p key={idx} className="text-xs text-red-600">
                        • {error}
                      </p>
                    ))}
                    {importProgress.errors.length > 5 && (
                      <p className="text-xs text-red-600 font-semibold">
                        ... e {importProgress.errors.length - 5} erro(s) mais
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">Instruções de Uso</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-indigo-800 space-y-2">
          <p>
            <strong>Para importar alunos:</strong> Crie um arquivo XLSX com duas colunas (Número e Nome). A primeira linha será ignorada (cabeçalho).
          </p>
          <p>
            <strong>Para importar notas:</strong> Crie um arquivo XLSX com sete colunas (Número Aluno, Nome Aluno, Matéria, Bimestre, N1, N2, N3). A primeira linha será ignorada.
          </p>
          <p>
            <strong>Dica:</strong> Certifique-se de que os nomes das matérias correspondem exatamente aos cadastrados no sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
