# Changelog - Escola App Mobile

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-06-16

### Added
- ✨ Cadastro completo de turmas com ano escolar e período
- ✨ Cadastro de alunos com número e nome
- ✨ Cadastro de matérias (Português, História, Ciências, Geografia, Arte, Ensino Religioso)
- ✨ Grade de notas por aluno com campos N1, N2, N3 para cada bimestre (1º ao 4º)
- ✨ Cálculo automático de média por matéria e média final
- ✨ Indicadores visuais de aprovação: verde (≥6.0) e vermelho (<6.0)
- ✨ Listagem de alunos com busca por nome
- ✨ Visualização rápida do status de aprovação de cada aluno
- ✨ Importação de dados em XLSX (alunos e notas)
- ✨ Interface mobile-first responsiva otimizada para Android
- ✨ Autenticação com Manus OAuth
- ✨ Design elegante com componentes shadcn/ui
- ✨ Feedback visual com toasts de sucesso/erro
- ✨ Documentação completa (README, guias de build, etc)

### Technical
- React 19 + Tailwind CSS 4 para frontend
- Express 4 + tRPC 11 para backend
- MySQL/TiDB para banco de dados
- Capacitor 8 para empacotamento Android
- Vite para build otimizado
- Vitest para testes unitários

### Documentation
- README.md com visão geral e instruções
- ANDROID_BUILD_GUIDE.md com 3 métodos de compilação
- APK_QUICK_START.md com guia rápido de 5 minutos
- RELEASE_GUIDE.md com instruções de distribuição

---

## [Unreleased]

### Planned for v1.1.0
- [ ] Exportação de relatórios em PDF por aluno
- [ ] Gráficos de evolução de notas por bimestre
- [ ] Backup automático de dados
- [ ] Sincronização em nuvem
- [ ] Modo offline com sincronização posterior
- [ ] Temas claro/escuro
- [ ] Suporte a múltiplos idiomas

### Planned for v2.0.0
- [ ] App para pais/responsáveis (visualizar notas dos filhos)
- [ ] Notificações em tempo real
- [ ] Integração com WhatsApp para avisos
- [ ] Suporte a múltiplas escolas
- [ ] Dashboard com estatísticas
- [ ] Relatórios avançados

---

## Notas de Versão

### Como Usar Este Changelog

- **Added**: Novas funcionalidades
- **Changed**: Mudanças em funcionalidades existentes
- **Deprecated**: Funcionalidades que serão removidas em breve
- **Removed**: Funcionalidades removidas
- **Fixed**: Correções de bugs
- **Security**: Correções de segurança
- **Technical**: Mudanças técnicas e dependências

### Versionamento Semântico

- **MAJOR** (ex: 1.0.0 → 2.0.0): Mudanças incompatíveis
- **MINOR** (ex: 1.0.0 → 1.1.0): Novas funcionalidades compatíveis
- **PATCH** (ex: 1.0.0 → 1.0.1): Correções de bugs

---

## Como Contribuir

Para reportar bugs ou sugerir funcionalidades:

1. Abra uma [Issue no GitHub](https://github.com/seu-usuario/escola-app-mobile/issues)
2. Descreva o problema/sugestão detalhadamente
3. Inclua screenshots se relevante
4. Aguarde feedback

---

## Suporte

- 📧 Email: suporte@escolaapp.com
- 🐛 Bugs: [GitHub Issues](https://github.com/seu-usuario/escola-app-mobile/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/seu-usuario/escola-app-mobile/discussions)

---

**Última atualização:** 16 de Junho de 2026
