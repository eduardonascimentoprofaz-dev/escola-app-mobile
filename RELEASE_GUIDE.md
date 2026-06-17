# 📦 Guia de Release e Distribuição - Escola App Mobile

Este documento fornece instruções completas para fazer release do APK e distribuir para usuários finais.

---

## 🎯 Fluxo de Release

```
1. Preparar Release
   ├─ Atualizar versão
   ├─ Atualizar CHANGELOG
   └─ Commit & Tag no Git

2. Gerar APK
   ├─ Build Frontend
   ├─ Compilar APK
   └─ Assinar APK

3. Distribuir
   ├─ GitHub Releases
   ├─ Google Play Store
   └─ Distribuição Direta
```

---

## 📋 Checklist de Release

### Antes de Começar

- [ ] Todas as funcionalidades testadas
- [ ] Bugs críticos corrigidos
- [ ] Documentação atualizada
- [ ] Testes passando (`pnpm test`)
- [ ] Build sem erros (`pnpm build`)

### Preparação

- [ ] Versão incrementada em `android/app/build.gradle`
- [ ] CHANGELOG.md atualizado
- [ ] README.md atualizado se necessário
- [ ] Commit com mensagem clara
- [ ] Tag Git criada (ex: `v1.0.0`)

### Build & Assinatura

- [ ] APK Debug compilado e testado
- [ ] APK Release compilado
- [ ] APK assinado com keystore
- [ ] Tamanho do APK verificado

### Distribuição

- [ ] GitHub Release criado
- [ ] APK enviado para Play Store (ou distribuição alternativa)
- [ ] Notas de release publicadas
- [ ] Usuários notificados

---

## 🚀 Passo a Passo Completo

### Passo 1: Preparar a Release

#### 1.1 Atualizar Versão

Edite `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        versionCode 2        // Incrementar sempre
        versionName "1.0.1"  // Versão semântica: MAJOR.MINOR.PATCH
    }
}
```

**Regra de Versionamento:**
- `MAJOR`: Mudanças incompatíveis (ex: 1.0.0 → 2.0.0)
- `MINOR`: Novas funcionalidades compatíveis (ex: 1.0.0 → 1.1.0)
- `PATCH`: Correções de bugs (ex: 1.0.0 → 1.0.1)

#### 1.2 Atualizar CHANGELOG

Edite `CHANGELOG.md`:

```markdown
## [1.0.1] - 2026-06-16

### Added
- Importação de XLSX com validação
- Indicadores visuais de aprovação (verde/vermelho)

### Fixed
- Corrigido cálculo de média por bimestre
- Melhorada performance em listagem de alunos

### Changed
- Interface refinada com melhor espaçamento
- Feedback visual aprimorado em formulários

### Security
- Atualizado Capacitor para versão 8.4.0
```

#### 1.3 Commit e Tag

```bash
# Commit
git add .
git commit -m "Release v1.0.1: Importação XLSX e indicadores visuais"

# Tag
git tag -a v1.0.1 -m "Release versão 1.0.1"

# Push
git push origin main
git push origin v1.0.1
```

---

### Passo 2: Gerar APK

#### 2.1 Build Debug (Testes)

```bash
./scripts/build-apk.sh debug
```

**Resultado:** `build-output/EscolaApp-debug.apk`

**Testar em dispositivo:**
```bash
adb install build-output/EscolaApp-debug.apk
```

#### 2.2 Build Release

```bash
./scripts/build-apk.sh release
```

**Resultado:** `build-output/EscolaApp-release.apk`

#### 2.3 Assinar APK

```bash
./scripts/sign-apk.sh
```

**Resultado:** `build-output/EscolaApp-signed.apk`

**Verificar tamanho:**
```bash
ls -lh build-output/EscolaApp-signed.apk
```

---

### Passo 3: Distribuir

#### Opção A: GitHub Releases (Recomendado para Distribuição Aberta)

##### 3A.1 Criar Release no GitHub

```bash
# Usando GitHub CLI
gh release create v1.0.1 \
  build-output/EscolaApp-signed.apk \
  --title "Escola App v1.0.1" \
  --notes "$(cat CHANGELOG.md | head -20)"
```

Ou manualmente:

