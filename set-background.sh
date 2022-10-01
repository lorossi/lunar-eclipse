#!/bin/bash
image_folder="/home/lorenzo/Pictures/Wallpapers/circles"

# this script has no interaction as it's made to be called automatically by a service such as cron
if [[ ! -d $image_folder ]]; then
    echo "Image folder does not exist"
    exit -1
    elif [[ -z $(ls $image_folder) ]]; then
    echo "Image folder is empty"
    exit -2
fi;

# load a random image from the folder
image=$(ls $image_folder | shuf -n 1)

# finally set the image as background
gsettings set org.gnome.desktop.background picture-uri file:///$image_folder/$image