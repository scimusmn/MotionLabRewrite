#!/bin/bash

set -o errexit

PROMPT='# '
YESNO_PROMPT='(y/n)# '

# version of the software
MAJOR_VERSION=1
MINOR_VERSION=1
# 0 Alpha, 1 Beta, 2 RC, 3 Public release
RELEASE_TYPE=2
RELEASE_BUILD=0

echo "This is a script to assist with uninstallation of the VIS-Shadow SDK.";
echo "Would you like to continue and uninstall all the VIS-Shadow SDK packages?";
echo -n "$YESNO_PROMPT"
read confirm

if [ $confirm = "n" ] || [ $confirm = "N" ] || [ $confirm = "no" ] || [ $confirm = "No" ]
then
    exit 0
    break
fi


echo "########################################################################"
echo "##                                                                    ##"
echo "##     VIS-Shadow - uninstall other packages                     	    ##"
echo "##                                                                    ##"
echo "########################################################################"
echo ""

echo "UnInstalling VIS-Shadow packages...";

sudo dpkg -r VIS-Shadow-1.1.0:i386

echo "Complete";

echo "Would you like to reboot the system?";
echo -n "$YESNO_PROMPT"
read confirm

if [ $confirm = "n" ] || [ $confirm = "N" ] || [ $confirm = "no" ] || [ $confirm = "No" ]
then
    exit 0
    break
fi

sudo reboot


exit 0
