import Instruction from '../instruction';
import Flag from '../flag';
import Memory from '../memory';
import CPU from '../cpu';

function get_CPU(PC = undefined, program = undefined, print_bytes = false){
    var cpu = new CPU();
    cpu.memory = new Memory();
    if(PC != undefined){
        cpu.PC = PC;
        
        if(program != undefined){
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

test('Memory is after instantiation 64kb', () => {
    let cpu = get_CPU();
    expect(cpu.memory.Data.length).toBe(1024 * 64);
});

test('Memory at 0xFF == 0x69 after storing value', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([0x69]));
    expect(cpu.memory.get(0xF000)).toBe(0x69);
});

test('Return $80, $0F as little endian word ($0F80)', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([0x80, 0x0F]));
    expect(cpu.fetch_word()).toBe(0x0F80);
});

test('Program loaded into memory at the correct address', () => {
    let cpu = get_CPU(0x0000, new Uint8Array([0xA9, 0x80, 0xA9, 0x69]));
    let byte1 = cpu.read_byte(0x0000);
    let byte2 = cpu.read_byte(0x0001);
    let byte3 = cpu.read_byte(0x0002);
    let byte4 = cpu.read_byte(0x0003);
    expect(byte1).toBe(0xA9);
    expect(byte2).toBe(0x80);
    expect(byte3).toBe(0xA9);
    expect(byte4).toBe(0x69);
});

test('Incrementing 8bit registers from 0xFF == 0x00', () => {
    let cpu = get_CPU();
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

test('Incrementing 16bit registers from 0xFF == 0x100', () => {
    let cpu = get_CPU();
    cpu.PC = 0xFF;
    cpu.PC++;
    expect(cpu.PC).toBe(0x100);
});


/*=============================================*/
/*    Flags
/*=============================================*/

// N Flag
test('N flag is set when value >= 128', () => {
    let cpu = get_CPU();
    for (let i = 128; i < 256; i++) {
        let val = cpu.check_if_negative(i); 
        cpu.set_flag(Flag.N, val);
        expect(cpu.check_flag(Flag.N)).toBe(true);
    }
});

test('N flag is not set when value < 128', () => {
    let cpu = get_CPU();
    for (let i = 0; i < 128; i++) {
        let val = cpu.check_if_negative(i); 
        cpu.set_flag(Flag.N, val);
        expect(cpu.check_flag(Flag.N)).toBe(false);
    }
});

// V Flag
test('V flag is set for $F0 + $20', () => {
    let cpu = get_CPU();
    let val = cpu.check_overflow(0xF0, 0x10); 
    cpu.set_flag(Flag.V, val);
    expect(cpu.check_flag(Flag.V)).toBe(true);
});

test('V flag is not set for $F0 + $04', () => {
    let cpu = get_CPU();
    let val = cpu.check_overflow(0xF0, 0xF4); 
    cpu.set_flag(Flag.V, val);
    expect(cpu.check_flag(Flag.V)).toBe(false);
});


//Z Flag
test('Z flag is set when value == 0', () => {
    let cpu = get_CPU();
    let val = cpu.check_if_zero(0x00); 
    cpu.set_flag(Flag.Z, val);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
});

test('Z flag is not set when value > 0', () => {
    let cpu = get_CPU();
    for (let i = 1; i < 256; i++) {
        let val = cpu.check_if_zero(i); 
        cpu.set_flag(Flag.Z, val);
        expect(cpu.check_flag(Flag.Z)).toBe(false);
    }
});

// Check flags set by on off commands
test('flags set by on/off commands can be set on with true', () => {
    let cpu = get_CPU();
    cpu.set_flag(Flag.B);
    expect(cpu.check_flag(Flag.B)).toBe(true);
    cpu.set_flag(Flag.D);
    expect(cpu.check_flag(Flag.D)).toBe(true);
    cpu.set_flag(Flag.I);
    expect(cpu.check_flag(Flag.I)).toBe(true);
});

test('flags set by on/off commands can be set off with false', () => {
    let cpu = get_CPU();
    cpu.set_flag(Flag.B, false);
    expect(cpu.check_flag(Flag.B)).toBe(false);
    cpu.set_flag(Flag.D, false);
    expect(cpu.check_flag(Flag.D)).toBe(false);
    cpu.set_flag(Flag.I, false);
    expect(cpu.check_flag(Flag.I)).toBe(false);
});


// C Flag
test('C flag is set for $F0 + $20 or for $10 - $20', () => {
    let cpu = get_CPU();
    let val = cpu.check_overflow(0xF0, 0x10);
    cpu.set_flag(Flag.C, val);
    expect(cpu.check_flag(Flag.C)).toBe(true);
});

test('C flag is set for $10 - $20', () => {
    let cpu = get_CPU();
    let val = cpu.check_underflow(0x10, 0xF0);
    cpu.set_flag(Flag.C, val);
    expect(cpu.check_flag(Flag.C)).toBe(true);
});

test('C flag is not set for $F0 + $04', () => {
    let cpu = get_CPU();
    let val = cpu.check_overflow(0xF0, 0xF4);
    cpu.set_flag(Flag.C, val);
    expect(cpu.check_flag(Flag.C)).toBe(false);
});

test('C flag is not set for $F4 - $04', () => {
    let cpu = get_CPU();
    let val = cpu.check_underflow(0xF4, 0xF0);
    cpu.set_flag(Flag.C, val);
    expect(cpu.check_flag(Flag.C)).toBe(false);
});

/*=============================================*/
/*    Implied Instructions
/*=============================================*/
test('NOP has no effect to the CPU', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.NOP]));
    cpu.execute();
    expect(cpu.A).toBe(0x00);
    expect(cpu.X).toBe(0x00);
    expect(cpu.Y).toBe(0x00);
    expect(cpu.P).toBe(Flag.CLR);
});

