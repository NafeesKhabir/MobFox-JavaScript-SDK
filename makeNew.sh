#!/usr/bin/env bash
mkdir -p dist

#combined tag
browserify src/tag.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/mobfox-combined.js
cp -f src/smart-tag.html dist/smart-tag.html

#browserify src/new-tag.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/tag.js
#browserify src/new-tag.js | java -jar compiler.jar --language_in ECMASCRIPT5 > test/www/new/tag.js

#cp -f src/moat-tag.js dist/moat-tag.js
#uglifyjs -c -- src/moat-tag.js > dist/moat-tag.js
#uglifyjs -c -- src/moat-tag.js > test/www/new/moat-tag.js

#cp -f sdk/tagBanneriOSMoat.html dist/tagBanneriOSMoat.html
#cp -f src/moat.html test/www/new/moat.html

#browserify src/smart-tag.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/smart-tag.js
#cp -f src/smart-tag.html dist/smart-tag.html
#browserify src/smart-tag.js | java -jar compiler.jar --language_in ECMASCRIPT5 > test/www/new/smart-tag.js
#cp -f src/smart-tag.html test/www/new/smart-tag.html
#browserify src/new.js | java -jar compiler.jar --language_in ECMASCRIPT5 > dist/new.js
#cp -f src/new.html dist/new.html
#uglifyjs -c -- src/smart-tag.js > dist/smart-tag.js

#uglifyjs -c -- src/ios-render.js > dist/ios-render.js
#uglifyjs -c -- src/ios-render.js > test/www/new/ios-render.js
#
#cp -f src/ios-render.html dist/ios-render.html
#cp -f src/ios-render.html test/www/new/ios-render.html
#
#uglifyjs -c -- src/ios-render.new.js > dist/ios-render.new.js
#uglifyjs -c -- src/ios-render.new.js > test/www/new/ios-render.new.js
#
#cp -f src/ios-render.new.html dist/ios-render.new.html
#cp -f src/ios-render.new.html test/www/new/ios-render.new.html