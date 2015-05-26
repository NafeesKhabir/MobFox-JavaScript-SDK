#!/usr/bin/env bash
browserify -t stringify src/native-sdk.js | uglifyjs --compress --mangle > dist/native-sdk.js