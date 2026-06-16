#!/bin/bash

# Script de Build APK - Escola App Mobile
# Uso: ./scripts/build-apk.sh [debug|release]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Tipo de build (debug ou release)
BUILD_TYPE=${1:-debug}

echo -e "${GREEN}🚀 Iniciando build APK - Escola App Mobile${NC}"
echo -e "${YELLOW}Tipo de build: ${BUILD_TYPE}${NC}\n"

# Verificar pré-requisitos
echo -e "${YELLOW}✓ Verificando pré-requisitos...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js não encontrado. Instale em: https://nodejs.org${NC}"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java não encontrado. Instale JDK 11+${NC}"
    exit 1
fi

if [ ! -d "android" ]; then
    echo -e "${RED}✗ Diretório 'android' não encontrado. Execute 'npx cap add android' primeiro${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Pré-requisitos OK${NC}\n"

# Passo 1: Instalar dependências
echo -e "${YELLOW}📦 Passo 1: Instalando dependências...${NC}"
pnpm install
echo -e "${GREEN}✓ Dependências instaladas${NC}\n"

# Passo 2: Build frontend
echo -e "${YELLOW}🔨 Passo 2: Compilando frontend...${NC}"
pnpm build
echo -e "${GREEN}✓ Frontend compilado${NC}\n"

# Passo 3: Sincronizar Capacitor
echo -e "${YELLOW}🔄 Passo 3: Sincronizando Capacitor...${NC}"
npx cap sync android
echo -e "${GREEN}✓ Capacitor sincronizado${NC}\n"

# Passo 4: Build Android
echo -e "${YELLOW}🏗️  Passo 4: Compilando APK (${BUILD_TYPE})...${NC}"
cd android

if [ "$BUILD_TYPE" = "release" ]; then
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
    echo -e "${GREEN}✓ APK Release compilado${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANTE: Assine o APK antes de distribuir!${NC}"
    echo -e "${YELLOW}Execute: ../scripts/sign-apk.sh${NC}"
else
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    echo -e "${GREEN}✓ APK Debug compilado${NC}"
fi

cd ..

# Passo 5: Copiar APK para diretório de saída
echo -e "${YELLOW}📁 Passo 5: Copiando APK...${NC}"
mkdir -p build-output
cp "android/${APK_PATH}" "build-output/EscolaApp-${BUILD_TYPE}.apk"
echo -e "${GREEN}✓ APK copiado para: build-output/EscolaApp-${BUILD_TYPE}.apk${NC}\n"

# Resultado final
echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
echo -e "${YELLOW}📱 Arquivo: build-output/EscolaApp-${BUILD_TYPE}.apk${NC}"
echo -e "${YELLOW}📊 Tamanho: $(du -h build-output/EscolaApp-${BUILD_TYPE}.apk | cut -f1)${NC}\n"

if [ "$BUILD_TYPE" = "debug" ]; then
    echo -e "${YELLOW}💡 Para instalar em dispositivo:${NC}"
    echo -e "${YELLOW}   adb install build-output/EscolaApp-debug.apk${NC}\n"
fi

echo -e "${GREEN}Pronto para usar! 🎉${NC}"
