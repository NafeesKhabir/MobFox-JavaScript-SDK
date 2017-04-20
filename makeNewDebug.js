#!/usr/bin/env bash
mkdir -p dist
browserify src/new-tag.js > dist/tag.js
