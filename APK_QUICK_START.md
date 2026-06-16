# 📱 Guia Rápido - Gerar APK do Escola App

## ⚡ Forma Mais Rápida (5 minutos)

### 1. Clonar o Repositório
```bash
git clone <seu-repositorio>
cd escola-app-mobile
```

### 2. Executar Script de Build
```bash
# Para teste/desenvolvimento (APK Debug)
./scripts/build-apk.sh debug

# Ou para distribuição (APK Release)
./scripts/build-apk.sh release
```

### 3. Pronto! 🎉
O APK estará em: `build-output/EscolaApp-debug.apk` ou `build-output/EscolaApp-release.apk`

---

## 📲 Instalar em Dispositivo Android

### Opção 1: Via ADB (Recomendado)
```bash
adb install build-output/EscolaApp-debug.apk
```

### Opção 2: Transferência Manual
1. Conectar dispositivo ao computador
2. Copiar arquivo APK para o dispositivo
3. Abrir gerenciador de arquivos no Android
4. Clicar no arquivo APK
5. Permitir instalação de fontes desconhecidas (se necessário)
6. Instalar

### Opção 3: Emulador Android Studio
```bash
# Iniciar emulador no Android Studio
adb install build-output/EscolaApp-debug.apk
```

---

## 🔐 Para Distribuição (Play Store)

### 1. Assinar APK
```bash
./scripts/sign-apk.sh
```

### 2. Upload na Play Store
1. Ir para [Google Play Console](https://play.google.com/console)
2. Criar novo aplicativo
3. Fazer upload do arquivo assinado: `build-output/EscolaApp-signed.apk`
4. Preencher informações e publicar

---

## 🆘 Problemas Comuns

### "Comando não encontrado"
Instale as dependências:
- **Node.js**: https://nodejs.org
- **Java JDK**: https://www.oracle.com/java/technologies/downloads/
- **Android SDK**: https://developer.android.com/studio

### "APK não instala"
Verifique:
- Versão do Android (mínimo 7.0)
- Espaço disponível no dispositivo
- Permissão para instalar de fontes desconhecidas

### "Build falha"
Execute:
```bash
pnpm install
pnpm build
npx cap sync android
```

---

## 📚 Documentação Completa

Para instruções detalhadas, veja: **ANDROID_BUILD_GUIDE.md**

---

**Pronto para usar! 🚀**