test('CLC clears the Carry flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CLC]));
    cpu.set_flag(Flag.C);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    cpu.execute();
    expect(cpu.check_flag(Flag.C)).toBe(false);
});

test('CLD clears the Decimal Mode flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CLD]));
    cpu.set_flag(Flag.D);
    expect(cpu.check_flag(Flag.D)).toBe(true);
    cpu.execute();
    expect(cpu.check_flag(Flag.D)).toBe(false);
});

test('CLI clears the Interrupt disable flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CLI]));
    cpu.set_flag(Flag.I);
    expect(cpu.check_flag(Flag.I)).toBe(true);
    cpu.execute();
    expect(cpu.check_flag(Flag.I)).toBe(false);
});

test('CLV clears the overflow flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CLV]));
    cpu.set_flag(Flag.V);
    expect(cpu.check_flag(Flag.V)).toBe(true);
    cpu.execute();
    expect(cpu.check_flag(Flag.V)).toBe(false);
});

test('DEX decrements the X register setting Zero flag when decremented from $01', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.DEX]));
    cpu.X = 0x01;
    cpu.execute();
    expect(cpu.X).toBe(0x00);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
});

test('DEY decrements the Y register setting Negative flag when decremented from $00', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.DEY]));
    cpu.Y = 0x00;
    cpu.execute();
    expect(cpu.Y).toBe(0xFF);
    expect(cpu.check_flag(Flag.N)).toBe(true);
});

test('INX increments the X register setting Zero flag when incremented from $FF', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.INX]));
    cpu.X = 0xFF;
    cpu.execute();
    expect(cpu.X).toBe(0x00);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
});

test('INY increments the Y register setting Negative flag when incremented from $127', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.INY]));
    cpu.Y = 0x7F;
    cpu.execute();
    expect(cpu.Y).toBe(0x80);
    expect(cpu.check_flag(Flag.N)).toBe(true);
});

test('PHA pushes $69 from the accumulator to the stack and decrements the stack pointer', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.PHA]));
    cpu.A = 0x69;
    cpu.execute();
    expect(cpu.memory.get(0x01FF)).toBe(0x69);
    expect(cpu.SP).toBe(0xFE);
});

test('PHP pushes the Processor status the stack and decrements the stack pointer', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.PHP]));
    cpu.set_flag(Flag.C);
    cpu.set_flag(Flag.Z);
    cpu.execute();
    expect(cpu.memory.get(0x01FF)).toBe(cpu.P);
    expect(cpu.SP).toBe(0xFE);
});

test('PLA pulls $69 from the stack, sets accumulator and decrements the stack pointer', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDA_IM, 0x69, Instruction.PHA, Instruction.LDA_IM, 0x00, Instruction.PLA]));
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.SP).toBe(0xFF);
});

test('PLP pulls Processor status from the stack, sets the P Register and decrements the stack pointer', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.SEC, Instruction.SED, Instruction.SEI, Instruction.PHP, Instruction.CLC, Instruction.CLD, Instruction.CLI, Instruction.PLP]));
    cpu.execute();
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.D)).toBe(true);
    expect(cpu.check_flag(Flag.I)).toBe(true);
    expect(cpu.SP).toBe(0xFF);
});

/*=============================================*/
/*    ADC
/*=============================================*/

test('ADC #$68 Adds to accumulator (#$01) to make 0x69 adding the carry, unsetting C flag once consumed', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ADC_IM, 0x68]));
    cpu.A = 0x00;
    cpu.set_flag(Flag.C);
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.check_flag(Flag.C)).toBe(false);
});

test('ADC #$68 Adds to accumulator (#$FE) to make 0x69 adding the carry, resetting C flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ADC_IM, 0x69]));
    cpu.A = 0xFF;
    cpu.set_flag(Flag.C);
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.check_flag(Flag.C)).toBe(true);
});

