# My Notes

Modern notes app — React + Vite + Tailwind + Capacitor. All notes stored offline in `localStorage`. No backend, no account.

## Features
- Create / edit / delete notes with autosave
- Instant search across title + content
- Categories (Personal, Work, Ideas, Code)
- Offline-first local storage

## Dev
```bash
npm install
npm run dev
```

## Android APK
Push to `main` → GitHub Actions builds `app-debug.apk` as an artifact.
