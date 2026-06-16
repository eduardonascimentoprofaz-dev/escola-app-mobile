#!/bin/bash

# Script de Assinatura de APK - Escola App Mobile
# Uso: ./scripts/sign-apk.sh
# IMPORTANTE: Executar após ./scripts/build-apk.sh release

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 Assinador de APK - Escola App Mobile${NC}\n"

# Verificar se arquivo APK existe
if [ ! -f "build-output/EscolaApp-release.apk" ]; then
    echo -e "${RED}✗ Arquivo APK não encontrado: build-output/EscolaApp-release.apk${NC}"
    echo -e "${YELLOW}Execute primeiro: ./scripts/build-apk.sh release${NC}"
    exit 1
fi

# Verificar se jarsigner está disponível
if ! command -v jarsigner &> /dev/null; then
    echo -e "${RED}✗ jarsigner não encontrado. Instale Java JDK.${NC}"
    exit 1
fi

# Diretório de keystore
KEYSTORE_DIR="build-output/keystore"
KEYSTORE_FILE="${KEYSTORE_DIR}/escola-app-release.keystore"
ALIAS="escolaapp-release"

# Criar diretório se não existir
mkdir -p "${KEYSTORE_DIR}"

# Verificar se keystore existe
if [ ! -f "${KEYSTORE_FILE}" ]; then
    echo -e "${YELLOW}📝 Keystore não encontrado. Criando novo...${NC}\n"
    echo -e "${BLUE}Você será solicitado a fornecer informações:${NC}"
    echo -e "${BLUE}  - Senha do keystore (mínimo 6 caracteres)${NC}"
    echo -e "${BLUE}  - Nome completo${NC}"
    echo -e "${BLUE}  - Unidade organizacional${NC}"
    echo -e "${BLUE}  - Organização${NC}"
    echo -e "${BLUE}  - Localidade${NC}"
    echo -e "${BLUE}  - Estado/Província${NC}"
    echo -e "${BLUE}  - Código do país (ex: BR)${NC}\n"
    
    keytool -genkey -v -keystore "${KEYSTORE_FILE}" \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -alias "${ALIAS}"
    
    echo -e "${GREEN}✓ Keystore criado com sucesso${NC}\n"
    echo -e "${YELLOW}⚠️  IMPORTANTE: Guarde este arquivo em local seguro!${NC}"
    echo -e "${YELLOW}Localização: ${KEYSTORE_FILE}${NC}\n"
else
    echo -e "${GREEN}✓ Keystore encontrado${NC}\n"
fi

# Passo 1: Otimizar APK com zipalign (DEVE SER ANTES DA ASSINATURA)
echo -e "${YELLOW}⚡ Passo 1: Otimizando APK com zipalign...${NC}"

TEMP_ALIGNED="build-output/EscolaApp-release-aligned.apk"

if command -v zipalign &> /dev/null; then
    zipalign -v 4 "build-output/EscolaApp-release.apk" "${TEMP_ALIGNED}"
    echo -e "${GREEN}✓ APK otimizado${NC}\n"
else
    echo -e "${YELLOW}⚠️  zipalign não encontrado. Continuando sem otimização.${NC}"
    echo -e "${YELLOW}   (Instale Android SDK para otimizar)${NC}\n"
    TEMP_ALIGNED="build-output/EscolaApp-release.apk"
fi

# Passo 2: Assinar APK (APÓS zipalign)
echo -e "${YELLOW}🔏 Passo 2: Assinando APK...${NC}"

jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
    -keystore "${KEYSTORE_FILE}" \
    "${TEMP_ALIGNED}" \
    "${ALIAS}"

echo -e "${GREEN}✓ APK assinado com sucesso${NC}\n"

# Passo 3: Mover para arquivo final
OUTPUT_FILE="build-output/EscolaApp-signed.apk"
mv "${TEMP_ALIGNED}" "${OUTPUT_FILE}"

# Passo 4: Verificar assinatura
echo -e "${YELLOW}✓ Passo 3: Verificando assinatura...${NC}"
jarsigner -verify -verbose -certs "${OUTPUT_FILE}"

# Resultado final
echo -e "\n${GREEN}✅ APK assinado e pronto para distribuição!${NC}"
echo -e "${YELLOW}📱 Arquivo final: ${OUTPUT_FILE}${NC}"
echo -e "${YELLOW}📊 Tamanho: $(du -h "${OUTPUT_FILE}" | cut -f1)${NC}\n"

echo -e "${BLUE}📚 Próximos passos:${NC}"
echo -e "${BLUE}1. Fazer upload na Google Play Console${NC}"
echo -e "${BLUE}2. Ou distribuir diretamente para usuários${NC}"
echo -e "${BLUE}3. Ou testar em dispositivo: adb install ${OUTPUT_FILE}${NC}\n"

echo -e "${GREEN}Pronto! 🎉${NC}"
