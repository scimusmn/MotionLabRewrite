#!/bin/bash

AUX_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $AUX_DIR

sudo apt install libfreeimage-dev >$1

sudo apt install node-gyp >$1

bash $AUX_DIR/local/src/VieworksModule/VIS-Shadow-Install/install.sh $1

sudo chmod -R 777 /usr/include/VIS-Shadow