test('ADC $80 gets #$68 from ZP$80 and adds to accumulator (#$01) to make 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ADC_ZP, 0x80]));
    cpu.store_byte(0x80, 0x68);
    cpu.A = 0x01;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('ADC $80,X gets #$68 from $82 and adds to accumulator (#$01) to make 0x69 if X == $02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ADC_ZPX, 0x80]));
    cpu.store_byte(0x82, 0x68);
    cpu.A = 0x01;
    cpu.X = 0x02;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});


test('ADC $2200 gets #$69 from $2200 and adds to accumulator (#$01) to make 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ADC_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x68);
    cpu.A = 0x01;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('ADC $2200,X gets #$69 from $220F and adds to accumulator (#$01) to make 0x69 if X == #$0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ADC_ABSX, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x68);
    cpu.A = 0x01;
    cpu.X = 0x0F;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('ADC $2200,Y gets #$69 from $220F and adds to accumulator (#$01) to make 0x69 if Y == #$0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ADC_ABSY, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x68);
    cpu.A = 0x01;
    cpu.Y = 0x0F;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('ADC ($20,X) gets 0x68 from $3074 and adds to accumulator (#$01) to make 0x69 if X == 0x04', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ADC_INDX, 0x20]));
    cpu.store_byte(0x3074, 0x68);
    cpu.store_byte(0x24, 0x74);
    cpu.store_byte(0x25, 0x30);
    cpu.A = 0x01;
    cpu.X = 0x04;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('ADC ($0),Y gets 0x68 from $0310 and adds to accumulator (#$01) to make 0x69 if Y == 0x90', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ADC_INDY, 0x00]));
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

test('AND #$69 performs logical AND on accumulator (0xE9) to make 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.AND_IM, 0x69]));
    cpu.A = 0xE9;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('AND $80 gets #$69 from ZP$80 and performs a logical AND on accumulator (0xE9) to make 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.AND_ZP, 0x80]));
    cpu.store_byte(0x80, 0x69);
    cpu.A = 0xE9;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('AND $80,X gets #$68 from $82 performs a logical AND on accumulator (0xE9) to make 0x69 if X == $02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.AND_ZPX, 0x80]));
    cpu.store_byte(0x82, 0x69);
    cpu.A = 0xE9;
    cpu.X = 0x02;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('AND $2200 gets #$69 from $2200 and performs logical AND on accumulator (0xE9) to make 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.AND_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x69);
    cpu.A = 0xE9;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('AND $2200,X gets #$69 from $220F and performs logical AND on accumulator (0xE9) to make 0x69 if X == #$0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.AND_ABSX, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x69);
    cpu.A = 0xE9;
    cpu.X = 0x0F;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('AND $2200,Y gets #$69 from $220F and performs logical AND on accumulator (0xE9) to make 0x69 if Y == #$0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.AND_ABSY, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x69);
    cpu.A = 0xE9;
    cpu.Y = 0x0F;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('AND ($20,X) gets 0x69 from $3074 and performs a logical AND on accumulator (0xE9) to make 0x69 if X == 0x04', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.AND_INDX, 0x20]));
    cpu.store_byte(0x3074, 0x69);
    cpu.store_byte(0x24, 0x74);
    cpu.store_byte(0x25, 0x30);
    cpu.A = 0xE9;
    cpu.X = 0x04;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('AND ($0),Y gets 0x69 from $0310 and performs a logical AND on accumulator (0xE9) to make 0x69 if Y == 0x90', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.AND_INDY, 0x00]));
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

test('ASL A shifts accumulator (0x30) left 1 bit doubling the value to 0x60, C Flag not set', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ASL_A]));
    cpu.A = 0x30;
    cpu.execute();
    expect(cpu.A).toBe(0x60);
    expect(cpu.check_flag(Flag.C)).toBe(false);
});

test('ASL A shifts accumulator (0x128) left 1 bit setting the C flag and resulting in 0x00', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ASL_A]));
    cpu.A = 0x80;
    cpu.execute();
    expect(cpu.A).toBe(0x00);
    expect(cpu.check_flag(Flag.C)).toBe(true);
});

test('ASL $80 shifts ZP$80 (0x30) left 1 bit doubling the value to 0x60', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ASL_ZP, 0x80]));
    cpu.store_byte(0x80, 0x30);
    cpu.execute();
    expect(cpu.read_byte(0x80)).toBe(0x60);
});

test('ASL $80,X shifts ZP$82 (0x30) left 1 bit doubling the value to 0x60, if X == 02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ASL_ZPX, 0x80]));
    cpu.store_byte(0x82, 0x30);
    cpu.X = 0x02;
    cpu.execute();
    expect(cpu.read_byte(0x82)).toBe(0x60);
});

