#!/bin/bash

# Script de Release Automatizado - Escola App Mobile
# Uso: ./scripts/release.sh v1.0.1

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ -z "$1" ]; then
    echo -e "${RED}✗ Versão não fornecida${NC}"
    echo -e "${YELLOW}Uso: ./scripts/release.sh v1.0.1${NC}"
    exit 1
fi

VERSION=$1
MAJOR=$(echo $VERSION | cut -d. -f1 | sed 's/v//')
MINOR=$(echo $VERSION | cut -d. -f2)
PATCH=$(echo $VERSION | cut -d. -f3)

echo -e "${GREEN}🚀 Release Automatizado - Escola App Mobile${NC}"
echo -e "${YELLOW}Versão: ${VERSION}${NC}\n"

# Verificar se versão é válida
if ! [[ $VERSION =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}✗ Formato de versão inválido${NC}"
    echo -e "${YELLOW}Use: v1.0.0, v1.0.1, etc${NC}"
    exit 1
fi

# Verificar se tag já existe
if git rev-parse "$VERSION" >/dev/null 2>&1; then
    echo -e "${RED}✗ Tag $VERSION já existe${NC}"
    exit 1
fi

# Passo 1: Verificar status do Git
echo -e "${YELLOW}📋 Passo 1: Verificando status do Git...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}✗ Há mudanças não commitadas${NC}"
    git status
    exit 1
fi
echo -e "${GREEN}✓ Git limpo${NC}\n"

# Passo 2: Atualizar versão em build.gradle
echo -e "${YELLOW}📝 Passo 2: Atualizando versão em build.gradle...${NC}"
GRADLE_FILE="android/app/build.gradle"
VERSION_CODE=$((MAJOR * 10000 + MINOR * 100 + PATCH))

sed -i.bak "s/versionCode [0-9]*/versionCode $VERSION_CODE/" "$GRADLE_FILE"
sed -i.bak "s/versionName \"[^\"]*\"/versionName \"$MAJOR.$MINOR.$PATCH\"/" "$GRADLE_FILE"
rm "${GRADLE_FILE}.bak"

echo -e "${GREEN}✓ Versão atualizada: $MAJOR.$MINOR.$PATCH (code: $VERSION_CODE)${NC}\n"

# Passo 3: Build
echo -e "${YELLOW}🔨 Passo 3: Compilando APK...${NC}"
./scripts/build-apk.sh release
echo -e "${GREEN}✓ APK compilado${NC}\n"

# Passo 4: Assinar
echo -e "${YELLOW}🔐 Passo 4: Assinando APK...${NC}"
./scripts/sign-apk.sh
echo -e "${GREEN}✓ APK assinado${NC}\n"

# Passo 5: Commit
echo -e "${YELLOW}📌 Passo 5: Commitando mudanças...${NC}"
git add android/app/build.gradle
git commit -m "Release $VERSION"
echo -e "${GREEN}✓ Commit realizado${NC}\n"

# Passo 6: Tag
echo -e "${YELLOW}🏷️  Passo 6: Criando tag...${NC}"
git tag -a "$VERSION" -m "Release versão $VERSION"
echo -e "${GREEN}✓ Tag criada${NC}\n"

# Passo 7: Push
echo -e "${YELLOW}📤 Passo 7: Enviando para Git...${NC}"
git push origin main
git push origin "$VERSION"
echo -e "${GREEN}✓ Enviado para Git${NC}\n"

# Passo 8: Criar GitHub Release
echo -e "${YELLOW}🎉 Passo 8: Criando GitHub Release...${NC}"

if command -v gh &> /dev/null; then
    # Extrair notas do CHANGELOG
    NOTES=$(sed -n "/## \[$MAJOR\.$MINOR\.$PATCH\]/,/## \[/p" CHANGELOG.md | head -n -1)
    
    if [ -z "$NOTES" ]; then
        NOTES="Release $VERSION"
    fi
    
    gh release create "$VERSION" \
        "build-output/EscolaApp-signed.apk" \
        --title "Escola App $VERSION" \
        --notes "$NOTES"
    
    echo -e "${GREEN}✓ GitHub Release criado${NC}\n"
else
    echo -e "${YELLOW}⚠️  GitHub CLI não encontrado${NC}"
    echo -e "${YELLOW}   Crie release manualmente em:${NC}"
    echo -e "${YELLOW}   https://github.com/seu-usuario/escola-app-mobile/releases${NC}\n"
fi

# Resultado final
echo -e "${GREEN}✅ Release concluído com sucesso!${NC}\n"
echo -e "${BLUE}📊 Resumo:${NC}"
echo -e "${BLUE}  Versão: $VERSION${NC}"
echo -e "${BLUE}  Arquivo: build-output/EscolaApp-signed.apk${NC}"
echo -e "${BLUE}  Tamanho: $(du -h build-output/EscolaApp-signed.apk | cut -f1)${NC}"
echo -e "${BLUE}  Git Tag: $VERSION${NC}\n"

echo -e "${YELLOW}📚 Próximos passos:${NC}"
echo -e "${YELLOW}1. Verificar GitHub Release: https://github.com/seu-usuario/escola-app-mobile/releases${NC}"
echo -e "${YELLOW}2. Fazer upload na Play Store (se desejado)${NC}"
echo -e "${YELLOW}3. Notificar usuários sobre a atualização${NC}\n"

echo -e "${GREEN}Pronto! 🎉${NC}"
