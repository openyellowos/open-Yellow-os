#!/bin/bash

THEME_DIR=$(dirname $(readlink -f $0))
source $THEME_DIR/../theme-functions.sh
start_theme "$@"
    
mkdir -p /etc/skel/.local/share/applications/
copy_dir usr/               /usr/
copy_dir etc/               /etc/
copy_dir boot/              /boot/

exit
