import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { tests } from 'commonmark-spec';
import { JSDOM } from 'jsdom';
import { minify as minifyHTML } from 'html-minifier-terser';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
const window = dom.window;

globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLParagraphElement = window.HTMLParagraphElement;
globalThis.Text = window.Text;

// "we move it to the top automatically to help you"
// so i had to move it down here using this weird syntax
const { md2html } = await import('./md2html.js');

console.log(new Set(tests.values().map(e => e.section)));

describe("Commonmark Compiliance Test", () => {
    tests.filter(e=>(["Thematic breaks", "ATX headings", "Fenced code blocks"]).includes(e.section)).forEach(tc => {
        test(`Test #${tc.number} - ${tc.section}`, async () => {
            const frag = md2html(tc.markdown);

            const td = window.document.createElement("div");
            td.appendChild(frag.cloneNode(true));
            const html = td.innerHTML;

            // assert.strictEqual(normalizeHtml(html), normalizeHtml(tc.html))
            if (await minifyHTML(html) !== await minifyHTML(tc.html)) {console.log(`Not working! { html, tc.md, tc.html }`, await minifyHTML(html), "\n", tc.markdown, "\n", await minifyHTML(tc.html)); throw new Error("Test failed!");}
        })
    });
});