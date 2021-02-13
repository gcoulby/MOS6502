"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _PC, _SP, _A, _X, _Y, _P;
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error - not a module - but this allows Jest test
const flag_1 = require("./flag");
// @ts-expect-error - not a module - but this allows Jest test
const instruction_1 = require("./instruction");
// @ts-expect-error - not a module - but this allows Jest test
const register_1 = require("./register");
class CPU {
    constructor(memory, start_addr = 0x0600) {
        _PC.set(this, void 0);
        _SP.set(this, void 0);
        _A.set(this, void 0);
        _X.set(this, void 0);
        _Y.set(this, void 0);
        _P.set(this, void 0);
        this.print_bytes = false;
        this.brk_count = 0;
        this.running = false;
        // this.A = 0x00;
        // this.X = 0x00;
        // this.Y = 0x00;
        // this.PC = 0xf000;
        // this.SP = 0xff;
        // this.P = Flag.CLR;     
        // this.memory = memory;
        // this.debug_stack = new Array();
        this.reset(memory, start_addr);
    }
    get PC() { return __classPrivateFieldGet(this, _PC); }
    set PC(v) { __classPrivateFieldSet(this, _PC, this.intToWord(v)); }
    get SP() { return __classPrivateFieldGet(this, _SP); }
    set SP(v) { __classPrivateFieldSet(this, _SP, this.intToByte(v)); }
    get A() { return __classPrivateFieldGet(this, _A); }
    set A(v) { __classPrivateFieldSet(this, _A, this.intToByte(v)); }
    get X() { return __classPrivateFieldGet(this, _X); }
    set X(v) { __classPrivateFieldSet(this, _X, this.intToByte(v)); }
    get Y() { return __classPrivateFieldGet(this, _Y); }
    set Y(v) { __classPrivateFieldSet(this, _Y, this.intToByte(v)); }
    get P() { return __classPrivateFieldGet(this, _P); }
    set P(v) { __classPrivateFieldSet(this, _P, this.intToByte(v)); }
    reset(memory, start_addr) {
        this.A = 0x00;
        this.X = 0x00;
        this.Y = 0x00;
        this.PC = start_addr;
        this.SP = 0xff;
        this.P = flag_1.default.CLR;
        this.memory = memory;
        this.debug_stack = new Array();
    }
    execute() {
        // if(this.print_bytes){
        //     console.log(this.memory.Data.slice(this.PC));
        // }
        while (this.PC !== 0) {
            if (this.print_bytes) {
                console.log(`ADDR: ${this.PC.toString(16)}`);
            }
            let ins = this.fetch_byte();
            switch (ins) {
                /*===========*/
                /*  ADC
                /*===========*/
                case instruction_1.default.ADC_IM: // ADC #$80
                    var byte = this.A;
                    var byte2 = this.get_byte_immediate();
                    this.A = this.add_with_carry(byte, byte2);
                    break;
                case instruction_1.default.ADC_ZP: // ADC $80
                    var byte = this.A;
                    var byte2 = this.get_byte_from_zero_page();
                    this.A = this.add_with_carry(byte, byte2);
                    break;
                case instruction_1.default.ADC_ZPX: // ADC $80,X
                    var byte = this.A;
                    var byte2 = this.get_byte_from_zero_page_add_XY(register_1.default.X);
                    this.A = this.add_with_carry(byte, byte2);
                    break;
                case instruction_1.default.ADC_ABS: // ADC $2200
                    var byte = this.A;
                    var byte2 = this.get_byte_absolute();
                    this.A = this.add_with_carry(byte, byte2);
                    break;
                case instruction_1.default.ADC_ABSX: // ADC $2200,X
                case instruction_1.default.ADC_ABSY: // ADC $2200,Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_absolute_XY(add_register);
                    this.A = this.add_with_carry(byte, byte2);
                    break;
                case instruction_1.default.ADC_INDX: // ADC ($80,X)
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_indexed_indirect_X(add_register);
                    this.A = this.add_with_carry(byte, byte2);
                    break;
                case instruction_1.default.ADC_INDY: // ADC ($80),Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                    this.A = this.add_with_carry(byte, byte2);
                    break;
                /*===========*/
                /*  AND
                /*===========*/
                case instruction_1.default.AND_IM: // AND #$80
                    var byte = this.A;
                    var byte2 = this.get_byte_immediate();
                    this.A = this.logical_and(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.AND_ZP: // AND $80
                    var byte = this.A;
                    var byte2 = this.get_byte_from_zero_page();
                    this.A = this.logical_and(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.AND_ZPX: // AND $80
                    var byte = this.A;
                    var byte2 = this.get_byte_from_zero_page_add_XY(register_1.default.X);
                    this.A = this.logical_and(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.AND_ABS: // AND $2200
                    var byte = this.A;
                    var byte2 = this.get_byte_absolute();
                    this.A = this.logical_and(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.AND_ABSX: // AND $2200,Y
                case instruction_1.default.AND_ABSY: // AND $2200,Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_absolute_XY(add_register);
                    this.A = this.logical_and(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.AND_INDX: // AND ($80,X)
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_indexed_indirect_X(add_register);
                    this.A = this.logical_and(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.AND_INDY: // AND ($80),Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                    this.A = this.logical_and(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                /*===========*/
                /*  ASL
                /*===========*/
                case instruction_1.default.ASL_A: // ASL A
                    this.A = this.shift_left(this.A);
                    break;
                case instruction_1.default.ASL_ZP: // ASL $80
                    var zp_addr = this.read_byte(this.PC);
                    var byte = this.get_byte_from_zero_page();
                    var shift = this.shift_left(byte);
                    this.store_byte(zp_addr, shift);
                    break;
                case instruction_1.default.ASL_ZPX: // ASL $80,X
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var zp_addr = this.intToByte(this.read_byte(this.PC) + this.X);
                    var byte = this.get_byte_from_zero_page_add_XY(add_register);
                    var shift = this.shift_left(byte);
                    this.store_byte(zp_addr, shift);
                    break;
                case instruction_1.default.ASL_ABS: // ASL $2200
                    var abs_addr = this.read_word(this.PC);
                    var byte = this.get_byte_absolute();
                    var shift = this.shift_left(byte);
                    this.store_byte(abs_addr, shift);
                    break;
                case instruction_1.default.ASL_ABSX: // ASL $2200,X
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var abs_addr = this.intToWord(this.read_word(this.PC) + this.X);
                    var byte = this.get_byte_absolute_XY(add_register);
                    var shift = this.shift_left(byte);
                    this.store_byte(abs_addr, shift);
                    break;
                /*===========*/
                /*  Branching
                /*===========*/
                case instruction_1.default.BCC: // BCC 
                    var carry_clear = !this.check_flag(flag_1.default.C);
                    this.branch_if_true(carry_clear);
                    break;
                case instruction_1.default.BCS: // BCS 
                    var carry_set = this.check_flag(flag_1.default.C);
                    this.branch_if_true(carry_set);
                    break;
                case instruction_1.default.BEQ: // BEQ 
                    var zero = this.check_flag(flag_1.default.Z);
                    this.branch_if_true(zero);
                    break;
                case instruction_1.default.BIT_ZP: // BIT $80
                    var byte1 = this.A;
                    var byte2 = this.get_byte_from_zero_page();
                    this.bit_test(byte1, byte2);
                    break;
                case instruction_1.default.BIT_ABS: // BIT $80
                    var byte1 = this.A;
                    var byte2 = this.get_byte_absolute();
                    this.bit_test(byte1, byte2);
                    break;
                case instruction_1.default.BMI: // BMI 
                    var negative = this.check_flag(flag_1.default.N);
                    this.branch_if_true(negative);
                    break;
                case instruction_1.default.BNE: // BMI 
                    var zero = !this.check_flag(flag_1.default.Z);
                    this.branch_if_true(zero);
                    break;
                case instruction_1.default.BPL: // BMI 
                    var positive = !this.check_flag(flag_1.default.N);
                    this.branch_if_true(positive);
                    break;
                case instruction_1.default.BRK: // BRK
                    this.push_PC_to_stack();
                    this.push_to_stack(this.P);
                    this.clear_flag(flag_1.default.D);
                    this.PC = 0;
                    break;
                case instruction_1.default.BVC: // BVC 
                    var overflow = !this.check_flag(flag_1.default.V);
                    this.branch_if_true(overflow);
                    break;
                case instruction_1.default.BVS: // BVS 
                    var overflow = this.check_flag(flag_1.default.V);
                    this.branch_if_true(overflow);
                    break;
                case instruction_1.default.CLC: // CLC
                    this.clear_flag(flag_1.default.C);
                    break;
                case instruction_1.default.CLD: // CLD
                    this.clear_flag(flag_1.default.D);
                    break;
                case instruction_1.default.CLI: // CLI
                    this.clear_flag(flag_1.default.I);
                    break;
                case instruction_1.default.CLV: // CLV
                    this.clear_flag(flag_1.default.V);
                    break;
                /*===========*/
                /*  CMP|CPX|Y
                /*===========*/
                case instruction_1.default.CPA_IM: // CMP #$80
                case instruction_1.default.CPX_IM: // CPX #$80
                case instruction_1.default.CPY_IM: // CPY #$80
                    var register = this.get_reg_from_instruction(ins, 2);
                    var byte1 = this[register];
                    var byte2 = this.get_byte_immediate();
                    this.compare(byte1, byte2);
                    break;
                case instruction_1.default.CPA_ZP: // CMP $80
                case instruction_1.default.CPX_ZP: // CMP $80
                case instruction_1.default.CPY_ZP: // CMP $80
                    var register = this.get_reg_from_instruction(ins, 2);
                    var byte1 = this[register];
                    var byte2 = this.get_byte_from_zero_page();
                    this.compare(byte1, byte2);
                    break;
                case instruction_1.default.CPA_ZPX: // CMP $80,X
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte1 = this.A;
                    var byte2 = this.get_byte_from_zero_page_add_XY(add_register);
                    this.compare(byte1, byte2);
                    break;
                case instruction_1.default.CPA_ABS: // CMP $2200
                case instruction_1.default.CPX_ABS: // CMP $2200
                case instruction_1.default.CPY_ABS: // CMP $2200
                    var register = this.get_reg_from_instruction(ins, 2);
                    var byte1 = this[register];
                    var byte2 = this.get_byte_absolute();
                    this.compare(byte1, byte2);
                    break;
                case instruction_1.default.CPA_ABSX: // CMP $2200
                case instruction_1.default.CPA_ABSY: // CMP $2200
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte1 = this.A;
                    var byte2 = this.get_byte_absolute_XY(add_register);
                    this.compare(byte1, byte2);
                    break;
                case instruction_1.default.CPA_INDX: // CMP ($80,X)
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte1 = this.A;
                    var byte2 = this.get_byte_indexed_indirect_X(add_register);
                    this.compare(byte1, byte2);
                    break;
                case instruction_1.default.CPA_INDY: // CMP ($80),Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte1 = this.A;
                    var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                    this.compare(byte1, byte2);
                    break;
                /*===========*/
                /*  DEC|X|Y
                /*===========*/
                case instruction_1.default.DEC_ZP: // DEC $80
                    var addr = this.get_zero_page_addr();
                    this.decrement_memory(addr);
                    break;
                case instruction_1.default.DEC_ZPX: // DEC $80,X
                    var addr = this.get_zero_page_addr_add_XY(register_1.default.X);
                    this.decrement_memory(addr);
                    break;
                case instruction_1.default.DEC_ABS: // DEC $2200
                    var addr = this.get_absolute_addr();
                    this.decrement_memory(addr);
                    break;
                case instruction_1.default.DEC_ABSX: // DEC $2200,X
                    var addr = this.get_absolute_addr_add_XY(register_1.default.X);
                    this.decrement_memory(addr);
                    break;
                case instruction_1.default.DEX: // DEX
                case instruction_1.default.DEY: // DEY
                    var register = this.get_reg_from_instruction(ins, 2);
                    this.decrement_register(register);
                    this.set_NZ_flags(this[register]);
                    break;
                /*===========*/
                /*  EOR
                /*===========*/
                case instruction_1.default.EOR_IM: // EOR #$80
                    var byte = this.A;
                    var byte2 = this.get_byte_immediate();
                    this.A = this.xor(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.EOR_ZP: // EOR $80
                    var byte = this.A;
                    var byte2 = this.get_byte_from_zero_page();
                    this.A = this.xor(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.EOR_ZPX: // EOR $80
                    var byte = this.A;
                    var byte2 = this.get_byte_from_zero_page_add_XY(register_1.default.X);
                    this.A = this.xor(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.EOR_ABS: // EOR $2200
                    var byte = this.A;
                    var byte2 = this.get_byte_absolute();
                    this.A = this.xor(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.EOR_ABSX: // EOR $2200,Y
                case instruction_1.default.EOR_ABSY: // EOR $2200,Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_absolute_XY(add_register);
                    this.A = this.xor(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.EOR_INDX: // EOR ($80,X)
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_indexed_indirect_X(add_register);
                    this.A = this.xor(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.EOR_INDY: // EOR ($80),Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                    this.A = this.xor(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                /*===========*/
                /*  INC|X|Y
                /*===========*/
                case instruction_1.default.INC_ZP: // INC $80
                    var addr = this.get_zero_page_addr();
                    this.increment_memory(addr);
                    break;
                case instruction_1.default.INC_ZPX: // INC $80,X
                    var addr = this.get_zero_page_addr_add_XY(register_1.default.X);
                    this.increment_memory(addr);
                    break;
                case instruction_1.default.INC_ABS: // INC $2200
                    var addr = this.get_absolute_addr();
                    this.increment_memory(addr);
                    break;
                case instruction_1.default.INC_ABSX: // INC $2200,X
                    var addr = this.get_absolute_addr_add_XY(register_1.default.X);
                    this.increment_memory(addr);
                    break;
                case instruction_1.default.INX: // INX
                case instruction_1.default.INY: // INY
                    var register = this.get_reg_from_instruction(ins, 2);
                    this.increment_register(register);
                    this.set_NZ_flags(this[register]);
                    break;
                case instruction_1.default.JMP_ABS: // JMP $2200
                    var addr = this.get_absolute_addr();
                    this.PC = addr;
                    break;
                case instruction_1.default.JMP_IND: // JMP ($2200)
                    var ind_addr = this.get_absolute_addr();
                    var addr = this.read_word(ind_addr);
                    this.PC = addr;
                    break;
                case instruction_1.default.JSR: // JSR ($2200)
                    var addr = this.get_absolute_addr();
                    this.push_PC_to_stack();
                    this.PC = addr;
                    break;
                /*===========*/
                /*  LDA|X|Y
                /*===========*/
                case instruction_1.default.LDA_IM: // LDA #$80
                case instruction_1.default.LDX_IM: // LDX #$80
                case instruction_1.default.LDY_IM: // LDY #$80
                    var register = this.get_reg_from_instruction(ins, 2);
                    var byte = this.get_byte_immediate();
                    this.set_NZ_flags(byte);
                    this.load_byte_into_register(register, byte);
                    break;
                case instruction_1.default.LDA_ZP: // LDA $80
                case instruction_1.default.LDX_ZP: // LDX $80
                case instruction_1.default.LDY_ZP: // LDY $80
                    var register = this.get_reg_from_instruction(ins, 2);
                    var byte = this.get_byte_from_zero_page();
                    this.set_NZ_flags(byte);
                    this.load_byte_into_register(register, byte);
                    break;
                case instruction_1.default.LDA_ZPX: // LDA $80,X
                case instruction_1.default.LDX_ZPY: // LDX $80,Y
                case instruction_1.default.LDY_ZPX: // LDY $80,X
                    var register = this.get_reg_from_instruction(ins, 2);
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.get_byte_from_zero_page_add_XY(add_register);
                    this.set_NZ_flags(byte);
                    this.load_byte_into_register(register, byte);
                    break;
                case instruction_1.default.LDA_ABS: // LDA $2200
                case instruction_1.default.LDX_ABS: // LDX $2200
                case instruction_1.default.LDY_ABS: // LDY $2200
                    var register = this.get_reg_from_instruction(ins, 2);
                    var byte = this.get_byte_absolute();
                    this.set_NZ_flags(byte);
                    this.load_byte_into_register(register, byte);
                    break;
                case instruction_1.default.LDA_ABSX: // LDA $2200,X
                case instruction_1.default.LDA_ABSY: // LDA $2200,Y
                case instruction_1.default.LDX_ABSY: // LDX $2200,Y
                case instruction_1.default.LDY_ABSX: // LDY $2200,X
                    var register = this.get_reg_from_instruction(ins, 2);
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.get_byte_absolute_XY(add_register);
                    this.set_NZ_flags(byte);
                    this.load_byte_into_register(register, byte);
                    break;
                case instruction_1.default.LDA_INDX: // LDA ($80,X)
                    var register = this.get_reg_from_instruction(ins, 2);
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.get_byte_indexed_indirect_X(add_register);
                    this.set_NZ_flags(byte);
                    this.load_byte_into_register(register, byte);
                    break;
                case instruction_1.default.LDA_INDY: // LDA ($80),Y
                    var register = this.get_reg_from_instruction(ins, 2);
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.get_byte_indirect_indexed_Y(add_register);
                    this.set_NZ_flags(byte);
                    this.load_byte_into_register(register, byte);
                    break;
                /*===========*/
                /*  LSR
                /*===========*/
                case instruction_1.default.LSR_A: // LSR A
                    this.A = this.shift_right(this.A);
                    break;
                case instruction_1.default.LSR_ZP: // LSR $80
                    var zp_addr = this.read_byte(this.PC);
                    var byte = this.get_byte_from_zero_page();
                    var shift = this.shift_right(byte);
                    this.store_byte(zp_addr, shift);
                    break;
                case instruction_1.default.LSR_ZPX: // LSR $80,X
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var zp_addr = this.intToByte(this.read_byte(this.PC) + this.X);
                    var byte = this.get_byte_from_zero_page_add_XY(add_register);
                    var shift = this.shift_right(byte);
                    this.store_byte(zp_addr, shift);
                    break;
                case instruction_1.default.LSR_ABS: // LSR $2200
                    var abs_addr = this.read_word(this.PC);
                    var byte = this.get_byte_absolute();
                    var shift = this.shift_right(byte);
                    this.store_byte(abs_addr, shift);
                    break;
                case instruction_1.default.LSR_ABSX: // LSR $2200,X
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var abs_addr = this.intToWord(this.read_word(this.PC) + this.X);
                    var byte = this.get_byte_absolute_XY(add_register);
                    var shift = this.shift_right(byte);
                    this.store_byte(abs_addr, shift);
                    break;
                /*===========*/
                /*  NOP
                /*===========*/
                case instruction_1.default.NOP: // NOP
                    this.no_operation();
                    break;
                /*===========*/
                /*  ORA
                /*===========*/
                case instruction_1.default.ORA_IM: // ORA #$80
                    var byte = this.A;
                    var byte2 = this.get_byte_immediate();
                    this.A = this.logical_or(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.ORA_ZP: // ORA $80
                    var byte = this.A;
                    var byte2 = this.get_byte_from_zero_page();
                    this.A = this.logical_or(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.ORA_ZPX: // ORA $80
                    var byte = this.A;
                    var byte2 = this.get_byte_from_zero_page_add_XY(register_1.default.X);
                    this.A = this.logical_or(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.ORA_ABS: // ORA $2200
                    var byte = this.A;
                    var byte2 = this.get_byte_absolute();
                    this.A = this.logical_or(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.ORA_ABSX: // ORA $2200,X
                case instruction_1.default.ORA_ABSY: // ORA $2200,Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_absolute_XY(add_register);
                    this.A = this.logical_or(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.ORA_INDX: // ORA ($80,X)
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_indexed_indirect_X(add_register);
                    this.A = this.logical_or(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                case instruction_1.default.ORA_INDY: // ORA ($80),Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                    this.A = this.logical_or(byte, byte2);
                    this.set_NZ_flags(this.A);
                    break;
                /*===========*/
                /*  Stack
                /*===========*/
                case instruction_1.default.PHA: // PHA
                    this.push_to_stack(this.A);
                    break;
                case instruction_1.default.PHP: // PHP
                    this.push_to_stack(this.P);
                    break;
                case instruction_1.default.PLA: // PLA
                    this.A = this.pull_from_stack();
                    break;
                case instruction_1.default.PLP: // PLP
                    this.P = this.pull_from_stack();
                    break;
                /*===========*/
                /*  ROL
                /*===========*/
                case instruction_1.default.ROL_A: // ROL A
                    var old_carry = (this.P & flag_1.default.C);
                    this.A = this.shift_left(this.A) | old_carry;
                    break;
                case instruction_1.default.ROL_ZP: // ROL $80
                    var zp_addr = this.read_byte(this.PC);
                    var byte = this.get_byte_from_zero_page();
                    var old_carry = (this.P & flag_1.default.C);
                    var shift = this.shift_left(byte) | old_carry;
                    this.store_byte(zp_addr, shift);
                    break;
                case instruction_1.default.ROL_ZPX: // ROL $80,X
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var zp_addr = this.intToByte(this.read_byte(this.PC) + this.X);
                    var byte = this.get_byte_from_zero_page_add_XY(add_register);
                    var old_carry = (this.P & flag_1.default.C);
                    var shift = this.shift_left(byte) | old_carry;
                    this.store_byte(zp_addr, shift);
                    break;
                case instruction_1.default.ROL_ABS: // ROL $2200
                    var abs_addr = this.read_word(this.PC);
                    var byte = this.get_byte_absolute();
                    var old_carry = (this.P & flag_1.default.C);
                    var shift = this.shift_left(byte) | old_carry;
                    this.store_byte(abs_addr, shift);
                    break;
                case instruction_1.default.ROL_ABSX: // ROL $2200,X
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var abs_addr = this.intToWord(this.read_word(this.PC) + this.X);
                    var byte = this.get_byte_absolute_XY(add_register);
                    var old_carry = (this.P & flag_1.default.C);
                    var shift = this.shift_left(byte) | old_carry;
                    this.store_byte(abs_addr, shift);
                    break;
                /*===========*/
                /*  ROR
                /*===========*/
                case instruction_1.default.ROR_A: // ROR A
                    var old_carry = (this.P & flag_1.default.C);
                    this.A = this.shift_right(this.A) | old_carry;
                    break;
                case instruction_1.default.ROR_ZP: // ROR $80
                    var zp_addr = this.read_byte(this.PC);
                    var byte = this.get_byte_from_zero_page();
                    var old_carry = (this.P & flag_1.default.C);
                    var shift = this.shift_right(byte) | old_carry;
                    this.store_byte(zp_addr, shift);
                    break;
                case instruction_1.default.ROR_ZPX: // ROR $80,X
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var zp_addr = this.intToByte(this.read_byte(this.PC) + this.X);
                    var byte = this.get_byte_from_zero_page_add_XY(add_register);
                    var old_carry = (this.P & flag_1.default.C);
                    var shift = this.shift_right(byte) | old_carry;
                    this.store_byte(zp_addr, shift);
                    break;
                case instruction_1.default.ROR_ABS: // ROR $2200
                    var abs_addr = this.read_word(this.PC);
                    var byte = this.get_byte_absolute();
                    var old_carry = (this.P & flag_1.default.C);
                    var shift = this.shift_right(byte) | old_carry;
                    this.store_byte(abs_addr, shift);
                    break;
                case instruction_1.default.ROR_ABSX: // ROR $2200,X
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var abs_addr = this.intToWord(this.read_word(this.PC) + this.X);
                    var byte = this.get_byte_absolute_XY(add_register);
                    var old_carry = (this.P & flag_1.default.C);
                    var shift = this.shift_right(byte) | old_carry;
                    this.store_byte(abs_addr, shift);
                    break;
                case instruction_1.default.RTI:
                    this.P = this.pull_from_stack();
                    this.PC = this.pull_PC_from_stack();
                    break; // TODO: Test RTI
                case instruction_1.default.RTS:
                    this.PC = this.pull_PC_from_stack();
                    break;
                /*===========*/
                /*  SBC
                /*===========*/
                case instruction_1.default.SBC_IM: // SBC #$80
                    var byte = this.A;
                    var byte2 = this.get_byte_immediate();
                    this.A = this.subtract_with_carry(byte, byte2);
                    break;
                case instruction_1.default.SBC_ZP: // SBC $80
                    var byte = this.A;
                    var byte2 = this.get_byte_from_zero_page();
                    this.A = this.subtract_with_carry(byte, byte2);
                    break;
                case instruction_1.default.SBC_ZPX: // SBC $80,X
                    var byte = this.A;
                    var byte2 = this.get_byte_from_zero_page_add_XY(register_1.default.X);
                    this.A = this.subtract_with_carry(byte, byte2);
                    break;
                case instruction_1.default.SBC_ABS: // SBC $2200
                    var byte = this.A;
                    var byte2 = this.get_byte_absolute();
                    this.A = this.subtract_with_carry(byte, byte2);
                    break;
                case instruction_1.default.SBC_ABSX: // SBC $2200,X
                case instruction_1.default.SBC_ABSY: // SBC $2200,Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_absolute_XY(add_register);
                    this.A = this.subtract_with_carry(byte, byte2);
                    break;
                case instruction_1.default.SBC_INDX: // SBC ($80,X)
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_indexed_indirect_X(add_register);
                    this.A = this.subtract_with_carry(byte, byte2);
                    break;
                case instruction_1.default.SBC_INDY: // SBC ($80),Y
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    var byte = this.A;
                    var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                    this.A = this.subtract_with_carry(byte, byte2);
                    break;
                /*===========*/
                /*  Set Flags
                /*===========*/
                case instruction_1.default.SEC: // SEC
                    this.set_flag(flag_1.default.C);
                    break;
                case instruction_1.default.SED: // SED
                    this.set_flag(flag_1.default.D);
                    break;
                case instruction_1.default.SEI: // SEI
                    this.set_flag(flag_1.default.I);
                    break;
                /*===========*/
                /*  STA|X|Y
                /*===========*/
                case instruction_1.default.STA_ZP: // STA $80
                case instruction_1.default.STX_ZP: // STX $80
                case instruction_1.default.STY_ZP: // STY $80
                    var register = this.get_reg_from_instruction(ins, 2);
                    this.store_register_zero_page(register);
                    break;
                case instruction_1.default.STA_ZPX: // STA $80,X
                case instruction_1.default.STX_ZPY: // STX $80,Y
                case instruction_1.default.STY_ZPX: // STY $80,X
                    var register = this.get_reg_from_instruction(ins, 2);
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    this.store_register_zero_page_add_XY(register, add_register);
                    break;
                case instruction_1.default.STA_ABS: // STA $2200
                case instruction_1.default.STX_ABS: // STX $2200
                case instruction_1.default.STY_ABS: // STY $2200
                    var register = this.get_reg_from_instruction(ins, 2);
                    this.store_register_absolute(register);
                    break;
                case instruction_1.default.STA_ABSX: // STA $2200,X    
                case instruction_1.default.STA_ABSY: // STA $2200,Y   
                    var register = this.get_reg_from_instruction(ins, 2);
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    this.store_register_absolute_add_XY(register, add_register);
                    break;
                case instruction_1.default.STA_INDX: // STA ($2200,X)   
                    var register = this.get_reg_from_instruction(ins, 2);
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    this.store_register_indexed_indirect_X(register, add_register);
                    break;
                case instruction_1.default.STA_INDY: // STA (£2200),Y   
                    var register = this.get_reg_from_instruction(ins, 2);
                    var add_register = this.get_reg_from_instruction(ins, -1);
                    this.store_register_indirect_indexed_Y(register, add_register);
                    break;
                case instruction_1.default.TAX: // TAX   
                case instruction_1.default.TAY: // TAY
                case instruction_1.default.TSX: // TSX
                case instruction_1.default.TXA: // TXA
                case instruction_1.default.TXS: // TXS
                case instruction_1.default.TYA: // TYA  
                    var src_register = this.get_reg_from_instruction(ins, 1);
                    src_register += src_register == "S" ? "P" : "";
                    var dest_register = this.get_reg_from_instruction(ins, 2);
                    dest_register += dest_register == "S" ? "P" : "";
                    this[dest_register] = this[src_register];
                    this.set_NZ_flags(this[dest_register]);
                    break;
                // default:
                //     break;
            }
        }
    }
    /*================================================*/
    /*            Helpers
    /*================================================*/
    intToByte(n) {
        return n & 0xFF;
    }
    intToWord(n) {
        return n & 0xFFFF;
    }
    get_reg_from_instruction(ins, str_start_pos, register_str_length = 1) {
        var ins_str = instruction_1.default[ins].toString();
        let out = ins_str.substr(str_start_pos, register_str_length);
        return out;
    }
    /*================================================*/
    /*            Flags
    /*================================================*/
    check_flag(flag) {
        return (this.P & flag) > 0;
    }
    set_flag(flag, set = true) {
        if (set) {
            this.P |= flag;
        }
        else {
            this.P &= ~flag;
        }
    }
    clear_flag(flag) {
        this.set_flag(flag, false);
    }
    set_NZ_flags(value) {
        this.set_flag(flag_1.default.N, this.check_if_negative(value));
        this.set_flag(flag_1.default.Z, this.check_if_zero(value));
    }
    // private set_N_flag(value: number){
    //     this.set_flag_boolen(Flag.N, (value & Flag.N) > 0)
    // }
    // private set_V_flag(old_byte: number, new_byte: number){
    //     let b1 = (old_byte & Flag.N); 
    //     let b2 = (new_byte & Flag.N);
    //     this.set_flag_boolen(Flag.V, b1 != b2);
    // }
    // private set_B_flag(set: boolean){
    //     this.set_flag_boolen(Flag.B, set);
    // }
    // private set_D_flag(set: boolean){
    //     this.set_flag_boolen(Flag.D, set);
    // }
    // private set_I_flag(set: boolean){
    //     this.set_flag_boolen(Flag.I, set);
    // }
    // private set_Z_flag(value: number){
    //     //value > 0
    //     if (value) { 
    //         this.P &= ~Flag.Z; // set NOT (~) z flag (z = 0)
    //     } else { //value == 0
    //         this.P |= Flag.Z;
    //     }
    // }
    // private set_C_flag(old_byte: number, new_byte: number){
    //     //Check Overflow
    //     let b1 = (old_byte & Flag.N); 
    //     let b2 = (new_byte & Flag.N);
    //     //Check Underflow
    //     let b3 = (old_byte & Flag.C); 
    //     let b4 = (new_byte & Flag.C);
    //     this.set_flag_boolen(Flag.C, (b1 != b2) || (b3 != b4));
    // }
    check_if_negative(value) {
        return (value & flag_1.default.N) > 0;
    }
    check_if_zero(value) {
        return value == 0;
    }
    check_overflow(old_byte, new_byte) {
        return old_byte > new_byte;
    }
    check_underflow(old_byte, new_byte) {
        return old_byte < new_byte;
    }
    /*================================================*/
    /*            Implied Instructions
    /*================================================*/
    decrement_register(register) {
        this[register]--;
    }
    increment_register(register) {
        this[register]++;
    }
    decrement_memory(addr) {
        let result = this.intToByte(this.read_byte(addr) - 1);
        this.store_byte(addr, result);
        this.set_flag(flag_1.default.Z, this.check_if_zero(result));
        this.set_flag(flag_1.default.N, this.check_if_negative(result));
    }
    increment_memory(addr) {
        let result = this.intToByte(this.read_byte(addr) + 1);
        this.store_byte(addr, result);
        this.set_flag(flag_1.default.Z, this.check_if_zero(result));
        this.set_flag(flag_1.default.N, this.check_if_negative(result));
    }
    no_operation() {
        this.increment_register(register_1.default.PC);
    }
    /*================================================*/
    /*            Stack
    /*================================================*/
    get_current_stack_addr() {
        return 0x0100 + this.SP;
    }
    push_to_stack(byte) {
        let addr = this.get_current_stack_addr();
        this.store_byte(addr, byte);
        this.decrement_register(register_1.default.SP);
    }
    push_PC_to_stack() {
        let addr = this.PC - 1;
        this.push_to_stack((addr >> 8) & 0xFF);
        this.push_to_stack(addr & 0xFF);
        // console.log(addr);
    }
    pull_from_stack() {
        this.increment_register(register_1.default.SP);
        let addr = this.get_current_stack_addr();
        let b = this.read_byte(addr);
        return b;
    }
    pull_PC_from_stack() {
        var low_order = this.pull_from_stack();
        var high_order = this.pull_from_stack() << 8;
        return this.intToWord(high_order + low_order + 1);
    }
    /*================================================*/
    /*            Operations
    /*================================================*/
    // private set_carry_flag(new_byte: number, old_byte: number){
    //     if (new_byte < old_byte) { 
    //         this.P |= Flag.C;
    //     } else { //value == 0
    //         this.P &= ~Flag.C; // set NOT (~) z flag (z = 0)
    //     }
    // }
    // private check_for_overflow(old_byte: number, new_byte: number){
    //     let b1 = old_byte & Flag.N;
    //     let b2 = new_byte & Flag.N;
    //     return b1 != b2;
    // }
    add_with_carry(byte1, byte2) {
        let carry = this.check_flag(flag_1.default.C) ? 1 : 0;
        let result = this.intToByte(byte1 + byte2 + carry);
        let carryCheck = this.check_overflow(byte1, result);
        this.set_flag(flag_1.default.C, carryCheck);
        this.set_NZ_flags(result);
        return result;
    }
    subtract_with_carry(byte1, byte2) {
        let carry = this.check_flag(flag_1.default.C) ? 0 : 1;
        let result = this.intToByte(byte1 - byte2 - carry);
        let carryCheck = this.check_underflow(byte1, result);
        this.set_flag(flag_1.default.C, carryCheck);
        this.set_NZ_flags(result);
        return result;
    }
    logical_and(byte1, byte2) {
        return this.intToByte(byte1 & byte2);
    }
    logical_or(byte1, byte2) {
        return this.intToByte(byte1 | byte2);
    }
    xor(byte1, byte2) {
        return this.intToByte(byte1 ^ byte2);
    }
    bit_test(byte1, byte2) {
        var bit_test = this.logical_and(byte1, byte2) > 0;
        var negative = this.logical_and(byte2, flag_1.default.N) > 0;
        var overflow = this.logical_and(byte2, flag_1.default.V) > 0;
        this.set_flag(flag_1.default.Z, bit_test);
        this.set_flag(flag_1.default.N, negative);
        this.set_flag(flag_1.default.V, overflow);
    }
    shift_left(byte) {
        let carryCheck = this.check_if_negative(byte);
        this.set_flag(flag_1.default.C, carryCheck);
        let result = this.intToByte(byte << 1);
        this.set_NZ_flags(result);
        return result;
    }
    shift_right(byte) {
        let carryCheck = (byte & 0x01) > 0;
        this.set_flag(flag_1.default.C, carryCheck);
        let result = this.intToByte(byte >> 1);
        this.set_NZ_flags(result);
        return result;
    }
    compare(byte1, byte2) {
        let result = byte1 - byte2;
        this.set_flag(flag_1.default.C, result >= 0);
        this.set_flag(flag_1.default.Z, result == 0);
        this.set_flag(flag_1.default.N, result < 0);
    }
    /*================================================*/
    /*            Relative Instructions
    /*================================================*/
    branch_if_true(condition) {
        let offset = this.fetch_byte() - 128;
        if (!condition)
            return;
        this.PC += offset;
    }
    /*================================================*/
    /*            Addressing
    /*================================================*/
    get_zero_page_addr() {
        return this.fetch_byte();
    }
    get_zero_page_addr_add_XY(register) {
        let addr = this.fetch_byte();
        return this.intToByte(addr + this[register]);
    }
    get_absolute_addr() {
        return this.fetch_word();
    }
    get_absolute_addr_add_XY(register) {
        let addr = this.fetch_word();
        return this.intToWord(addr + this[register]);
    }
    /*
        Example: LDA ($20,X)

        X = 04
        
        Address    24  25  ...
        Value      74  30  ...

        Zero Page Address: 20 + 04   = 24
        low order 8 bits:  $24       = 74
        high order 8 bits: $25       = 30

        Absolute Address = $3074
    */
    get_indexed_indirect_addr_X(register) {
        let zp_addr = this.get_zero_page_addr_add_XY(register);
        return this.read_word(zp_addr);
    }
    /*
        Example: LDA ($00),Y

        Y = 90
        
        Address    00  01  ...
        Value      80  02  ...

        low order 8 bits:  80 + 90     = 10   (with carry = 1)
        high order 8 bits: 02 + Carry  = 03

        Absolute Address = $0310
    */
    get_indirect_indexed_addr_X(register) {
        let zp_addr = this.get_zero_page_addr();
        let zp_b1 = this.read_byte(zp_addr);
        let low_order = this.intToByte(zp_b1 + this[register]);
        let carry = low_order < zp_b1 ? 1 : 0;
        let zp_b2 = this.read_byte(zp_addr + 1);
        let high_order = this.intToWord((zp_b2 + carry) << 8);
        return high_order + low_order;
    }
    /*================================================*/
    /*            Get Bytes
    /*================================================*/
    fetch_byte() {
        let data = this.read_byte(this.PC);
        this.increment_register(register_1.default.PC);
        this.debug_stack.push(data);
        if (this.print_bytes) {
            console.log(`ADDR: ${this.PC.toString(16)}`);
            console.log(`BYTE: ${data.toString(16)}`);
        }
        return data;
    }
    fetch_word() {
        let data = this.read_word(this.PC);
        this.debug_stack.push(data & 0xFF);
        this.debug_stack.push((data >> 8) & 0xFF);
        this.increment_register(register_1.default.PC);
        this.increment_register(register_1.default.PC);
        return data;
    }
    read_byte(addr) {
        return this.memory.get(addr);
    }
    read_word(addr) {
        return this.memory.get_word(addr);
    }
    get_byte_immediate() {
        return this.fetch_byte();
    }
    get_byte_from_zero_page() {
        let addr = this.get_zero_page_addr();
        return this.read_byte(addr);
    }
    get_byte_from_zero_page_add_XY(register) {
        let addr = this.get_zero_page_addr_add_XY(register);
        return this.read_byte(addr);
    }
    get_byte_absolute() {
        let addr = this.get_absolute_addr();
        return this.read_byte(addr);
    }
    get_byte_absolute_XY(register) {
        let addr = this.get_absolute_addr_add_XY(register);
        return this.read_byte(addr);
    }
    get_byte_indexed_indirect_X(register) {
        let addr = this.get_indexed_indirect_addr_X(register);
        return this.read_byte(addr);
    }
    get_byte_indirect_indexed_Y(register) {
        let addr = this.get_indirect_indexed_addr_X(register);
        return this.read_byte(addr);
    }
    /*================================================*/
    /*            Store Byte
    /*================================================*/
    store_byte(addr, byte) {
        this.memory.set(addr, byte);
    }
    load_byte_into_register(register, byte) {
        this[register] = byte;
    }
    store_register_zero_page(register) {
        let addr = this.get_zero_page_addr();
        this.store_byte(addr, this[register]);
    }
    store_register_zero_page_add_XY(register, add_register) {
        let addr = this.get_zero_page_addr_add_XY(add_register);
        this.store_byte(addr, this[register]);
    }
    store_register_absolute(register) {
        let addr = this.get_absolute_addr();
        this.store_byte(addr, this[register]);
    }
    store_register_absolute_add_XY(register, add_register) {
        let addr = this.get_absolute_addr_add_XY(add_register);
        this.store_byte(addr, this[register]);
    }
    store_register_indexed_indirect_X(register, add_register) {
        let addr = this.get_indexed_indirect_addr_X(add_register);
        this.store_byte(addr, this[register]);
    }
    store_register_indirect_indexed_Y(register, add_register) {
        let addr = this.get_indirect_indexed_addr_X(add_register);
        this.store_byte(addr, this[register]);
    }
}
_PC = new WeakMap(), _SP = new WeakMap(), _A = new WeakMap(), _X = new WeakMap(), _Y = new WeakMap(), _P = new WeakMap();
module.exports = CPU;
