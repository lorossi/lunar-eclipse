#!/bin/bash
default_resize=40
default_output=background.png

# load image from argument
if [[ -z $1 ]]; then
    echo "No image specified"
    exit 1
fi;
# set source path
if [[ -z $2 ]]; then
    echo -e "defaulting to $default_resize% of screen size"
    resize=$default_resize
else
    echo -e "resizing center to $2% of screen size"
    resize=$2
fi;
# set output path
if [[ -z $3 ]]; then
    echo -e "defaulting to $default_output as output path"
    output=$default_output
else
    echo -e "saving output to $3"
    output=$3
fi;

# resize to 1920x1080
convert $1 -resize $resize% -background "rgb(15, 15, 15)" -gravity center -extent 1920x1080 $output