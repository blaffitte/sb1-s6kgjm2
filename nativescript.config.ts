import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'com.fridgemanager.app',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  },
  ios: {
    teamId: '', // Votre Apple Team ID sera nécessaire ici
    buildPath: 'build/ios',
    podfile: true
  }
} as NativeScriptConfig;