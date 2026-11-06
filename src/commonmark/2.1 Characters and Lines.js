/**
 * @fileoverview An implementation of Commonmark spec 0.31.2 Section 2.1
 * 
 * Any sequence of [characters] is a valid CommonMark
 * document.
 *
 * A [character](@) is a Unicode code point.  Although some
 * code points (for example, combining accents) do not correspond to
 * characters in an intuitive sense, all code points count as characters
 * for purposes of this spec.
 *
 * This spec does not specify an encoding; it thinks of lines as composed
 * of [characters] rather than bytes.  A conforming parser may be limited
 * to a certain encoding.
 *
 * A [line](@) is a sequence of zero or more [characters]
 * other than line feed (`U+000A`) or carriage return (`U+000D`),
 * followed by a [line ending] or by the end of file.
 *
 * A [line ending](@) is a line feed (`U+000A`), a carriage return
 * (`U+000D`) not followed by a line feed, or a carriage return and a
 * following line feed.
 *
 * A line containing no characters, or a line containing only spaces
 * (`U+0020`) or tabs (`U+0009`), is called a [blank line](@).
 *
 * The following definitions of character classes will be used in this spec:
 *
 * A [Unicode whitespace character](@) is a character in the Unicode `Zs` general
 * category, or a tab (`U+0009`), line feed (`U+000A`), form feed (`U+000C`), or
 * carriage return (`U+000D`).
 *
 * [Unicode whitespace](@) is a sequence of one or more
 * [Unicode whitespace characters].
 *
 * A [tab](@) is `U+0009`.
 *
 * A [space](@) is `U+0020`.
 *
 * An [ASCII control character](@) is a character between `U+0000–1F` (both
 * including) or `U+007F`.
 *
 * An [ASCII punctuation character](@)
 * is `!`, `"`, `#`, `$`, `%`, `&`, `'`, `(`, `)`,
 * `*`, `+`, `,`, `-`, `.`, `/` (U+0021–2F), 
 * `:`, `;`, `<`, `=`, `>`, `?`, `@` (U+003A–0040),
 * `[`, `\`, `]`, `^`, `_`, `` ` `` (U+005B–0060), 
 * `{`, `|`, `}`, or `~` (U+007B–007E).
 *
 * A [Unicode punctuation character](@) is a character in the Unicode `P`
 * (puncuation) or `S` (symbol) general categories.
 */

/** @const {!RegExp} */
export const tab = /\u0009/;
/** @const {!RegExp} */
export const space = /\u0020/;
/** @const {!RegExp} */
export const character = /[\s\S]/u;
/** @const {!RegExp} */
export const lineEnding = /(?:\u000A|\u000D(?!\u000A)|\u000D\u000A)/;
/** @const {!RegExp} */
export const line = new RegExp(`^[^\\u000A\\u000D]*(?:${lineEnding.source}|$)`);
/** @const {!RegExp} */
export const blankLine = new RegExp(`^(?:$|[${space.source}${tab.source}]+)$`);
/** @const {!RegExp} */
export const unicodeWhitespaceCharacter = new RegExp(`[\\p{Zs}${tab.source}\\u000A\\u000C\\u000D]`, "u");
/** @const {!RegExp} */
export const unicodeWhitespace = new RegExp(`(?:${unicodeWhitespaceCharacter.source})+`, "u");
/** @const {!RegExp} */
export const asciiControlCharacter = /[\u0000-\u001F\u007F]/;
/** @const {!RegExp} */
export const asciiPunctuationCharacter = /[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/;
/** @const {!RegExp} */
export const unicodePunctuationCharacter = /[\p{P}\p{S}]/u;