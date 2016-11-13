#!/usr/bin/env node
import TouchPad from './touchpad';

const BUS = process.argv[2];
const ADDR = 0x15;

const touchPad = new TouchPad(BUS, ADDR);
touchPad.open();
try {
  touchPad.inputLoop();
} finally {
  touchPad.close();
}
