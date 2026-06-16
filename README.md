# 📚 Escola App Mobile - Gestão Escolar de Notas

Um aplicativo web elegante e responsivo para gestão escolar de notas, otimizado para uso em dispositivos móveis Android. Permite cadastro de alunos, turmas, matérias, registro de notas por bimestre e acompanhamento visual do desempenho dos alunos.

**Versão:** 1.0.0  
**Tecnologia:** React 19 + TypeScript + Express + tRPC + MySQL  
**Status:** ✅ Produção  
**Domínio:** [escolaapp-x5ndie34.manus.space](https://escolaapp-x5ndie34.manus.space)

---

## 🎯 Funcionalidades Principais

### 1. **Gestão de Turmas**
- Criar turmas escolares com informações detalhadas
- Organizar por ano escolar (ex: 5º Ano), turma (A, B, C) e período (Manhã, Tarde)
- Listar e visualizar todas as turmas cadastradas
- Nomenclatura automática (ex: "5º Ano A - Manhã")

### 2. **Cadastro de Alunos**
- Adicionar alunos a turmas específicas
- Registrar número do aluno e nome completo
- Listar alunos por turma
- Buscar alunos por nome ou número
- Visualizar status de aprovação de cada aluno

### 3. **Gestão de Matérias**
- Cadastrar matérias escolares (Português, Matemática, História, etc.)
- Sugestões pré-preenchidas com matérias comuns
- Códigos opcionais para matérias
- Listar todas as matérias disponíveis

### 4. **Grade de Notas**
- Registrar notas N1, N2 e N3 para cada bimestre (1º ao 4º)
- Seleção intuitiva de aluno, matéria e bimestre
- Cálculo automático de média por matéria
- Cálculo de média final (média de todas as matérias)
- Indicadores visuais de aprovação:
  - 🟢 **Verde**: Média ≥ 6.0 (Aprovado)
  - 🔴 **Vermelho**: Média < 6.0 (Reprovado)
- Edição de notas já registradas
- Resumo visual de desempenho

### 5. **Listagem e Busca de Alunos**
- Visualizar todos os alunos de uma turma
- Buscar por nome ou número do aluno
- Status visual de aprovação (aprovado/reprovado/sem notas)
- Exibição de média final por aluno
- Estatísticas da turma:
  - Total de alunos aprovados
  - Total de alunos reprovados
  - Total de alunos sem notas
  - Média geral da turma

### 6. **Importação de Dados**
- Importar alunos a partir de arquivos XLSX
- Importar notas a partir de arquivos XLSX
- Parser robusto com validação de dados
- Feedback visual com progresso de importação
- Tratamento detalhado de erros com listagem de problemas
- Preview de dados antes da importação

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| **Backend** | Express 4, Node.js, tRPC 11 |
| **Banco de Dados** | MySQL/TiDB, Drizzle ORM |
| **Autenticação** | Manus OAuth |
| **UI Components** | shadcn/ui, Lucide Icons |
| **Notificações** | Sonner (Toast) |
| **Importação** | XLSX (xlsx library) |

### Estrutura de Banco de Dados

```sql
-- Usuários (autenticação)
users
├── id (PK)
├── openId (unique)
├── name
├── email
├── role (admin/user)
└── timestamps

-- Turmas (classes escolares)
turmas
├── id (PK)
├── nome (ex: "5º Ano A - Manhã")
├── anoEscolar
├── turma
├── periodo
└── timestamps

-- Alunos (estudantes)
alunos
├── id (PK)
├── numero (número do aluno)
├── nome
├── turmaId (FK → turmas)
└── timestamps

-- Matérias (disciplinas)
materias
├── id (PK)
├── nome
├── codigo (opcional)
└── timestamps

-- Notas (grades por bimestre)
notas
├── id (PK)
├── alunoId (FK → alunos)
├── materiaId (FK → materias)
├── bimestre (1-4)
├── n1 (nota 1)
├── n2 (nota 2)
├── n3 (nota 3)
├── media (calculada automaticamente)
└── timestamps
```

### Fluxo de Dados

```
Frontend (React)
    ↓
tRPC Client
    ↓
Backend (Express + tRPC)
    ↓
Database (MySQL)
    ↓
Response → Frontend
```

---

## 🚀 Como Usar

### Acesso ao Aplicativo

1. Abra o navegador e acesse: **[escolaapp-x5ndie34.manus.space](https://escolaapp-x5ndie34.manus.space)**
2. Faça login com sua conta Manus
3. Você será redirecionado para a página inicial

### Fluxo de Uso Recomendado

#### **Passo 1: Criar Turmas**
1. Clique na aba **"Turmas"**
2. Preencha os campos:
   - **Ano Escolar**: ex: "5º Ano"
   - **Turma**: ex: "A"
   - **Período**: "Manhã" ou "Tarde"
3. Clique em **"Criar Turma"**
4. A turma aparecerá na lista abaixo

#### **Passo 2: Cadastrar Matérias**
1. Clique na aba **"Matérias"**
2. Clique em **"Adicionar Matéria"** (ou use as sugestões pré-preenchidas)
3. Digite o nome da matéria (ex: "Português", "Matemática")
4. Clique em **"Criar Matéria"**

#### **Passo 3: Adicionar Alunos**
1. Clique na aba **"Alunos"**
2. Selecione a turma no dropdown
3. Preencha:
   - **Número do Aluno**: número sequencial (1, 2, 3...)
   - **Nome do Aluno**: nome completo
4. Clique em **"Adicionar Aluno"**
5. Alunos aparecem na lista abaixo

#### **Passo 4: Registrar Notas**
1. Clique na aba **"Notas"**
2. Selecione:
   - **Turma**: escolha a turma
   - **Aluno**: escolha o aluno
   - **Bimestre**: 1º, 2º, 3º ou 4º
3. Para cada matéria, preencha N1, N2 e N3
4. Clique em **"Salvar Notas"**
5. A média é calculada automaticamente
6. Visualize o status visual (verde/vermelho) na seção "Resumo de Desempenho"

#### **Passo 5: Visualizar Desempenho**
1. Clique na aba **"Alunos"** (Listagem)
2. Selecione a turma
3. Visualize:
   - Status de aprovação (verde/vermelho)
   - Média final de cada aluno
   - Estatísticas da turma

#### **Passo 6: Importar Dados (Opcional)**
1. Clique na aba **"Importação"**
2. Escolha entre **"Importar Alunos"** ou **"Importar Notas"**
3. Selecione a turma
4. Clique em **"Selecionar Arquivo"** e escolha um XLSX
5. Clique em **"Importar"**
6. Visualize o resultado com quantidade importada e erros

---

## 📊 Formato de Importação

### Importar Alunos (XLSX)

| Coluna A | Coluna B |
|----------|----------|
| Número | Nome |
| 1 | João Silva |
| 2 | Maria Santos |
| 3 | Pedro Oliveira |

**Exemplo de arquivo:** `alunos.xlsx`

### Importar Notas (XLSX)

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Número Aluno | Nome Aluno | Matéria | Bimestre | N1 | N2 | N3 |
| 1 | João Silva | Português | 1 | 8.5 | 7.0 | 8.0 |
| 1 | João Silva | Matemática | 1 | 9.0 | 8.5 | 9.5 |
| 2 | Maria Santos | Português | 1 | 9.5 | 9.0 | 9.5 |

**Exemplo de arquivo:** `notas.xlsx`

---

## 🎨 Interface e Design

### Tema Visual
- **Paleta de Cores**: Azul indigo (primário), verde (aprovação), vermelho (reprovação)
- **Tipografia**: Inter (Google Fonts)
- **Componentes**: shadcn/ui para consistência
- **Ícones**: Lucide React

### Responsividade
- ✅ Otimizado para Android (viewport 375px)
- ✅ Tablet (768px)
- ✅ Desktop (1280px+)
- ✅ Touch-friendly com espaçamento adequado
- ✅ Navegação por abas em mobile

### Acessibilidade
- ✅ Contraste de cores adequado
- ✅ Rótulos de formulário associados
- ✅ Navegação por teclado
- ✅ Feedback visual claro

---

## 🔐 Autenticação e Segurança

### Autenticação
- **Sistema**: Manus OAuth 2.0
- **Fluxo**: Login automático ao acessar o app
- **Sessão**: Mantida via cookie seguro
- **Logout**: Disponível no menu superior

### Autorização
- Todos os endpoints requerem autenticação
- Usuários só veem seus próprios dados
- Suporte para roles (admin/user) para expansão futura

### Dados Sensíveis
- Senhas: Gerenciadas pelo Manus OAuth
- Notas: Armazenadas com criptografia em trânsito (HTTPS)
- Banco de dados: Backups automáticos

---

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 22+
- pnpm 10+
- Git

### Instalação Local

```bash
# Clonar repositório
git clone <repository-url>
cd escola-app-mobile

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Executar em desenvolvimento
pnpm dev

# Acessar em http://localhost:3000
```

### Estrutura de Pastas

```
escola-app-mobile/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas (Turmas, Alunos, Notas, etc)
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── lib/              # Utilitários (tRPC client)
│   │   ├── contexts/         # Contextos React
│   │   └── App.tsx           # Roteamento principal
│   └── index.html
├── server/                    # Backend Express
│   ├── routers/              # Routers tRPC (turmas, alunos, etc)
│   ├── db.ts                 # Query helpers
│   ├── routers.ts            # Agregação de routers
│   └── _core/                # Infraestrutura (auth, OAuth, etc)
├── drizzle/                  # Migrations e schema
│   ├── schema.ts             # Definição de tabelas
│   └── migrations/           # Arquivos SQL
├── shared/                   # Código compartilhado
├── package.json
└── README.md
```

### Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento

# Build
pnpm build            # Compila para produção

# Testes
pnpm test             # Executa testes com Vitest

# Linting
pnpm format           # Formata código com Prettier
pnpm check            # Verifica tipos TypeScript

# Database
pnpm drizzle-kit generate  # Gera migrations
pnpm drizzle-kit migrate   # Aplica migrations
```

### Adicionando Nova Funcionalidade

1. **Atualizar Schema** (`drizzle/schema.ts`)
   ```typescript
   export const novaTabela = mysqlTable("nova_tabela", {
     id: int("id").autoincrement().primaryKey(),
     // ... colunas
   });
   ```

2. **Gerar Migration**
   ```bash
   pnpm drizzle-kit generate
   ```

3. **Aplicar Migration**
   ```bash
   pnpm drizzle-kit migrate
   ```

4. **Criar Query Helper** (`server/db.ts`)
   ```typescript
   export async function getNovaTabela() {
     const db = await getDb();
     return await db.select().from(novaTabela);
   }
   ```

5. **Criar Router tRPC** (`server/routers/nova.ts`)
   ```typescript
   export const novaRouter = router({
     list: protectedProcedure.query(async () => {
       return await db.getNovaTabela();
     }),
   });
   ```

6. **Integrar Router** (`server/routers.ts`)
   ```typescript
   export const appRouter = router({
     nova: novaRouter,
     // ...
   });
   ```

7. **Criar Página React** (`client/src/pages/NovaPage.tsx`)
   ```typescript
   export default function NovaPage() {
     const query = trpc.nova.list.useQuery();
     // ...
   }
   ```

---

## 📈 Métricas e Monitoramento

### Dados Coletados
- Acessos ao aplicativo (via Umami Analytics)
- Operações CRUD (criação, leitura, atualização)
- Erros e exceções

### Dashboard
- Disponível em: Management UI → Dashboard
- Visualiza: Visualizações, Pageviews, Usuários únicos

---

## 🐛 Troubleshooting

### Problema: "Arquivo XLSX não é reconhecido"
**Solução**: Certifique-se de que o arquivo está em formato `.xlsx` (não `.xls` antigo ou `.csv`)

### Problema: "Aluno não encontrado durante importação"
**Solução**: Verifique se o número ou nome do aluno corresponde exatamente aos cadastrados

### Problema: "Matéria não encontrada durante importação"
**Solução**: Certifique-se de que a matéria está cadastrada antes de importar notas

### Problema: "Erro ao conectar ao banco de dados"
**Solução**: Verifique se `DATABASE_URL` está configurado corretamente em `.env`

### Problema: "Notas aparecem como 0 após importação"
**Solução**: Certifique-se de que as colunas E, F, G (N1, N2, N3) contêm números válidos

---

## 🚀 Deploy

### Publicar no Manus

1. Clique no botão **"Publish"** na Management UI
2. Aguarde o build (2-5 minutos)
3. Acesse o domínio gerado: `escolaapp-x5ndie34.manus.space`

### Domínios Personalizados
1. Vá para **Settings → Domains**
2. Clique em **"Add Custom Domain"**
3. Configure DNS conforme instruções
4. Domínio ativo em até 24 horas

---

## 📝 Changelog

### v1.0.0 (Atual)
- ✅ Gestão completa de turmas, alunos e matérias
- ✅ Grade de notas com cálculo automático de média
- ✅ Indicadores visuais de aprovação (verde/vermelho)
- ✅ Listagem de alunos com busca e estatísticas
- ✅ Importação de dados via XLSX
- ✅ Interface responsiva mobile-first
- ✅ Autenticação Manus OAuth
- ✅ Feedback visual com toasts

### Roadmap Futuro
- 🔜 Suporte a importação de PDF
- 🔜 Gráficos de evolução de notas
- 🔜 Relatórios em PDF por aluno
- 🔜 Notificações de alunos com baixo desempenho
- 🔜 Exportação de dados em Excel
- 🔜 Modo offline com sincronização
- 🔜 App nativa Android/iOS

---

## 📞 Suporte

### Dúvidas Frequentes

**P: Como resetar a senha?**  
R: Use a opção "Esqueceu a senha?" na tela de login do Manus

**P: Posso deletar um aluno?**  
R: Atualmente, não há função de deleção. Você pode criar uma nova turma sem o aluno

**P: Quantos alunos posso cadastrar?**  
R: Sem limite técnico. O sistema suporta milhares de alunos

**P: Posso editar turmas após criação?**  
R: Atualmente, não há função de edição. Crie uma nova turma se necessário

**P: Os dados são sincronizados em tempo real?**  
R: Sim, todos os dados são salvos imediatamente no banco de dados

### Contato
- 📧 Email: [suporte@manus.im](mailto:suporte@manus.im)
- 🌐 Website: [manus.im](https://manus.im)
- 💬 Chat: Disponível na Management UI

---

## 📄 Licença

Este projeto é desenvolvido na plataforma Manus e segue os termos de serviço da Manus.

---

## 👨‍💻 Desenvolvido com

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Express** - Backend Framework
- **tRPC** - Type-safe RPC
- **Drizzle ORM** - Database ORM
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component Library
- **Manus Platform** - Hosting & Infrastructure

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ para educadores e gestores escolares.

**Versão:** 1.0.0  
**Última atualização:** 16 de Junho de 2026  
**Status:** ✅ Produção
