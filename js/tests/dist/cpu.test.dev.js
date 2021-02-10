"use strict";

var _instruction = _interopRequireDefault(require("../instruction"));

var _flag = _interopRequireDefault(require("../flag"));

var _memory = _interopRequireDefault(require("../memory"));

var _cpu = _interopRequireDefault(require("../cpu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function get_CPU() {
  var PC = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  var program = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var print_bytes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var cpu = new _cpu["default"]();
  cpu.memory = new _memory["default"]();

  if (PC != undefined) {
    cpu.PC = PC;

    if (program != undefined) {
      cpu.memory.load_bytes(program, PC);
      cpu.PC = PC;
      cpu.print_bytes = print_bytes;
    }
  }

  return cpu;
}
/*=============================================*/

/*    Functions
/*=============================================*/


test('Memory is after instantiation 64kb', function () {
  var cpu = get_CPU();
  expect(cpu.memory.Data.length).toBe(1024 * 64);
});
test('Memory at 0xFF == 0x69 after storing value', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([0x69]));
  expect(cpu.memory.get(0xF000)).toBe(0x69);
});
test('Return $80, $0F as little endian word ($0F80)', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([0x80, 0x0F]));
  expect(cpu.fetch_word()).toBe(0x0F80);
});
test('Program loaded into memory at the correct address', function () {
  var cpu = get_CPU(0x0000, new Uint8Array([0xA9, 0x80, 0xA9, 0x69]));
  var byte1 = cpu.read_byte(0x0000);
  var byte2 = cpu.read_byte(0x0001);
  var byte3 = cpu.read_byte(0x0002);
  var byte4 = cpu.read_byte(0x0003);
  expect(byte1).toBe(0xA9);
  expect(byte2).toBe(0x80);
  expect(byte3).toBe(0xA9);
  expect(byte4).toBe(0x69);
});
test('Incrementing 8bit registers from 0xFF == 0x00', function () {
  var cpu = get_CPU();
  cpu.A = 0xFF;
  cpu.A++;
  expect(cpu.A).toBe(0x00);
  cpu.X = 0xFF;
  cpu.X++;
  expect(cpu.X).toBe(0x00);
  cpu.Y = 0xFF;
  cpu.Y++;
  expect(cpu.Y).toBe(0x00);
  cpu.P = 0xFF;
  cpu.P++;
  expect(cpu.P).toBe(0x00);
  cpu.SP = 0xFF;
  cpu.SP++;
  expect(cpu.SP).toBe(0x00);
});
test('Incrementing 16bit registers from 0xFF == 0x100', function () {
  var cpu = get_CPU();
  cpu.PC = 0xFF;
  cpu.PC++;
  expect(cpu.PC).toBe(0x100);
});
/*=============================================*/

/*    Flags
/*=============================================*/
// N Flag

test('N flag is set when value >= 128', function () {
  var cpu = get_CPU();

  for (var i = 128; i < 256; i++) {
    var val = cpu.check_if_negative(i);
    cpu.set_flag(_flag["default"].N, val);
    expect(cpu.check_flag(_flag["default"].N)).toBe(true);
  }
});
test('N flag is not set when value < 128', function () {
  var cpu = get_CPU();

  for (var i = 0; i < 128; i++) {
    var val = cpu.check_if_negative(i);
    cpu.set_flag(_flag["default"].N, val);
    expect(cpu.check_flag(_flag["default"].N)).toBe(false);
  }
}); // V Flag

test('V flag is set for $F0 + $20', function () {
  var cpu = get_CPU();
  var val = cpu.check_overflow(0xF0, 0x10);
  cpu.set_flag(_flag["default"].V, val);
  expect(cpu.check_flag(_flag["default"].V)).toBe(true);
});
test('V flag is not set for $F0 + $04', function () {
  var cpu = get_CPU();
  var val = cpu.check_overflow(0xF0, 0xF4);
  cpu.set_flag(_flag["default"].V, val);
  expect(cpu.check_flag(_flag["default"].V)).toBe(false);
}); //Z Flag

test('Z flag is set when value == 0', function () {
  var cpu = get_CPU();
  var val = cpu.check_if_zero(0x00);
  cpu.set_flag(_flag["default"].Z, val);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
});
test('Z flag is not set when value > 0', function () {
  var cpu = get_CPU();

  for (var i = 1; i < 256; i++) {
    var val = cpu.check_if_zero(i);
    cpu.set_flag(_flag["default"].Z, val);
    expect(cpu.check_flag(_flag["default"].Z)).toBe(false);
  }
}); // Check flags set by on off commands

