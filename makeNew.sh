#!/usr/bin/env bash
mkdir -p dist
browserify src/new-tag.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/tag.js
browserify src/new-tag.js | java -jar compiler.jar --language_in ECMASCRIPT5 > test/www/new/tag.js
uglifyjs -c -- src/ios-render.js > dist/ios-render.js
uglifyjs -c -- src/ios-render.js > test/www/new/ios-render.js
cp -f src/ios-render.html dist/ios-render.html
cp -f src/ios-render.html test/www/new/ios-render.html