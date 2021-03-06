var Instruction;
(function (Instruction) {
    //ADC - Add with Carry
    Instruction[Instruction["ADC_IM"] = 105] = "ADC_IM";
    Instruction[Instruction["ADC_ZP"] = 101] = "ADC_ZP";
    Instruction[Instruction["ADC_ZPX"] = 117] = "ADC_ZPX";
    Instruction[Instruction["ADC_ABS"] = 109] = "ADC_ABS";
    Instruction[Instruction["ADC_ABSX"] = 125] = "ADC_ABSX";
    Instruction[Instruction["ADC_ABSY"] = 121] = "ADC_ABSY";
    Instruction[Instruction["ADC_INDX"] = 97] = "ADC_INDX";
    Instruction[Instruction["ADC_INDY"] = 113] = "ADC_INDY";
    //AND - Logical AND
    Instruction[Instruction["AND_IM"] = 41] = "AND_IM";
    Instruction[Instruction["AND_ZP"] = 37] = "AND_ZP";
    Instruction[Instruction["AND_ZPX"] = 53] = "AND_ZPX";
    Instruction[Instruction["AND_ABS"] = 45] = "AND_ABS";
    Instruction[Instruction["AND_ABSX"] = 61] = "AND_ABSX";
    Instruction[Instruction["AND_ABSY"] = 57] = "AND_ABSY";
    Instruction[Instruction["AND_INDX"] = 33] = "AND_INDX";
    Instruction[Instruction["AND_INDY"] = 49] = "AND_INDY";
    //ASL - Arithmetic Shift Left
    Instruction[Instruction["ASL_A"] = 10] = "ASL_A";
    Instruction[Instruction["ASL_ZP"] = 6] = "ASL_ZP";
    Instruction[Instruction["ASL_ZPX"] = 22] = "ASL_ZPX";
    Instruction[Instruction["ASL_ABS"] = 14] = "ASL_ABS";
    Instruction[Instruction["ASL_ABSX"] = 30] = "ASL_ABSX";
    //BCC - Brach if Carry Clear
    Instruction[Instruction["BCC_REL"] = 144] = "BCC_REL";
    //BCS - Brach if Carry Set
    Instruction[Instruction["BCS_REL"] = 176] = "BCS_REL";
    //BEQ - Brach if Equal
    Instruction[Instruction["BEQ_REL"] = 240] = "BEQ_REL";
    //BIT
    Instruction[Instruction["BIT_ZP"] = 36] = "BIT_ZP";
    Instruction[Instruction["BIT_ABS"] = 44] = "BIT_ABS";
    //BMI - Branch if Negative
    Instruction[Instruction["BMI_REL"] = 48] = "BMI_REL";
    //BNE - Branch if Not Equal
    Instruction[Instruction["BNE_REL"] = 208] = "BNE_REL";
    //BPL - Branch if Positive
    Instruction[Instruction["BPL_REL"] = 16] = "BPL_REL";
    //BVC - Branch if Overflow Clear
    Instruction[Instruction["BVC_REL"] = 80] = "BVC_REL";
    //BVS - Branch if Overflow Set
    Instruction[Instruction["BVS_REL"] = 112] = "BVS_REL";
    //BRK - Break
    Instruction[Instruction["BRK"] = 0] = "BRK";
    //CLC - Clear Carry Flag
    Instruction[Instruction["CLC"] = 24] = "CLC";
    //CLD - Clear Decimal Flag
    Instruction[Instruction["CLD"] = 216] = "CLD";
    //CLI - Clear Interrupt Disable Flag
    Instruction[Instruction["CLI"] = 88] = "CLI";
    //CLV - Clear OverflowFlag
    Instruction[Instruction["CLV"] = 184] = "CLV";
    //CMP - Compare 
    Instruction[Instruction["CPA_IM"] = 201] = "CPA_IM";
    Instruction[Instruction["CPA_ZP"] = 197] = "CPA_ZP";
    Instruction[Instruction["CPA_ZPX"] = 213] = "CPA_ZPX";
    Instruction[Instruction["CPA_ABS"] = 205] = "CPA_ABS";
    Instruction[Instruction["CPA_ABSX"] = 221] = "CPA_ABSX";
    Instruction[Instruction["CPA_ABSY"] = 217] = "CPA_ABSY";
    Instruction[Instruction["CPA_INDX"] = 193] = "CPA_INDX";
    Instruction[Instruction["CPA_INDY"] = 209] = "CPA_INDY";
    //CPX
    Instruction[Instruction["CPX_IM"] = 224] = "CPX_IM";
    Instruction[Instruction["CPX_ZP"] = 228] = "CPX_ZP";
    Instruction[Instruction["CPX_ABS"] = 236] = "CPX_ABS";
    //CPY
    Instruction[Instruction["CPY_IM"] = 192] = "CPY_IM";
    Instruction[Instruction["CPY_ZP"] = 196] = "CPY_ZP";
    Instruction[Instruction["CPY_ABS"] = 204] = "CPY_ABS";
    //DEC
    Instruction[Instruction["DEC_ZP"] = 198] = "DEC_ZP";
    Instruction[Instruction["DEC_ZPX"] = 214] = "DEC_ZPX";
    Instruction[Instruction["DEC_ABS"] = 206] = "DEC_ABS";
    Instruction[Instruction["DEC_ABSX"] = 222] = "DEC_ABSX";
    //DEX - Decrement X Register
    Instruction[Instruction["DEX"] = 202] = "DEX";
    //DEY - Decrement Y Register
    Instruction[Instruction["DEY"] = 136] = "DEY";
    //EOR
    Instruction[Instruction["EOR_IM"] = 73] = "EOR_IM";
    Instruction[Instruction["EOR_ZP"] = 69] = "EOR_ZP";
    Instruction[Instruction["EOR_ZPX"] = 85] = "EOR_ZPX";
    Instruction[Instruction["EOR_ABS"] = 77] = "EOR_ABS";
    Instruction[Instruction["EOR_ABSX"] = 93] = "EOR_ABSX";
    Instruction[Instruction["EOR_ABSY"] = 89] = "EOR_ABSY";
    Instruction[Instruction["EOR_INDX"] = 65] = "EOR_INDX";
    Instruction[Instruction["EOR_INDY"] = 81] = "EOR_INDY";
    //INC
    Instruction[Instruction["INC_ZP"] = 230] = "INC_ZP";
    Instruction[Instruction["INC_ZPX"] = 246] = "INC_ZPX";
    Instruction[Instruction["INC_ABS"] = 238] = "INC_ABS";
    Instruction[Instruction["INC_ABSX"] = 254] = "INC_ABSX";
    //INX - Increment X Register
    Instruction[Instruction["INX"] = 232] = "INX";
    //INY - Increment X Register
    Instruction[Instruction["INY"] = 200] = "INY";
    //JMP - Jump
    Instruction[Instruction["JMP_ABS"] = 76] = "JMP_ABS";
    Instruction[Instruction["JMP_IND"] = 108] = "JMP_IND";
    //JSR - Jump to Subroutine
    Instruction[Instruction["JSR"] = 32] = "JSR";
    //LDA - Load A Register
    Instruction[Instruction["LDA_IM"] = 169] = "LDA_IM";
    Instruction[Instruction["LDA_ZP"] = 165] = "LDA_ZP";
    Instruction[Instruction["LDA_ZPX"] = 181] = "LDA_ZPX";
    Instruction[Instruction["LDA_ABS"] = 173] = "LDA_ABS";
    Instruction[Instruction["LDA_ABSX"] = 189] = "LDA_ABSX";
    Instruction[Instruction["LDA_ABSY"] = 185] = "LDA_ABSY";
    Instruction[Instruction["LDA_INDX"] = 161] = "LDA_INDX";
    Instruction[Instruction["LDA_INDY"] = 177] = "LDA_INDY";
    //LDX - Load X Register
    Instruction[Instruction["LDX_IM"] = 162] = "LDX_IM";
    Instruction[Instruction["LDX_ZP"] = 166] = "LDX_ZP";
    Instruction[Instruction["LDX_ZPY"] = 182] = "LDX_ZPY";
    Instruction[Instruction["LDX_ABS"] = 174] = "LDX_ABS";
    Instruction[Instruction["LDX_ABSY"] = 190] = "LDX_ABSY";
    //LDY - Load Y Register
    Instruction[Instruction["LDY_IM"] = 160] = "LDY_IM";
    Instruction[Instruction["LDY_ZP"] = 164] = "LDY_ZP";
    Instruction[Instruction["LDY_ZPX"] = 180] = "LDY_ZPX";
    Instruction[Instruction["LDY_ABS"] = 172] = "LDY_ABS";
    Instruction[Instruction["LDY_ABSX"] = 188] = "LDY_ABSX";
    //LSR - Logical Shift Right
    Instruction[Instruction["LSR_A"] = 74] = "LSR_A";
    Instruction[Instruction["LSR_ZP"] = 70] = "LSR_ZP";
    Instruction[Instruction["LSR_ZPX"] = 86] = "LSR_ZPX";
    Instruction[Instruction["LSR_ABS"] = 78] = "LSR_ABS";
    Instruction[Instruction["LSR_ABSX"] = 94] = "LSR_ABSX";
    //NOP - No Operation
    Instruction[Instruction["NOP"] = 234] = "NOP";
    //ORA - Logical ORA
    Instruction[Instruction["ORA_IM"] = 9] = "ORA_IM";
    Instruction[Instruction["ORA_ZP"] = 5] = "ORA_ZP";
    Instruction[Instruction["ORA_ZPX"] = 21] = "ORA_ZPX";
    Instruction[Instruction["ORA_ABS"] = 13] = "ORA_ABS";
    Instruction[Instruction["ORA_ABSX"] = 29] = "ORA_ABSX";
    Instruction[Instruction["ORA_ABSY"] = 25] = "ORA_ABSY";
    Instruction[Instruction["ORA_INDX"] = 1] = "ORA_INDX";
    Instruction[Instruction["ORA_INDY"] = 17] = "ORA_INDY";
    //PHA - Push Accumulator to Stack
    Instruction[Instruction["PHA"] = 72] = "PHA";
    //PHA - Push Accumulator to Stack
    Instruction[Instruction["PHP"] = 8] = "PHP";
    //PHA - Push Accumulator to Stack
    Instruction[Instruction["PLA"] = 104] = "PLA";
    //PHA - Push Accumulator to Stack
    Instruction[Instruction["PLP"] = 40] = "PLP";
    //RTI - Return from Interrupt
    Instruction[Instruction["RTI"] = 64] = "RTI";
    //RTS - Return from Subroutine
    Instruction[Instruction["RTS"] = 96] = "RTS";
    //ROL - Rotate Left
    Instruction[Instruction["ROL_A"] = 42] = "ROL_A";
    Instruction[Instruction["ROL_ZP"] = 38] = "ROL_ZP";
    Instruction[Instruction["ROL_ZPX"] = 54] = "ROL_ZPX";
    Instruction[Instruction["ROL_ABS"] = 46] = "ROL_ABS";
    Instruction[Instruction["ROL_ABSX"] = 62] = "ROL_ABSX";
    //ROR - Rotate Left
    Instruction[Instruction["ROR_A"] = 106] = "ROR_A";
    Instruction[Instruction["ROR_ZP"] = 102] = "ROR_ZP";
    Instruction[Instruction["ROR_ZPX"] = 118] = "ROR_ZPX";
    Instruction[Instruction["ROR_ABS"] = 110] = "ROR_ABS";
    Instruction[Instruction["ROR_ABSX"] = 126] = "ROR_ABSX";
    //SBC - subtract with Carry
    Instruction[Instruction["SBC_IM"] = 233] = "SBC_IM";
    Instruction[Instruction["SBC_ZP"] = 229] = "SBC_ZP";
    Instruction[Instruction["SBC_ZPX"] = 245] = "SBC_ZPX";
    Instruction[Instruction["SBC_ABS"] = 237] = "SBC_ABS";
    Instruction[Instruction["SBC_ABSX"] = 253] = "SBC_ABSX";
    Instruction[Instruction["SBC_ABSY"] = 249] = "SBC_ABSY";
    Instruction[Instruction["SBC_INDX"] = 225] = "SBC_INDX";
    Instruction[Instruction["SBC_INDY"] = 241] = "SBC_INDY";
    //SEC - Set Carry Flag
    Instruction[Instruction["SEC"] = 56] = "SEC";
    //SEC - Set Decimal Flag
    Instruction[Instruction["SED"] = 248] = "SED";
    //SEI - Set Interrupt Flag
    Instruction[Instruction["SEI"] = 120] = "SEI";
    //STA - Store A Register
    Instruction[Instruction["STA_ZP"] = 133] = "STA_ZP";
    Instruction[Instruction["STA_ZPX"] = 149] = "STA_ZPX";
    Instruction[Instruction["STA_ABS"] = 141] = "STA_ABS";
    Instruction[Instruction["STA_ABSX"] = 157] = "STA_ABSX";
    Instruction[Instruction["STA_ABSY"] = 153] = "STA_ABSY";
    Instruction[Instruction["STA_INDX"] = 129] = "STA_INDX";
    Instruction[Instruction["STA_INDY"] = 145] = "STA_INDY";
    //STX - Store X Register
    Instruction[Instruction["STX_ZP"] = 134] = "STX_ZP";
    Instruction[Instruction["STX_ZPY"] = 150] = "STX_ZPY";
    Instruction[Instruction["STX_ABS"] = 142] = "STX_ABS";
    //STY - Store Y Register
    Instruction[Instruction["STY_ZP"] = 132] = "STY_ZP";
    Instruction[Instruction["STY_ZPX"] = 148] = "STY_ZPX";
    Instruction[Instruction["STY_ABS"] = 140] = "STY_ABS";
    //TAX
    Instruction[Instruction["TAX"] = 170] = "TAX";
    Instruction[Instruction["TAY"] = 168] = "TAY";
    Instruction[Instruction["TSX"] = 186] = "TSX";
    Instruction[Instruction["TXA"] = 138] = "TXA";
    Instruction[Instruction["TXS"] = 154] = "TXS";
    Instruction[Instruction["TYA"] = 152] = "TYA";
})(Instruction || (Instruction = {}));
Object.freeze(Instruction);
module.exports = Instruction;
