#!/usr/bin/env bash
mkdir -p dist

#combined tag
browserify src/tag.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/mobfox-combined.js

#combined mopub
browserify src/mopub-combined.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/mopub-combined.js

#video
browserify src/video.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/video.js