test('flags set by on/off commands can be set on with true', function () {
  var cpu = get_CPU();
  cpu.set_flag(_flag["default"].B);
  expect(cpu.check_flag(_flag["default"].B)).toBe(true);
  cpu.set_flag(_flag["default"].D);
  expect(cpu.check_flag(_flag["default"].D)).toBe(true);
  cpu.set_flag(_flag["default"].I);
  expect(cpu.check_flag(_flag["default"].I)).toBe(true);
});
test('flags set by on/off commands can be set off with false', function () {
  var cpu = get_CPU();
  cpu.set_flag(_flag["default"].B, false);
  expect(cpu.check_flag(_flag["default"].B)).toBe(false);
  cpu.set_flag(_flag["default"].D, false);
  expect(cpu.check_flag(_flag["default"].D)).toBe(false);
  cpu.set_flag(_flag["default"].I, false);
  expect(cpu.check_flag(_flag["default"].I)).toBe(false);
}); // C Flag

test('C flag is set for $F0 + $20 or for $10 - $20', function () {
  var cpu = get_CPU();
  var val = cpu.check_overflow(0xF0, 0x10);
  cpu.set_flag(_flag["default"].C, val);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
});
test('C flag is set for $10 - $20', function () {
  var cpu = get_CPU();
  var val = cpu.check_underflow(0x10, 0xF0);
  cpu.set_flag(_flag["default"].C, val);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
});
test('C flag is not set for $F0 + $04', function () {
  var cpu = get_CPU();
  var val = cpu.check_overflow(0xF0, 0xF4);
  cpu.set_flag(_flag["default"].C, val);
  expect(cpu.check_flag(_flag["default"].C)).toBe(false);
});
test('C flag is not set for $F4 - $04', function () {
  var cpu = get_CPU();
  var val = cpu.check_underflow(0xF4, 0xF0);
  cpu.set_flag(_flag["default"].C, val);
  expect(cpu.check_flag(_flag["default"].C)).toBe(false);
});
/*=============================================*/

/*    Implied Instructions
/*=============================================*/

test('NOP has no effect to the CPU', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].NOP]));
  cpu.execute();
  expect(cpu.A).toBe(0x00);
  expect(cpu.X).toBe(0x00);
  expect(cpu.Y).toBe(0x00);
  expect(cpu.P).toBe(_flag["default"].CLR);
});
test('CLC clears the Carry flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CLC]));
  cpu.set_flag(_flag["default"].C);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].C)).toBe(false);
});
test('CLD clears the Decimal Mode flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CLD]));
  cpu.set_flag(_flag["default"].D);
  expect(cpu.check_flag(_flag["default"].D)).toBe(true);
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].D)).toBe(false);
});
test('CLI clears the Interrupt disable flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CLI]));
  cpu.set_flag(_flag["default"].I);
  expect(cpu.check_flag(_flag["default"].I)).toBe(true);
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].I)).toBe(false);
});
test('CLV clears the overflow flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CLV]));
  cpu.set_flag(_flag["default"].V);
  expect(cpu.check_flag(_flag["default"].V)).toBe(true);
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].V)).toBe(false);
});
test('DEX decrements the X register setting Zero flag when decremented from $01', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].DEX]));
  cpu.X = 0x01;
  cpu.execute();
  expect(cpu.X).toBe(0x00);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
});
test('DEY decrements the Y register setting Negative flag when decremented from $00', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].DEY]));
  cpu.Y = 0x00;
  cpu.execute();
  expect(cpu.Y).toBe(0xFF);
  expect(cpu.check_flag(_flag["default"].N)).toBe(true);
});
test('INX increments the X register setting Zero flag when incremented from $FF', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].INX]));
  cpu.X = 0xFF;
  cpu.execute();
  expect(cpu.X).toBe(0x00);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
});
test('INY increments the Y register setting Negative flag when incremented from $127', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].INY]));
  cpu.Y = 0x7F;
  cpu.execute();
  expect(cpu.Y).toBe(0x80);
  expect(cpu.check_flag(_flag["default"].N)).toBe(true);
});
test('PHA pushes $69 from the accumulator to the stack and decrements the stack pointer', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].PHA]));
  cpu.A = 0x69;
  cpu.execute();
  expect(cpu.memory.get(0x01FF)).toBe(0x69);
  expect(cpu.SP).toBe(0xFE);
});
test('PHP pushes the Processor status the stack and decrements the stack pointer', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].PHP]));
  cpu.set_flag(_flag["default"].C);
  cpu.set_flag(_flag["default"].Z);
  cpu.execute();
  expect(cpu.memory.get(0x01FF)).toBe(cpu.P);
  expect(cpu.SP).toBe(0xFE);
});
test('PLA pulls $69 from the stack, sets accumulator and decrements the stack pointer', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDA_IM, 0x69, _instruction["default"].PHA, _instruction["default"].LDA_IM, 0x00, _instruction["default"].PLA]));
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.SP).toBe(0xFF);
});
test('PLP pulls Processor status from the stack, sets the P Register and decrements the stack pointer', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].SEC, _instruction["default"].SED, _instruction["default"].SEI, _instruction["default"].PHP, _instruction["default"].CLC, _instruction["default"].CLD, _instruction["default"].CLI, _instruction["default"].PLP]));
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].D)).toBe(true);
  expect(cpu.check_flag(_flag["default"].I)).toBe(true);
  expect(cpu.SP).toBe(0xFF);
});
/*=============================================*/

/*    ADC
/*=============================================*/

