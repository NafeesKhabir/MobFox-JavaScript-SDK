#!/usr/bin/env bash
mkdir -p dist
browserify src/new-tag.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/tag.js
