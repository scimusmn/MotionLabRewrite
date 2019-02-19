#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

bash $DIR/local/VieworksModule/VIS-Shadow-Install/install.sh

chmod -R 777 /usr/include/VIS-Shadow
