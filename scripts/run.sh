#! /bin/bash

control_c()
{
  echo -en "\n*** Exiting ***\n"
  from_dev
  exit $?
}

to_dev()
{
  sudo rmmod i2c_hid
  sudo rmmod hid_generic
  sudo rmmod hid
  sudo modprobe i2c_dev
  sudo chmod a+rw /dev/i2c-$1
}

from_dev()
{
  while : ; do
   sudo modprobe i2c_hid;
    if [ -n "`dmesg | tail -f -n 1 | grep Mouse`" ]; then
      break;
    else
      echo "Trying bring TouchPad back again...";
      sudo rmmod i2c_hid;
    fi
  done
}

# trap keyboard interrupt (control-c)
trap control_c SIGINT

BUS=`dmesg | sed -n 's/.*i2c-\([0-9][0-9]*\)\/i2c-FTE1001.*/\1/p' | head -1`

to_dev $BUS
babel-node src/index.js $BUS
from_dev $BUS
