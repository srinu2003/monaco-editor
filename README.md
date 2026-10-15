feat(build): add lightweight HTML Monaco editor distribution build script
Add dedicated standalone build configuration and entry point to compile
a lightweight (~3.9 MB) HTML-only Monaco Editor directly from TypeScript source,
excluding unnecessary language grammars and services.

Files added/modified:
- build-html-monaco.js: Standalone esbuild script targeting HTML distribution
- src/html-editor.ts: Entry point importing core editor + HTML/CSS/JS language support
- package.json: Added 'npm run build-html' script
