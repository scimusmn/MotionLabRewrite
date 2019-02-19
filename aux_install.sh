#!/bin/bash

AUX_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $AUX_DIR



bash $AUX_DIR/local/VieworksModule/VIS-Shadow-Install/install.sh

sudo chmod -R 777 /usr/include/VIS-Shadow
