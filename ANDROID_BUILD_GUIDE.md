# 📱 Guia de Compilação APK - Escola App Mobile

Este documento fornece instruções completas para compilar o aplicativo Escola App em um APK instalável para Android.

---

## 🎯 Opções de Compilação

Existem **3 formas** de gerar o APK:

| Opção | Tempo | Complexidade | Custo | Resultado |
|-------|-------|-------------|-------|-----------|
| **1. Localmente** | 10-30 min | Alta | Grátis | APK assinado |
| **2. Serviço Cloud** | 5-10 min | Baixa | $0-50/mês | APK assinado |
| **3. Ferramentas Online** | 2-5 min | Muito Baixa | Grátis | APK debug |

---

## ✅ Pré-requisitos

### Para Compilação Local

**Windows/Mac/Linux:**
- Node.js 22+
- **Java Development Kit (JDK) 21** ⚠️ **IMPORTANTE: Java 21 é OBRIGATÓRIO**
- Android SDK
- Gradle 8.0+
- Git

**Instalação rápida:**

```bash
# macOS (com Homebrew)
brew install openjdk@21 gradle android-sdk

# Ubuntu/Debian
sudo apt-get install openjdk-21-jdk gradle android-sdk

# Windows (com Chocolatey)
choco install openjdk21 gradle android-sdk
```

**⚠️ Configurar JAVA_HOME para Java 21:**

```bash
# Linux/Mac
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64  # Ubuntu/Debian
export JAVA_HOME=$(/usr/libexec/java_home -v 21)     # macOS

# Windows - Adicionar ao Path do Sistema
C:\Program Files\Eclipse Temurin\jdk-21.0.x
```

**Verificar versão do Java:**
```bash
java -version
# Deve retornar: openjdk version "21" ou similar
```

### Variáveis de Ambiente

Configure as variáveis de ambiente para Android SDK:

```bash
# Linux/Mac - adicione ao ~/.bashrc ou ~/.zshrc
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools

# Windows - adicione ao Path do Sistema
ANDROID_SDK_ROOT=C:\Android\Sdk
```

---

## 🔧 Método 1: Compilação Local (Recomendado)

### Passo 1: Clonar Repositório

```bash
git clone <seu-repositorio>
cd escola-app-mobile
```

### Passo 2: Instalar Dependências

```bash
pnpm install
```

### Passo 3: Compilar Frontend

```bash
pnpm build
```

### Passo 4: Sincronizar com Capacitor

```bash
npx cap sync android
```

### Passo 5: Compilar APK

#### **APK Debug (Testes)**
```bash
cd android
./gradlew assembleDebug
```

Resultado: `android/app/build/outputs/apk/debug/app-debug.apk`

#### **APK Release (Distribuição)**
```bash
cd android
./gradlew assembleRelease
```

Resultado: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Passo 6: Assinar APK (Apenas Release)

#### Criar Keystore (primeira vez apenas)

```bash
keytool -genkey -v -keystore escola-app.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias escolaapp
```

Será solicitado:
- Senha do keystore
- Nome completo
- Unidade organizacional
- Organização
- Localidade
- Estado/Província
- Código do país (BR)

#### Assinar APK

```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore escola-app.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  escolaapp
```

#### Otimizar APK (Opcional)

```bash
zipalign -v 4 \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  EscolaApp-v1.0.0.apk
```

---

## 🌐 Método 2: Compilação em Nuvem (EAS Build)

### Opção A: Expo Application Services (Recomendado)

**Vantagens:** Simples, rápido, integrado com Capacitor

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configurar projeto
eas build:configure

# 4. Compilar APK
eas build --platform android --type apk

# 5. Download automático
# APK será enviado para seu email
```

**Custo:** Grátis para 30 builds/mês, depois $99/mês

### Opção B: GitHub Actions (Grátis)

Crie arquivo `.github/workflows/build-apk.yml`:

```yaml
name: Build APK

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build frontend
        run: pnpm build
      
      - name: Sync Capacitor
        run: npx cap sync android
      
      - name: Build APK
        run: cd android && ./gradlew assembleDebug
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-debug.apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚀 Método 3: Ferramentas Online (Mais Rápido)

### Usando Capacitor Cloud Build

```bash
# 1. Fazer login
npx cap login

# 2. Compilar na nuvem
npx cap build android

# 3. Baixar APK
# Link será fornecido após compilação
```

---

## 📲 Instalação do APK

### Em Dispositivo Físico

#### Via ADB (Android Debug Bridge)

```bash
# 1. Conectar dispositivo via USB
# 2. Ativar "Depuração USB" nas Configurações do Android
# 3. Executar:

adb install app-debug.apk
```

#### Via Arquivo

1. Transferir `app-debug.apk` para o dispositivo
2. Abrir gerenciador de arquivos
3. Localizar o arquivo
4. Clicar para instalar
5. Permitir instalação de fontes desconhecidas (se necessário)

### Em Emulador Android Studio

```bash
# 1. Abrir Android Studio
# 2. Abrir AVD Manager
# 3. Iniciar emulador
# 4. Executar:

adb install app-debug.apk
```

---

## 🔐 Assinatura para Play Store

### Passo 1: Criar Keystore

```bash
keytool -genkey -v -keystore escola-app-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias escolaapp-release
```

**IMPORTANTE:** Guarde este arquivo em local seguro! Você precisará dele para atualizações futuras.

### Passo 2: Configurar Gradle

