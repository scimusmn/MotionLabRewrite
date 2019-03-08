#!/bin/bash

OPTS="$@"

CMD_OUTPUT='/dev/null'
CAM_IFACE='eth0'
NET_IFACE='eth1'
UPDATE_KERNAL=false

echo $OPTS

while getopts ':c:o:n:r:a:s:dk' option; do
  case "${option}"
  in
  c)
    CAM_IFACE=${OPTARG}
    echo "$CAM_IFACE is the camera interface"
    ;;
  o) CMD_OUTPUT=${OPTARG};;
  n)
    NET_IFACE=${OPTARG}
    echo "$NET_IFACE is the network interface"
    ;;
  k)
    UPDATE_KERNAL=true
    echo "Kernal will be updated"
    ;;
  s) echo ${OPTARG};;
  r) echo ${OPTARG};;
  a) echo ${OPTARG};;
  d) echo ${OPTARG};;
  ?) echo "Unknown option; make sure it follows any used flags";;
  esac
done


AUX_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )/../"

cd $AUX_DIR

echo -e "\n* Install the Native Abstraction for Node dependencies..."

if [ $UPDATE_KERNAL = true ]; then
  sudo add-apt-repository -y ppa:teejee2008/ppa

  sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install ukuu

  sudo ukuu --install-latest
fi

# if [ $bInterface -eq 0 ]
# then
#         echo "setting interface"
#         echo "#VIS-Shadow" >> /etc/network/interfaces
#         echo "auto $giethname" >> /etc/network/interfaces
#         echo "iface $giethname inet static" >> /etc/network/interfaces
#         echo "address 169.254.0.60" >> /etc/network/interfaces
#         echo "netmask 255.255.0.0" >> /etc/network/interfaces
#         echo "gateway 0.0.0.0" >> /etc/network/interfaces
#         echo "mtu 9000" >> /etc/network/interfaces
#         echo "#VIS-Shadow" >> /etc/network/interfaces
# fi

# cameraIface=0
# netIface=0
#
# #array_test=()
# for iface in $(sudo lshw -C network | grep "logical name:" | sed 's/^.*: //' | $
# do
#   #printf "$iface\n"
#   #array_test+=("$iface")
#   if $(ping -c 1 -W 1 -I "$iface" google.com > /dev/null 2>&1)
#   then
#     echo "$iface connected"
#     if ! netIface; then netIface=$iface; fi;
#   else
#     echo "Not connected: $iface"
#     if ! netIface; then netIface=$iface; fi;
#   fi
# done


sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install libfreeimage3 libfreeimage-dev >$CMD_OUTPUT 2>&1

sudo apt-get -qq -o=Dpkg::Use-Pty=0 --assume-yes install node-gyp >$CMD_OUTPUT 2>&1

echo -e "\n* Install the Vieworks Libraries..."

if [[ ! -f "$AUX_DIR/../current/VIS_Installed" ]]; then
  bash $AUX_DIR/local/src/VieworksModule/VIS-Shadow-Install/install.sh -o $CMD_OUTPUT -c $CAM_IFACE
fi

touch $AUX_DIR/../current/VIS_Installed

sudo chmod -R 755 /usr/include/VIS-Shadow
