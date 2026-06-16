# Projeto TODO - Escola App Mobile

## Fase 1: Modelo de Dados e Schema
- [x] Analisar estrutura da planilha
- [x] Definir tabelas: users, turmas, alunos, materias, notas
- [x] Criar schema no Drizzle ORM

## Fase 2: Banco de Dados e Rotas
- [x] Criar schema de banco de dados (turmas, alunos, materias, notas)
- [x] Implementar query helpers em server/db.ts
- [x] Criar routers tRPC para CRUD de turmas, alunos, materias
- [x] Criar routers tRPC para notas (criar, atualizar, listar)

## Fase 3: Telas de Cadastro
- [x] Criar página de cadastro de turmas
- [x] Criar página de cadastro de alunos
- [x] Criar página de cadastro de matérias
- [x] Implementar validação de formulários
- [x] Adicionar feedback visual (toasts de sucesso/erro)

## Fase 4: Grade de Notas
- [x] Criar página de grade de notas por aluno
- [x] Implementar campos N1, N2, N3 para cada bimestre (1º ao 4º)
- [x] Calcular média automática por matéria
- [x] Calcular média final (média dos 4 bimestres)
- [x] Indicador visual: verde (≥6.0) e vermelho (<6.0)
- [x] Salvar notas no banco de dados
- [x] Implementar edição de notas

## Fase 5: Listagem e Busca
- [x] Criar página de listagem de alunos com busca
- [x] Exibir status de aprovação visual (verde/vermelho)
- [x] Exibir média final de cada aluno
- [x] Estatísticas da turma (aprovados, reprovados, sem notas)

## Fase 6: Refinamento Visual e Testes
- [x] Design visual elegante (tipografia, cores, espaçamento)
- [x] Otimizado para Android (viewport, touch, responsividade)
- [x] Testes manuais em navegador
- [x] Criar checkpoint final

## Funcionalidades Implementadas
- [x] Projeto inicializado com scaffold web-db-user
- [x] Estrutura de pastas e configuração básica
- [x] Schema de banco de dados com 4 tabelas (turmas, alunos, materias, notas)
- [x] Migrations SQL criadas e aplicadas
- [x] Query helpers para todas as operações CRUD
- [x] Routers tRPC para turmas, alunos, matérias e notas
- [x] Página de cadastro de turmas com validação
- [x] Página de cadastro de matérias com sugestões padrão
- [x] Página de cadastro de alunos por turma
- [x] Página de notas com grade N1, N2, N3 por bimestre
- [x] Cálculo automático de média por matéria
- [x] Cálculo de média final (média de todas as matérias)
- [x] Indicadores visuais (verde/vermelho) baseados em média ≥6.0
- [x] Navegação por abas (Turmas, Matérias, Alunos, Notas)
- [x] Interface responsiva e elegante
- [x] Página de listagem de alunos com busca por nome/número
- [x] Status visual de aprovação (aprovado/reprovado/sem notas)
- [x] Estatísticas da turma (total aprovados, reprovados, sem notas)
- [x] Média geral da turma
- [x] Autenticação com Manus OAuth
- [x] Design mobile-first otimizado para Android
- [x] Componentes shadcn/ui para consistência visual
- [x] Feedback visual com toasts (sonner)
- [x] Validação de formulários com Zod
