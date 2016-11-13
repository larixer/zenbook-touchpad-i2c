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

const dumpHex = fields => _.mapValues(fields,
  (val, key) => fields[key].toString(16));

const getField = (struct, name, bytes) => {
  const offset = struct.getOffset(name);
  return struct.buffer().slice(offset, offset + bytes);
};

const READ_HID_CMD = [0x1, 0x0];

export default class TouchPad {
  constructor(bus, addr) {
    this.bus = bus;
    this.addr = addr;
  }

  _writeCmd(wrbuf) {
    const nrw = this.dev.i2cWriteSync(this.addr, wrbuf.length, wrbuf);
    assert.equal(nrw, wrbuf.length);
    console.log('write_cmd: ', wrbuf);
  }

  _readData(rdbuf) {
    const nr = this.dev.i2cReadSync(this.addr, rdbuf.length, rdbuf);
    assert.equal(nr, rdbuf.length);
    console.log('read_data: ', rdbuf);
  }

  open() {
    this.dev = i2c.openSync(this.bus);
    this.hidDescriptor = this.readHIDDescriptor();
    console.log('HID Descriptor', dumpHex(this.hidDescriptor.fields));
    this.readReportDescriptor();
  }

  readHIDDescriptor() {
    this._writeCmd(new Buffer(READ_HID_CMD));

    const HIDDescriptor = getStruct(hidDescSchema);
    HIDDescriptor.allocate();
    this._readData(HIDDescriptor.buffer());

    return HIDDescriptor;
  }

  readReportDescriptor() {
    this._writeCmd(getField(this.hidDescriptor, 'wReportDescRegister', 2));
    const rdbuf = new Buffer(this.hidDescriptor.fields.wReportDescLength);
    this._readData(rdbuf);
  }

  close() {
    this.dev.closeSync();
  }
}