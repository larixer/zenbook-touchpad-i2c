#! /bin/sh

while : ; do
	sudo modprobe i2c_hid;
	if [ -z "`dmesg | tail -f -n 1 | grep failed`" ]; then
		break;
	else
		echo "Trying bring TouchPad back again...";
		sudo rmmod i2c_hid;
	fi
done

