#!/bin/bash

OPTS="$@"

CMD_OUTPUT='/dev/null'
CAM_IFACE='eth0'
NET_IFACE='eth1'
UPDATE_KERNAL=false

declare -A flags
declare -A booleans
args=()

while [ "$1" ];
do
    arg=$1
    #if the next opt starts with a '-'
    if [ "${1:0:1}" == "-" ]
    then
      # move to the next opt
      shift
      rev=$(echo "$arg" | rev) #reverse the string

      #if the next opt is not empty, or begins with a '-', or this opt ends in a ':'
      if [ -z "$1" ] || [ "${1:0:1}" == "-" ] || [ "${rev:0:1}" == ":" ]
      then
        # it is a boolean flag
        bool=$(echo ${arg:1} | sed s/://g)
        booleans[$bool]=true
        #echo \"$bool\" is boolean
      else
        # it is a flag with a value
        value=$1
        flags[${arg:1}]=$value
        shift
      fi
    else
      args+=("$arg")
      shift
      #echo \"$arg\" is an arg
    fi
done

if [ ! -z "${flags['c']}"]; then
  CAM_IFACE="${flags['c']}"
fi

if [ ! -z "${flags['o']}"]; then
  CMD_OUTPUT="${flags['o']}"
fi

if [ ! -z "${flags['n']}"]; then
  NET_IFACE="${flags['n']}"
fi

if [ "${booleans['k']}" = true ]; then
  UPDATE_KERNAL=true
fi

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
