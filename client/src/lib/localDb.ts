export type Turma = { id: string; nome: string };
export type Materia = { id: string; nome: string };
export type Aluno = { id: string; nome: string; turmaId: string };
export type Nota = {
  id: string;
  alunoId: string;
  materiaId: string;
  bimestre: string;
  valor: number;
};

function getData<T>(key: string): T[] {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function setData<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const localDb = {
  turmas: {
    listar: () => getData<Turma>("turmas"),
    salvar: (item: Turma) => {
      const data = getData<Turma>("turmas");
      setData("turmas", [...data, item]);
    },
  },

  materias: {
    listar: () => getData<Materia>("materias"),
    salvar: (item: Materia) => {
      const data = getData<Materia>("materias");
      setData("materias", [...data, item]);
    },
  },

  alunos: {
    listar: () => getData<Aluno>("alunos"),
    salvar: (item: Aluno) => {
      const data = getData<Aluno>("alunos");
      setData("alunos", [...data, item]);
    },
  },

  notas: {
    listar: () => getData<Nota>("notas"),
    salvar: (item: Nota) => {
      const data = getData<Nota>("notas");
      setData("notas", [...data, item]);
    },
  },
};