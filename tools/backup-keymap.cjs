const fs = require('node:fs');
const path = require('node:path');
const HID = require('node-hid');

const candidates = HID.devices().filter(d => d.vendorId === 0x0194 && d.productId === 0x0463 && d.usagePage === 0xff60 && d.usage === 0x61);
if (candidates.length !== 1) throw new Error(`Expected one W17PAD Raw HID interface; found ${candidates.length}`);
const device = new HID.HID(candidates[0].path);
function send(bytes) {
  const packet = Buffer.alloc(33);
  Buffer.from(bytes).copy(packet, 1);
  if (device.write([...packet]) !== 33) throw new Error('Incomplete HID request');
  const reply = Buffer.from(device.readTimeout(1500));
  if (reply.length !== 32) throw new Error('Missing or malformed HID response');
  return reply;
}
function readMap(layers) {
  const size = layers * 5 * 4 * 2;
  const chunks = [];
  for (let offset = 0; offset < size; offset += 28) {
    const count = Math.min(28, size - offset);
    const reply = send([0x12, offset >> 8, offset & 255, count]);
    if (reply[0] !== 0x12 || reply.readUInt16BE(1) !== offset || reply[3] !== count) throw new Error('Unexpected keymap response');
    chunks.push(reply.subarray(4, 4 + count));
  }
  return Buffer.concat(chunks);
}
try {
  const id = send([0xfe, 0x00]);
  const expectedUID = Buffer.from('18cd7e6f6c0c709b', 'hex');
  if (!id.subarray(4, 12).equals(expectedUID)) throw new Error('Device UID differs from this board; no backup created');
  const via = send([0x01]);
  const layerReply = send([0x11]);
  const layers = layerReply[1];
  if (layerReply[0] !== 0x11 || layers < 1 || layers > 16) throw new Error('Invalid layer count');
  const first = readMap(layers);
  if (!first.equals(readMap(layers))) throw new Error('Keymap changed while being read; retry with Vial closed');
  const active = new Set(['0,0','0,1','0,2','0,3','1,0','1,1','1,2','2,0','2,1','2,2','2,3','3,0','3,1','3,2','4,0','4,2','4,3']);
  const layout = Array.from({length: layers}, (_, l) => Array.from({length: 5}, (_, r) => Array.from({length: 4}, (_, c) => active.has(`${r},${c}`) ? first.readUInt16BE(((l * 5 + r) * 4 + c) * 2) : -1)));
  const output = path.resolve(process.argv[2] || `../config/vial/w17-keymap-${new Date().toISOString().slice(0,10)}.vil`);
  if (fs.existsSync(output)) throw new Error('Output exists; choose a new backup filename');
  const data = {
    version: 1, uid: '__EXACT_UID__', layout,
    encoder_layout: Array.from({length: layers}, () => []), layout_options: -1,
    vial_protocol: id.readUInt32LE(0), via_protocol: via.readUInt16BE(1),
    _backup: { scope: 'keymap-only', captured_at: new Date().toISOString(), vid: '0x0194', pid: '0x0463', matrix: [5,4], num_keycode: layout[0][0][0] }
  };
  const json = JSON.stringify(data, null, 2).replace('"__EXACT_UID__"', id.readBigUInt64LE(4).toString()) + '\n';
  fs.mkdirSync(path.dirname(output), {recursive: true});
  fs.writeFileSync(output, json, {flag: 'wx'});
  console.log(`Saved ${layers} layers to ${output}`);
  console.log(`Num key: 0x${layout[0][0][0].toString(16).padStart(4, '0')}; two reads matched; device not modified`);
} finally {
  device.close();
}