test('ASL $2200 shifts $2200 (0x30) left 1 bit doubling the value to 0x60', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ASL_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x30);
    cpu.execute();
    expect(cpu.read_byte(0x2200)).toBe(0x60);
});

test('ASL $2200,X shifts $220F (0x30) left 1 bit doubling the value to 0x60 if X == 0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.ASL_ABSX, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x30);
    cpu.X = 0x0F;
    cpu.execute();
    expect(cpu.read_byte(0x220F)).toBe(0x60);
});

/*=============================================*/
/*    Branching
/*=============================================*/

test('BCC skips setting A to 0 because Carry is clear, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BCC, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.X).toBe(0x69);
});

//TODO: Test Branch in negative direction once JSR/JMP is done 

test('BCC sets A to 0 because Carry is not clear, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BCC, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.set_flag(Flag.C);
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x0);
    expect(cpu.X).toBe(0x69);
});

test('BCS skips setting A to 0 because Carry is set, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BCS, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.set_flag(Flag.C);
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.X).toBe(0x69);
});

test('BCS sets A to 0 because Carry is clear, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BCS, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x0);
    expect(cpu.X).toBe(0x69);
});

test('BEQ skips setting A to 0 because Zero flag is set, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BEQ, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.set_flag(Flag.Z);
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.X).toBe(0x69);
});

test('BEQ sets A to 0 because Zero flag clear, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BEQ, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x0);
    expect(cpu.X).toBe(0x69);
});

test('BMI skips setting A to 0 because Negative flag is set, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BMI, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.set_flag(Flag.N);
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.X).toBe(0x69);
});

test('BMI sets A to 0 because Negative flag clear, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BMI, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x0);
    expect(cpu.X).toBe(0x69);
});

test('BNE skips setting A to 0 because Zero flag is clear, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BNE, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.X).toBe(0x69);
});

test('BNE sets A to 0 because Zero flag set, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BNE, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.set_flag(Flag.Z);
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x0);
    expect(cpu.X).toBe(0x69);
});

test('BPL skips setting A to 0 because Negative flag is clear, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BPL, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.X).toBe(0x69);
});

test('BPL sets A to 0 because Negative flag is set, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BPL, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.set_flag(Flag.N);
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x0);
    expect(cpu.X).toBe(0x69);
});

test('BVC skips setting A to 0 because Overflow flag clear, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BVC, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.X).toBe(0x69);
});

test('BVC sets A to 0 because Overflow flag is set, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BVC, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.set_flag(Flag.V);
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x0);
    expect(cpu.X).toBe(0x69);
});

test('BVS skips setting A to 0 because Overflow flag is set, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BVS, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.set_flag(Flag.V);
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
    expect(cpu.X).toBe(0x69);
});

test('BVS sets A to 0 because Overflow flag is clear, but X still set to 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BVS, 0x82, Instruction.LDA_IM, 0x00, Instruction.LDX_IM, 0x69]));
    cpu.A = 0x69;
    cpu.X = 0x00;
    cpu.execute();
    expect(cpu.A).toBe(0x0);
    expect(cpu.X).toBe(0x69);
});

/*=============================================*/
/*    BIT Test
/*=============================================*/

test('BIT $80 ANDs A (0x1E) with ZP$80 (0x3E), (both remain unchanged) Zero flag is set, but NV flags are not', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BIT_ZP, 0x80]));
    cpu.store_byte(0x80, 0x3E);
    cpu.A = 0x1E;
    cpu.execute();
    expect(cpu.A).toBe(0x1E);
    expect(cpu.read_byte(0x80)).toBe(0x3E);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
    expect(cpu.check_flag(Flag.V)).toBe(false);
});

test('BIT $80 ANDs A (0x1E) with ZP$80 (0x5E), (both remain unchanged) Z and V flags are set, N flag is not', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BIT_ZP, 0x80]));
    cpu.store_byte(0x80, 0x5E);
    cpu.A = 0x1E;
    cpu.execute();
    expect(cpu.A).toBe(0x1E);
    expect(cpu.read_byte(0x80)).toBe(0x5E);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
    expect(cpu.check_flag(Flag.V)).toBe(true);
});

test('BIT $80 ANDs A (0x1E) with ZP$80 (0x9E), (both remain unchanged) Z and N flags are set, V flag is not', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BIT_ZP, 0x80]));
    cpu.store_byte(0x80, 0x9E);
    cpu.A = 0x1E;
    cpu.execute();
    expect(cpu.A).toBe(0x1E);
    expect(cpu.read_byte(0x80)).toBe(0x9E);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(true);
    expect(cpu.check_flag(Flag.V)).toBe(false);
});

test('BIT $80 ANDs A (0x1E) with $2200 (0xDE), (both remain unchanged) ZNV flags are set', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.BIT_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0xDE);
    cpu.A = 0x1E;
    cpu.execute();
    expect(cpu.A).toBe(0x1E);
    expect(cpu.read_byte(0x2200)).toBe(0xDE);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(true);
    expect(cpu.check_flag(Flag.V)).toBe(true);
});



