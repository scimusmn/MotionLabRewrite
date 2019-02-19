#!/bin/bash

set -o errexit

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
sudo apt-get install zlib1g-dev -y 2> error.log
echo "   install 2 of 7 .... gcc "
sudo apt-get install gcc -y 2> error.log
echo "   install 3 of 7 .... g++ "
sudo apt-get install g++ -y 2> error.log
echo "   install 4 of 7 .... libqtcore4 "
sudo apt-get install libqtcore4 -y 2> error.log
echo "   install 6 of 7 .... libqt4-dev "
sudo apt-get install libqt4-dev -y 2> error.log
echo "   install 7 of 7 .... libqtgui4 "
sudo apt-get install libqtgui4 -y 2> error.log

echo ""
echo "    Other Package Installation's Completion!"
echo ""

echo "Installing VIS-Shadow packages...";

sudo dpkg -i $DIR/VIS-Shadow_1.1.0_x86_64.deb 2> error.log

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
