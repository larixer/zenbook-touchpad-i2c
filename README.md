## ASUS ZenBook TouchPads I2C HID Protocol Reverse Engineering

This project is meant to be started on the ASUS Laptop with FTE1001 TouchPad. When launched it unloads TouchPad driver 
and adds i2c-dev driver instead to communicate with TouchPad in userspace. When it finishes i2c_hid driver loaded again to
let you use TouchPad again.

## Getting Started

1. Clone source code locally.

  ```
  git clone git@github.com:vlasenko/zenbook-touchpad-i2c.git
  cd zenbook-touchpad-i2c
  ```

2. Install dependencies.

  ```
  npm i
  ```

3. Start the project.

  ```
  npm start
  ```


If you want to launch the project inside IDE, place the line below at the end of `/etc/sudoers` file:
``` shell
echo "$USER ALL=(ALL) NOPASSWD: `which rmmod`, `which modprobe`, `which chmod`" | sudo tee -a /etc/sudoers
```

Please comment out this line, when you don't do the development, because it lowers security of your system.

## Decoded Windows TouchPad driver command sequences
Based on excellent work of @ain101 [HID Protocol Sniffed]

```
01 00 - READ HID DESCRIPTOR
05 00 00 08 - POWER ON
05 00 00 01 - RESET
02 00 - READ REPORT DESCRIPTOR
05 00 3D 03 ... - SET REPORT - Feature Report Type, Report ID: 13 (0xd)
```

### ASUS Vendor Specific Command to put this TouchPad into Multi Touch Mode!
`05 00 3D 03 06 00 07 00 0D 00 03 01 00`

## Protocol specifications
- [Microsoft HID over I2C]
- [Microsoft HID for MultiTouch]

## Data From Device
```
HID Descriptor:
wHIDDescLength: '1e',
bcdVersion: '100',
wReportDescLength: '85',
wReportDescRegister: '2',
wInputRegister: '3',
wMaxInputLength: '1e',
wOutputRegister: '4',
wMaxOutputLength: '42',
wCommandRegister: '5',
wDataRegister: '6',
wVendorID: 'b05',
wProductID: '101',
wVersionID: '7',
reserved: '0'
```

```
Report Descriptor:
0x05, 0x01,        // Usage Page (Generic Desktop Ctrls)
0x09, 0x02,        // Usage (Mouse)
0xA1, 0x01,        // Collection (Application)
0x85, 0x01,        //   Report ID (1)
0x09, 0x01,        //   Usage (Pointer)
0xA1, 0x00,        //   Collection (Physical)
0x05, 0x09,        //     Usage Page (Button)
0x19, 0x01,        //     Usage Minimum (0x01)
0x29, 0x02,        //     Usage Maximum (0x02)
0x15, 0x00,        //     Logical Minimum (0)
0x25, 0x01,        //     Logical Maximum (1)
0x75, 0x01,        //     Report Size (1)
0x95, 0x02,        //     Report Count (2)
0x81, 0x02,        //     Input (Data,Var,Abs,No Wrap,Linear,Preferred State,No Null Position)
0x95, 0x06,        //     Report Count (6)
0x81, 0x03,        //     Input (Const,Var,Abs,No Wrap,Linear,Preferred State,No Null Position)
0x05, 0x01,        //     Usage Page (Generic Desktop Ctrls)
0x09, 0x30,        //     Usage (X)
0x09, 0x31,        //     Usage (Y)
0x09, 0x38,        //     Usage (Wheel)
0x15, 0x81,        //     Logical Minimum (129)
0x25, 0x7F,        //     Logical Maximum (127)
0x75, 0x08,        //     Report Size (8)
0x95, 0x03,        //     Report Count (3)
0x81, 0x06,        //     Input (Data,Var,Rel,No Wrap,Linear,Preferred State,No Null Position)
0xC0,              //   End Collection
0xC0,              // End Collection
0x06, 0x00, 0xFF,  // Usage Page (Vendor Defined 0xFF00)
0x09, 0xC5,        // Usage (0xC5)
0xA1, 0x01,        // Collection (Application)
0x85, 0x0D,        //   Report ID (13)
0x09, 0xC5,        //   Usage (0xC5)
0x15, 0x00,        //   Logical Minimum (0)
0x26, 0xFF, 0x00,  //   Logical Maximum (255)
0x75, 0x08,        //   Report Size (8)
0x95, 0x04,        //   Report Count (4)
0xB1, 0x02,        //   Feature (Data,Var,Abs,No Wrap,Linear,Preferred State,No Null Position,Non-volatile)
0x85, 0x0C,        //   Report ID (12)
0x09, 0xC6,        //   Usage (0xC6)
0x96, 0x76, 0x02,  //   Report Count (630)
0x75, 0x08,        //   Report Size (8)
0xB1, 0x02,        //   Feature (Data,Var,Abs,No Wrap,Linear,Preferred State,No Null Position,Non-volatile)
0x85, 0x0B,        //   Report ID (11)
0x09, 0xC7,        //   Usage (0xC7)
0x95, 0x80,        //   Report Count (128)
0x75, 0x08,        //   Report Size (8)
0xB1, 0x02,        //   Feature (Data,Var,Abs,No Wrap,Linear,Preferred State,No Null Position,Non-volatile)
0x85, 0x5D,        //   Report ID (93)
0x09, 0x01,        //   Usage (0x01)
0x95, 0x1B,        //   Report Count (27)
0x75, 0x08,        //   Report Size (8)
0x81, 0x06,        //   Input (Data,Var,Rel,No Wrap,Linear,Preferred State,No Null Position)
0xC0,              // End Collection
0x06, 0x00, 0xFF,  // Usage Page (Vendor Defined 0xFF00)
0x09, 0x01,        // Usage (0x01)
0xA1, 0x01,        // Collection (Application)
0x15, 0x00,        //   Logical Minimum (0)
0x26, 0xFF, 0x00,  //   Logical Maximum (255)
0x75, 0x08,        //   Report Size (8)
0x85, 0x06,        //   Report ID (6)
0x95, 0x3F,        //   Report Count (63)
0x09, 0x01,        //   Usage (0x01)
0x81, 0x02,        //   Input (Data,Var,Abs,No Wrap,Linear,Preferred State,No Null Position)
0x09, 0x01,        //   Usage (0x01)
0x91, 0x02,        //   Output (Data,Var,Abs,No Wrap,Linear,Preferred State,No Null Position,Non-volatile)
0xC0,              // End Collection
```

## License
Copyright © 2016 Victor Vlasenko. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[Microsoft HID over I2C]: http://download.microsoft.com/download/7/d/d/7dd44bb7-2a7a-4505-ac1c-7227d3d96d5b/hid-over-i2c-protocol-spec-v1-0.docx
[Microsoft HID for MultiTouch]: https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwj71NnfxqjQAhWGtxoKHZ_VDMIQFggZMAA&url=http%3A%2F%2Fdownload.microsoft.com%2Fdownload%2Fa%2Fd%2Ff%2Fadf1347d-08dc-41a4-9084-623b1194d4b2%2Fdigitizerdrvs_touch.docx&usg=AFQjCNGJTf0cCfNaDVyONvraOcJnAzNgkw&sig2=z2igbUN9UDKcwGgkBmx2SQ&bvm=bv.138493631,d.d2s
[HID Protocol Sniffed]: https://github.com/ain101/drivers-input-touchscreen-FTS_driver/blob/master/doc/sniff/logic%20analyzer/win%20boot%20after%20grub%202.csv
