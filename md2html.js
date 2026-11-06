/**
 * @fileoverview A markdown to HTML converter based upon https://spec.commonmark.org/0.31.2/
 */

/**
 * @typedef {{type: string, val: (string|undefined)}} token
 */
let token = void 0;

/**
 * @param {string} md The markdown to tokenize.
 * @returns {!Array<!token>}
 */
function tokenize(md) {
    /** @type {!Array<!token>} */
    const tokens = [];
    return tokens;
}

/**
 * Convert markdown into HTML.
 * 
 * @param {string} md The markdown string to convert
 * @returns {!DocumentFragment} The output html
 * @export
 */
export function md2html(md) {
    /** @type {!DocumentFragment} */
    const html = document.createDocumentFragment();
    /** @type {!Array<!token>} */
    const tokens = tokenize(md);
    // html.push(md);
    return html;
}