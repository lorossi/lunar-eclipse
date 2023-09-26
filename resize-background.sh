#!/bin/bash
default_resize=40
default_output=background.png

# check if imagemagick is installed, if not prompt to install and exit
if ! command -v convert &> /dev/null
then
    echo "imagemagick could not be found"
    echo "install imagemagick with your package manager"
    echo "exiting..."
    exit
fi

# load image from argument
if [[ -z $1 ]]; then
    echo "No image specified"
    exit 1
fi;

# load resize from argument
if [[ -z $2 ]]; then
    echo -e "defaulting to $default_resize% of screen size"
    resize=$default_resize
else
    echo -e "resizing center to $2% of screen size"
    resize=$2
fi;

# load output from argument
if [[ -z $3 ]]; then
    echo -e "defaulting to $default_output as output path"
    output=$default_output
else
    echo -e "saving output to $3"
    output=$3
fi;

# resize to 1920x1080
convert $1 -resize $resize% -background "rgb(15, 15, 15)" -gravity center -extent 1920x1080 $output