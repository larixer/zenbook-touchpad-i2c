import i2c from 'i2c-bus';
import Struct from './struct';
import _ from 'lodash';

const hidDescSchema = {
  wHIDDescLength: 2,
  bcdVersion: 2,
  wReportDescLength: 2,
  wReportDescRegister: 2,
  wInputRegister: 2,
  wMaxInputLength: 2,
  wOutputRegister: 2,
  wMaxOutputLength: 2,
  wCommandRegister: 2,
  wDataRegister: 2,
  wVendorID: 2,
  wProductID: 2,
  wVersionID: 2,
  reserved: 4,
};

const READ_HID_CMD = [0x1, 0x0];

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
    this.hidDescriptor = this.readHIDDescriptor();
    console.log('HID .Descriptor', this.hidDescriptor.toString());
    this.readReportDescriptor();
  }

  readHIDDescriptor() {
    this._writeCmd(new Buffer(READ_HID_CMD));

    const HIDDescriptor = new Struct(hidDescSchema);
    this._readData(HIDDescriptor.buffer);

    return HIDDescriptor;
  }

  readReportDescriptor() {
    this._writeCmd(this.hidDescriptor.fields.wReportDescRegister);
    const rdbuf = new Buffer(this.hidDescriptor.wReportDescLength);
    this._readData(rdbuf);
  }

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