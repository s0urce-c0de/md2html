/**
 * @fileoverview A markdown to HTML converter based upon https://spec.commonmark.org/0.31.2/
 */

import { entityNamesDict } from './entities.js';

/**
 * @enum {number}
 */
const tokenType = {
    HEADER6: -6,
    HEADER5: -5,
    HEADER4: -4,
    HEADER3: -3,
    HEADER2: -2,
    HEADER1: -1,
    TEXT: 0,
    THEMATICBREAK: 1,
    LITERALNEWLINE: 2,
}; 

/**
 * @typedef {{type: !tokenType, val: (undefined|string|!Array<!token>)}} token
 */
const token = void 0;

/**
 * @const {!RegExp};
 */
const asciiPunctuationCharacter = /[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/;

/**
 * @param {string} md The markdown to tokenize.
 * @param {{
 *  inline: (boolean|undefined)
 * }} opts The options
 * @returns {!Array<!token>}
 */
function tokenize(md, opts) {
    /** @type {!Array<!token>} */
    const tokens = [];
    /** @type {?RegExpResult} */
    let match;
    /* NO i++ */
    tokenBlock: for (let i = 0; i < md.length;) {
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
        /** @const {string} */
        const restPastStart = md.slice(i).split("\n")[0];

        notInline: if(!opts.inline || (md[i-1] === '\n')) {
            if (match = restPastStart.match(/^\u0020{0,3}([\-\_\*])[\u0020\u0009]*(?:\1[\u0020\u0009]*){2,}$/)) {
                // 4.1
                tokens.push({
                    type: tokenType.THEMATICBREAK
                });
                i += match[0].length;
            } else if (match = restPastStart.match(/^\u0020{0,3}(#{1,6})(?:[\u0020\u0009]+(.+?)(?:[\u0020\u0009]+\#+)?)?[\u0020\u0009]*$/)) {
                /** @const {?tokenType} */
                const tokType = ([tokenType.HEADER1, tokenType.HEADER2, tokenType.HEADER3, tokenType.HEADER4, tokenType.HEADER5, tokenType.HEADER6])[match[1].length-1];
                if(!tokType) { console.error("Somehow you broke the header regex!", tok); continue; }
                tokens.push({
                    type: tokType,
                    val: tokenize(match[2] ?? '', { ...opts, inline: true })
                });
                i += match[0].length;
            } else {
                break notInline;
            }

            let s;
            if ((s = md[i]) === "\n" || (s=md.slice(i, i+2)) === '\r\n') {
                tokens.push({
                    type: tokenType.LITERALNEWLINE
                });

                i += s.length;
                continue tokenBlock;
            }
            // skipping 4.3 setext
        }
        if (md[i] === "\\") {
            // 2.4
            if(md[i + 1] != void 0 && asciiPunctuationCharacter.test(md[i + 1])) {
                tokens.push({
                    type: tokenType.TEXT,
                    val: md[i + 1]
                });
                i += 2;
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
        continue;
    }

    return tokens;
}

/**
 * Convert markdown into HTML.
 * 
 * @param {string} md The markdown string to convert
 * @param {{
 *  tokens: (!Array<!token>|undefined),
 *  inline: (boolean|undefined)
 * }=} opts Extra token options
 * @returns {!DocumentFragment} The output html
 */
function md2html(md, opts = {}) {
    opts = {tokens: undefined, inline: false, ...opts};
    /** @const {!DocumentFragment} */
    const html = document.createDocumentFragment();
    /** @const {!Array<!token>} */
    const tokens = opts.tokens ?? tokenize(md, opts);

    for (let tok of tokens) {
        if (tok.type === tokenType.TEXT) {
            if(!(typeof tok.val === "string")) { console.error("Text Token was not a string!", tok); continue; }
            if (html.lastChild instanceof (opts.inline ? Text : HTMLParagraphElement)) {
                html.lastChild.textContent += tok.val;
            } else {
                const p = (opts.inline ? new Text() : document.createElement("p"));
                // 2.3
                p.textContent += tok.val.replaceAll('\u0000', '\uFFFD');
                html.appendChild(p);
            }
        } else if (opts.inline) {
            console.error("The token does not parse in inline!", tok);
            continue;
        } else if (tok.type === tokenType.LITERALNEWLINE) {
            if (tok.val) { console.error("Newlines should not have a value!"); continue; }
            html.appendChild(document.createTextNode("\n"));
        } else if (tok.type === tokenType.THEMATICBREAK) {
            if (tok.val) { console.error("Thematic Break token should not have a value!", tok); continue; }
            html.appendChild(document.createElement("hr"));
        } else if (([tokenType.HEADER1, tokenType.HEADER2, tokenType.HEADER3, tokenType.HEADER4, tokenType.HEADER5, tokenType.HEADER6]).includes(tok.type)) {
            if(!(tok.val instanceof Array)) { console.error("Header tokens should have subelements!"); continue; }
            const header = document.createElement(`h${-tok.type}`);
            header.appendChild(md2html("", {tokens: tok.val, inline: true}));
            html.appendChild(header);
        } else {
            console.log("something went wrong! you sholdnt be able to get here");
        }
    }

    return html;
}

window["md2html"] = md2html;

export { md2html };