import i2c from 'i2c-bus';

export default class TouchPad {
  constructor(bus, addr) {
    this.bus = bus;
    this.addr = addr;
  }

  _writeCmd(wrbuf) {
    this.dev.i2cWriteSync(this.addr, wrbuf.length, wrbuf);
    console.log('write_cmd: ', wrbuf);
  }

  _readData(rdbuf) {
    this.dev.i2cReadSync(this.addr, rdbuf.length, rdbuf);
    console.log('read_data: ', rdbuf);
  }

  open() {
    this.dev = i2c.openSync(this.bus);

    this.enableMultiTouch();
  }

  enableMultiTouch() {
    this._writeCmd(new Buffer([0x05,0x00,0x3D,0x03,0x06,0x00,0x07,0x00,0x0D,0x00,0x03,0x01,0x00]));
  }

  /**
   * This is just the code to read input packets, it is a hack because we don't have
   * interrupt support for i2c-dev devices and thus have to poll the device instead.
   */
  inputLoop() {
    const lenbuf = new Buffer(2);
    while (true) {
      // Because we don't have interrupts for i2c-dev devices, we should poll the device
      // We detect first non-zero byte and treat it as the start of packet length
      this.dev.i2cReadSync(this.addr, lenbuf.length, lenbuf);
      // The first byte of length can appear as the second element in buf, so handle this case
      if (lenbuf[0] === 0 && lenbuf[1] !== 0) {
        this.dev.i2cReadSync(this.addr, 1, lenbuf);
        const tmp = lenbuf[0];
        lenbuf[0] = lenbuf[1];
        lenbuf[1] = tmp;
      }
      if (lenbuf[0] !== 0 || lenbuf[1] !== 0) {
        const rdbuf = new Buffer(lenbuf[1] * 256 + lenbuf[0]);
        this.dev.i2cReadSync(this.addr, rdbuf.length, rdbuf);
        console.log("Input Packet:", rdbuf.length, Buffer.concat([lenbuf, rdbuf]));
      }
    }
  }

  close() {
    this.dev.closeSync();
  }
}