/*=============================================*/
/*    CMP
/*=============================================*/

test('CMP #$69 compares accumulator (0x69) with hex 0x69 setting the Z,C flag, but not N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPA_IM, 0x69]));
    cpu.A = 0x69;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

test('CPX #$69 compares X Register (0x69) with hex 0x6F setting the N flag, but not Z,C flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPX_IM, 0x6F]));
    cpu.X = 0x69;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(false);
    expect(cpu.check_flag(Flag.C)).toBe(false);
    expect(cpu.check_flag(Flag.N)).toBe(true);
});

test('CMP #$69 compares Y Register (0x6F) with hex 0x69 setting the C flag, but not Z,N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPY_IM, 0x69]));
    cpu.Y = 0x6F;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(false);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

test('CMP $80 compares accumulator (0x69) with hex ZP$80 (0x69) setting the Z,C flag, but not N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPA_ZP, 0x80]));
    cpu.store_byte(0x80, 0x69);
    cpu.A = 0x69;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

test('CPX $80 compares X Register (0x69) with hex ZP$80 (0x69) setting the Z,C flag, but not N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPX_ZP, 0x80]));
    cpu.store_byte(0x80, 0x69);
    cpu.X = 0x69;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

test('CPX $80 compares Y Register (0x69) with hex ZP$80 (0x69) setting the Z,C flag, but not N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPY_ZP, 0x80]));
    cpu.store_byte(0x80, 0x69);
    cpu.Y = 0x69;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});


test('CMP $80,X compares X Register (0x69) with hex ZP$82 (0x69) setting the Z,C flag, but not N flag if X==0x02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPA_ZPX, 0x80]));
    cpu.store_byte(0x82, 0x69);
    cpu.A = 0x69;
    cpu.X = 0x02;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});


test('CMP $2200 compares accumulator (0x69) with hex $2200 (0x69) setting the Z,C flag, but not N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPA_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x69);
    cpu.A = 0x69;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

test('CPX $2200 compares X Register (0x69) with hex $2200 (0x69) setting the Z,C flag, but not N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPX_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x69);
    cpu.X = 0x69;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

test('CPX $2200 compares Y Register (0x69) with hex $2200 (0x69) setting the Z,C flag, but not N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPY_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x69);
    cpu.Y = 0x69;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

test('CMP $2200,X compares accumulator (0x69) with hex $2202 (0x69) setting the Z,C flag, but not N flag if X==0x02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPA_ABSX, 0x00, 0x22]));
    cpu.store_byte(0x2202, 0x69);
    cpu.A = 0x69;
    cpu.X = 0x02;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

test('CMP $2200,Y compares accumulator (0x69) with hex $2202 (0x69) setting the Z,C flag, but not N flag if Y==0x02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPA_ABSY, 0x00, 0x22]));
    cpu.store_byte(0x2202, 0x69);
    cpu.A = 0x69;
    cpu.Y = 0x02;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

test('CMP ($20,X) gets 0x69 from $3074 and compares to accumulator (0x69) setting Z,C Flag but not N flag, if X == 0x04', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPA_INDX, 0x20]));
    cpu.store_byte(0x3074, 0x69);
    cpu.store_byte(0x24, 0x74);
    cpu.store_byte(0x25, 0x30);
    cpu.A = 0x69;
    cpu.X = 0x04;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

test('CMP ($0),Y gets 0x69 from $0310 and compares to on accumulator (0x69) setting Z,C Flag but not N flag, if Y == 0x90', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.CPA_INDY, 0x00]));
    cpu.store_byte(0x0310, 0x69);
    cpu.store_byte(0x00, 0x80);
    cpu.store_byte(0x01, 0x02);
    cpu.Y = 0x90;
    cpu.A = 0x69;
    cpu.execute();
    expect(cpu.check_flag(Flag.Z)).toBe(true);
    expect(cpu.check_flag(Flag.C)).toBe(true);
    expect(cpu.check_flag(Flag.N)).toBe(false);
});

/*=============================================*/
/*    DEC
/*=============================================*/

test('DEC $80 decrements ZP$80 (0x6A) to equal 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.DEC_ZP, 0x80]));
    cpu.store_byte(0x80, 0x6A);
    cpu.execute();
    expect(cpu.read_byte(0x80)).toBe(0x69);
    expect(cpu.check_flag(Flag.N)).toBe(false);
    expect(cpu.check_flag(Flag.Z)).toBe(false);
});

test('DEC $80,X decrements ZP$82 (0x01) to equal 0x00 setting Z flag, if X == 02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.DEC_ZPX, 0x80]));
    cpu.store_byte(0x82, 0x01);
    cpu.X = 0x02;
    cpu.execute();
    expect(cpu.read_byte(0x82)).toBe(0x00);
    expect(cpu.check_flag(Flag.N)).toBe(false);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
});

