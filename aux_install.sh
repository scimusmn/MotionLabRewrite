#!/bin/bash

CMD_OUTPUT=$1

echo "Output is going to $CMD_OUTPUT"

AUX_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $AUX_DIR

sudo apt-get install libfreeimage-dev >$1 2>&1

sudo apt-get install node-gyp >$1 2>&1

bash $AUX_DIR/local/src/VieworksModule/VIS-Shadow-Install/install.sh $1

sudo chmod -R 777 /usr/include/VIS-Shadow