test('ADC #$68 Adds to accumulator (#$01) to make 0x69 adding the carry, unsetting C flag once consumed', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ADC_IM, 0x68]));
  cpu.A = 0x00;
  cpu.set_flag(_flag["default"].C);
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.check_flag(_flag["default"].C)).toBe(false);
});
test('ADC #$68 Adds to accumulator (#$FE) to make 0x69 adding the carry, resetting C flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ADC_IM, 0x69]));
  cpu.A = 0xFF;
  cpu.set_flag(_flag["default"].C);
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
});
test('ADC $80 gets #$68 from ZP$80 and adds to accumulator (#$01) to make 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ADC_ZP, 0x80]));
  cpu.store_byte(0x80, 0x68);
  cpu.A = 0x01;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('ADC $80,X gets #$68 from $82 and adds to accumulator (#$01) to make 0x69 if X == $02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ADC_ZPX, 0x80]));
  cpu.store_byte(0x82, 0x68);
  cpu.A = 0x01;
  cpu.X = 0x02;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('ADC $2200 gets #$69 from $2200 and adds to accumulator (#$01) to make 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ADC_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x68);
  cpu.A = 0x01;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('ADC $2200,X gets #$69 from $220F and adds to accumulator (#$01) to make 0x69 if X == #$0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ADC_ABSX, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x68);
  cpu.A = 0x01;
  cpu.X = 0x0F;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('ADC $2200,Y gets #$69 from $220F and adds to accumulator (#$01) to make 0x69 if Y == #$0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ADC_ABSY, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x68);
  cpu.A = 0x01;
  cpu.Y = 0x0F;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('ADC ($20,X) gets 0x68 from $3074 and adds to accumulator (#$01) to make 0x69 if X == 0x04', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ADC_INDX, 0x20]));
  cpu.store_byte(0x3074, 0x68);
  cpu.store_byte(0x24, 0x74);
  cpu.store_byte(0x25, 0x30);
  cpu.A = 0x01;
  cpu.X = 0x04;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('ADC ($0),Y gets 0x68 from $0310 and adds to accumulator (#$01) to make 0x69 if Y == 0x90', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ADC_INDY, 0x00]));
  cpu.store_byte(0x0310, 0x68);
  cpu.store_byte(0x00, 0x80);
  cpu.store_byte(0x01, 0x02);
  cpu.Y = 0x90;
  cpu.A = 0x01;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
/*=============================================*/

/*    AND
/*=============================================*/

test('AND #$69 performs logical AND on accumulator (0xE9) to make 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].AND_IM, 0x69]));
  cpu.A = 0xE9;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('AND $80 gets #$69 from ZP$80 and performs a logical AND on accumulator (0xE9) to make 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].AND_ZP, 0x80]));
  cpu.store_byte(0x80, 0x69);
  cpu.A = 0xE9;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('AND $80,X gets #$68 from $82 performs a logical AND on accumulator (0xE9) to make 0x69 if X == $02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].AND_ZPX, 0x80]));
  cpu.store_byte(0x82, 0x69);
  cpu.A = 0xE9;
  cpu.X = 0x02;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('AND $2200 gets #$69 from $2200 and performs logical AND on accumulator (0xE9) to make 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].AND_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x69);
  cpu.A = 0xE9;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('AND $2200,X gets #$69 from $220F and performs logical AND on accumulator (0xE9) to make 0x69 if X == #$0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].AND_ABSX, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x69);
  cpu.A = 0xE9;
  cpu.X = 0x0F;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('AND $2200,Y gets #$69 from $220F and performs logical AND on accumulator (0xE9) to make 0x69 if Y == #$0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].AND_ABSY, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x69);
  cpu.A = 0xE9;
  cpu.Y = 0x0F;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('AND ($20,X) gets 0x69 from $3074 and performs a logical AND on accumulator (0xE9) to make 0x69 if X == 0x04', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].AND_INDX, 0x20]));
  cpu.store_byte(0x3074, 0x69);
  cpu.store_byte(0x24, 0x74);
  cpu.store_byte(0x25, 0x30);
  cpu.A = 0xE9;
  cpu.X = 0x04;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('AND ($0),Y gets 0x69 from $0310 and performs a logical AND on accumulator (0xE9) to make 0x69 if Y == 0x90', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].AND_INDY, 0x00]));
  cpu.store_byte(0x0310, 0x69);
  cpu.store_byte(0x00, 0x80);
  cpu.store_byte(0x01, 0x02);
  cpu.Y = 0x90;
  cpu.A = 0xE9;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
/*=============================================*/

/*    ASL
/*=============================================*/

test('ASL A shifts accumulator (0x30) left 1 bit doubling the value to 0x60, C Flag not set', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ASL_A]));
  cpu.A = 0x30;
  cpu.execute();
  expect(cpu.A).toBe(0x60);
  expect(cpu.check_flag(_flag["default"].C)).toBe(false);
});
test('ASL A shifts accumulator (0x128) left 1 bit setting the C flag and resulting in 0x00', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ASL_A]));
  cpu.A = 0x80;
  cpu.execute();
  expect(cpu.A).toBe(0x00);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
});
test('ASL $80 shifts ZP$80 (0x30) left 1 bit doubling the value to 0x60', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ASL_ZP, 0x80]));
  cpu.store_byte(0x80, 0x30);
  cpu.execute();
  expect(cpu.read_byte(0x80)).toBe(0x60);
});
test('ASL $80,X shifts ZP$82 (0x30) left 1 bit doubling the value to 0x60, if X == 02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ASL_ZPX, 0x80]));
  cpu.store_byte(0x82, 0x30);
  cpu.X = 0x02;
  cpu.execute();
  expect(cpu.read_byte(0x82)).toBe(0x60);
});
test('ASL $2200 shifts $2200 (0x30) left 1 bit doubling the value to 0x60', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ASL_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x30);
  cpu.execute();
  expect(cpu.read_byte(0x2200)).toBe(0x60);
});
test('ASL $2200,X shifts $220F (0x30) left 1 bit doubling the value to 0x60 if X == 0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].ASL_ABSX, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x30);
  cpu.X = 0x0F;
  cpu.execute();
  expect(cpu.read_byte(0x220F)).toBe(0x60);
});
/*=============================================*/

