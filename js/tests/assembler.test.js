import Instruction from '../instruction';
import Memory from '../memory';
import Assembler from '../assembler';

function get_assember(start_addr = 0x0600){
    let memory = new Memory();
    return new Assembler(memory, start_addr);
}

test('DEX assembles to a single byte', () => {
    let assembler = get_assember();
    let program = assembler.assemble("\tDEX $90");
    let comparison = [Instruction.DEX];
    expect(program).toStrictEqual(comparison);
});

test('LDA #80 assembles to LDA Immediate', () => {
    let assembler = get_assember();
    let program = assembler.assemble("\tLDA #80");
    let comparison = [Instruction.LDA_IM, 0x80];
    expect(program).toStrictEqual(comparison);
});

test('LDA $80 assembles to LDA Zero Page', () => {
    let assembler = get_assember();
    let program = assembler.assemble("\tLDA $80");
    let comparison = [Instruction.LDA_ZP, 0x80];
    expect(program).toStrictEqual(comparison);
});


test('LDA $80,X assembles to LDA Zero Page,X', () => {
    let assembler = get_assember();
    let program = assembler.assemble("\tLDA $80,X");
    let comparison = [Instruction.LDA_ZPX, 0x80];
    expect(program).toStrictEqual(comparison);
});

test('LDX $80,Y assembles to LDX Zero Page,Y', () => {
    let assembler = get_assember();
    let program = assembler.assemble("\tLDX $80,Y");
    let comparison = [Instruction.LDX_ZPY, 0x80];
    expect(program).toStrictEqual(comparison);
});

test('LDA $8000 assembles to LDA absolute, little endian', () => {
    let assembler = get_assember();
    let program = assembler.assemble("\tLDA $8000");
    let comparison = [Instruction.LDA_ABS, 0x00, 0x80];
    expect(program).toStrictEqual(comparison);
});

test('LDA $8000,X assembles to LDA absolute,X little endian', () => {
    let assembler = get_assember();
    let program = assembler.assemble("\tLDA $8000,X");
    let comparison = [Instruction.LDA_ABSX, 0x00, 0x80];
    expect(program).toStrictEqual(comparison);
});

test('LDA $8000,Y assembles to LDA absolute,Y little endian', () => {
    let assembler = get_assember();
    let program = assembler.assemble("\tLDA $8000,Y");
    let comparison = [Instruction.LDA_ABSY, 0x00, 0x80];
    expect(program).toStrictEqual(comparison);
});