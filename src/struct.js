import _ from 'lodash';

class Struct {
  constructor(schema, length) {
    this.schema = schema;
    this.buffer = Buffer.alloc(length || _.sum(_.values(schema)));
    let offset = 0;
    this.offsets = {};
    for (let key of Object.keys(schema)) {
      this.offsets[key] = offset;
      offset += schema[key];
    }
    this.fields = {};

    _.each(schema, (val, key) => {
      Object.defineProperty(this, key, {
        get: () => Struct.getInt(this.buffer, this.offsets[key], val),
        set(value) {
          const offset = this.offsets[key];
          for (let i = 0; i < val; i++) {
            this.buffer[offset + i] = value & 0xff;
            value = Math.floor(value / Math.pow(256, i + 1));
          }
        },
        enumerable : true
      });
      Object.defineProperty(this.fields, key, {
        get: () => {
          const offset = this.offsets[key];
          return this.buffer.slice(offset, offset + val);
        },
        enumerable : true
      });
    });
  }

  static getInt(buffer, offset, bytes) {
    let result = 0;
    for (let i = 0; i < bytes; i++) {
      result += Math.pow(256, i) * buffer[offset + i];
    }
    return result;
  }

  toString() {
    return _.mapValues(this.schema, (val, key) => this[key].toString(16));
  }
}

export default Struct;