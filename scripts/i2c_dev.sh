#! /bin/sh

sudo rmmod i2c_hid
sudo rmmod hid_generic
sudo rmmod hid
sudo modprobe i2c_dev
sudo chmod a+rw /dev/i2c-$1
