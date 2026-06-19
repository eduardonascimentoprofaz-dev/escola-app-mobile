import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { importRouter } from "./routers/import";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========== TURMAS ==========
  turmas: router({
    create: protectedProcedure
      .input(z.object({
        nome: z.string().min(1),
        anoEscolar: z.string().min(1),
        turma: z.string().min(1),
        periodo: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        return await db.createTurma(input);
      }),

    list: protectedProcedure.query(async () => {
      return await db.getTurmas();
    }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getTurmaById(input);
      }),
  }),

  // ========== ALUNOS ==========
  alunos: router({
    create: protectedProcedure
      .input(z.object({
        numero: z.number().int().positive(),
        nome: z.string().min(1),
        turmaId: z.number().int().positive(),
      }))
      .mutation(async ({ input }) => {
        return await db.createAluno(input);
      }),

    listByTurma: protectedProcedure
      .input(z.number().int().positive())
      .query(async ({ input }) => {
        return await db.getAlunosByTurma(input);
      }),

    getById: protectedProcedure
      .input(z.number().int().positive())
      .query(async ({ input }) => {
        return await db.getAlunoById(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number().int().positive(),
        numero: z.number().int().positive().optional(),
        nome: z.string().min(1).optional(),
        turmaId: z.number().int().positive().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateAluno(id, data);
      }),
  }),

  // ========== MATÉRIAS ==========
  materias: router({
    create: protectedProcedure
      .input(z.object({
        nome: z.string().min(1),
        codigo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createMateria(input);
      }),

    list: protectedProcedure.query(async () => {
      return await db.getMaterias();
    }),

    getById: protectedProcedure
      .input(z.number().int().positive())
      .query(async ({ input }) => {
        return await db.getMateriaById(input);
      }),
  }),

  // ========== NOTAS ==========
  notas: router({
    create: protectedProcedure
      .input(z.object({
        alunoId: z.number().int().positive(),
        materiaId: z.number().int().positive(),
        bimestre: z.number().int().min(1).max(4),
        n1: z.number().min(0).max(10).optional(),
        n2: z.number().min(0).max(10).optional(),
        n3: z.number().min(0).max(10).optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createNota(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number().int().positive(),
        n1: z.number().min(0).max(10).optional(),
        n2: z.number().min(0).max(10).optional(),
        n3: z.number().min(0).max(10).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateNota(id, data);
      }),

    getByAluno: protectedProcedure
      .input(z.number().int().positive())
      .query(async ({ input }) => {
        return await db.getNotasByAluno(input);
      }),

    getByAlunoAndMateria: protectedProcedure
      .input(z.object({
        alunoId: z.number().int().positive(),
        materiaId: z.number().int().positive(),
      }))
      .query(async ({ input }) => {
        return await db.getNotasByAlunoAndMateria(input.alunoId, input.materiaId);
      }),

    getByAlunoMateriaAndBimestre: protectedProcedure
      .input(z.object({
        alunoId: z.number().int().positive(),
        materiaId: z.number().int().positive(),
        bimestre: z.number().int().min(1).max(4),
      }))
      .query(async ({ input }) => {
        return await db.getNotaByAlunoMateriaAndBimestre(input.alunoId, input.materiaId, input.bimestre);
      }),

    getByTurmaAndBimestre: protectedProcedure
      .input(z.object({
        turmaId: z.number().int().positive(),
        bimestre: z.number().int().min(1).max(4),
      }))
      .query(async ({ input }) => {
        return await db.getNotasByTurmaAndBimestre(input.turmaId, input.bimestre);
      }),
  }),

  // ========== IMPORTACAO ==========
  import: importRouter,
});

export type AppRouter = typeof appRouter;
