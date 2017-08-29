ionic cordova build android --prod --release
#cordova build --prod --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore platforms/android/pokedex.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk Pokedex
rm Pokedex.apk
~/Code/sdk/android/build-tools/23.0.2/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk Pokedex.apk
