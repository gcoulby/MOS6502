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
    Instruction[Instruction["ASL_ABSX"] = 29] = "ASL_ABSX";
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
    //DEX - Decrement X Register
    Instruction[Instruction["DEX"] = 202] = "DEX";
    //DEY - Decrement Y Register
    Instruction[Instruction["DEY"] = 136] = "DEY";
    //INX - Increment X Register
    Instruction[Instruction["INX"] = 232] = "INX";
    //INY - Increment X Register
    Instruction[Instruction["INY"] = 200] = "INY";
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
    //JMP
    Instruction[Instruction["JSR"] = 32] = "JSR";
    //NOP - No Operation
    Instruction[Instruction["NOP"] = 234] = "NOP";
    //PHA - Push Accumulator to Stack
    Instruction[Instruction["PHA"] = 72] = "PHA";
    //PHA - Push Accumulator to Stack
    Instruction[Instruction["PHP"] = 8] = "PHP";
    //PHA - Push Accumulator to Stack
    Instruction[Instruction["PLA"] = 104] = "PLA";
    //PHA - Push Accumulator to Stack
    Instruction[Instruction["PLP"] = 40] = "PLP";
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