test('DEC $2200 decrements $2200 (0x00) to equal 0xFF setting N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.DEC_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x00);
    cpu.execute();
    expect(cpu.read_byte(0x2200)).toBe(0xFF);
    expect(cpu.check_flag(Flag.N)).toBe(true);
    expect(cpu.check_flag(Flag.Z)).toBe(false);
});

test('DEC $2200,X decrements $2202 (0x6A) to equal 0x69 if X==0x02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.DEC_ABSX, 0x00, 0x22]));
    cpu.store_byte(0x2202, 0x6A);
    cpu.X = 0x02;
    cpu.execute();
    expect(cpu.read_byte(0x2202)).toBe(0x69);
    expect(cpu.check_flag(Flag.N)).toBe(false);
    expect(cpu.check_flag(Flag.Z)).toBe(false);
});

/*=============================================*/
/*    EOR
/*=============================================*/

test('EOR #$69 performs Exclusive OR on accumulator (0x69) to make 0x00', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.EOR_IM, 0x69]));
    cpu.A = 0x69;
    cpu.execute();
    expect(cpu.A).toBe(0x00);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
});

test('EOR $80 gets #$69 from ZP$80 and performs a Exclusive OR on accumulator (0xE9) to make 0x80', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.EOR_ZP, 0x80]));
    cpu.store_byte(0x80, 0x69);
    cpu.A = 0xE9;
    cpu.execute();
    expect(cpu.A).toBe(0x80);
    expect(cpu.check_flag(Flag.N)).toBe(true);
});

test('EOR $80,X gets #$68 from $82 performs a Exclusive OR on accumulator (0xE9) to make 0x80 if X == $02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.EOR_ZPX, 0x80]));
    cpu.store_byte(0x82, 0x69);
    cpu.A = 0xE9;
    cpu.X = 0x02;
    cpu.execute();
    expect(cpu.A).toBe(0x80);
});

test('EOR $2200 gets #$69 from $2200 and performs Exclusive OR on accumulator (0xE9) to make 0x80', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.EOR_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x69);
    cpu.A = 0xE9;
    cpu.execute();
    expect(cpu.A).toBe(0x80);
});

test('EOR $2200,X gets #$69 from $220F and performs Exclusive OR on accumulator (0xE9) to make 0x80 if X == #$0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.EOR_ABSX, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x69);
    cpu.A = 0xE9;
    cpu.X = 0x0F;
    cpu.execute();
    expect(cpu.A).toBe(0x80);
});

test('EOR $2200,Y gets #$69 from $220F and performs Exclusive OR on accumulator (0xE9) to make 0x80 if Y == #$0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.EOR_ABSY, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x69);
    cpu.A = 0xE9;
    cpu.Y = 0x0F;
    cpu.execute();
    expect(cpu.A).toBe(0x80);
});

test('EOR ($20,X) gets 0x69 from $3074 and performs a Exclusive OR on accumulator (0xE9) to make 0x80 if X == 0x04', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.EOR_INDX, 0x20]));
    cpu.store_byte(0x3074, 0x69);
    cpu.store_byte(0x24, 0x74);
    cpu.store_byte(0x25, 0x30);
    cpu.A = 0xE9;
    cpu.X = 0x04;
    cpu.execute();
    expect(cpu.A).toBe(0x80);
});

test('EOR ($0),Y gets 0x69 from $0310 and performs a Exclusive OR on accumulator (0xE9) to make 0x80 if Y == 0x90', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.EOR_INDY, 0x00]));
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

test('INC $80 decrements ZP$80 (0x68) to equal 0x69', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.INC_ZP, 0x80]));
    cpu.store_byte(0x80, 0x68);
    cpu.execute();
    expect(cpu.read_byte(0x80)).toBe(0x69);
    expect(cpu.check_flag(Flag.N)).toBe(false);
    expect(cpu.check_flag(Flag.Z)).toBe(false);
});

test('INC $80,X decrements ZP$82 (0xFF) to equal 0x00 setting Z flag, if X == 02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.INC_ZPX, 0x80]));
    cpu.store_byte(0x82, 0xFF);
    cpu.X = 0x02;
    cpu.execute();
    expect(cpu.read_byte(0x82)).toBe(0x00);
    expect(cpu.check_flag(Flag.N)).toBe(false);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
});

test('INC $2200 decrements $2200 (0x) to equal 0xFF setting N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.INC_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x7F);
    cpu.execute();
    expect(cpu.read_byte(0x2200)).toBe(0x80);
    expect(cpu.check_flag(Flag.N)).toBe(true);
    expect(cpu.check_flag(Flag.Z)).toBe(false);
});

