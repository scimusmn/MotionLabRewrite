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

echo "This is a script to assist with installation of the VIS-Shadow SDK.";
echo "Would you like to continue and install all the VIS-Shadow SDK packages?";
echo -n "$YESNO_PROMPT"
read confirm

if [ $confirm = "n" ] || [ $confirm = "N" ] || [ $confirm = "no" ] || [ $confirm = "No" ]
then
    exit 0
    break
fi


echo "########################################################################"
echo "##                                                                    ##"
echo "##     VIS-Shadow - install other packages                            ##"
echo "##                                                                    ##"
echo "########################################################################"
echo ""
echo "    Please wating for a few minutes while downloading and installing  "
echo ""
echo "   install 1 of 7 .... zlib1g-dev "
sudo apt-get install zlib1g-dev -y 2> error.log
echo "   install 2 of 7 .... gcc "
sudo apt-get install gcc -y 2> error.log
echo "   install 3 of 7 .... g++ "
sudo apt-get install g++ -y 2> error.log
echo "   install 4 of 7 .... libqt4-core "
sudo apt-get install libqt4-core -y 2> error.log
echo "   install 6 of 7 .... libqt4-dev "
sudo apt-get install libqt4-dev -y 2> error.log
echo "   install 7 of 7 .... libqt4-gui "
sudo apt-get install libqt4-gui -y 2> error.log

echo ""
echo "    Other Package Installation's Completion!"
echo ""

echo "Installing VIS-Shadow packages...";

sudo dpkg -i VIS-Shadow_1.1.0_x86_64.deb

#sudo sh genicam.sh
#sudo sh netsetting.sh

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
