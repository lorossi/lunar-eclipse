#!/bin/bash
BACKGROUND_PATH="~/Pictures/Wallpapers/circles"

# this script has no interaction as it's made to be called automatically by a service such as cron
if [[ ! -d $BACKGROUND_PATH ]]; then
    echo "Image folder does not exist"
    exit -1
    elif [[ -z $(ls $BACKGROUND_PATH) ]]; then
    echo "Image folder is empty"
    exit -2
fi;

# load a random image from the folder
image=$(ls $BACKGROUND_PATH | shuf -n 1)

# finally set the image as background
gsettings set org.gnome.desktop.background picture-uri file:///$BACKGROUND_PATH/$image