test('INC $2200,X decrements $2202 (0x68) to equal 0x69 if X==0x02', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.INC_ABSX, 0x00, 0x22]));
    cpu.store_byte(0x2202, 0x68);
    cpu.X = 0x02;
    cpu.execute();
    expect(cpu.read_byte(0x2202)).toBe(0x69);
    expect(cpu.check_flag(Flag.N)).toBe(false);
    expect(cpu.check_flag(Flag.Z)).toBe(false);
});



/*=============================================*/
/*    LDA
/*=============================================*/

test('LDA #$69 Loads 0x69 into A Register', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDA_IM, 0x69]));
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('LDA $80 Loads 0x69 from $80 into A Register', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDA_ZP, 0x80]));
    cpu.store_byte(0x80, 0x69);
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('LDA $80,X Loads 0x69 from $7f into A Register if X register is $FF', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDA_ZPX, 0x80]));
    cpu.store_byte(0x7f,0x69);
    cpu.X = 0xFF;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('LDA $2200 Loads 0x69 from $2200 into A Register', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDA_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x69);
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('LDA $2200,X Loads 0x69 from $220F into A Register if X register is $0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDA_ABSX, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x69);
    cpu.X = 0x0F;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('LDA $2200,Y Loads 0x69 from $220F into A Register if Y register is $0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDA_ABSY, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x69);
    cpu.Y = 0x0F;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('LDA ($20,X) Loads 0x69 from $3074 into A Register if X register is $04', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDA_INDX, 0x20]));
    cpu.store_byte(0x3074, 0x69);
    cpu.store_byte(0x24, 0x74);
    cpu.store_byte(0x25, 0x30);
    cpu.X = 0x04;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('LDA ($0),Y Loads 0x69 from $0310 into A Register if Y register is $90', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDA_INDY, 0x00]));
    cpu.store_byte(0x0310, 0x69);
    cpu.store_byte(0x00, 0x80);
    cpu.store_byte(0x01, 0x02);
    cpu.Y = 0x90;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('LDA ($0),Y does not carry when low order calculation is < 0xFF', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDA_INDY, 0x00]));
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

test('LDX #$69 Loads 0x69 into X Register', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDX_IM, 0x69]));
    cpu.execute();
    expect(cpu.X).toBe(0x69);
});

test('LDX $80 Loads 0x69 from $80 into X Register', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDX_ZP, 0x80]));
    cpu.store_byte(0x80, 0x69);
    cpu.execute();
    expect(cpu.X).toBe(0x69);
});

test('LDX $80,Y Loads 0x69 from $7f into X Register if Y register is $FF', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDX_ZPY, 0x80]));
    cpu.store_byte(0x7f,0x69);
    cpu.Y = 0xFF;
    cpu.execute();
    expect(cpu.X).toBe(0x69);
});

test('LDX $2200 Loads 0x69 from $2200 into X Register', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDX_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x69);
    cpu.execute();
    expect(cpu.X).toBe(0x69);
});

test('LDX $2200,Y Loads 0x69 from $220F into X Register if Y register is $0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDX_ABSY, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x69);
    cpu.Y = 0x0F;
    cpu.execute();
    expect(cpu.X).toBe(0x69);
});

/*=============================================*/
/*    LDY
/*=============================================*/

test('LDY #$69 Loads 0x69 into Y Register', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDY_IM, 0x69]));
    cpu.execute();
    expect(cpu.Y).toBe(0x69);
});

test('LDY $80 Loads 0x69 from $80 into X Register', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDY_ZP, 0x80]));
    cpu.store_byte(0x80, 0x69);
    cpu.execute();
    expect(cpu.Y).toBe(0x69);
});

test('LDY $80,X Loads 0x69 from $7f into X Register if X register is $FF', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDY_ZPX, 0x80]));
    cpu.store_byte(0x7f,0x69);
    cpu.X = 0xFF;
    cpu.execute();
    expect(cpu.Y).toBe(0x69);
});

test('LDY $2200 Loads 0x69 from $2200 into Y Register', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDY_ABS, 0x00, 0x22]));
    cpu.store_byte(0x2200, 0x69);
    cpu.execute();
    expect(cpu.Y).toBe(0x69);
});

test('LDY $2200,X Loads 0x69 from $220F into Y Register if X register is $0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.LDY_ABSX, 0x00, 0x22]));
    cpu.store_byte(0x220F, 0x69);
    cpu.X = 0x0F;
    cpu.execute();
    expect(cpu.Y).toBe(0x69);
});


/*=============================================*/
/*    STA - Store A Register
/*=============================================*/

test('STA $22 stores 0x69 from Register A into Zero Page memory @ $22', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STA_ZP, 0x22]));
    cpu.A = 0x69;
    cpu.execute();
    expect(cpu.memory.get(0x22)).toBe(0x69);
});

