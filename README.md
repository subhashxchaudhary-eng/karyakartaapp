# Neta: Booth se PM Tak

HTML5 political career game (HQ Theme), portrait-first, built to be wrapped for the Play Store.
No framework and no build step: plain HTML/CSS/JS, SVG icons and art drawn in code, sound synthesised with WebAudio.

## Run
```
npm start            # http://localhost:8080  (or: python3 -m http.server 8080)
```

## Android (Capacitor)
```
npm install
npm run android:add  # first time: copies the game into www/ and creates android/
npm run android:sync # after changes
npm run android:open # open in Android Studio, build the APK/AAB
```
Set `android:screenOrientation="portrait"` on the main activity in `android/app/src/main/AndroidManifest.xml`.

## Layout
- `index.html`: shell, fonts, PWA manifest, service worker
- `css/style.css`: HQ theme tokens and components
- `js/icons.js`: SVG icon sprite (`ic('name')`)
- `js/data.js`: content (backgrounds, tolas, actions, events, missions, people)
- `js/art.js`: procedural illustrations (village map, faces, event art, prologue scene)
- `js/engine.js`: state, turn simulation, rival bot, election engine, audio/haptics
- `js/app.js`: screens and flow
- `docs/SCREENS.md`: screen design and screenshots
