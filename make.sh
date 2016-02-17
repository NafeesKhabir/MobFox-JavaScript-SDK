#!/usr/bin/env bash
mkdir -p dist
browserify src/index.js > dist/ad_sdk.js
echo "//@ sourceURL= MobFox_JS_SDK.js" >> dist/ad_sdk.js
browserify -t stringify src/native.js > dist/native_ad_sdk.js
