#!/usr/bin/env bash
mkdir -p dist
browserify src/pinger.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/pinger.js
#browserify src/pinger.js  > dist/pinger.js
#echo "//@ sourceURL= MobFox_JS_SDK.js" >> dist/ad_sdk.js
#browserify -t stringify src/native.js > dist/native_ad_sdk.js
