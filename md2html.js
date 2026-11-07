/**
 * @fileoverview A markdown to HTML converter based upon https://spec.commonmark.org/0.31.2/
 */

/**
 * @enum {number}
 */
const tokenType = {
    TEXT: 0,
    NULL: 1
}; 

/**
 * @typedef {{type: !tokenType, val: (string|!Array<!token>)}} token
 */
const token = void 0;

/**
 * @const {!RegExp};
 */
const asciiPunctuationCharacter = /[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/;

/**
 * @param {string} md The markdown to tokenize.
 * @returns {!Array<!token>}
 */
function tokenize(md) {
    /** @type {!Array<!token>} */
    const tokens = [];
    /* NO i++ */
    for (let i = 0; i < md.length;) {
        /* if (false) {
            // implement 2.2 later
        } else */ if (md[i] === '\u0000') {
            // 2.3
            tokens.push({
                type: tokenType.NULL,
                val: md[i]
            });
            i++;
        } else if (md[i] === "\\") {
            // 2.4
            if(md[i + 1] != void 0 && asciiPunctuationCharacter.test(md[i + 1])) {
                tokens.push({
                    type: tokenType.TEXT,
                    val: md[++i]
                });
                i++;
            } else {
                tokens.push({
                    type: tokenType.TEXT,
                    val: md.slice(i, i + 2)
                });
                i += 2;
            }
        } else {
            tokens.push({
                type: tokenType.TEXT,
                val: md[i]
            });
            i++;
        }
    }

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
    /** @const {!DocumentFragment} */
    const html = document.createDocumentFragment();
    /** @const {!Array<!token>} */
    const tokens = tokenize(md);

    for (let tok of tokens) {
    switch (tok.type) {
        case tokenType.TEXT:
            if (html.lastElementChild instanceof HTMLParagraphElement) {
                html.lastElementChild.textContent += tok.val;
            } else {
                /** @type {!HTMLParagraphElement} */
                const p = /** @type {!HTMLParagraphElement} */(document.createElement("p"));
                p.textContent += tok.val;
                html.appendChild(p);
            }
            break;

        case tokenType.NULL:
            if (html.lastElementChild instanceof HTMLParagraphElement) {
                html.lastElementChild.textContent += '\uFFFD';
            } else {
                /** @type {!HTMLParagraphElement} */
                const p = /** @type {!HTMLParagraphElement} */(document.createElement("p"));
                p.textContent = '\uFFFD';
                html.appendChild(p);
            }
            break;
        default:
            console.log("something went wrong! you sholdnt be able to get here");
            break;
    }
    }

    return html;
}