import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, GraduationCap, BarChart3, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";
import TurmasPage from "./TurmasPage";
import MateriasPage from "./MateriasPage";
import AlunosPage from "./AlunosPage";
import NotasPage from "./NotasPage";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("turmas");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <GraduationCap className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Escola App</h1>
            <p className="text-gray-600">Gestão elegante de notas escolares</p>
          </div>
          <p className="text-gray-700 mb-6">
            Cadastre alunos, turmas e matérias. Acompanhe notas e desempenho com indicadores visuais intuitivos.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Entrar com Manus
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Escola App</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Bem-vindo, <span className="font-semibold">{user?.name || "Usuário"}</span></span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm rounded-lg border border-gray-200">
            <TabsTrigger value="turmas" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Turmas</span>
            </TabsTrigger>
            <TabsTrigger value="materias" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Matérias</span>
            </TabsTrigger>
            <TabsTrigger value="alunos" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Alunos</span>
            </TabsTrigger>
            <TabsTrigger value="notas" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Notas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="turmas" className="mt-6">
            <TurmasPage />
          </TabsContent>

          <TabsContent value="materias" className="mt-6">
            <MateriasPage />
          </TabsContent>

          <TabsContent value="alunos" className="mt-6">
            <AlunosPage />
          </TabsContent>

          <TabsContent value="notas" className="mt-6">
            <NotasPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
