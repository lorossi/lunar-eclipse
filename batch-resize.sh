#!/bin/bash
default_input="to_resize"
default_resize=40
default_output="/home/lorenzo/Pictures/Wallpapers/circles"

# load folder from argument
if [[ -z $1 ]]; then
    echo "defaulting to $default_input as input folder"
else
    echo "using $1 as input folder"
    default_input=$1
fi

# load resize from argument
if [[ -z $2 ]]; then
    echo "defaulting to $default_resize% of screen size"
    resize=$default_resize
else
    echo "resizing center to $2% of screen size"
    resize=$2
fi;

# load output from argument
if [[ -z $3 ]]; then
    echo "defaulting to $default_output as output path"
    output_path=$default_output
else
    echo "saving output to $3"
    output_path=$3
fi;

# create output folder if not exists
if [[ ! -d $output_path ]]; then
    mkdir $output_path
fi;

count=0
# actually resize
for file in $default_input/*; do
    if [[ $(basename $file) =~ noise-([0-9]{13}).png ]]; then
        outfile=$output_path/background-${BASH_REMATCH[1]}.png
        if [[ -f $outfile  ]]; then
            echo "skipping $file as it has been already resized"
        fi;
        
        echo "resizing $file, saving to $outfile"
        convert $file -resize $resize% -background "rgb(15, 15, 15)" -gravity center -extent 1920x1080 $outfile
        ((count++))
    fi
done

if [[ $count -eq 0 ]]; then
    echo "no files found in $default_input"
else
    echo "resized $count files"
fi

# count files in output folder
echo "output folder now contains $(ls $output_path | wc -l) files"