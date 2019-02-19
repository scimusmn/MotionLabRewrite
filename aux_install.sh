#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR

bash $DIR/local/VieworksModule/VIS-Shadow-Install/install.sh

sudo chmod -R 777 /usr/include/VIS-Shadow
