import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, GraduationCap, BarChart3 } from "lucide-react";
import TurmasPage from "./TurmasPage";
import MateriasPage from "./MateriasPage";
import AlunosPage from "./AlunosPage";
import NotasPage from "./NotasPage";

export default function Home() {
  const [activeTab, setActiveTab] = useState("turmas");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <img
            src="/icon.png"
            alt="Escola App Logo"
            className="h-16 w-16 object-contain rounded-2xl"
          />

          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Escola App
            </h1>
            <p className="text-sm text-gray-500">
              Gestão Escolar de Notas
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-md rounded-2xl border border-gray-200 p-1">
            <TabsTrigger value="turmas">
              <BookOpen className="w-5 h-5" />
            </TabsTrigger>

            <TabsTrigger value="materias">
              <BarChart3 className="w-5 h-5" />
            </TabsTrigger>

            <TabsTrigger value="alunos">
              <Users className="w-5 h-5" />
            </TabsTrigger>

            <TabsTrigger value="notas">
              <GraduationCap className="w-5 h-5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="turmas" className="mt-8">
            <TurmasPage />
          </TabsContent>

          <TabsContent value="materias" className="mt-8">
            <MateriasPage />
          </TabsContent>

          <TabsContent value="alunos" className="mt-8">
            <AlunosPage />
          </TabsContent>

          <TabsContent value="notas" className="mt-8">
            <NotasPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}