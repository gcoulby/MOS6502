"use strict";

var _instruction = _interopRequireDefault(require("../instruction"));

var _assembler = _interopRequireDefault(require("../assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import Memory from '../memory';
function get_assember() {
  var start_addr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0x0600;
  // let memory = new Memory();
  return new _assembler["default"](start_addr);
}

test('DEX assembles to an implicit instruction', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tDEX $90");
  var comparison = new Uint8Array([_instruction["default"].DEX]);
  expect(program).toStrictEqual(comparison);
});
test('LDA #80 assembles to LDA Immediate', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tLDA #80");
  var comparison = new Uint8Array([_instruction["default"].LDA_IM, 0x80]);
  expect(program).toStrictEqual(comparison);
});
test('LDA $80 assembles to LDA Zero Page', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tLDA $80");
  var comparison = new Uint8Array([_instruction["default"].LDA_ZP, 0x80]);
  expect(program).toStrictEqual(comparison);
});
test('LDA $80,X assembles to LDA Zero Page,X', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tLDA $80,X");
  var comparison = new Uint8Array([_instruction["default"].LDA_ZPX, 0x80]);
  expect(program).toStrictEqual(comparison);
});
test('LDX $80,Y assembles to LDX Zero Page,Y', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tLDX $80,Y");
  var comparison = new Uint8Array([_instruction["default"].LDX_ZPY, 0x80]);
  expect(program).toStrictEqual(comparison);
});
test('LDA $8000 assembles to LDA absolute, little endian', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tLDA $8000");
  var comparison = new Uint8Array([_instruction["default"].LDA_ABS, 0x00, 0x80]);
  expect(program).toStrictEqual(comparison);
});
test('LDA $8000,X assembles to LDA absolute,X little endian', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tLDA $8000,X");
  var comparison = new Uint8Array([_instruction["default"].LDA_ABSX, 0x00, 0x80]);
  expect(program).toStrictEqual(comparison);
});
test('LDA $8000,Y assembles to LDA absolute,Y little endian', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tLDA $8000,Y");
  var comparison = new Uint8Array([_instruction["default"].LDA_ABSY, 0x00, 0x80]);
  expect(program).toStrictEqual(comparison);
});
test('JMP ($8000) assembles to JMP Indirect, little endian', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tJMP ($8000)");
  var comparison = new Uint8Array([_instruction["default"].JMP_IND, 0x00, 0x80]);
  expect(program).toStrictEqual(comparison);
});
test('LDA ($80,X) assembles to LDA Indexed Indirect X', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tLDA ($80,X)");
  var comparison = new Uint8Array([_instruction["default"].LDA_INDX, 0x80]);
  expect(program).toStrictEqual(comparison);
});
test('LDA ($80),Y assembles to LDA Indirect Indexed Y', function () {
  var assembler = get_assember();
  var program = assembler.assemble("\tLDA ($80),Y");
  console.log(program);
  var comparison = new Uint8Array([_instruction["default"].LDA_INDY, 0x80]);
  console.log(comparison);
  expect(program).toStrictEqual(comparison);
});