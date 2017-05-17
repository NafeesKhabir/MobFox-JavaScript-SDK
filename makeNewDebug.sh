#!/usr/bin/env bash
mkdir -p dist
browserify src/new-tag.js > dist/tag.js
browserify src/new-tag.js > test/www/new/tag.js
