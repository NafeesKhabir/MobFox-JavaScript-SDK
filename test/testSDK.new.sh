#!/bin/bash
cd ..
./makeNew.sh 
cd test/
nodeunit testSDK.new.js -t "$1"
