#!/bin/bash
default_resize=40
default_output="resized"

# load folder from argument
if [[ -z $1 ]]; then
    echo "No folder specified"
    exit -1
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
    output_path=$default_output
else
    echo -e "saving output to $3"
    output_path=$3
fi;

# create output folder if not exists
if [[ ! -d $output_path ]]; then
    mkdir $output_path
fi;

# actually resize
for file in $1/*; do
    if [[ -f $file && $(basename $file) =~ noise-([0-9]{13}).png ]]; then
        outfile=$output_path/background-${BASH_REMATCH[1]}.png
        echo "resizing $file, saving to $outfile"
        convert $file -resize $resize% -background "rgb(15, 15, 15)" -gravity center -extent 1920x1080 $outfile
    fi
done