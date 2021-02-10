// @ts-expect-error - not a module - but this allows Jest test
import Flag from "./flag";
// @ts-expect-error - not a module - but this allows Jest test
import Instruction from  "./instruction";
// @ts-expect-error - not a module - but this allows Jest test
import Register from  "./register";

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
    
    memory: Memory
    print_bytes: boolean = false;
    brk_count :number = 0;
    public constructor(memory: Memory) {
        this.A = 0x00;
        this.X = 0x00;
        this.Y = 0x00;
        this.PC = 0xf000;
        this.SP = 0xff;
        this.P = Flag.CLR;     
        this.memory = memory;
    }

    public execute() {
         //TODO: stop when the program finishes
        while (this.PC !== 0) {
            let ins = this.fetch_byte();
            if(ins > 0 && this.brk_count > 0)
                this.brk_count = 0;
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
                case Instruction.BCC: // BCC 
                    var carry_clear = !this.check_flag(Flag.C);
                    this.branch_if_true(carry_clear);
                    break; 
                case Instruction.BCS: // BCS 
                    var carry_set = this.check_flag(Flag.C);
                    this.branch_if_true(carry_set);
                    break; 
                case Instruction.BEQ: // BEQ 
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
                case Instruction.BMI: // BMI 
                    var negative = this.check_flag(Flag.N);
                    this.branch_if_true(negative);
                    break; 
                case Instruction.BNE: // BMI 
                    var zero = !this.check_flag(Flag.Z);
                    this.branch_if_true(zero);
                    break; 
                case Instruction.BPL: // BMI 
                    var positive = !this.check_flag(Flag.N);
                    this.branch_if_true(positive);
                    break; 
                //TODO : BRK
                case Instruction.BRK: // BRK
                    //TODO: Clearing flag causings issues
                    // this.clear_flag(Flag.D);
                    if(this.brk_count % 3 == 0)
                        return;
                    this.brk_count++;
                    break;
                case Instruction.BVC: // BVC 
                    var overflow = !this.check_flag(Flag.V);
                    this.branch_if_true(overflow);
                    break; 
                case Instruction.BVS: // BVS 
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
                //TODO : DEC
                case Instruction.DEX: // DEX
                case Instruction.DEY: // DEY
                    var register = this.get_reg_from_instruction(ins, 2);
                    this.decrement_register(register);
                    this.set_NZ_flags(this[register]);
                    break;
                //TODO : EOR
                //TODO : INC
                /*===========*/
                /*  INC|X|Y 
                /*===========*/
                //TODO : INC
                case Instruction.INX: // INX
                case Instruction.INY: // INY
                    var register = this.get_reg_from_instruction(ins, 2);
                    this.increment_register(register);
                    this.set_NZ_flags(this[register]);
                    break;
                //TODO : JMP
                //TODO : JSR
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
                //TODO : LSR
                /*===========*/
                /*  NOP     
                /*===========*/
                case Instruction.NOP: // NOP
                    this.no_operation();
                    break;
                //TODO : ORA
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
                //TODO : ROL
                //TODO : ROR
                //TODO : RTI
                //TODO : RTS
                //TODO : SBC
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
    }

    /*================================================*/
    /*            Helpers    
    /*================================================*/
    private intToByte(n: number) : number{
        return n & 0xFF;
    }

    private intToWord(n: number) : number{
        return n & 0xFFFF;
    }

    private get_reg_from_instruction(ins : Instruction, str_start_pos, register_str_length = 1) : string{
        var ins_str : string = Instruction[<Instruction>ins].toString();
        let out = ins_str.substr(str_start_pos, register_str_length);
        return out;
    }

    /*================================================*/
    /*            Flags       
    /*================================================*/
    public check_flag(flag: number): boolean {
        return (this.P & flag) > 0;
    }

    public set_flag(flag: number, set: boolean = true){
        if(set){
            this.P |= flag;
        }
        else{
            this.P &= ~flag;
        }
    }

    private clear_flag(flag: number){
        this.set_flag(flag, false);
    }

    private set_NZ_flags(value: number) {
        this.set_flag(Flag.N, this.check_if_negative(value));
        this.set_flag(Flag.Z, this.check_if_zero(value));
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

    private check_if_negative(value: number): boolean{
        return (value & Flag.N) > 0;
    }

    private check_if_zero(value: number): boolean{
        return value == 0;
    }

    private check_overflow(old_byte: number, new_byte: number): boolean{
        return old_byte > new_byte;
    }

    private check_underflow(old_byte: number, new_byte: number): boolean{
        return old_byte < new_byte;
    }
    
    /*================================================*/
    /*            Implied Instructions
    /*================================================*/

    private decrement_register(register: string){
        this[register]--;
    }

    private increment_register(register: string){
        this[register]++;
    }
    
    private no_operation(){
        this.increment_register(Register.PC);
    }

    /*================================================*/
    /*            Stack  
    /*================================================*/

    private get_current_stack_addr(){
        return 0x0100 + this.SP;
    }

    private push_to_stack(byte: number){
        let addr = this.get_current_stack_addr();
        this.store_byte(addr, byte);
        this.decrement_register(Register.SP);
    }

    private pull_from_stack(): number{
        this.increment_register(Register.SP);
        let addr = this.get_current_stack_addr();
        let b = this.read_byte(addr);
        return b; 
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

    private add_with_carry(byte1:number, byte2:number){
        let carry = this.check_flag(Flag.C) ? 1 : 0;
        let result = this.intToByte(byte1 + byte2 + carry);
        let carryCheck = this.check_overflow(byte1, result);
        this.set_flag(Flag.C, carryCheck);
        this.set_NZ_flags(result);
        return result; 
    }

    private logical_and(byte1:number, byte2:number){
        return this.intToByte(byte1 & byte2);
    }

    private bit_test(byte1: number, byte2: number){
        var bit_test = this.logical_and(byte1, byte2) > 0;
        var negative = this.logical_and(byte2, Flag.N) > 0;
        var overflow = this.logical_and(byte2, Flag.V) > 0;
        this.set_flag(Flag.Z, bit_test);
        this.set_flag(Flag.N, negative);
        this.set_flag(Flag.V, overflow);
    }

    private shift_left(byte:number){
        let carryCheck = this.check_if_negative(byte)
        this.set_flag(Flag.C, carryCheck);
        let result = this.intToByte(byte << 1);
        this.set_NZ_flags(result);
        return result;
    }

    private compare(byte1: number, byte2: number){
        let result = byte1 - byte2;
        this.set_flag(Flag.C, result >= 0);
        this.set_flag(Flag.Z, result == 0);
        this.set_flag(Flag.N, result < 0);
    }

    /*================================================*/
    /*            Relative Instructions
    /*================================================*/

    private branch_if_true(condition: boolean){
        let offset = this.fetch_byte() - 128;
        if(!condition) return;

        this.PC += offset;
    }



    /*================================================*/
    /*            Addressing     
    /*================================================*/
    
    private get_zero_page_addr(){
        return this.fetch_byte();
    }

    private get_zero_page_addr_add_XY(register: string){
        let addr = this.fetch_byte();
        return this.intToByte(addr + this[register]);
    }

    private get_absolute_addr(){
        return this.fetch_word();
    }

    private get_absolute_addr_add_XY(register: string){
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
    private get_indexed_indirect_addr_X(register: string){
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
    private get_indirect_indexed_addr_X(register: string){
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
        if(this.print_bytes)
            console.log(data);
        return data;
    }

    private fetch_word(): number {
        let data = this.read_word(this.PC);
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

    private get_byte_immediate(){
        return this.fetch_byte();
    }

    private get_byte_from_zero_page(){
        let addr = this.get_zero_page_addr();
        return this.read_byte(addr);
    }

    private get_byte_from_zero_page_add_XY(register: string){
        let addr = this.get_zero_page_addr_add_XY(register);
        return this.read_byte(addr);
    }

    private get_byte_absolute(){
        let addr = this.get_absolute_addr();
        return this.read_byte(addr);
    }

    private get_byte_absolute_XY(register: string){
        let addr = this.get_absolute_addr_add_XY(register);
        return this.read_byte(addr);
    }

    private get_byte_indexed_indirect_X(register: string){
        let addr = this.get_indexed_indirect_addr_X(register);
        return this.read_byte(addr);
    }

    private get_byte_indirect_indexed_Y(register: string){
        let addr = this.get_indirect_indexed_addr_X(register);
        return this.read_byte(addr);
    }

    /*================================================*/
    /*            Store Byte  
    /*================================================*/

    private store_byte(addr: number, byte: number){
        this.memory.set(addr, byte);
    }

    private load_byte_into_register(register: string, byte: number){
        this[register] = byte;
    }

    private store_register_zero_page(register: string){
        let addr = this.get_zero_page_addr();
        this.store_byte(addr, this[register]);
    }

    private store_register_zero_page_add_XY(register: string, add_register: string){
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