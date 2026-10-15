/**
 * Dedicated Lightweight Monaco HTML Editor Build Script
 * 
 * Compiles a focused, HTML-only distribution of Monaco Editor directly from TypeScript source (src/).
 * Excludes 70+ unnecessary language grammars and heavy language servers, reducing bundle size by ~85%.
 * 
 * Inputs:
 *   - Main Editor Entry: src/html-editor.ts
 *   - Base Editor Worker: src/deprecated/editor/editor.worker.ts
 *   - HTML Language Worker: src/languages/features/html/html.worker.ts
 *   - AMD Module Loader: build/amd/src/loader.js (or out/monaco-editor/min/vs/loader.js)
 * 
 * Outputs (dist/vs/):
 *   - vs/loader.js
 *   - vs/editor/editor.main.js & editor.main.css
 *   - vs/editor/editor.worker.js
 *   - vs/language/html/html.worker.js
 */

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function build() {
  const rootDir = __dirname;
  const outVsDir = path.resolve(rootDir, 'dist/vs');

  // 1. Create target directories
  const editorOutDir = path.join(outVsDir, 'editor');
  const htmlOutDir = path.join(outVsDir, 'language/html');
  fs.mkdirSync(editorOutDir, { recursive: true });
  fs.mkdirSync(htmlOutDir, { recursive: true });

  // 2. Copy official AMD module loader
  console.log('1. Copying AMD loader.js...');
  const loaderSrc = fs.existsSync(path.resolve(rootDir, 'build/amd/src/loader.js'))
    ? path.resolve(rootDir, 'build/amd/src/loader.js')
    : path.resolve(rootDir, 'out/monaco-editor/min/vs/loader.js');

  fs.copyFileSync(loaderSrc, path.join(outVsDir, 'loader.js'));

  // 3. Compile Main Editor (src/html-editor.ts)
  console.log('2. Compiling editor.main.js and editor.main.css directly from src/html-editor.ts...');
  await esbuild.build({
    entryPoints: [path.join(rootDir, 'src/html-editor.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    globalName: 'monaco',
    banner: {
      js: `define("vs/editor/editor.main", ["require", "exports"], function(require, exports) {
if (typeof document !== "undefined" && !document.querySelector("link[href*='editor.main.css']")) {
  var _l = document.createElement("link");
  _l.rel = "stylesheet";
  _l.href = (typeof require !== "undefined" && require.toUrl) ? require.toUrl("vs/editor/editor.main.css") : "vs/editor/editor.main.css";
  document.head.appendChild(_l);
}`
    },
    footer: {
      js: 'if (typeof exports !== "undefined" && typeof monaco !== "undefined") { Object.assign(exports, monaco); } if (typeof globalThis !== "undefined" && typeof monaco !== "undefined") { globalThis.monaco = monaco; } });'
    },
    outfile: path.join(editorOutDir, 'editor.main.js'),
    loader: {
      '.ttf': 'dataurl',
      '.svg': 'dataurl'
    },
    define: {
      'import.meta.url': '""'
    },
    target: ['es2020'],
    logLevel: 'info'
  });

  // 4. Compile Base Editor Worker (src/deprecated/editor/editor.worker.ts)
  console.log('3. Compiling clean vs/editor/editor.worker.js from src/deprecated/editor/editor.worker.ts...');
  await esbuild.build({
    entryPoints: [path.join(rootDir, 'src/deprecated/editor/editor.worker.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    outfile: path.join(editorOutDir, 'editor.worker.js'),
    target: ['es2020'],
    logLevel: 'info'
  });

  // 5. Compile HTML Language Worker (src/languages/features/html/html.worker.ts)
  console.log('4. Compiling clean vs/language/html/html.worker.js from src/languages/features/html/html.worker.ts...');
  await esbuild.build({
    entryPoints: [path.join(rootDir, 'src/languages/features/html/html.worker.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    outfile: path.join(htmlOutDir, 'html.worker.js'),
    target: ['es2020'],
    logLevel: 'info'
  });

  // 6. Print Summary
  console.log('\n=========================================');
  console.log('BUILD SUCCESSFUL! Output in dist/vs:');
  console.log('=========================================');
  function printDir(dir, prefix = '') {
    for (const item of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        console.log(`${prefix}${item}/`);
        printDir(fullPath, prefix + '  ');
      } else {
        const sizeKB = (stat.size / 1024).toFixed(1);
        console.log(`${prefix}${item} (${sizeKB} KB)`);
      }
    }
  }
  printDir(outVsDir);
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
