#!/bin/bash

if [ "$#" -lt 1 ];
then
    mkdir -p resized
    rm -rf resized/*.png
    
    for file in frames/*.png; do # for each of them
        out="resized/${file:7}"
        echo "resizing $file"
        convert $file -resize 1920x1080 -background "rgb(15, 15, 15)" -gravity center -extent 1920x1080 $out
    done
else
    out="wallpaper.png"
    echo "converting $1 to $out"
    convert $1 -resize 1920x1080 -background "rgb(15, 15, 15)" -gravity center -extent 1920x1080 $out
fi