/*    Branching
/*=============================================*/

test('BCC skips setting A to 0 because Carry is clear, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BCC, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.X).toBe(0x69);
}); //TODO: Test Branch in negative direction once JSR/JMP is done 

test('BCC sets A to 0 because Carry is not clear, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BCC, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.set_flag(_flag["default"].C);
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x0);
  expect(cpu.X).toBe(0x69);
});
test('BCS skips setting A to 0 because Carry is set, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BCS, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.set_flag(_flag["default"].C);
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.X).toBe(0x69);
});
test('BCS sets A to 0 because Carry is clear, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BCS, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x0);
  expect(cpu.X).toBe(0x69);
});
test('BEQ skips setting A to 0 because Zero flag is set, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BEQ, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.set_flag(_flag["default"].Z);
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.X).toBe(0x69);
});
test('BEQ sets A to 0 because Zero flag clear, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BEQ, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x0);
  expect(cpu.X).toBe(0x69);
});
test('BMI skips setting A to 0 because Negative flag is set, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BMI, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.set_flag(_flag["default"].N);
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.X).toBe(0x69);
});
test('BMI sets A to 0 because Negative flag clear, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BMI, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x0);
  expect(cpu.X).toBe(0x69);
});
test('BNE skips setting A to 0 because Zero flag is clear, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BNE, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.X).toBe(0x69);
});
test('BNE sets A to 0 because Zero flag set, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BNE, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.set_flag(_flag["default"].Z);
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x0);
  expect(cpu.X).toBe(0x69);
});
test('BPL skips setting A to 0 because Negative flag is clear, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BPL, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.X).toBe(0x69);
});
test('BPL sets A to 0 because Negative flag is set, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BPL, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.set_flag(_flag["default"].N);
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x0);
  expect(cpu.X).toBe(0x69);
});
test('BVC skips setting A to 0 because Overflow flag clear, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BVC, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.X).toBe(0x69);
});
test('BVC sets A to 0 because Overflow flag is set, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BVC, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.set_flag(_flag["default"].V);
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x0);
  expect(cpu.X).toBe(0x69);
});
test('BVS skips setting A to 0 because Overflow flag is set, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BVS, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.set_flag(_flag["default"].V);
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
  expect(cpu.X).toBe(0x69);
});
test('BVS sets A to 0 because Overflow flag is clear, but X still set to 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BVS, 0x82, _instruction["default"].LDA_IM, 0x00, _instruction["default"].LDX_IM, 0x69]));
  cpu.A = 0x69;
  cpu.X = 0x00;
  cpu.execute();
  expect(cpu.A).toBe(0x0);
  expect(cpu.X).toBe(0x69);
});
/*=============================================*/

/*    BIT Test
/*=============================================*/

test('BIT $80 ANDs A (0x1E) with ZP$80 (0x3E), (both remain unchanged) Zero flag is set, but NV flags are not', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BIT_ZP, 0x80]));
  cpu.store_byte(0x80, 0x3E);
  cpu.A = 0x1E;
  cpu.execute();
  expect(cpu.A).toBe(0x1E);
  expect(cpu.read_byte(0x80)).toBe(0x3E);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
  expect(cpu.check_flag(_flag["default"].V)).toBe(false);
});
test('BIT $80 ANDs A (0x1E) with ZP$80 (0x5E), (both remain unchanged) Z and V flags are set, N flag is not', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BIT_ZP, 0x80]));
  cpu.store_byte(0x80, 0x5E);
  cpu.A = 0x1E;
  cpu.execute();
  expect(cpu.A).toBe(0x1E);
  expect(cpu.read_byte(0x80)).toBe(0x5E);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
  expect(cpu.check_flag(_flag["default"].V)).toBe(true);
});
test('BIT $80 ANDs A (0x1E) with ZP$80 (0x9E), (both remain unchanged) Z and N flags are set, V flag is not', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BIT_ZP, 0x80]));
  cpu.store_byte(0x80, 0x9E);
  cpu.A = 0x1E;
  cpu.execute();
  expect(cpu.A).toBe(0x1E);
  expect(cpu.read_byte(0x80)).toBe(0x9E);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(true);
  expect(cpu.check_flag(_flag["default"].V)).toBe(false);
});
test('BIT $80 ANDs A (0x1E) with $2200 (0xDE), (both remain unchanged) ZNV flags are set', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].BIT_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0xDE);
  cpu.A = 0x1E;
  cpu.execute();
  expect(cpu.A).toBe(0x1E);
  expect(cpu.read_byte(0x2200)).toBe(0xDE);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(true);
  expect(cpu.check_flag(_flag["default"].V)).toBe(true);
});
/*=============================================*/

