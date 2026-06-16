import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.escolaapp.mobile',
  appName: 'Escola App',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;

// Configuração para desenvolvimento local
if (process.env.NODE_ENV === 'development') {
  config.server = {
    url: 'http://localhost:5173',
    cleartext: true
  };
}
