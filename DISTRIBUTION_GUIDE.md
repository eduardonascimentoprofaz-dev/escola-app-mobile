# 📱 Guia de Distribuição - Escola App Mobile

Este documento fornece instruções para distribuir o APK para usuários finais.

---

## 🎯 Opções de Distribuição

| Opção | Facilidade | Alcance | Custo | Tempo |
|-------|-----------|--------|-------|-------|
| **GitHub Releases** | ⭐⭐⭐⭐⭐ | Público | Grátis | Imediato |
| **Google Play Store** | ⭐⭐⭐ | Muito Grande | $25 | 24-48h |
| **Distribuição Direta** | ⭐⭐ | Limitado | Grátis | Imediato |
| **APK via Email** | ⭐⭐ | Muito Limitado | Grátis | Imediato |

---

## 🚀 Opção 1: GitHub Releases (Recomendado)

### Vantagens
- ✅ Grátis e simples
- ✅ Versionamento automático
- ✅ Histórico de releases
- ✅ Notificações de atualizações
- ✅ Ideal para distribuição aberta

### Passo a Passo

#### 1. Preparar Release

```bash
# Atualizar versão
# Edite: android/app/build.gradle
# versionCode 1
# versionName "1.0.0"

# Atualizar CHANGELOG.md
# Commit
git add .
git commit -m "Release v1.0.0"

# Tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main v1.0.0
```

#### 2. Gerar APK

```bash
./scripts/build-apk.sh release
./scripts/sign-apk.sh
```

#### 3. Criar Release no GitHub

**Opção A: Usando GitHub CLI**
```bash
gh release create v1.0.0 \
  build-output/EscolaApp-signed.apk \
  --title "Escola App v1.0.0" \
  --notes "Primeira versão com todas as funcionalidades básicas"
```

**Opção B: Manualmente**

1. Ir para: `https://github.com/seu-usuario/escola-app-mobile/releases`
2. Clique em "Create a new release"
3. Preencha:
   - Tag: `v1.0.0`
   - Title: `Escola App v1.0.0`
   - Description: Copie do CHANGELOG.md
4. Upload: `build-output/EscolaApp-signed.apk`
5. Clique em "Publish release"

#### 4. Compartilhar Link

Compartilhe com usuários:
```
https://github.com/seu-usuario/escola-app-mobile/releases/tag/v1.0.0
```

### Como Usuários Instalam

1. Acessam o link acima
2. Clicam em "EscolaApp-signed.apk"
3. Clicam em "Download"
4. Abrem o arquivo no dispositivo Android
5. Clicam em "Instalar"

---

## 🏪 Opção 2: Google Play Store

### Vantagens
- ✅ Alcance muito grande
- ✅ Atualizações automáticas
- ✅ Estatísticas detalhadas
- ✅ Profissional e confiável

### Desvantagens
- ❌ Custo inicial ($25)
- ❌ Tempo de análise (24-48h)
- ❌ Políticas rigorosas
- ❌ Mais complexo

### Passo a Passo

#### 1. Criar Conta de Desenvolvedor