/*    CMP
/*=============================================*/

test('CMP #$69 compares accumulator (0x69) with hex 0x69 setting the Z,C flag, but not N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPA_IM, 0x69]));
  cpu.A = 0x69;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CPX #$69 compares X Register (0x69) with hex 0x6F setting the N flag, but not Z,C flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPX_IM, 0x6F]));
  cpu.X = 0x69;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(false);
  expect(cpu.check_flag(_flag["default"].C)).toBe(false);
  expect(cpu.check_flag(_flag["default"].N)).toBe(true);
});
test('CMP #$69 compares Y Register (0x6F) with hex 0x69 setting the C flag, but not Z,N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPY_IM, 0x69]));
  cpu.Y = 0x6F;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(false);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CMP $80 compares accumulator (0x69) with hex ZP$80 (0x69) setting the Z,C flag, but not N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPA_ZP, 0x80]));
  cpu.store_byte(0x80, 0x69);
  cpu.A = 0x69;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CPX $80 compares X Register (0x69) with hex ZP$80 (0x69) setting the Z,C flag, but not N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPX_ZP, 0x80]));
  cpu.store_byte(0x80, 0x69);
  cpu.X = 0x69;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CPX $80 compares Y Register (0x69) with hex ZP$80 (0x69) setting the Z,C flag, but not N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPY_ZP, 0x80]));
  cpu.store_byte(0x80, 0x69);
  cpu.Y = 0x69;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CMP $80,X compares X Register (0x69) with hex ZP$82 (0x69) setting the Z,C flag, but not N flag if X==0x02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPA_ZPX, 0x80]));
  cpu.store_byte(0x82, 0x69);
  cpu.A = 0x69;
  cpu.X = 0x02;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CMP $2200 compares accumulator (0x69) with hex $2200 (0x69) setting the Z,C flag, but not N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPA_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x69);
  cpu.A = 0x69;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CPX $2200 compares X Register (0x69) with hex $2200 (0x69) setting the Z,C flag, but not N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPX_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x69);
  cpu.X = 0x69;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CPX $2200 compares Y Register (0x69) with hex $2200 (0x69) setting the Z,C flag, but not N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPY_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x69);
  cpu.Y = 0x69;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CMP $2200,X compares accumulator (0x69) with hex $2202 (0x69) setting the Z,C flag, but not N flag if X==0x02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPA_ABSX, 0x00, 0x22]));
  cpu.store_byte(0x2202, 0x69);
  cpu.A = 0x69;
  cpu.X = 0x02;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CMP $2200,Y compares accumulator (0x69) with hex $2202 (0x69) setting the Z,C flag, but not N flag if Y==0x02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPA_ABSY, 0x00, 0x22]));
  cpu.store_byte(0x2202, 0x69);
  cpu.A = 0x69;
  cpu.Y = 0x02;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CMP ($20,X) gets 0x69 from $3074 and compares to accumulator (0x69) setting Z,C Flag but not N flag, if X == 0x04', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPA_INDX, 0x20]));
  cpu.store_byte(0x3074, 0x69);
  cpu.store_byte(0x24, 0x74);
  cpu.store_byte(0x25, 0x30);
  cpu.A = 0x69;
  cpu.X = 0x04;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
test('CMP ($0),Y gets 0x69 from $0310 and compares to on accumulator (0x69) setting Z,C Flag but not N flag, if Y == 0x90', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].CPA_INDY, 0x00]));
  cpu.store_byte(0x0310, 0x69);
  cpu.store_byte(0x00, 0x80);
  cpu.store_byte(0x01, 0x02);
  cpu.Y = 0x90;
  cpu.A = 0x69;
  cpu.execute();
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
  expect(cpu.check_flag(_flag["default"].C)).toBe(true);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
});
/*=============================================*/

/*    DEC
/*=============================================*/

