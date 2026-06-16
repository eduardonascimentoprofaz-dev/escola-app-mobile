import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Turmas (Classes/Grades)
 * Represents a school class (e.g., "5º Ano A - Manhã")
 */
export const turmas = mysqlTable("turmas", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(), // e.g., "5º Ano A - Manhã"
  anoEscolar: varchar("anoEscolar", { length: 20 }).notNull(), // e.g., "5º Ano"
  turma: varchar("turma", { length: 10 }).notNull(), // e.g., "A"
  periodo: varchar("periodo", { length: 20 }).notNull(), // "Manhã" ou "Tarde"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Turma = typeof turmas.$inferSelect;
export type InsertTurma = typeof turmas.$inferInsert;

/**
 * Matérias (Subjects)
 * Represents a school subject (e.g., "Português", "Matemática")
 */
export const materias = mysqlTable("materias", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(), // e.g., "Português"
  codigo: varchar("codigo", { length: 20 }), // Optional: e.g., "PT"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Materia = typeof materias.$inferSelect;
export type InsertMateria = typeof materias.$inferInsert;

/**
 * Alunos (Students)
 * Represents a student enrolled in a class
 */
export const alunos = mysqlTable("alunos", {
  id: int("id").autoincrement().primaryKey(),
  numero: int("numero").notNull(), // Student number in class
  nome: varchar("nome", { length: 255 }).notNull(),
  turmaId: int("turmaId").notNull(), // Foreign key to turmas
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Aluno = typeof alunos.$inferSelect;
export type InsertAluno = typeof alunos.$inferInsert;

/**
 * Notas (Grades)
 * Stores individual grades for each student, subject, and bimester
 * Each record contains N1, N2, N3 for a specific bimester
 */
export const notas = mysqlTable("notas", {
  id: int("id").autoincrement().primaryKey(),
  alunoId: int("alunoId").notNull(), // Foreign key to alunos
  materiaId: int("materiaId").notNull(), // Foreign key to materias
  bimestre: int("bimestre").notNull(), // 1, 2, 3, or 4
  n1: decimal("n1", { precision: 4, scale: 2 }), // Grade 1 (0.00 - 10.00)
  n2: decimal("n2", { precision: 4, scale: 2 }), // Grade 2 (0.00 - 10.00)
  n3: decimal("n3", { precision: 4, scale: 2 }), // Grade 3 (0.00 - 10.00)
  media: decimal("media", { precision: 4, scale: 2 }), // Calculated average (0.00 - 10.00)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Nota = typeof notas.$inferSelect;
export type InsertNota = typeof notas.$inferInsert;
