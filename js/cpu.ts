// // @ts-expect-error - not a module - but this allows Jest test
// import Flag from "./flag";
// // @ts-expect-error - not a module - but this allows Jest test
// import Instruction from "./instruction";
// // @ts-expect-error - not a module - but this allows Jest test
// import Register from "./register";

class CPU {
    #PC: number;
    public get PC(): number { return this.#PC; }
    public set PC(v: number) { this.#PC = this.intToWord(v); }

    #SP: number;
    public get SP(): number { return this.#SP; }
    public set SP(v: number) { this.#SP = this.intToByte(v); }

    #A: number;
    public get A(): number { return this.#A; }
    public set A(v: number) { this.#A = this.intToByte(v); }

    #X: number;
    public get X(): number { return this.#X; }
    public set X(v: number) { this.#X = this.intToByte(v); }

    #Y: number;
    public get Y(): number { return this.#Y; }
    public set Y(v: number) { this.#Y = this.intToByte(v); }

    #P: number;
    public get P(): number { return this.#P; }
    public set P(v: number) { this.#P = this.intToByte(v); }

    public debug_stack: number[];

    memory: Memory
    print_bytes: boolean = false;
    loaded_program : Uint8Array | null = null;

    public constructor(memory: Memory, start_addr = 0x0600) {
        this.reset(memory, start_addr);
    }

    public reset(memory: Memory, start_addr: number) {
        this.A = 0x00;
        this.X = 0x00;
        this.Y = 0x00;
        this.PC = start_addr;
        this.SP = 0xff;
        this.P = Flag.CLR;
        this.memory = memory;
        this.loaded_program = null;
        this.debug_stack = new Array();
    }

    public load_program(program : Uint8Array){
        this.loaded_program = program;
        this.memory.load_bytes(this.loaded_program, start_addr);
    }

    public execute() {
        while (this.PC !== 0) {
            this.step();
        }
    }

    public step(){
        if(this.PC == 0) {
            console.log("Program Execution Halted");
            return;
        }
        if (this.print_bytes) {
            console.log(this.memory.Data.slice(this.PC));
            console.log(`ADDR: ${this.PC.toString(16)}`);
        }
        let ins = this.fetch_byte();
        switch (ins) {
            /*===========*/
            /*  ADC     
            /*===========*/
            case Instruction.ADC_IM: // ADC #$80
                var byte = this.A;
                var byte2 = this.get_byte_immediate();
                this.A = this.add_with_carry(byte, byte2);
                break;
            case Instruction.ADC_ZP: // ADC $80
                var byte = this.A;
                var byte2 = this.get_byte_from_zero_page();
                this.A = this.add_with_carry(byte, byte2);
                break;
            case Instruction.ADC_ZPX: // ADC $80,X
                var byte = this.A;
                var byte2 = this.get_byte_from_zero_page_add_XY(Register.X);
                this.A = this.add_with_carry(byte, byte2);
                break;
            case Instruction.ADC_ABS: // ADC $2200
                var byte = this.A;
                var byte2 = this.get_byte_absolute();
                this.A = this.add_with_carry(byte, byte2);
                break;
            case Instruction.ADC_ABSX: // ADC $2200,X
            case Instruction.ADC_ABSY: // ADC $2200,Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_absolute_XY(add_register);
                this.A = this.add_with_carry(byte, byte2);
                break;
            case Instruction.ADC_INDX: // ADC ($80,X)
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_indexed_indirect_X(add_register);
                this.A = this.add_with_carry(byte, byte2);
                break;
            case Instruction.ADC_INDY: // ADC ($80),Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                this.A = this.add_with_carry(byte, byte2);
                break;
            /*===========*/
            /*  AND
            /*===========*/
            case Instruction.AND_IM: // AND #$80
                var byte = this.A;
                var byte2 = this.get_byte_immediate();
                this.A = this.logical_and(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.AND_ZP: // AND $80
                var byte = this.A;
                var byte2 = this.get_byte_from_zero_page();
                this.A = this.logical_and(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.AND_ZPX: // AND $80
                var byte = this.A;
                var byte2 = this.get_byte_from_zero_page_add_XY(Register.X);
                this.A = this.logical_and(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.AND_ABS: // AND $2200
                var byte = this.A;
                var byte2 = this.get_byte_absolute();
                this.A = this.logical_and(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.AND_ABSX: // AND $2200,Y
            case Instruction.AND_ABSY: // AND $2200,Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_absolute_XY(add_register);
                this.A = this.logical_and(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.AND_INDX: // AND ($80,X)
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_indexed_indirect_X(add_register);
                this.A = this.logical_and(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.AND_INDY: // AND ($80),Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                this.A = this.logical_and(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            /*===========*/
            /*  ASL
            /*===========*/
            case Instruction.ASL_A: // ASL A
                this.A = this.shift_left(this.A);
                break;
            case Instruction.ASL_ZP: // ASL $80
                var zp_addr = this.read_byte(this.PC);
                var byte = this.get_byte_from_zero_page();
                var shift = this.shift_left(byte);
                this.store_byte(zp_addr, shift);
                break;
            case Instruction.ASL_ZPX: // ASL $80,X
                var add_register = this.get_reg_from_instruction(ins, -1);
                var zp_addr = this.intToByte(this.read_byte(this.PC) + this.X);
                var byte = this.get_byte_from_zero_page_add_XY(add_register);
                var shift = this.shift_left(byte);
                this.store_byte(zp_addr, shift);
                break;
            case Instruction.ASL_ABS: // ASL $2200
                var abs_addr = this.read_word(this.PC);
                var byte = this.get_byte_absolute();
                var shift = this.shift_left(byte);
                this.store_byte(abs_addr, shift);
                break;
            case Instruction.ASL_ABSX: // ASL $2200,X
                var add_register = this.get_reg_from_instruction(ins, -1);
                var abs_addr = this.intToWord(this.read_word(this.PC) + this.X);
                var byte = this.get_byte_absolute_XY(add_register);
                var shift = this.shift_left(byte);
                this.store_byte(abs_addr, shift);
                break;
            /*===========*/
            /*  Branching
            /*===========*/
            case Instruction.BCC_REL: // BCC 
                var carry_clear = !this.check_flag(Flag.C);
                this.branch_if_true(carry_clear);
                break;
            case Instruction.BCS_REL: // BCS 
                var carry_set = this.check_flag(Flag.C);
                this.branch_if_true(carry_set);
                break;
            case Instruction.BEQ_REL: // BEQ 
                var zero = this.check_flag(Flag.Z);
                this.branch_if_true(zero);
                break;
            case Instruction.BIT_ZP: // BIT $80
                var byte1 = this.A;
                var byte2 = this.get_byte_from_zero_page();
                this.bit_test(byte1, byte2);
                break;
            case Instruction.BIT_ABS: // BIT $80
                var byte1 = this.A;
                var byte2 = this.get_byte_absolute();
                this.bit_test(byte1, byte2);
                break;
            case Instruction.BMI_REL: // BMI 
                var negative = this.check_flag(Flag.N);
                this.branch_if_true(negative);
                break;
            case Instruction.BNE_REL: // BMI 
                var zero = !this.check_flag(Flag.Z);
                this.branch_if_true(zero);
                break;
            case Instruction.BPL_REL: // BMI 
                var positive = !this.check_flag(Flag.N);
                this.branch_if_true(positive);
                break;
            case Instruction.BRK: // BRK
                this.push_PC_to_stack();
                this.push_to_stack(this.P);
                this.clear_flag(Flag.D);
                this.PC = 0;
                break;
            case Instruction.BVC_REL: // BVC 
                var overflow = !this.check_flag(Flag.V);
                this.branch_if_true(overflow);
                break;
            case Instruction.BVS_REL: // BVS 
                var overflow = this.check_flag(Flag.V);
                this.branch_if_true(overflow);
                break;
            case Instruction.CLC: // CLC
                this.clear_flag(Flag.C);
                break;
            case Instruction.CLD: // CLD
                this.clear_flag(Flag.D);
                break;
            case Instruction.CLI: // CLI
                this.clear_flag(Flag.I);
                break;
            case Instruction.CLV: // CLV
                this.clear_flag(Flag.V);
                break;
            /*===========*/
            /*  CMP|CPX|Y 
            /*===========*/
            case Instruction.CPA_IM: // CMP #$80
            case Instruction.CPX_IM: // CPX #$80
            case Instruction.CPY_IM: // CPY #$80
                var register = this.get_reg_from_instruction(ins, 2);
                var byte1 = this[register];
                var byte2 = this.get_byte_immediate();
                this.compare(byte1, byte2);
                break;
            case Instruction.CPA_ZP: // CMP $80
            case Instruction.CPX_ZP: // CMP $80
            case Instruction.CPY_ZP: // CMP $80
                var register = this.get_reg_from_instruction(ins, 2);
                var byte1 = this[register];
                var byte2 = this.get_byte_from_zero_page();
                this.compare(byte1, byte2);
                break;
            case Instruction.CPA_ZPX: // CMP $80,X
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte1 = this.A;
                var byte2 = this.get_byte_from_zero_page_add_XY(add_register);
                this.compare(byte1, byte2);
                break;
            case Instruction.CPA_ABS: // CMP $2200
            case Instruction.CPX_ABS: // CMP $2200
            case Instruction.CPY_ABS: // CMP $2200
                var register = this.get_reg_from_instruction(ins, 2);
                var byte1 = this[register];
                var byte2 = this.get_byte_absolute();
                this.compare(byte1, byte2);
                break;
            case Instruction.CPA_ABSX: // CMP $2200
            case Instruction.CPA_ABSY: // CMP $2200
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte1 = this.A;
                var byte2 = this.get_byte_absolute_XY(add_register);
                this.compare(byte1, byte2);
                break;
            case Instruction.CPA_INDX: // CMP ($80,X)
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte1 = this.A;
                var byte2 = this.get_byte_indexed_indirect_X(add_register);
                this.compare(byte1, byte2);
                break;
            case Instruction.CPA_INDY: // CMP ($80),Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte1 = this.A;
                var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                this.compare(byte1, byte2);
                break;
            /*===========*/
            /*  DEC|X|Y 
            /*===========*/
            case Instruction.DEC_ZP: // DEC $80
                var addr = this.get_zero_page_addr();
                this.decrement_memory(addr);
                break;
            case Instruction.DEC_ZPX: // DEC $80,X
                var addr = this.get_zero_page_addr_add_XY(Register.X);
                this.decrement_memory(addr);
                break;
            case Instruction.DEC_ABS: // DEC $2200
                var addr = this.get_absolute_addr();
                this.decrement_memory(addr);
                break;
            case Instruction.DEC_ABSX: // DEC $2200,X
                var addr = this.get_absolute_addr_add_XY(Register.X);
                this.decrement_memory(addr);
                break;
            case Instruction.DEX: // DEX
            case Instruction.DEY: // DEY
                var register = this.get_reg_from_instruction(ins, 2);
                this.decrement_register(register);
                this.set_NZ_flags(this[register]);
                break;
            /*===========*/
            /*  EOR
            /*===========*/
            case Instruction.EOR_IM: // EOR #$80
                var byte = this.A;
                var byte2 = this.get_byte_immediate();
                this.A = this.xor(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.EOR_ZP: // EOR $80
                var byte = this.A;
                var byte2 = this.get_byte_from_zero_page();
                this.A = this.xor(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.EOR_ZPX: // EOR $80
                var byte = this.A;
                var byte2 = this.get_byte_from_zero_page_add_XY(Register.X);
                this.A = this.xor(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.EOR_ABS: // EOR $2200
                var byte = this.A;
                var byte2 = this.get_byte_absolute();
                this.A = this.xor(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.EOR_ABSX: // EOR $2200,Y
            case Instruction.EOR_ABSY: // EOR $2200,Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_absolute_XY(add_register);
                this.A = this.xor(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.EOR_INDX: // EOR ($80,X)
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_indexed_indirect_X(add_register);
                this.A = this.xor(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.EOR_INDY: // EOR ($80),Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                this.A = this.xor(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            /*===========*/
            /*  INC|X|Y 
            /*===========*/
            case Instruction.INC_ZP: // INC $80
                var addr = this.get_zero_page_addr();
                this.increment_memory(addr);
                break;
            case Instruction.INC_ZPX: // INC $80,X
                var addr = this.get_zero_page_addr_add_XY(Register.X);
                this.increment_memory(addr);
                break;
            case Instruction.INC_ABS: // INC $2200
                var addr = this.get_absolute_addr();
                this.increment_memory(addr);
                break;
            case Instruction.INC_ABSX: // INC $2200,X
                var addr = this.get_absolute_addr_add_XY(Register.X);
                this.increment_memory(addr);
                break;
            case Instruction.INX: // INX
            case Instruction.INY: // INY
                var register = this.get_reg_from_instruction(ins, 2);
                this.increment_register(register);
                this.set_NZ_flags(this[register]);
                break;
            case Instruction.JMP_ABS: // JMP $2200
                var addr = this.get_absolute_addr();
                this.PC = addr;
                break;
            case Instruction.JMP_IND: // JMP ($2200)
                var ind_addr = this.get_absolute_addr();
                var addr = this.read_word(ind_addr);
                this.PC = addr;
                break;
            case Instruction.JSR: // JSR ($2200)
                var addr = this.get_absolute_addr();
                this.push_PC_to_stack();
                this.PC = addr;
                break;
            /*===========*/
            /*  LDA|X|Y 
            /*===========*/
            case Instruction.LDA_IM: // LDA #$80
            case Instruction.LDX_IM: // LDX #$80
            case Instruction.LDY_IM: // LDY #$80
                var register = this.get_reg_from_instruction(ins, 2);
                var byte = this.get_byte_immediate();
                this.set_NZ_flags(byte);
                this.load_byte_into_register(register, byte);
                break;
            case Instruction.LDA_ZP: // LDA $80
            case Instruction.LDX_ZP: // LDX $80
            case Instruction.LDY_ZP: // LDY $80
                var register = this.get_reg_from_instruction(ins, 2);
                var byte = this.get_byte_from_zero_page();
                this.set_NZ_flags(byte);
                this.load_byte_into_register(register, byte);
                break;
            case Instruction.LDA_ZPX: // LDA $80,X
            case Instruction.LDX_ZPY: // LDX $80,Y
            case Instruction.LDY_ZPX: // LDY $80,X
                var register = this.get_reg_from_instruction(ins, 2);
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.get_byte_from_zero_page_add_XY(add_register);
                this.set_NZ_flags(byte);
                this.load_byte_into_register(register, byte);
                break;
            case Instruction.LDA_ABS: // LDA $2200
            case Instruction.LDX_ABS: // LDX $2200
            case Instruction.LDY_ABS: // LDY $2200
                var register = this.get_reg_from_instruction(ins, 2);
                var byte = this.get_byte_absolute();
                this.set_NZ_flags(byte);
                this.load_byte_into_register(register, byte);
                break;
            case Instruction.LDA_ABSX: // LDA $2200,X
            case Instruction.LDA_ABSY: // LDA $2200,Y
            case Instruction.LDX_ABSY: // LDX $2200,Y
            case Instruction.LDY_ABSX: // LDY $2200,X
                var register = this.get_reg_from_instruction(ins, 2);
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.get_byte_absolute_XY(add_register);
                this.set_NZ_flags(byte);
                this.load_byte_into_register(register, byte);
                break;
            case Instruction.LDA_INDX: // LDA ($80,X)
                var register = this.get_reg_from_instruction(ins, 2);
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.get_byte_indexed_indirect_X(add_register);
                this.set_NZ_flags(byte);
                this.load_byte_into_register(register, byte);
                break;
            case Instruction.LDA_INDY: // LDA ($80),Y
                var register = this.get_reg_from_instruction(ins, 2);
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.get_byte_indirect_indexed_Y(add_register);
                this.set_NZ_flags(byte);
                this.load_byte_into_register(register, byte);
                break;
            /*===========*/
            /*  LSR
            /*===========*/
            case Instruction.LSR_A: // LSR A
                this.A = this.shift_right(this.A);
                break;
            case Instruction.LSR_ZP: // LSR $80
                var zp_addr = this.read_byte(this.PC);
                var byte = this.get_byte_from_zero_page();
                var shift = this.shift_right(byte);
                this.store_byte(zp_addr, shift);
                break;
            case Instruction.LSR_ZPX: // LSR $80,X
                var add_register = this.get_reg_from_instruction(ins, -1);
                var zp_addr = this.intToByte(this.read_byte(this.PC) + this.X);
                var byte = this.get_byte_from_zero_page_add_XY(add_register);
                var shift = this.shift_right(byte);
                this.store_byte(zp_addr, shift);
                break;
            case Instruction.LSR_ABS: // LSR $2200
                var abs_addr = this.read_word(this.PC);
                var byte = this.get_byte_absolute();
                var shift = this.shift_right(byte);
                this.store_byte(abs_addr, shift);
                break;
            case Instruction.LSR_ABSX: // LSR $2200,X
                var add_register = this.get_reg_from_instruction(ins, -1);
                var abs_addr = this.intToWord(this.read_word(this.PC) + this.X);
                var byte = this.get_byte_absolute_XY(add_register);
                var shift = this.shift_right(byte);
                this.store_byte(abs_addr, shift);
                break;
            /*===========*/
            /*  NOP     
            /*===========*/
            case Instruction.NOP: // NOP
                this.no_operation();
                break;
            /*===========*/
            /*  ORA
            /*===========*/
            case Instruction.ORA_IM: // ORA #$80
                var byte = this.A;
                var byte2 = this.get_byte_immediate();
                this.A = this.logical_or(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.ORA_ZP: // ORA $80
                var byte = this.A;
                var byte2 = this.get_byte_from_zero_page();
                this.A = this.logical_or(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.ORA_ZPX: // ORA $80
                var byte = this.A;
                var byte2 = this.get_byte_from_zero_page_add_XY(Register.X);
                this.A = this.logical_or(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.ORA_ABS: // ORA $2200
                var byte = this.A;
                var byte2 = this.get_byte_absolute();
                this.A = this.logical_or(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.ORA_ABSX: // ORA $2200,X
            case Instruction.ORA_ABSY: // ORA $2200,Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_absolute_XY(add_register);
                this.A = this.logical_or(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.ORA_INDX: // ORA ($80,X)
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_indexed_indirect_X(add_register);
                this.A = this.logical_or(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            case Instruction.ORA_INDY: // ORA ($80),Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                this.A = this.logical_or(byte, byte2);
                this.set_NZ_flags(this.A);
                break;
            /*===========*/
            /*  Stack     
            /*===========*/
            case Instruction.PHA: // PHA
                this.push_to_stack(this.A);
                break;
            case Instruction.PHP: // PHP
                this.push_to_stack(this.P);
                break;
            case Instruction.PLA: // PLA
                this.A = this.pull_from_stack();
                break;
            case Instruction.PLP: // PLP
                this.P = this.pull_from_stack();
                break;
            /*===========*/
            /*  ROL
            /*===========*/
            case Instruction.ROL_A: // ROL A
                var old_carry = (this.P & Flag.C);
                this.A = this.shift_left(this.A) | old_carry;
                break;
            case Instruction.ROL_ZP: // ROL $80
                var zp_addr = this.read_byte(this.PC);
                var byte = this.get_byte_from_zero_page();
                var old_carry = (this.P & Flag.C);
                var shift = this.shift_left(byte) | old_carry;
                this.store_byte(zp_addr, shift);
                break;
            case Instruction.ROL_ZPX: // ROL $80,X
                var add_register = this.get_reg_from_instruction(ins, -1);
                var zp_addr = this.intToByte(this.read_byte(this.PC) + this.X);
                var byte = this.get_byte_from_zero_page_add_XY(add_register);
                var old_carry = (this.P & Flag.C);
                var shift = this.shift_left(byte) | old_carry;
                this.store_byte(zp_addr, shift);
                break;
            case Instruction.ROL_ABS: // ROL $2200
                var abs_addr = this.read_word(this.PC);
                var byte = this.get_byte_absolute();
                var old_carry = (this.P & Flag.C);
                var shift = this.shift_left(byte) | old_carry;
                this.store_byte(abs_addr, shift);
                break;
            case Instruction.ROL_ABSX: // ROL $2200,X
                var add_register = this.get_reg_from_instruction(ins, -1);
                var abs_addr = this.intToWord(this.read_word(this.PC) + this.X);
                var byte = this.get_byte_absolute_XY(add_register);
                var old_carry = (this.P & Flag.C);
                var shift = this.shift_left(byte) | old_carry;
                this.store_byte(abs_addr, shift);
                break;
            /*===========*/
            /*  ROR
            /*===========*/
            case Instruction.ROR_A: // ROR A
                var old_carry = (this.P & Flag.C);
                this.A = this.shift_right(this.A) | old_carry;
                break;
            case Instruction.ROR_ZP: // ROR $80
                var zp_addr = this.read_byte(this.PC);
                var byte = this.get_byte_from_zero_page();
                var old_carry = (this.P & Flag.C);
                var shift = this.shift_right(byte) | old_carry;
                this.store_byte(zp_addr, shift);
                break;
            case Instruction.ROR_ZPX: // ROR $80,X
                var add_register = this.get_reg_from_instruction(ins, -1);
                var zp_addr = this.intToByte(this.read_byte(this.PC) + this.X);
                var byte = this.get_byte_from_zero_page_add_XY(add_register);
                var old_carry = (this.P & Flag.C);
                var shift = this.shift_right(byte) | old_carry;
                this.store_byte(zp_addr, shift);
                break;
            case Instruction.ROR_ABS: // ROR $2200
                var abs_addr = this.read_word(this.PC);
                var byte = this.get_byte_absolute();
                var old_carry = (this.P & Flag.C);
                var shift = this.shift_right(byte) | old_carry;
                this.store_byte(abs_addr, shift);
                break;
            case Instruction.ROR_ABSX: // ROR $2200,X
                var add_register = this.get_reg_from_instruction(ins, -1);
                var abs_addr = this.intToWord(this.read_word(this.PC) + this.X);
                var byte = this.get_byte_absolute_XY(add_register);
                var old_carry = (this.P & Flag.C);
                var shift = this.shift_right(byte) | old_carry;
                this.store_byte(abs_addr, shift);
                break;
            case Instruction.RTI:
                this.P = this.pull_from_stack();
                this.PC = this.pull_PC_from_stack();
                break;
            case Instruction.RTS:
                this.PC = this.pull_PC_from_stack();
                break;
            /*===========*/
            /*  SBC     
            /*===========*/
            case Instruction.SBC_IM: // SBC #$80
                var byte = this.A;
                var byte2 = this.get_byte_immediate();
                this.A = this.subtract_with_carry(byte, byte2);
                break;
            case Instruction.SBC_ZP: // SBC $80
                var byte = this.A;
                var byte2 = this.get_byte_from_zero_page();
                this.A = this.subtract_with_carry(byte, byte2);
                break;
            case Instruction.SBC_ZPX: // SBC $80,X
                var byte = this.A;
                var byte2 = this.get_byte_from_zero_page_add_XY(Register.X);
                this.A = this.subtract_with_carry(byte, byte2);
                break;
            case Instruction.SBC_ABS: // SBC $2200
                var byte = this.A;
                var byte2 = this.get_byte_absolute();
                this.A = this.subtract_with_carry(byte, byte2);
                break;
            case Instruction.SBC_ABSX: // SBC $2200,X
            case Instruction.SBC_ABSY: // SBC $2200,Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_absolute_XY(add_register);
                this.A = this.subtract_with_carry(byte, byte2);
                break;
            case Instruction.SBC_INDX: // SBC ($80,X)
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_indexed_indirect_X(add_register);
                this.A = this.subtract_with_carry(byte, byte2);
                break;
            case Instruction.SBC_INDY: // SBC ($80),Y
                var add_register = this.get_reg_from_instruction(ins, -1);
                var byte = this.A;
                var byte2 = this.get_byte_indirect_indexed_Y(add_register);
                this.A = this.subtract_with_carry(byte, byte2);
                break;
            /*===========*/
            /*  Set Flags  
            /*===========*/
            case Instruction.SEC: // SEC
                this.set_flag(Flag.C);
                break;
            case Instruction.SED: // SED
                this.set_flag(Flag.D);
                break;
            case Instruction.SEI: // SEI
                this.set_flag(Flag.I);
                break;
            /*===========*/
            /*  STA|X|Y  
            /*===========*/
            case Instruction.STA_ZP: // STA $80
            case Instruction.STX_ZP: // STX $80
            case Instruction.STY_ZP: // STY $80
                var register = this.get_reg_from_instruction(ins, 2);
                this.store_register_zero_page(register);
                break;
            case Instruction.STA_ZPX: // STA $80,X
            case Instruction.STX_ZPY: // STX $80,Y
            case Instruction.STY_ZPX: // STY $80,X
                var register = this.get_reg_from_instruction(ins, 2);
                var add_register = this.get_reg_from_instruction(ins, -1);
                this.store_register_zero_page_add_XY(register, add_register);
                break;
            case Instruction.STA_ABS: // STA $2200
            case Instruction.STX_ABS: // STX $2200
            case Instruction.STY_ABS: // STY $2200
                var register = this.get_reg_from_instruction(ins, 2);
                this.store_register_absolute(register);
                break;
            case Instruction.STA_ABSX: // STA $2200,X    
            case Instruction.STA_ABSY: // STA $2200,Y   
                var register = this.get_reg_from_instruction(ins, 2);
                var add_register = this.get_reg_from_instruction(ins, -1);
                this.store_register_absolute_add_XY(register, add_register);
                break;
            case Instruction.STA_INDX: // STA ($2200,X)   
                var register = this.get_reg_from_instruction(ins, 2);
                var add_register = this.get_reg_from_instruction(ins, -1);
                this.store_register_indexed_indirect_X(register, add_register);
                break;
            case Instruction.STA_INDY: // STA (£2200),Y   
                var register = this.get_reg_from_instruction(ins, 2);
                var add_register = this.get_reg_from_instruction(ins, -1);
                this.store_register_indirect_indexed_Y(register, add_register);
                break;
            case Instruction.TAX: // TAX   
            case Instruction.TAY: // TAY
            case Instruction.TSX: // TSX
            case Instruction.TXA: // TXA
            case Instruction.TXS: // TXS
            case Instruction.TYA: // TYA  
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

    /*================================================*/
    /*            Helpers    
    /*================================================*/
    private intToByte(n: number): number {
        return n & 0xFF;
    }

    private intToWord(n: number): number {
        return n & 0xFFFF;
    }

    private get_reg_from_instruction(ins: Instruction, str_start_pos, register_str_length = 1): string {
        var ins_str: string = Instruction[<Instruction>ins].toString();
        let out = ins_str.substr(str_start_pos, register_str_length);
        return out;
    }

    /*================================================*/
    /*            Flags       
    /*================================================*/
    public check_flag(flag: number): boolean {
        return (this.P & flag) > 0;
    }

    public set_flag(flag: number, set: boolean = true) {
        if (set) {
            this.P |= flag;
        }
        else {
            this.P &= ~flag;
        }
    }

    private clear_flag(flag: number) {
        this.set_flag(flag, false);
    }

    private set_NZ_flags(value: number) {
        this.set_flag(Flag.N, this.check_if_negative(value));
        this.set_flag(Flag.Z, this.check_if_zero(value));
    }

    private check_if_negative(value: number): boolean {
        return (value & Flag.N) > 0;
    }

    private check_if_zero(value: number): boolean {
        return value == 0;
    }

    private check_overflow(old_byte: number, new_byte: number): boolean {
        return old_byte > new_byte;
    }

    private check_underflow(old_byte: number, new_byte: number): boolean {
        return old_byte < new_byte;
    }

    /*================================================*/
    /*            Implied Instructions
    /*================================================*/

    private decrement_register(register: string) {
        this[register]--;
    }

    private increment_register(register: string) {
        this[register]++;
    }

    private decrement_memory(addr: number) {
        let result = this.intToByte(this.read_byte(addr) - 1);
        this.store_byte(addr, result);
        this.set_flag(Flag.Z, this.check_if_zero(result));
        this.set_flag(Flag.N, this.check_if_negative(result));
    }

    private increment_memory(addr: number) {
        let result = this.intToByte(this.read_byte(addr) + 1);
        this.store_byte(addr, result);
        this.set_flag(Flag.Z, this.check_if_zero(result));
        this.set_flag(Flag.N, this.check_if_negative(result));
    }

    private no_operation() {
        this.increment_register(Register.PC);
    }

    /*================================================*/
    /*            Stack  
    /*================================================*/

    private get_current_stack_addr() {
        return 0x0100 + this.SP;
    }

    public push_to_stack(byte: number) {
        let addr = this.get_current_stack_addr();
        this.store_byte(addr, byte);
        this.decrement_register(Register.SP);
    }

    private push_PC_to_stack() {
        let addr = this.PC - 1;
        this.push_to_stack((addr >> 8) & 0xFF);
        this.push_to_stack(addr & 0xFF);
        // console.log(addr);
    }

    public pull_from_stack(): number {
        this.increment_register(Register.SP);
        let addr = this.get_current_stack_addr();
        let b = this.read_byte(addr);
        return b;
    }

    private pull_PC_from_stack(): number {
        var low_order = this.pull_from_stack();
        var high_order = this.pull_from_stack() << 8;
        return this.intToWord(high_order + low_order + 1);
    }

    /*================================================*/
    /*            Operations   
    /*================================================*/


    private add_with_carry(byte1: number, byte2: number) {
        let carry = this.check_flag(Flag.C) ? 1 : 0;
        let result = this.intToByte(byte1 + byte2 + carry);
        let carryCheck = this.check_overflow(byte1, result);
        this.set_flag(Flag.C, carryCheck);
        this.set_NZ_flags(result);
        return result;
    }

    private subtract_with_carry(byte1: number, byte2: number) {
        let carry = this.check_flag(Flag.C) ? 0 : 1;
        let result = this.intToByte(byte1 - byte2 - carry);
        let carryCheck = this.check_underflow(byte1, result);
        this.set_flag(Flag.C, carryCheck);
        this.set_NZ_flags(result);
        return result;
    }

    private logical_and(byte1: number, byte2: number) {
        return this.intToByte(byte1 & byte2);
    }

    private logical_or(byte1: number, byte2: number) {
        return this.intToByte(byte1 | byte2);
    }

    private xor(byte1: number, byte2: number) {
        return this.intToByte(byte1 ^ byte2);
    }

    private bit_test(byte1: number, byte2: number) {
        var bit_test = this.logical_and(byte1, byte2) > 0;
        var negative = this.logical_and(byte2, Flag.N) > 0;
        var overflow = this.logical_and(byte2, Flag.V) > 0;
        this.set_flag(Flag.Z, bit_test);
        this.set_flag(Flag.N, negative);
        this.set_flag(Flag.V, overflow);
    }

    private shift_left(byte: number) {
        let carryCheck = this.check_if_negative(byte)
        this.set_flag(Flag.C, carryCheck);
        let result = this.intToByte(byte << 1);
        this.set_NZ_flags(result);
        return result;
    }

    private shift_right(byte: number) {
        let carryCheck = (byte & 0x01) > 0;
        this.set_flag(Flag.C, carryCheck);
        let result = this.intToByte(byte >> 1);
        this.set_NZ_flags(result);
        return result;
    }

    private compare(byte1: number, byte2: number) {
        let result = byte1 - byte2;
        this.set_flag(Flag.C, result >= 0);
        this.set_flag(Flag.Z, result == 0);
        this.set_flag(Flag.N, result < 0);
    }

    /*================================================*/
    /*            Relative Instructions
    /*================================================*/

    private branch_if_true(condition: boolean) {
        let offset = this.fetch_byte() - 128;
        if (!condition) return;

        this.PC += offset;
    }



    /*================================================*/
    /*            Addressing     
    /*================================================*/

    private get_zero_page_addr() {
        return this.fetch_byte();
    }

    private get_zero_page_addr_add_XY(register: string) {
        let addr = this.fetch_byte();
        return this.intToByte(addr + this[register]);
    }

    private get_absolute_addr() {
        return this.fetch_word();
    }

    private get_absolute_addr_add_XY(register: string) {
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
    private get_indexed_indirect_addr_X(register: string) {
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
    private get_indirect_indexed_addr_X(register: string) {
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

    private fetch_byte(): number {
        let data = this.read_byte(this.PC);
        this.increment_register(Register.PC);
        this.debug_stack.push(data);
        if (this.print_bytes) {
            console.log(`ADDR: ${this.PC.toString(16)}`);
            console.log(`BYTE: ${data.toString(16)}`);
        }
        return data;
    }

    private fetch_word(): number {
        let data = this.read_word(this.PC);
        this.debug_stack.push(data & 0xFF);
        this.debug_stack.push((data >> 8) & 0xFF);
        this.increment_register(Register.PC);
        this.increment_register(Register.PC);
        return data;
    }

    private read_byte(addr: number): number {
        return this.memory.get(addr);
    }

    private read_word(addr: number): number {
        return this.memory.get_word(addr);
    }

    private get_byte_immediate() {
        return this.fetch_byte();
    }

    private get_byte_from_zero_page() {
        let addr = this.get_zero_page_addr();
        return this.read_byte(addr);
    }

    private get_byte_from_zero_page_add_XY(register: string) {
        let addr = this.get_zero_page_addr_add_XY(register);
        return this.read_byte(addr);
    }

    private get_byte_absolute() {
        let addr = this.get_absolute_addr();
        return this.read_byte(addr);
    }

    private get_byte_absolute_XY(register: string) {
        let addr = this.get_absolute_addr_add_XY(register);
        return this.read_byte(addr);
    }

    private get_byte_indexed_indirect_X(register: string) {
        let addr = this.get_indexed_indirect_addr_X(register);
        return this.read_byte(addr);
    }

    private get_byte_indirect_indexed_Y(register: string) {
        let addr = this.get_indirect_indexed_addr_X(register);
        return this.read_byte(addr);
    }

    /*================================================*/
    /*            Store Byte  
    /*================================================*/

    private store_byte(addr: number, byte: number) {
        this.memory.set(addr, byte);
    }

    private load_byte_into_register(register: string, byte: number) {
        this[register] = byte;
    }

    private store_register_zero_page(register: string) {
        let addr = this.get_zero_page_addr();
        this.store_byte(addr, this[register]);
    }

    private store_register_zero_page_add_XY(register: string, add_register: string) {
        let addr = this.get_zero_page_addr_add_XY(add_register);
        this.store_byte(addr, this[register]);
    }

    private store_register_absolute(register: string) {
        let addr = this.get_absolute_addr();
        this.store_byte(addr, this[register]);
    }

    private store_register_absolute_add_XY(register: string, add_register: string) {
        let addr = this.get_absolute_addr_add_XY(add_register);
        this.store_byte(addr, this[register]);
    }

    private store_register_indexed_indirect_X(register: string, add_register: string) {
        let addr = this.get_indexed_indirect_addr_X(add_register);
        this.store_byte(addr, this[register]);
    }

    private store_register_indirect_indexed_Y(register: string, add_register: string) {
        let addr = this.get_indirect_indexed_addr_X(add_register);
        this.store_byte(addr, this[register]);
    }

}
module.exports = CPU;