test('STA $80,X stores 0x69 from Register A into Zero Page memory @ $7F if X register is $FF', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STA_ZPX, 0x80]));
    cpu.A = 0x69;
    cpu.X = 0xFF;
    cpu.execute();
    expect(cpu.memory.get(0x7f)).toBe(0x69);
});

test('STA $2200 stores 0x69 from Register A into memory @ $2200', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STA_ABS, 0x00, 0x22]));
    cpu.A = 0x69;
    cpu.execute();
    expect(cpu.memory.get(0x2200)).toBe(0x69);
});

test('STA $2200,X stores 0x69 from Register A into memory @ $220F is X register is $0F', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STA_ABSX, 0x00, 0x22]));
    cpu.A = 0x69;
    cpu.X = 0x0F;
    cpu.execute();
    expect(cpu.memory.get(0x220F)).toBe(0x69);
});


test('STA ($20,X) stores 0x69 from Register A into memory @ $3074 if X register is $04', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STA_INDX, 0x20]));
    cpu.A = 0x69;
    cpu.store_byte(0x24, 0x74);
    cpu.store_byte(0x25, 0x30);
    cpu.X = 0x04;
    cpu.execute();
    expect(cpu.memory.get(0x3074)).toBe(0x69);
});

test('STA ($0),Y stores 0x69 from Register A into memory @ $0310 if Y register is $90', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STA_INDY, 0x00]));
    cpu.A = 0x69;
    cpu.store_byte(0x00, 0x80);
    cpu.store_byte(0x01, 0x02);
    cpu.Y = 0x90;
    cpu.execute();
    expect(cpu.memory.get(0x0310)).toBe(0x69);
});

test('STA ($0),Y does not carry when low order calculation is < 0xFF', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STA_INDY, 0x00]));
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

test('STX $22 stores 0x69 from Register X into Zero Page memory @ $22', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STX_ABS, 0x22]));
    cpu.X = 0x69;
    cpu.execute();
    expect(cpu.memory.get(0x22)).toBe(0x69);
});

test('STX $80,Y stores 0x69 from Register X into Zero Page memory @ $7F if Y register is $FF', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STX_ZPY, 0x80]));
    cpu.X = 0x69;
    cpu.Y = 0xFF;
    cpu.execute();
    expect(cpu.memory.get(0x7f)).toBe(0x69);
});


test('STX $2200 stores 0x69 from Register X into memory @ $2200', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STX_ABS, 0x00, 0x22]));
    cpu.X = 0x69;
    cpu.execute();
    expect(cpu.memory.get(0x2200)).toBe(0x69);
});


/*=============================================*/
/*    STY - Store Y Register
/*=============================================*/

test('STY $22 stores 0x69 from Register Y into Zero Page memory @ $22', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STY_ABS, 0x22]));
    cpu.Y = 0x69;
    cpu.execute();
    expect(cpu.memory.get(0x22)).toBe(0x69);
});

test('STY $80,X stores 0x69 from Register Y into Zero Page memory @ $7F if X register is $FF', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STY_ZPX, 0x80]));
    cpu.Y = 0x69;
    cpu.X = 0xFF;
    cpu.execute();
    expect(cpu.memory.get(0x7f)).toBe(0x69);
});


test('STY $2200 stores 0x69 from Register Y into memory @ $2200', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.STY_ABS, 0x00, 0x22]));
    cpu.Y = 0x69;
    cpu.execute();
    expect(cpu.memory.get(0x2200)).toBe(0x69);
});


/*=============================================*/
/*    TAX - Transfer
/*=============================================*/

test('TAX transfers 0x80 from Register A to Register X setting N flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.TAX]));
    cpu.A = 0x80;
    cpu.execute();
    expect(cpu.X).toBe(0x80);
    expect(cpu.check_flag(Flag.N)).toBe(true);
});

test('TAY transfers 0x00 from Register A to Register Y setting Z flag', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.TAY]));
    cpu.A = 0x00;
    cpu.Y = 0x69
    cpu.execute();
    expect(cpu.Y).toBe(0x00);
    expect(cpu.check_flag(Flag.Z)).toBe(true);
});

test('TSX transfers stack pointer to Register X', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.TSX]));
    cpu.execute();
    expect(cpu.X).toBe(cpu.SP);
});


test('TXA transfers 0x00 from Register X to Register A', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.TXA]));
    cpu.A = 0x00;
    cpu.X = 0x69;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});

test('TXS transfers Register X to stack pointer', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.TXS]));
    cpu.X = 0x69;
    cpu.execute();
    expect(cpu.SP).toBe(0x69);
});

test('TYA transfers 0x69 from Register Y to Register A', () => {
    let cpu = get_CPU(0xF000, new Uint8Array([Instruction.TYA]));
    cpu.A = 0x00;
    cpu.Y = 0x69;
    cpu.execute();
    expect(cpu.A).toBe(0x69);
});