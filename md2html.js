/**
 * @fileoverview A markdown to HTML converter based upon https://spec.commonmark.org/0.31.2/
 */

import { entityNamesDict } from './entities.js';

/**
 * @enum {number}
 */
const tokenType = {
    TEXT: 0,
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
        } else */ /* Migrated out to later if (md[i] === '\u0000') {
            // 2.3
            tokens.push({
                type: tokenType.NULL,
                val: md[i]
            });
            i++;
            continue;
        } */ 
        if (md[i] === "\\") {
            // 2.4
            if(md[i + 1] != void 0 && asciiPunctuationCharacter.test(md[i + 1])) {
                tokens.push({
                    type: tokenType.TEXT,
                    val: md[++i]
                });
                i++;
                continue;
            } /* possible implement hard breaks */ else {
                tokens.push({
                    type: tokenType.TEXT,
                    val: md.slice(i, i + 2)
                });
                i += 2;
                continue;
            }
        } 
        if (md[i] === "&") {
            // 2.5
            /** @const {string} */
            const restPastStart = md.slice(i).split("\n")[0];
            /** @type {?RegExpResult} */
            let match;

            if (match = restPastStart.match(/^\&([a-zA-Z]+?)\;/)) {
                tokens.push({
                    type: tokenType.TEXT,
                    val: entityNamesDict[match[1]] ? entityNamesDict[match[1]].characters : match[0]
                });

                i += match[0].length;
                continue;
            } else if (match = restPastStart.match(/^\&\#(\d{1,7})\;/)) {
                tokens.push({
                    type: tokenType.TEXT,
                    val: String.fromCodePoint(parseInt(match[1], 10))
                });

                i += match[0].length;
                continue;
            } else if (match = restPastStart.match(/^\&\#[xX]([0-9a-fA-F]{1,6})\;/)) {
                tokens.push({
                    type: tokenType.TEXT,
                    val: String.fromCodePoint(parseInt(match[1], 16))
                });

                i += match[0].length;
                continue;
            }
        }
        tokens.push({
            type: tokenType.TEXT,
            val: md[i]
        });
        i++;
    }

    return tokens;
}

/**
 * Convert markdown into HTML.
 * 
 * @param {string} md The markdown string to convert
 * @returns {!DocumentFragment} The output html
 */
function md2html(md) {
    /** @const {!DocumentFragment} */
    const html = document.createDocumentFragment();
    /** @const {!Array<!token>} */
    const tokens = tokenize(md);

    for (let tok of tokens) {
        if(typeof tok.val === "string" && tok.type === tokenType.TEXT) {
            if (html.lastElementChild instanceof HTMLParagraphElement) {
                html.lastElementChild.textContent += tok.val;
            } else {
                /** @type {!HTMLParagraphElement} */
                const p = /** @type {!HTMLParagraphElement} */(document.createElement("p"));
                // 2.3
                p.textContent += tok.val.replaceAll('\u0000', '\uFFFD');
                html.appendChild(p);
            }
        } else {
            console.log("something went wrong! you sholdnt be able to get here");
        }
    }

    return html;
}

window["md2html"] = md2html;

export { md2html };