test('DEC $80 decrements ZP$80 (0x6A) to equal 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].DEC_ZP, 0x80]));
  cpu.store_byte(0x80, 0x6A);
  cpu.execute();
  expect(cpu.read_byte(0x80)).toBe(0x69);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(false);
});
test('DEC $80,X decrements ZP$82 (0x01) to equal 0x00 setting Z flag, if X == 02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].DEC_ZPX, 0x80]));
  cpu.store_byte(0x82, 0x01);
  cpu.X = 0x02;
  cpu.execute();
  expect(cpu.read_byte(0x82)).toBe(0x00);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
});
test('DEC $2200 decrements $2200 (0x00) to equal 0xFF setting N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].DEC_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x00);
  cpu.execute();
  expect(cpu.read_byte(0x2200)).toBe(0xFF);
  expect(cpu.check_flag(_flag["default"].N)).toBe(true);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(false);
});
test('DEC $2200,X decrements $2202 (0x6A) to equal 0x69 if X==0x02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].DEC_ABSX, 0x00, 0x22]));
  cpu.store_byte(0x2202, 0x6A);
  cpu.X = 0x02;
  cpu.execute();
  expect(cpu.read_byte(0x2202)).toBe(0x69);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(false);
});
/*=============================================*/

/*    EOR
/*=============================================*/

test('EOR #$69 performs Exclusive OR on accumulator (0x69) to make 0x00', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].EOR_IM, 0x69]));
  cpu.A = 0x69;
  cpu.execute();
  expect(cpu.A).toBe(0x00);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
});
test('EOR $80 gets #$69 from ZP$80 and performs a Exclusive OR on accumulator (0xE9) to make 0x80', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].EOR_ZP, 0x80]));
  cpu.store_byte(0x80, 0x69);
  cpu.A = 0xE9;
  cpu.execute();
  expect(cpu.A).toBe(0x80);
  expect(cpu.check_flag(_flag["default"].N)).toBe(true);
});
test('EOR $80,X gets #$68 from $82 performs a Exclusive OR on accumulator (0xE9) to make 0x80 if X == $02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].EOR_ZPX, 0x80]));
  cpu.store_byte(0x82, 0x69);
  cpu.A = 0xE9;
  cpu.X = 0x02;
  cpu.execute();
  expect(cpu.A).toBe(0x80);
});
test('EOR $2200 gets #$69 from $2200 and performs Exclusive OR on accumulator (0xE9) to make 0x80', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].EOR_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x69);
  cpu.A = 0xE9;
  cpu.execute();
  expect(cpu.A).toBe(0x80);
});
test('EOR $2200,X gets #$69 from $220F and performs Exclusive OR on accumulator (0xE9) to make 0x80 if X == #$0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].EOR_ABSX, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x69);
  cpu.A = 0xE9;
  cpu.X = 0x0F;
  cpu.execute();
  expect(cpu.A).toBe(0x80);
});
test('EOR $2200,Y gets #$69 from $220F and performs Exclusive OR on accumulator (0xE9) to make 0x80 if Y == #$0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].EOR_ABSY, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x69);
  cpu.A = 0xE9;
  cpu.Y = 0x0F;
  cpu.execute();
  expect(cpu.A).toBe(0x80);
});
test('EOR ($20,X) gets 0x69 from $3074 and performs a Exclusive OR on accumulator (0xE9) to make 0x80 if X == 0x04', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].EOR_INDX, 0x20]));
  cpu.store_byte(0x3074, 0x69);
  cpu.store_byte(0x24, 0x74);
  cpu.store_byte(0x25, 0x30);
  cpu.A = 0xE9;
  cpu.X = 0x04;
  cpu.execute();
  expect(cpu.A).toBe(0x80);
});
test('EOR ($0),Y gets 0x69 from $0310 and performs a Exclusive OR on accumulator (0xE9) to make 0x80 if Y == 0x90', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].EOR_INDY, 0x00]));
  cpu.store_byte(0x0310, 0x69);
  cpu.store_byte(0x00, 0x80);
  cpu.store_byte(0x01, 0x02);
  cpu.Y = 0x90;
  cpu.A = 0xE9;
  cpu.execute();
  expect(cpu.A).toBe(0x80);
});
/*=============================================*/

/*    INC
/*=============================================*/

test('INC $80 decrements ZP$80 (0x68) to equal 0x69', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].INC_ZP, 0x80]));
  cpu.store_byte(0x80, 0x68);
  cpu.execute();
  expect(cpu.read_byte(0x80)).toBe(0x69);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(false);
});
test('INC $80,X decrements ZP$82 (0xFF) to equal 0x00 setting Z flag, if X == 02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].INC_ZPX, 0x80]));
  cpu.store_byte(0x82, 0xFF);
  cpu.X = 0x02;
  cpu.execute();
  expect(cpu.read_byte(0x82)).toBe(0x00);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
});
test('INC $2200 decrements $2200 (0x) to equal 0xFF setting N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].INC_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x7F);
  cpu.execute();
  expect(cpu.read_byte(0x2200)).toBe(0x80);
  expect(cpu.check_flag(_flag["default"].N)).toBe(true);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(false);
});
test('INC $2200,X decrements $2202 (0x68) to equal 0x69 if X==0x02', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].INC_ABSX, 0x00, 0x22]));
  cpu.store_byte(0x2202, 0x68);
  cpu.X = 0x02;
  cpu.execute();
  expect(cpu.read_byte(0x2202)).toBe(0x69);
  expect(cpu.check_flag(_flag["default"].N)).toBe(false);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(false);
});
/*=============================================*/

