# Markdown 2 HTML

This is a simple tool to convert markdown to html. To compile, install dependencies then run `npm run build`. It runs via the API md2html (installed to window.m2html) which takes a markdown string and returns a DocumentFragment. You can get the thing at https://cdn.jsdelivr.net/gh/s0urce-c0de/md2html/md2html.min.js. 

## THIS IS NOT EVEN CLOSE TO FULL COMMONMARK COMPATABILITY YET

Try the web demo at https://s0urce-c0de.github.io/md2html/
![Demo Image](https://terra.hackclub-assets.com/8a5c015f-1140-4dbe-851b-5413fe525269.png)

# DISCLAIMER

The portions of the commmonmark spec cited from https://github.com/commonmark/commonmark-spec/raw/0.31.2/spec.txt (saved at [commonmark-spec.txt](./commonmark-spec.txt)) are CC-BY-SA 4.0 and not my copyright.

All the files are use commonmark 0.31.2 or unicode 18.0.0














Want a specific unicode category? Replace `Zs` with that catgeory and run this (outputs with `|` seperator) `awk -F';' '$3 ~ /^Zs/ { printf "\\u%04s|", $1 }' UnicodeData-18.0.0.txt`.

node -e "import { tests } from 'commonmark-spec';console.log(JSON.stringify(tests));" | jq -M . | tee tests.json
