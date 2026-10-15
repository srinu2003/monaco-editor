/*---------------------------------------------------------------------------------------------
 *  Monaco HTML Editor - Dedicated Lightweight Distribution Entry
 *  
 *  This entry point bundles only the core editor and HTML/CSS/JS language support,
 *  slashing the bundle size from ~25 MB to ~3.9 MB for Salesforce Static Resources.
 *--------------------------------------------------------------------------------------------*/

// 1. Core Editor: Line numbers, cursor, canvas, rendering engine
import 'monaco-editor-core';

// 2. Editor Features: Autocomplete suggest widget, diff editor, find/replace, folding, formatting
import './features/register.all';

// 3. HTML Language Services: Tag auto-closing, diagnostics, formatting, and workerManager
import * as html from './languages/features/html/register';

// 4. Syntax Highlighting: HTML tokens, CSS (for <style> tags), and JS (for <script> tags)
import './languages/definitions/html/register';
import './languages/definitions/css/register';
import './languages/definitions/javascript/register';

// 5. Public API Exports
export * from './editor';
export { html };
