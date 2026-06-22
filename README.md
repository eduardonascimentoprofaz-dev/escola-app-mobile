# Escola App Mobile - Gestão Escolar de Notas

Um aplicativo web elegante e responsivo para gestão escolar de notas, otimizado para uso em dispositivos móveis Android. Permite cadastro de alunos, turmas, matérias, registro de notas por bimestre, acompanhamento visual do desempenho e exportação de relatórios em PDF.

**Versão:** 2.0.0  
**Tecnologia:** React 19 + TypeScript + Express + tRPC + MySQL + jsPDF + Capacitor  
**Status:** ✅ Produção  
**Domínio:** https://escolaapp-x5ndie34.manus.space

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
- Exibição de média final por aluno

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

### 7. **Exportação de Relatórios em PDF**
- **Boletim Individual**: Exportar notas de um aluno com média final e indicador visual
- **Relatório por Bimestre**: Exportar todas as notas de uma turma em um bimestre específico
  - Tabela consolidada com todos os alunos
  - Nomes das matérias no cabeçalho
  - Médias por matéria com indicadores visuais
  - Resumo de desempenho consolidado (aprovados, reprovados, média geral)
- Design profissional com logo do Escola App Mobile
- Quebra de página automática para relatórios longos

### 8. **Logo e Identidade Visual**
- Logo profissional do Escola App Mobile integrada
- Exibição no header e telas de login
- Design elegante e sofisticado
- Cores coordenadas (azul principal #1967D2)

### 9. **Autenticação e Segurança**
- Autenticação via Manus OAuth
- Controle de acesso por usuário
- Sessões seguras com cookies
- Logout com limpeza de sessão

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
| **Exportação** | jsPDF |
| **Mobile** | Capacitor (React Native Bridge) |

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

-- Alunos
alunos
├── id (PK)
├── turmaId (FK)
├── numero (ex: 1, 2, 3...)
├── nome
└── timestamps

-- Matérias
materias
├── id (PK)
├── nome (ex: "Português", "Matemática")
├── codigo (opcional)
└── timestamps

-- Notas
notas
├── id (PK)
├── alunoId (FK)
├── materiaId (FK)
├── bimestre (1-4)
├── n1 (decimal)
├── n2 (decimal)
├── n3 (decimal)
├── media (calculada)
└── timestamps
```

### Fluxo de Dados

```
Frontend (React)
    ↓
tRPC Client
    ↓
tRPC Server (Express)
    ↓
Drizzle ORM
    ↓
MySQL Database
```

---

## 📱 Guia de Uso

### Primeira Vez

1. **Faça login** com sua conta Manus OAuth
2. **Crie uma turma**: Vá para a aba "Turmas" e clique em "Criar Turma"
3. **Crie matérias**: Vá para a aba "Matérias" e adicione as disciplinas
4. **Cadastre alunos**: Vá para a aba "Alunos" e adicione os alunos à turma

### Registrando Notas

1. Vá para a aba "Notas"
2. Selecione a turma, aluno e bimestre
3. Preencha as notas N1, N2 e N3 para cada matéria
4. A média é calculada automaticamente
5. Clique em "Salvar Notas"

### Importando Dados em Lote

1. Vá para a aba "Importação"
2. Selecione a aba "Importar Alunos" ou "Importar Notas"
3. Faça upload do arquivo XLSX
4. Revise o preview dos dados
5. Clique em "Importar" para confirmar

### Exportando Relatórios

1. Vá para a aba "Notas"
2. Para **boletim individual**:
   - Selecione turma, aluno e bimestre
   - Clique em "Exportar Boletim" na seção de média final
3. Para **relatório por bimestre**:
   - Selecione turma e bimestre
   - Clique em "Exportar Bimestre" na seção de exportação
4. O PDF será baixado automaticamente

---

## 📊 Formatos de Importação

### Importar Alunos (XLSX)

Crie um arquivo Excel com as seguintes colunas:

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| Número | Número do aluno | 1 |
| Nome | Nome completo | Francisco Eduardo |
| Turma | Nome da turma | 1 a |

**Exemplo de arquivo:**
```
Número | Nome | Turma
1 | Francisco Eduardo | 1 a
2 | João Silva | 1 a
3 | Maria Santos | 1 a
```

### Importar Notas (XLSX)

Crie um arquivo Excel com as seguintes colunas:

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| Aluno | Número do aluno | 1 |
| Matéria | Nome da matéria | Português |
| Bimestre | Número do bimestre (1-4) | 1 |
| N1 | Primeira nota | 8.5 |
| N2 | Segunda nota | 7.0 |
| N3 | Terceira nota | 9.0 |

**Exemplo de arquivo:**
```
Aluno | Matéria | Bimestre | N1 | N2 | N3
1 | Português | 1 | 8.5 | 7.0 | 9.0
1 | Matemática | 1 | 7.5 | 8.0 | 8.5
2 | Português | 1 | 6.0 | 6.5 | 7.0
```

---

## 🎨 Design e Responsividade

### Características Visuais

- **Cores Principais**: Azul (#1967D2), Verde (#22C55E), Vermelho (#DC2626)
- **Tipografia**: Inter, Helvetica
- **Espaçamento**: Sistema de grid com Tailwind CSS
- **Componentes**: shadcn/ui para consistência

### Responsividade

- ✅ Mobile-first design (otimizado para Android)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Navegação adaptativa por abas
- ✅ Toque-friendly (botões com 44px mínimo)

---

## 🚀 Deployment e APK

### Publicar na Web

1. Clique no botão **"Publish"** na interface de gerenciamento
2. Escolha o domínio (ex: escolaapp-x5ndie34.manus.space)
3. Configure as configurações de visibilidade
4. Clique em "Publicar"

### Gerar APK para Android

O projeto está configurado com **Capacitor** para gerar APK nativo.

#### Método 1: Build Local (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/escola-app-mobile.git
cd escola-app-mobile

# Instale dependências
pnpm install

# Compile o frontend
pnpm build

# Execute o script de build
./scripts/build-apk.sh debug

# O APK será gerado em: android/app/build/outputs/apk/debug/
```

#### Método 2: Build em Nuvem

Use serviços como:
- **GitHub Actions** (CI/CD automatizado)
- **EAS Build** (Expo Application Services)
- **Codemagic** (Build mobile em nuvem)

#### Método 3: APK Online

Use ferramentas online como:
- **PhoneGap Build**
- **Appetize.io**
- **Capacitor Cloud**

### Assinar APK para Play Store

```bash
# Gere uma chave de assinatura (primeira vez)
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias

# Assine o APK
./scripts/sign-apk.sh

# O APK assinado estará em: android/app/build/outputs/apk/release/
```

---

## 🔧 Desenvolvimento Local

### Requisitos

- Node.js 18+
- pnpm 10+
- MySQL 8+ ou TiDB
- Java JDK 11+ (para Android)
- Android SDK (para compilar APK)

### Setup

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/escola-app-mobile.git
cd escola-app-mobile

# Instale dependências
pnpm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
pnpm dev

# Acesse em: http://localhost:3000
```

### Estrutura de Pastas

```
escola-app-mobile/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas principais
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários (pdfExport.ts)
│   │   └── App.tsx        # Roteamento principal
│   └── public/            # Assets estáticos
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Definição de procedures
│   ├── db.ts              # Query helpers
│   └── _core/             # Framework interno
├── drizzle/               # Schema do banco de dados
├── scripts/               # Scripts de build e release
├── android/               # Código nativo Android (Capacitor)
└── README.md              # Este arquivo
```

### Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento

# Build
pnpm build            # Compila frontend e backend
pnpm check            # Verifica tipos TypeScript

# Testes
pnpm test             # Executa testes com Vitest

# Linting
pnpm format           # Formata código com Prettier

# Database
pnpm drizzle-kit generate  # Gera migrations SQL
pnpm drizzle-kit migrate   # Aplica migrations
```

---

## 📝 Changelog

### v2.0.0 (Atual)
- ✅ Adicionada logo profissional do Escola App Mobile
- ✅ Implementada exportação de notas em PDF (boletim individual)
- ✅ Implementada exportação consolidada por bimestre
- ✅ Adicionado resumo de desempenho nos relatórios
- ✅ Corrigido layout do PDF com cabeçalho de matérias
- ✅ Configurado Capacitor para gerar APK Android
- ✅ Criados scripts de build e assinatura

### v1.0.0
- ✅ Gestão de turmas, alunos e matérias
- ✅ Grade de notas com cálculo de média
- ✅ Indicadores visuais de aprovação
- ✅ Listagem e busca de alunos
- ✅ Importação de dados em XLSX
- ✅ Autenticação Manus OAuth
- ✅ Design responsivo mobile-first

---

## 🐛 Troubleshooting

### Erro ao importar XLSX

**Problema**: "Erro ao processar arquivo"  
**Solução**: Verifique se o arquivo está no formato correto com as colunas esperadas

### Notas não aparecem na grade

**Problema**: "Sem notas registradas"  
**Solução**: Certifique-se de que alunos e matérias foram cadastrados primeiro

### PDF não gera

**Problema**: "Erro ao exportar relatório"  
**Solução**: Verifique se há dados de notas para exportar

### APK não instala

**Problema**: "Aplicação não instalada"  
**Solução**: Habilite "Instalar de fontes desconhecidas" nas configurações do Android

---

## 📞 Suporte

Para dúvidas, bugs ou sugestões:

1. Abra uma **Issue** no GitHub
2. Envie um **Pull Request** com melhorias
3. Entre em contato via email

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

---

## 👨‍💻 Autor

**Francisco Eduardo Nascimento**  
Desenvolvido com ❤️ usando React, TypeScript e Manus Platform

---

## 🙏 Agradecimentos

- **Manus Platform** - Infraestrutura e autenticação
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Styling
- **jsPDF** - Geração de PDFs
- **Capacitor** - Bridge para Android

---

**Última atualização:** Junho 2026  
**Versão:** 2.0.0  
**Status:** ✅ Produção
