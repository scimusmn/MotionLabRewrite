#!/bin/bash

CMD_OUTPUT=$1

AUX_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $AUX_DIR

echo -e "\n* Install the Native Abstraction for Node dependencies..."

sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install libfreeimage-dev >$1 2>&1

sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install node-gyp >$1 2>&1

echo -e "\n* Install the Vieworks Libraries..."

bash $AUX_DIR/local/src/VieworksModule/VIS-Shadow-Install/install.sh $CMD_OUTPUT

sudo chmod -R 777 /usr/include/VIS-Shadow
