#!/usr/bin/env bash
mkdir -p dist
browserify src/new-tag.js > dist/tag.js
browserify src/new-tag.js > test/www/new/tag.js

#combined tag
browserify src/tag.js > dist/new-tag.js
cp -f src/smart-tag.html dist/smart-tag.html