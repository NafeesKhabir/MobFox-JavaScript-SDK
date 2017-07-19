#!/usr/bin/env bash
mkdir -p test/www

#combined tag
#browserify src/tag.js | java -jar compiler.jar --language_in ECMASCRIPT5 > test/www/mobfox-combined.js
#cp -f src/banner-in-body.html test/www/banner-in-body.html
#cp -f src/banner-in-head.html test/www/banner-in-head.html
#cp -f src/banner-secure.html test/www/banner-secure.html
#cp -f src/banner-smart.html test/www/banner-smart.html

#combined mopub
#browserify src/mopub-combined.js | java -jar compiler.jar --language_in ECMASCRIPT5 > test/www/mopub-combined.js

#video
browserify src/video.js | java -jar compiler.jar --language_in ECMASCRIPT5 > test/www/video.js
cp -f src/video.html test/www/video.html