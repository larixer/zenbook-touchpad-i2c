#! /bin/sh
dmesg | sed -n 's/.*i2c-\([0-9][0-9]*\)\/i2c-FTE1001.*/\1/p' | head -1