1. Ir para [GitHub Releases](https://github.com/seu-usuario/escola-app-mobile/releases)
2. Clique em "Create a new release"
3. Tag: `v1.0.1`
4. Title: `Escola App v1.0.1`
5. Description: Copie do CHANGELOG.md
6. Upload: `build-output/EscolaApp-signed.apk`
7. Publish

##### 3A.2 Usuários Baixam

Usuários acessam: `https://github.com/seu-usuario/escola-app-mobile/releases`

E clicam em "EscolaApp-signed.apk" para baixar.

---

#### Opção B: Google Play Store (Distribuição Profissional)

##### 3B.1 Criar Conta de Desenvolvedor

1. Ir para [Google Play Console](https://play.google.com/console)
2. Pagar taxa única de $25
3. Criar novo aplicativo

##### 3B.2 Configurar Aplicativo

**Informações Básicas:**
- Nome: "Escola App Mobile"
- Descrição: Descrição completa do app
- Categoria: Educação
- Classificação: Geral

**Screenshots:**
- Mínimo 2, máximo 8
- Dimensões: 1080x1920 pixels
- Mostrar principais funcionalidades

**Ícone:**
- 512x512 pixels
- PNG com fundo transparente

**Descrição Longa:**
```
Aplicativo completo de gestão escolar para professores.

Funcionalidades:
✓ Cadastro de alunos e turmas
✓ Registro de notas por bimestre
✓ Cálculo automático de médias
✓ Indicadores visuais de aprovação
✓ Importação de dados em XLSX
✓ Interface intuitiva e responsiva

Perfeito para escolas que buscam organização e eficiência!
```

##### 3B.3 Upload do APK

1. Abrir "Testes" → "Testes Internos"
2. Criar novo release
3. Upload: `build-output/EscolaApp-signed.apk`
4. Adicionar notas de release
5. Revisar e publicar

##### 3B.4 Revisar e Publicar

1. Ir para "Produção"
2. Criar novo release
3. Upload do APK
4. Revisar políticas de privacidade
5. Submeter para análise (leva 24-48h)

---

#### Opção C: Distribuição Direta (Sem App Store)

##### 3C.1 Hospedagem do APK

**Opção 1: GitHub Releases** (recomendado)
```bash
gh release create v1.0.1 build-output/EscolaApp-signed.apk
```

**Opção 2: Google Drive**
1. Fazer upload do APK
2. Compartilhar link público
3. Usuários clicam para baixar

**Opção 3: Seu Servidor**
```bash
scp build-output/EscolaApp-signed.apk seu-servidor.com:/var/www/html/
```

##### 3C.2 Instruções para Usuários

Compartilhe este guia:

```markdown
# Como Instalar Escola App

## Pré-requisitos
- Android 7.0 ou superior
- 50 MB de espaço livre

## Passos

1. **Baixar APK**
   - Acesse: [Link do APK]
   - Clique em "Download"

2. **Permitir Instalação**
   - Abra Configurações → Segurança
   - Ative "Fontes Desconhecidas"

3. **Instalar**
   - Abra Gerenciador de Arquivos
   - Localize "EscolaApp-signed.apk"
   - Clique para instalar
   - Confirme

4. **Usar**
   - Abra o app
   - Faça login
   - Comece a usar!

## Problemas?
- Verifique espaço em disco
- Reinicie o dispositivo
- Desinstale versão anterior
```

---

## 🔄 Atualizar Versão Existente

### Para Usuários com Versão Anterior

**Automático:**
- Se distribuindo via Play Store, atualização é automática

**Manual:**
- Usuários desinstalam versão antiga
- Baixam e instalam nova versão

**Sem Perder Dados:**
- Dados são salvos no banco de dados
- Reinstalar não apaga dados

---

## 📊 Monitoramento de Releases

### Rastrear Downloads

**GitHub:**
```bash
# Ver estatísticas de release
gh release view v1.0.1
```

**Play Store:**
- Acessar Play Console
- Ver estatísticas em "Análise"

### Coletar Feedback

**Opções:**
1. Formulário Google Forms
2. Email de suporte
3. Comentários no GitHub
4. Reviews na Play Store

---

## 🐛 Hotfix (Correção Urgente)

Se encontrar bug crítico após release:

```bash
# 1. Corrigir código
# 2. Incrementar versão (ex: 1.0.1 → 1.0.2)
# 3. Build
./scripts/build-apk.sh release
./scripts/sign-apk.sh

# 4. Release
git tag v1.0.2
gh release create v1.0.2 build-output/EscolaApp-signed.apk

# 5. Notificar usuários
```

---

## 📈 Roadmap de Releases

### v1.0.0 (Atual)
- ✅ Cadastro de alunos, turmas, matérias
- ✅ Grade de notas com cálculo de média
- ✅ Indicadores visuais de aprovação
- ✅ Importação XLSX

### v1.1.0 (Próximo)
- [ ] Exportação de relatórios em PDF
- [ ] Gráficos de evolução de notas
- [ ] Backup automático de dados
- [ ] Sincronização em nuvem

### v2.0.0 (Futuro)
- [ ] App para pais/responsáveis
- [ ] Notificações em tempo real
- [ ] Integração com WhatsApp
- [ ] Suporte a múltiplas escolas

---

## 🔐 Segurança de Releases

### Proteger Keystore

```bash
# Guardar em local seguro
cp build-output/keystore/escola-app-release.keystore ~/Backups/

# Nunca commitar no Git
echo "build-output/keystore/" >> .gitignore
git add .gitignore
git commit -m "Proteger keystore"
```

### Gerenciar Senhas

**Usar GitHub Secrets para CI/CD:**

1. Ir para Settings → Secrets
2. Adicionar:
   - `KEYSTORE_FILE`: Conteúdo do keystore (base64)
   - `KEYSTORE_PASSWORD`: Senha
   - `KEY_ALIAS`: Nome da chave
   - `KEY_PASSWORD`: Senha da chave

---

## 📞 Suporte e Feedback

### Canais de Comunicação

- **Email:** suporte@escolaapp.com
- **GitHub Issues:** Para bugs técnicos
- **WhatsApp:** Para suporte rápido
- **Formulário:** Para feedback geral

---

## ✅ Checklist Final

Antes de publicar cada release:

- [ ] Versão incrementada
- [ ] CHANGELOG atualizado
- [ ] Testes passando
- [ ] Build sem erros
- [ ] APK assinado
- [ ] Tamanho verificado
- [ ] Release notes preparadas
- [ ] Screenshots/ícone atualizados (se necessário)
- [ ] Usuários notificados
- [ ] Monitoramento ativado

---

**Pronto para distribuir! 🚀**

Última atualização: 16 de Junho de 2026
