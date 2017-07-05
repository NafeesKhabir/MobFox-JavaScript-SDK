#!/usr/bin/env bash
mkdir -p dist
browserify src/mopub.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/mopub.js
browserify src/smart-mopub.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/smart-mopub.js
echo "//@ sourceURL= MobFox_JS_SDK.js" >> dist/ad_sdk.js
#browserify -t stringify src/native.js > dist/native_ad_sdk.js
