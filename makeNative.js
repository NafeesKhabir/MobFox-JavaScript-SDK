#!/usr/bin/env bash
mkdir -p dist
browserify src/native.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/native.js
