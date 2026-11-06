# Markdown 2 HTML

This is a simple tool to convert markdown to html. To compile, install dependencies then run `npm run build`.

# DISCLAIMER

The portions of the commmonmark spec cited from https://github.com/commonmark/commonmark-spec/raw/0.31.2/spec.txt (saved at [commonmark-spec.txt](./commonmark-spec.txt)) are CC-BY-SA 4.0 and not my copyright.

All the files are use commonmark 0.31.2 or unicode 18.0.0

Want a specific unicode category? Replace `Zs` with that catgeory and run this (outputs with `|` seperator) `awk -F';' '$3 ~ /^Zs/ { printf "\\u%04s|", $1 }' UnicodeData-18.0.0.txt`.