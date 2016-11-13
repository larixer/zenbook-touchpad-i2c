import i2c from 'i2c-bus';
import assert from 'assert';
import Struct from 'struct';
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

const getStruct = schema => {
  let result = Struct();
  for (let key of Object.keys(schema)) {
    const bits = schema[key] * 8;
    result[`word${bits}Ule`].call(result, key);
  }
  return result;
};

const toObject = fields => _.mapValues(fields,
  (val, key) => fields[key]);

const dumpHex = fields => _.mapValues(fields,
  (val, key) => fields[key].toString(16));

const READ_HID_CMD = [0x1, 0x0];

export default class TouchPad {
  constructor(bus, addr) {
    this.bus = bus;
    this.addr = addr;
  }

  open() {
    this.dev = i2c.openSync(this.bus);
    this.hidDescriptor = this.readHIDDescriptor();
    console.log('HID Descriptor', dumpHex(this.hidDescriptor));
  }

  readHIDDescriptor() {
    const wrbuf = new Buffer(READ_HID_CMD);
    const nrw = this.dev.i2cWriteSync(this.addr, wrbuf.length, wrbuf);
    assert.equal(nrw, wrbuf.length);

    const HIDDescriptor = getStruct(hidDescSchema);
    HIDDescriptor.allocate();
    const rdbuf = HIDDescriptor.buffer();
    const nr = this.dev.i2cReadSync(this.addr, rdbuf.length, rdbuf);

    assert.equal(nr, rdbuf.length);
    return toObject(HIDDescriptor.fields);
  }

  close() {
    this.dev.closeSync();
  }
}