# One Guide use React-native CLI to develop

## Run and build
### Run commands to remove and install node module:
> rm -rf node_modules && npm install

Remember: You don't need to run react-native link , because the project have linked already.And some projects will build fail with this command.

### ANDROID 
1. Run android:
Start server first: 
> npm start

2. Run on emulator (emulator must be opened before) or real device:
> npm run android

> npm run android-staging

> npm run android-production

3. Build android:
You need some files below to build (keep it private and don't commit to git ):
* keystore.properties : copy to node-modules/android folder
* my-release-key.keystore (Staging build) : copy to node-modules/android/app folder
* my-release-key.jks (Production build) : copy to node-modules/android/app folder
* google-services.json (Staging build): copy to node-modules/android/app/src/staging folder
* google-services.json (Production build): copy to node-modules/android/app/src/production folder
4. Build command:
> npm run android-build-staging

> npm run android-build-production

APK file will be exported in node-modules/android/app/build/outputs/apk/ folder

### IOS
1. For the first time, you need to install pod for ios project:
> cd ios

> pod install

> cd ..

2. Run ios (only simulator):
> npm run ios

> npm run ios-staging

> npm run ios-production

To run ios in real device, you must open Xcode (with cer and provisioning files), select Scheme and click Run (Command + R):

Oneguild : Dev
Oneguild (Staging) : Staging
Oneguild (Production) : Production

3. Build ios:
You need cer and provisioning files to build (keep it private and don't commit to git ):
Currently, you only export .ipa file by using xcode
Select Scheme for each environment then select Product -> Archive
"# oneGuide" 
