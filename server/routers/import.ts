import { z } from "zod";
import { eq } from "drizzle-orm";
import * as XLSX from "xlsx";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { turmas, alunos, materias, notas } from "../../drizzle/schema";

export const importRouter = router({
  parseXLSX: publicProcedure
    .input(z.object({ fileContent: z.string() }))
    .mutation(async ({ input }) => {
      try {
        // Decodificar base64
        const buffer = Buffer.from(input.fileContent, "base64");
        const workbook = XLSX.read(buffer, { type: "buffer" });

        // Obter primeira sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Converter para JSON
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        if (!data || data.length === 0) {
          throw new Error("Arquivo XLSX vazio ou inválido");
        }

        return {
          success: true,
          data,
          sheetName,
          rowCount: data.length,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || "Erro ao processar arquivo XLSX",
        };
      }
    }),

  importarAlunos: publicProcedure
    .input(
      z.object({
        turmaId: z.number(),
        alunos: z.array(
          z.object({
            numero: z.coerce.number(),
            nome: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Banco de dados não disponível");

      try {
        const insertedAlunos = [];
        const errors = [];

        for (const aluno of input.alunos) {
          try {
            // Validar dados
            if (!aluno.nome || !aluno.numero) {
              errors.push(`Aluno inválido: ${JSON.stringify(aluno)}`);
              continue;
            }

            // Inserir aluno
            await db.insert(alunos).values({
              turmaId: input.turmaId,
              numero: aluno.numero,
              nome: aluno.nome.trim(),
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            insertedAlunos.push(aluno);
          } catch (error: any) {
            errors.push(`Erro ao importar ${aluno.nome}: ${error.message}`);
          }
        }

        return {
          success: true,
          imported: insertedAlunos.length,
          errors,
          total: input.alunos.length,
        };
      } catch (error: any) {
        throw new Error(`Erro ao importar alunos: ${error.message}`);
      }
    }),

  importarNotas: publicProcedure
    .input(
      z.object({
        turmaId: z.number(),
        notas: z.array(
          z.object({
            alunoNumero: z.coerce.number(),
            alunoNome: z.string(),
            materiaNome: z.string(),
            bimestre: z.coerce.number(),
            n1: z.coerce.number().optional(),
            n2: z.coerce.number().optional(),
            n3: z.coerce.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Banco de dados não disponível");

      try {
        const insertedNotas = [];
        const errors = [];

        // Buscar todos os alunos da turma
        const alunosList = await db
          .select()
          .from(alunos)
          .where(eq(alunos.turmaId, input.turmaId));

        // Buscar todas as matérias
        const materiasList = await db.select().from(materias);

        for (const nota of input.notas) {
          try {
            // Encontrar aluno
            const aluno = alunosList.find(
              (a) =>
                a.numero === nota.alunoNumero || a.nome === nota.alunoNome
            );

            if (!aluno) {
              errors.push(
                `Aluno não encontrado: ${nota.alunoNome} (${nota.alunoNumero})`
              );
              continue;
            }

            // Encontrar matéria
            const materia = materiasList.find((m) => m.nome === nota.materiaNome);

            if (!materia) {
              errors.push(`Matéria não encontrada: ${nota.materiaNome}`);
              continue;
            }

            // Calcular média
            const valores = [nota.n1, nota.n2, nota.n3].filter(
              (v) => v !== undefined && v !== null
            );
            const media =
              valores.length > 0
                ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2)
                : null;

            // Inserir nota
            await db.insert(notas).values({
              alunoId: aluno.id,
              materiaId: materia.id,
              bimestre: nota.bimestre,
              n1: nota.n1 !== undefined ? String(nota.n1) : null,
              n2: nota.n2 !== undefined ? String(nota.n2) : null,
              n3: nota.n3 !== undefined ? String(nota.n3) : null,
              media: media ? String(media) : null,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            insertedNotas.push(nota);
          } catch (error: any) {
            errors.push(
              `Erro ao importar nota de ${nota.alunoNome}: ${error.message}`
            );
          }
        }

        return {
          success: true,
          imported: insertedNotas.length,
          errors,
          total: input.notas.length,
        };
      } catch (error: any) {
        throw new Error(`Erro ao importar notas: ${error.message}`);
      }
    }),
});