1. Ir para: [Google Play Console](https://play.google.com/console)
2. Clique em "Create account"
3. Pague taxa de $25
4. Preencha dados pessoais

#### 2. Criar Aplicativo

1. Clique em "Create app"
2. Nome: "Escola App Mobile"
3. Selecione "Educação"
4. Clique em "Create"

#### 3. Preencher Informações

**Descrição Breve (80 caracteres):**
```
Gestão escolar completa: notas, alunos, turmas
```

**Descrição Completa:**
```
Aplicativo profissional de gestão escolar para professores.

FUNCIONALIDADES:
✓ Cadastro de alunos e turmas
✓ Registro de notas por bimestre
✓ Cálculo automático de médias
✓ Indicadores visuais de aprovação
✓ Importação de dados em XLSX
✓ Interface intuitiva e responsiva

PERFEITO PARA:
• Escolas que buscam organização
• Professores que querem eficiência
• Gestão de múltiplas turmas

Baixe agora e comece a usar!
```

#### 4. Upload de Imagens

**Ícone do App (512x512):**
- Fundo transparente
- PNG
- Representar a marca

**Screenshots (mínimo 2, máximo 8):**
- Dimensões: 1080x1920
- Mostrar principais telas
- Incluir descrições

**Imagem de Destaque (1024x500):**
- Banner promocional
- Mostrar funcionalidades principais

#### 5. Categorização

- Categoria: Educação
- Classificação: Geral (ou conforme necessário)
- Conteúdo: Sem conteúdo sensível

#### 6. Upload do APK

1. Ir para "Testes" → "Testes Internos"
2. Criar novo release
3. Upload: `build-output/EscolaApp-signed.apk`
4. Adicionar notas de release
5. Revisar e publicar

#### 7. Revisar Políticas

1. Ir para "Configurações do app"
2. Preencher:
   - Política de privacidade
   - Email de contato
   - Website (opcional)

#### 8. Submeter para Análise

1. Ir para "Produção"
2. Criar novo release
3. Upload do APK
4. Revisar tudo
5. Clique em "Enviar para análise"

**Tempo de análise:** 24-48 horas

---

## 📧 Opção 3: Distribuição Direta

### Vantagens
- ✅ Controle total
- ✅ Sem restrições
- ✅ Imediato

### Desvantagens
- ❌ Alcance limitado
- ❌ Sem atualizações automáticas
- ❌ Menos profissional

### Métodos

#### 3A: Google Drive

1. Fazer upload do APK
2. Compartilhar link público
3. Usuários clicam para baixar

#### 3B: Seu Servidor Web

```bash
# Copiar APK para servidor
scp build-output/EscolaApp-signed.apk seu-servidor.com:/var/www/html/

# Usuários acessam:
# https://seu-servidor.com/EscolaApp-signed.apk
```

#### 3C: Email

Enviar arquivo diretamente (máximo 25 MB)

```bash
# Verificar tamanho
ls -lh build-output/EscolaApp-signed.apk
```

---

## 📲 Instruções para Usuários

### Guia de Instalação

Compartilhe este texto com usuários:

```
╔════════════════════════════════════════════╗
║  COMO INSTALAR ESCOLA APP MOBILE           ║
╚════════════════════════════════════════════╝

PRÉ-REQUISITOS:
• Android 7.0 ou superior
• 50 MB de espaço livre
• Conexão com internet

PASSO 1: BAIXAR
1. Acesse o link fornecido
2. Clique em "Download" ou "Baixar"
3. Aguarde o download terminar

PASSO 2: PERMITIR INSTALAÇÃO
1. Abra "Configurações"
2. Vá para "Segurança"
3. Ative "Fontes Desconhecidas"
   (ou "Aplicativos de Fontes Desconhecidas")

PASSO 3: INSTALAR
1. Abra "Gerenciador de Arquivos"
2. Localize o arquivo "EscolaApp-signed.apk"
3. Clique no arquivo
4. Clique em "Instalar"
5. Aguarde a instalação

PASSO 4: USAR
1. Abra o app "Escola App"
2. Faça login com suas credenciais
3. Comece a usar!

PROBLEMAS?
• Verifique espaço em disco
• Reinicie o dispositivo
• Desinstale versão anterior
• Tente novamente

SUPORTE:
Email: suporte@escolaapp.com
```

---

## 🔄 Atualizar Versão

### Para Usuários (Play Store)

- Automático: Notificação de atualização
- Manual: Abrir Play Store → Meus apps → Atualizar

### Para Usuários (GitHub/Direto)

1. Desinstalar versão antiga
2. Baixar nova versão
3. Instalar normalmente

**Dados não são perdidos** (salvos no banco de dados)

---

## 📊 Monitoramento

### GitHub Releases

```bash
# Ver estatísticas
gh release view v1.0.0

# Listar todas as releases
gh release list
```

### Play Store

1. Abrir Play Console
2. Ir para "Análise"
3. Ver:
   - Downloads
   - Usuários ativos
   - Avaliações
   - Crashes

---

## 🆘 Suporte ao Usuário

### Problemas Comuns

**"Não consigo instalar"**
- Verificar espaço em disco
- Verificar versão do Android
- Desinstalar versão anterior

**"App não abre"**
- Reiniciar dispositivo
- Limpar cache do app
- Desinstalar e reinstalar

**"Dados desapareceram"**
- Dados são salvos no servidor
- Fazer login novamente
- Contatar suporte

### Canais de Suporte

- 📧 Email: suporte@escolaapp.com
- 💬 WhatsApp: (XX) XXXXX-XXXX
- 🐛 GitHub Issues: [Link]
- 📞 Telefone: (XX) XXXXX-XXXX

---

## 📈 Estratégia de Crescimento

### Fase 1: Beta (Primeiros Usuários)
- Distribuir via GitHub Releases
- Coletar feedback
- Corrigir bugs

### Fase 2: Lançamento
- Publicar na Play Store
- Compartilhar em redes sociais
- Contatar escolas

### Fase 3: Crescimento
- Otimizar baseado em feedback
- Adicionar funcionalidades
- Expandir para outras plataformas

---

## ✅ Checklist de Distribuição

- [ ] APK compilado e testado
- [ ] APK assinado
- [ ] Versão incrementada
- [ ] CHANGELOG atualizado
- [ ] Release notes preparadas
- [ ] Screenshots/ícone prontos (se Play Store)
- [ ] Guia de instalação preparado
- [ ] Canais de suporte configurados
- [ ] Usuários notificados
- [ ] Monitoramento ativado

---

**Pronto para distribuir! 🚀**

Última atualização: 17 de Junho de 2026
