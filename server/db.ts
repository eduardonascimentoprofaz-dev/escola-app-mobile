import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, turmas, alunos, materias, notas, Turma, Aluno, Materia, Nota } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== TURMAS ==========

export async function createTurma(data: { nome: string; anoEscolar: string; turma: string; periodo: string }): Promise<Turma> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(turmas).values(data);
  const id = result[0].insertId;
  
  const created = await db.select().from(turmas).where(eq(turmas.id, Number(id))).limit(1);
  return created[0];
}

export async function getTurmas(): Promise<Turma[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(turmas);
}

export async function getTurmaById(id: number): Promise<Turma | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(turmas).where(eq(turmas.id, id)).limit(1);
  return result[0];
}

// ========== ALUNOS ==========

export async function createAluno(data: { numero: number; nome: string; turmaId: number }): Promise<Aluno> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(alunos).values(data);
  const id = result[0].insertId;
  
  const created = await db.select().from(alunos).where(eq(alunos.id, Number(id))).limit(1);
  return created[0];
}

export async function getAlunosByTurma(turmaId: number): Promise<Aluno[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(alunos).where(eq(alunos.turmaId, turmaId));
}

export async function getAlunoById(id: number): Promise<Aluno | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(alunos).where(eq(alunos.id, id)).limit(1);
  return result[0];
}

export async function updateAluno(id: number, data: Partial<{ numero: number; nome: string; turmaId: number }>): Promise<Aluno | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(alunos).set(data).where(eq(alunos.id, id));
  return getAlunoById(id);
}

// ========== MATÉRIAS ==========

export async function createMateria(data: { nome: string; codigo?: string }): Promise<Materia> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(materias).values(data);
  const id = result[0].insertId;
  
  const created = await db.select().from(materias).where(eq(materias.id, Number(id))).limit(1);
  return created[0];
}

export async function getMaterias(): Promise<Materia[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(materias);
}

export async function getMateriaById(id: number): Promise<Materia | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(materias).where(eq(materias.id, id)).limit(1);
  return result[0];
}

// ========== NOTAS ==========

export async function createNota(data: { alunoId: number; materiaId: number; bimestre: number; n1?: number; n2?: number; n3?: number }): Promise<Nota> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Calculate media if all grades are provided
  let media: string | undefined;
  if (data.n1 !== undefined && data.n2 !== undefined && data.n3 !== undefined) {
    const avg = (data.n1 + data.n2 + data.n3) / 3;
    media = avg.toFixed(2);
  }

  const result = await db.insert(notas).values({
    alunoId: data.alunoId,
    materiaId: data.materiaId,
    bimestre: data.bimestre,
    n1: data.n1 !== undefined ? data.n1.toString() : undefined,
    n2: data.n2 !== undefined ? data.n2.toString() : undefined,
    n3: data.n3 !== undefined ? data.n3.toString() : undefined,
    media,
  } as any);
  const id = result[0].insertId;
  
  const created = await db.select().from(notas).where(eq(notas.id, Number(id))).limit(1);
  return created[0];
}

export async function updateNota(id: number, data: Partial<{ n1?: number; n2?: number; n3?: number }>): Promise<Nota | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  // Get current nota to calculate new media
  const current = await db.select().from(notas).where(eq(notas.id, id)).limit(1);
  if (!current[0]) return undefined;

  const n1 = data.n1 !== undefined ? data.n1 : (current[0].n1 ? Number(current[0].n1) : undefined);
  const n2 = data.n2 !== undefined ? data.n2 : (current[0].n2 ? Number(current[0].n2) : undefined);
  const n3 = data.n3 !== undefined ? data.n3 : (current[0].n3 ? Number(current[0].n3) : undefined);

  let media: string | undefined;
  if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
    const avg = (n1 + n2 + n3) / 3;
    media = avg.toFixed(2);
  }

  const updateData: any = {};
  if (data.n1 !== undefined) updateData.n1 = data.n1.toString();
  if (data.n2 !== undefined) updateData.n2 = data.n2.toString();
  if (data.n3 !== undefined) updateData.n3 = data.n3.toString();
  if (media !== undefined) updateData.media = media;

  await db.update(notas).set(updateData).where(eq(notas.id, id));

  const result = await db.select().from(notas).where(eq(notas.id, id)).limit(1);
  return result[0];
}

export async function getNotasByAluno(alunoId: number): Promise<Nota[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(notas).where(eq(notas.alunoId, alunoId));
}

export async function getNotasByAlunoAndMateria(alunoId: number, materiaId: number): Promise<Nota[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(notas).where(
    and(eq(notas.alunoId, alunoId), eq(notas.materiaId, materiaId))
  );
}

export async function getNotaByAlunoMateriaAndBimestre(alunoId: number, materiaId: number, bimestre: number): Promise<Nota | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(notas).where(
    and(
      eq(notas.alunoId, alunoId),
      eq(notas.materiaId, materiaId),
      eq(notas.bimestre, bimestre)
    )
  ).limit(1);

  return result[0];
}


export async function getNotasByTurmaAndBimestre(turmaId: number, bimestre: number): Promise<Nota[]> {
  const db = await getDb();
  if (!db) return [];

  const { and, eq } = await import("drizzle-orm");
  
  // Buscar todos os alunos da turma
  const alunosDaTurma = await db.select().from(alunos).where(eq(alunos.turmaId, turmaId));
  const alunoIds = alunosDaTurma.map(a => a.id);

  if (alunoIds.length === 0) return [];

  // Buscar todas as notas desses alunos no bimestre
  const { inArray } = await import("drizzle-orm");
  return await db.select().from(notas).where(
    and(
      inArray(notas.alunoId, alunoIds),
      eq(notas.bimestre, bimestre)
    )
  );
}
