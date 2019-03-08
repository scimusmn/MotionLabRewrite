#!/bin/bash

set -o errexit

trap 'echo "Error while installing vieworks libraries."' ERR

CAM_IFACE='eth0'
CMD_OUTPUT='/dev/null'

echo "$@"

while getopts c:o: option
do
case "${option}"
in
C) CAM_IFACE=${OPTARG};;
o) CMD_OUTPUT=${OPTARG};;
esac
done

VIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"


echo "########################################################################"
echo "##                                                                    ##"
echo "##     VIS-Shadow - install other packages                            ##"
echo "##                                                                    ##"
echo "########################################################################"
echo ""
echo "    Please wating for a few minutes while downloading and installing  "
echo ""
echo "   install 1 of 7 .... zlib1g-dev "
sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install zlib1g-dev >${CMD_OUTPUT} 2>&1
echo "   install 2 of 7 .... gcc "
sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install gcc -y >${CMD_OUTPUT} 2>&1
echo "   install 3 of 7 .... g++ "
sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install g++ -y >${CMD_OUTPUT} 2>&1
echo "   install 4 of 7 .... libqtcore4 "
sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install libqtcore4 -y >${CMD_OUTPUT} 2>&1
echo "   install 6 of 7 .... libqt4-dev "
sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install libqt4-dev -y >${CMD_OUTPUT} 2>&1
echo "   install 7 of 7 .... libqtgui4 "
sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install libqtgui4 -y >${CMD_OUTPUT} 2>&1

echo ""
echo "    Dependency Installation Completion!"
echo ""

echo "Installing VIS-Shadow packages...";


echo "${CAM_IFACE}" | sudo dpkg -i $VIS_DIR/VIS-Shadow_1.1.0_x86_64.deb


#sudo sh genicam.sh
#sudo sh netsetting.sh

echo "Complete";
#
# echo "Would you like to reboot the system?";
# echo -n "$YESNO_PROMPT"
# read confirm
#
# if [ $confirm = "n" ] || [ $confirm = "N" ] || [ $confirm = "no" ] || [ $confirm = "No" ]
# then
#     exit 0
#     break
# fi
#
# sudo reboot
#

exit 0