/*    LDA
/*=============================================*/

test('LDA #$69 Loads 0x69 into A Register', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDA_IM, 0x69]));
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('LDA $80 Loads 0x69 from $80 into A Register', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDA_ZP, 0x80]));
  cpu.store_byte(0x80, 0x69);
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('LDA $80,X Loads 0x69 from $7f into A Register if X register is $FF', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDA_ZPX, 0x80]));
  cpu.store_byte(0x7f, 0x69);
  cpu.X = 0xFF;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('LDA $2200 Loads 0x69 from $2200 into A Register', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDA_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x69);
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('LDA $2200,X Loads 0x69 from $220F into A Register if X register is $0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDA_ABSX, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x69);
  cpu.X = 0x0F;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('LDA $2200,Y Loads 0x69 from $220F into A Register if Y register is $0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDA_ABSY, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x69);
  cpu.Y = 0x0F;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('LDA ($20,X) Loads 0x69 from $3074 into A Register if X register is $04', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDA_INDX, 0x20]));
  cpu.store_byte(0x3074, 0x69);
  cpu.store_byte(0x24, 0x74);
  cpu.store_byte(0x25, 0x30);
  cpu.X = 0x04;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('LDA ($0),Y Loads 0x69 from $0310 into A Register if Y register is $90', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDA_INDY, 0x00]));
  cpu.store_byte(0x0310, 0x69);
  cpu.store_byte(0x00, 0x80);
  cpu.store_byte(0x01, 0x02);
  cpu.Y = 0x90;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('LDA ($0),Y does not carry when low order calculation is < 0xFF', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDA_INDY, 0x00]));
  cpu.store_byte(0x0290, 0x69);
  cpu.store_byte(0x00, 0x80);
  cpu.store_byte(0x01, 0x02);
  cpu.Y = 0x10;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
/*=============================================*/

/*    LDX
/*=============================================*/

test('LDX #$69 Loads 0x69 into X Register', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDX_IM, 0x69]));
  cpu.execute();
  expect(cpu.X).toBe(0x69);
});
test('LDX $80 Loads 0x69 from $80 into X Register', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDX_ZP, 0x80]));
  cpu.store_byte(0x80, 0x69);
  cpu.execute();
  expect(cpu.X).toBe(0x69);
});
test('LDX $80,Y Loads 0x69 from $7f into X Register if Y register is $FF', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDX_ZPY, 0x80]));
  cpu.store_byte(0x7f, 0x69);
  cpu.Y = 0xFF;
  cpu.execute();
  expect(cpu.X).toBe(0x69);
});
test('LDX $2200 Loads 0x69 from $2200 into X Register', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDX_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x69);
  cpu.execute();
  expect(cpu.X).toBe(0x69);
});
test('LDX $2200,Y Loads 0x69 from $220F into X Register if Y register is $0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDX_ABSY, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x69);
  cpu.Y = 0x0F;
  cpu.execute();
  expect(cpu.X).toBe(0x69);
});
/*=============================================*/

/*    LDY
/*=============================================*/

test('LDY #$69 Loads 0x69 into Y Register', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDY_IM, 0x69]));
  cpu.execute();
  expect(cpu.Y).toBe(0x69);
});
test('LDY $80 Loads 0x69 from $80 into X Register', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDY_ZP, 0x80]));
  cpu.store_byte(0x80, 0x69);
  cpu.execute();
  expect(cpu.Y).toBe(0x69);
});
test('LDY $80,X Loads 0x69 from $7f into X Register if X register is $FF', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDY_ZPX, 0x80]));
  cpu.store_byte(0x7f, 0x69);
  cpu.X = 0xFF;
  cpu.execute();
  expect(cpu.Y).toBe(0x69);
});
test('LDY $2200 Loads 0x69 from $2200 into Y Register', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDY_ABS, 0x00, 0x22]));
  cpu.store_byte(0x2200, 0x69);
  cpu.execute();
  expect(cpu.Y).toBe(0x69);
});
test('LDY $2200,X Loads 0x69 from $220F into Y Register if X register is $0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].LDY_ABSX, 0x00, 0x22]));
  cpu.store_byte(0x220F, 0x69);
  cpu.X = 0x0F;
  cpu.execute();
  expect(cpu.Y).toBe(0x69);
});
/*=============================================*/

/*    STA - Store A Register
/*=============================================*/

