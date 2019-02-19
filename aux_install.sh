#!/bin/bash

CUR_DIR=$PWD

AUX_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $AUX_DIR

sudo apt install libfreeimage-dev 2> $OUTPUT

sudo apt install node-gyp 2>$OUTPUT

bash $AUX_DIR/local/VieworksModule/VIS-Shadow-Install/install.sh

sudo chmod -R 777 /usr/include/VIS-Shadow
