import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { tests } from 'commonmark-spec';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
const window = dom.window;

globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLParagraphElement = window.HTMLParagraphElement;

// "we move it to the top automatically to help you"
// so i had to move it down here using this weird syntax
const { md2html } = await import('./md2html.js');

function normalizeHtml(htmlStr) {
  const div = window.document.createElement('div');
  div.innerHTML = htmlStr;
  return div.innerHTML
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><');
}

describe("Commonmark Compiliance Test", () => {
    tests.forEach(tc => {
        test(`Test #${tc.number} - ${tc.section}`, () => {
            const frag = md2html(tc.markdown);

            const td = window.document.createElement("div");
            td.appendChild(frag.cloneNode(true));
            const html = td.innerHTML;

            // assert.strictEqual(normalizeHtml(html), normalizeHtml(tc.html))
            if (normalizeHtml(html) !== normalizeHtml(tc.html)) throw new Error("Test failed!")
        })
    });
});