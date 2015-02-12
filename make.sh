#!/usr/bin/env bash
browserify src/index.js >  dist/ad.js
browserify -t stringify src/native.js >  dist/native.js