Edite `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            keyAlias 'escolaapp-release'
            keyPassword 'sua-senha-aqui'
            storeFile file('../../escola-app-release.keystore')
            storePassword 'sua-senha-aqui'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Passo 3: Compilar APK Assinado

```bash
cd android
./gradlew assembleRelease
```

Resultado: `android/app/build/outputs/apk/release/app-release.apk`

### Passo 4: Publicar na Play Store

1. Ir para [Google Play Console](https://play.google.com/console)
2. Criar novo aplicativo
3. Preencher informações (nome, descrição, screenshots)
4. Fazer upload do APK assinado
5. Revisar e publicar

---

## 🐛 Troubleshooting

### Problema: "Gradle not found"
**Solução:** Instale Gradle ou use `./gradlew` (gradle wrapper incluído)

```bash
cd android
./gradlew --version
```

### Problema: "JAVA_HOME not set"
**Solução:** Configure variável de ambiente

```bash
# Linux/Mac
export JAVA_HOME=$(/usr/libexec/java_home)

# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-21
```

### Problema: "SDK not found"
**Solução:** Configure ANDROID_SDK_ROOT

```bash
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
```

### Problema: "Build fails with memory error"
**Solução:** Aumente memória do Gradle

```bash
# Edite android/gradle.properties
org.gradle.jvmargs=-Xmx4096m
```

### Problema: "APK não instala"
**Solução:** Verifique versão mínima do Android

```bash
# android/app/build.gradle
android {
    defaultConfig {
        minSdkVersion 24  // Android 7.0+
        targetSdkVersion 34
    }
}
```

---

## 📊 Versioning e Atualizações

### Atualizar Versão

Edite `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        versionCode 2        // Incrementar sempre
        versionName "1.0.1"  // Versão semântica
    }
}
```

**Regra:** `versionCode` deve aumentar a cada release!

### Changelog

Mantenha arquivo `CHANGELOG.md`:

```markdown
## [1.0.1] - 2026-06-16
### Added
- Importação de XLSX
- Indicadores visuais de aprovação

### Fixed
- Correção de cálculo de média
- Melhorias de performance
```

---

## 📈 Monitoramento e Analytics

### Adicionar Firebase (Opcional)

```bash
pnpm add @capacitor-firebase/analytics
npx cap sync android
```

Edite `capacitor.config.ts`:

```typescript
plugins: {
  FirebaseAnalytics: {
    enabled: true
  }
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Completo

```yaml
name: Build & Deploy APK

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - run: pnpm install
      - run: pnpm build
      - run: npx cap sync android
      
      - run: cd android && ./gradlew assembleDebug
      
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
      
      - name: Upload APK
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./android/app/build/outputs/apk/debug/app-debug.apk
          asset_name: EscolaApp-debug.apk
          asset_content_type: application/vnd.android.package-archive
```

---

## 🆘 Solução de Problemas (Troubleshooting)

### ❌ Erro: "Android Gradle plugin requires Java 17 to run"

**Problema:** Build falha com erro indicando versão de Java insuficiente.

**Solução:**
```bash
# Instalar Java 21
sudo apt-get install openjdk-21-jdk

# Configurar JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

# Tentar novamente
cd android && ./gradlew clean assembleDebug
```

---

### ❌ Erro: "invalid source release: 21"

**Problema:** Compilador Java é versão anterior a 21 (por ex: Java 11 ou 17).

**Causa:** O arquivo `capacitor.build.gradle` (auto-gerado) requer Java 21.

**Solução:**
```bash
# Verificar versão do Java
java -version

# Se não for 21, instalar Java 21:
sudo apt-get install openjdk-21-jdk

# Definir como padrão:
sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-21-openjdk-amd64/bin/java 1
sudo update-alternatives --config java

# Ou passar na variável de ambiente:
cd android
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 ./gradlew assembleDebug
```

---

### ❌ Erro: "Android SDK location not found"

**Solução:**
```bash
# Linux/Mac
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools

# Windows
setx ANDROID_SDK_ROOT "C:\Android\Sdk"
```

---

### ❌ App não abre após instalar no Android

**Possíveis causas e soluções:**

1. **Assets não foram compilados:**
   ```bash
   cd /workspaces/escola-app-mobile
   pnpm build
   npx cap sync android
   ```

2. **Frontend não está em dist/public:**
   ```bash
   ls -la dist/public/index.html
   # Se não existir, rodar pnpm build
   ```

3. **Limpar cache do Android:**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   ```

4. **Verificar logs do app no dispositivo:**
   ```bash
   adb logcat | grep EscolaApp
   ```

---

### 📚 Recursos Adicionais


- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android Developer Guide](https://developer.android.com/)
- [Google Play Console](https://play.google.com/console)
- [Android Studio](https://developer.android.com/studio)

---

## ✅ Checklist de Deploy

- [ ] Versão incrementada em `build.gradle`
- [ ] Changelog atualizado
- [ ] Frontend compilado com `pnpm build`
- [ ] Capacitor sincronizado com `npx cap sync android`
- [ ] APK compilado com `./gradlew assembleDebug` ou `assembleRelease`
- [ ] APK testado em dispositivo/emulador
- [ ] Keystore guardado em local seguro (release apenas)
- [ ] APK assinado (release apenas)
- [ ] Publicado na Play Store (release apenas)

---

## 🆘 Suporte

Para problemas com compilação:

1. Verifique [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)
2. Abra issue no [GitHub do Capacitor](https://github.com/ionic-team/capacitor)
3. Consulte [Fórum Capacitor](https://forum.ionicframework.com/)

---

**Última atualização:** 16 de Junho de 2026  
**Versão:** 1.0.0
