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

## Relevant protocol specifications
- [Microsoft HID over I2C]

## License
Copyright © 2016 Victor Vlasenko. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[Microsoft HID over I2C]: http://download.microsoft.com/download/7/d/d/7dd44bb7-2a7a-4505-ac1c-7227d3d96d5b/hid-over-i2c-protocol-spec-v1-0.docx