test('STA $22 stores 0x69 from Register A into Zero Page memory @ $22', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STA_ZP, 0x22]));
  cpu.A = 0x69;
  cpu.execute();
  expect(cpu.memory.get(0x22)).toBe(0x69);
});
test('STA $80,X stores 0x69 from Register A into Zero Page memory @ $7F if X register is $FF', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STA_ZPX, 0x80]));
  cpu.A = 0x69;
  cpu.X = 0xFF;
  cpu.execute();
  expect(cpu.memory.get(0x7f)).toBe(0x69);
});
test('STA $2200 stores 0x69 from Register A into memory @ $2200', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STA_ABS, 0x00, 0x22]));
  cpu.A = 0x69;
  cpu.execute();
  expect(cpu.memory.get(0x2200)).toBe(0x69);
});
test('STA $2200,X stores 0x69 from Register A into memory @ $220F is X register is $0F', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STA_ABSX, 0x00, 0x22]));
  cpu.A = 0x69;
  cpu.X = 0x0F;
  cpu.execute();
  expect(cpu.memory.get(0x220F)).toBe(0x69);
});
test('STA ($20,X) stores 0x69 from Register A into memory @ $3074 if X register is $04', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STA_INDX, 0x20]));
  cpu.A = 0x69;
  cpu.store_byte(0x24, 0x74);
  cpu.store_byte(0x25, 0x30);
  cpu.X = 0x04;
  cpu.execute();
  expect(cpu.memory.get(0x3074)).toBe(0x69);
});
test('STA ($0),Y stores 0x69 from Register A into memory @ $0310 if Y register is $90', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STA_INDY, 0x00]));
  cpu.A = 0x69;
  cpu.store_byte(0x00, 0x80);
  cpu.store_byte(0x01, 0x02);
  cpu.Y = 0x90;
  cpu.execute();
  expect(cpu.memory.get(0x0310)).toBe(0x69);
});
test('STA ($0),Y does not carry when low order calculation is < 0xFF', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STA_INDY, 0x00]));
  cpu.A = 0x69;
  cpu.store_byte(0x00, 0x80);
  cpu.store_byte(0x01, 0x02);
  cpu.Y = 0x10;
  cpu.execute();
  expect(cpu.memory.get(0x0290)).toBe(0x69);
});
/*=============================================*/

/*    STX - Store X Register
/*=============================================*/

test('STX $22 stores 0x69 from Register X into Zero Page memory @ $22', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STX_ABS, 0x22]));
  cpu.X = 0x69;
  cpu.execute();
  expect(cpu.memory.get(0x22)).toBe(0x69);
});
test('STX $80,Y stores 0x69 from Register X into Zero Page memory @ $7F if Y register is $FF', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STX_ZPY, 0x80]));
  cpu.X = 0x69;
  cpu.Y = 0xFF;
  cpu.execute();
  expect(cpu.memory.get(0x7f)).toBe(0x69);
});
test('STX $2200 stores 0x69 from Register X into memory @ $2200', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STX_ABS, 0x00, 0x22]));
  cpu.X = 0x69;
  cpu.execute();
  expect(cpu.memory.get(0x2200)).toBe(0x69);
});
/*=============================================*/

/*    STY - Store Y Register
/*=============================================*/

test('STY $22 stores 0x69 from Register Y into Zero Page memory @ $22', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STY_ABS, 0x22]));
  cpu.Y = 0x69;
  cpu.execute();
  expect(cpu.memory.get(0x22)).toBe(0x69);
});
test('STY $80,X stores 0x69 from Register Y into Zero Page memory @ $7F if X register is $FF', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STY_ZPX, 0x80]));
  cpu.Y = 0x69;
  cpu.X = 0xFF;
  cpu.execute();
  expect(cpu.memory.get(0x7f)).toBe(0x69);
});
test('STY $2200 stores 0x69 from Register Y into memory @ $2200', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].STY_ABS, 0x00, 0x22]));
  cpu.Y = 0x69;
  cpu.execute();
  expect(cpu.memory.get(0x2200)).toBe(0x69);
});
/*=============================================*/

/*    TAX - Transfer
/*=============================================*/

test('TAX transfers 0x80 from Register A to Register X setting N flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].TAX]));
  cpu.A = 0x80;
  cpu.execute();
  expect(cpu.X).toBe(0x80);
  expect(cpu.check_flag(_flag["default"].N)).toBe(true);
});
test('TAY transfers 0x00 from Register A to Register Y setting Z flag', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].TAY]));
  cpu.A = 0x00;
  cpu.Y = 0x69;
  cpu.execute();
  expect(cpu.Y).toBe(0x00);
  expect(cpu.check_flag(_flag["default"].Z)).toBe(true);
});
test('TSX transfers stack pointer to Register X', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].TSX]));
  cpu.execute();
  expect(cpu.X).toBe(cpu.SP);
});
test('TXA transfers 0x00 from Register X to Register A', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].TXA]));
  cpu.A = 0x00;
  cpu.X = 0x69;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});
test('TXS transfers Register X to stack pointer', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].TXS]));
  cpu.X = 0x69;
  cpu.execute();
  expect(cpu.SP).toBe(0x69);
});
test('TYA transfers 0x69 from Register Y to Register A', function () {
  var cpu = get_CPU(0xF000, new Uint8Array([_instruction["default"].TYA]));
  cpu.A = 0x00;
  cpu.Y = 0x69;
  cpu.execute();
  expect(cpu.A).toBe(0x69);
});