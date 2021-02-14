enum Instruction {
    //ADC - Add with Carry
    ADC_IM      = 0x69,
    ADC_ZP      = 0x65,
    ADC_ZPX     = 0x75,
    ADC_ABS     = 0x6D,
    ADC_ABSX    = 0x7D,
    ADC_ABSY    = 0x79,
    ADC_INDX    = 0x61,
    ADC_INDY    = 0x71,
    //AND - Logical AND
    AND_IM      = 0x29,
    AND_ZP      = 0x25,
    AND_ZPX     = 0x35,
    AND_ABS     = 0x2D,
    AND_ABSX    = 0x3D,
    AND_ABSY    = 0x39,
    AND_INDX    = 0x21,
    AND_INDY    = 0x31,
    //ASL - Arithmetic Shift Left
    ASL_A       = 0x0A,
    ASL_ZP      = 0x06,
    ASL_ZPX     = 0x16,
    ASL_ABS     = 0x0E,
    ASL_ABSX    = 0x1E,
    //BCC - Brach if Carry Clear
    BCC_REL     = 0x90,
    //BCS - Brach if Carry Set
    BCS_REL     = 0xB0,
    //BEQ - Brach if Equal
    BEQ_REL     = 0xF0,
    //BIT
    BIT_ZP      = 0x24,
    BIT_ABS     = 0x2C,
    //BMI - Branch if Negative
    BMI_REL     = 0x30,
    //BNE - Branch if Not Equal
    BNE_REL     = 0xD0,
    //BPL - Branch if Positive
    BPL_REL     = 0x10,
    //BVC - Branch if Overflow Clear
    BVC_REL     = 0x50,
    //BVS - Branch if Overflow Set
    BVS_REL     = 0x70,
    //BRK - Break
    BRK         = 0x00,
    //CLC - Clear Carry Flag
    CLC         = 0x18,
    //CLD - Clear Decimal Flag
    CLD         = 0xD8,
    //CLI - Clear Interrupt Disable Flag
    CLI         = 0x58,
    //CLV - Clear OverflowFlag
    CLV         = 0xB8,
    //CMP - Compare 
    CPA_IM      = 0xC9,
    CPA_ZP      = 0xC5,
    CPA_ZPX     = 0xD5,
    CPA_ABS     = 0xCD,
    CPA_ABSX    = 0xDD,
    CPA_ABSY    = 0xD9,
    CPA_INDX    = 0xC1,
    CPA_INDY    = 0xD1,
    //CPX
    CPX_IM      = 0xE0,
    CPX_ZP      = 0xE4,
    CPX_ABS     = 0xEC,
    //CPY
    CPY_IM      = 0xC0,
    CPY_ZP      = 0xC4,
    CPY_ABS     = 0xCC,
    //DEC
    DEC_ZP      = 0xC6,
    DEC_ZPX     = 0xD6,
    DEC_ABS     = 0xCE,
    DEC_ABSX    = 0xDE,
    //DEX - Decrement X Register
    DEX         = 0xCA,
    //DEY - Decrement Y Register
    DEY         = 0x88,
    //EOR
    EOR_IM      = 0x49,
    EOR_ZP      = 0x45,
    EOR_ZPX     = 0x55,
    EOR_ABS     = 0x4D,
    EOR_ABSX    = 0x5D,
    EOR_ABSY    = 0x59,
    EOR_INDX    = 0x41,
    EOR_INDY    = 0x51,
    //INC
    INC_ZP      = 0xE6,
    INC_ZPX     = 0xF6,
    INC_ABS     = 0xEE,
    INC_ABSX    = 0xFE,
    //INX - Increment X Register
    INX         = 0xE8,
    //INY - Increment X Register
    INY         = 0xC8,
    //JMP - Jump
    JMP_ABS     = 0x4C,
    JMP_IND     = 0x6C,
    //JSR - Jump to Subroutine
    JSR         = 0x20,
    //LDA - Load A Register
    LDA_IM      = 0xA9,
    LDA_ZP      = 0xA5,
    LDA_ZPX     = 0xB5,
    LDA_ABS     = 0xAD,
    LDA_ABSX    = 0xBD,
    LDA_ABSY    = 0xB9,
    LDA_INDX    = 0xA1,
    LDA_INDY    = 0xB1,
    //LDX - Load X Register
    LDX_IM      = 0xA2,
    LDX_ZP      = 0xA6,
    LDX_ZPY     = 0xB6,
    LDX_ABS     = 0xAE,
    LDX_ABSY    = 0xBE,
    //LDY - Load Y Register
    LDY_IM      = 0xA0,
    LDY_ZP      = 0xA4,
    LDY_ZPX     = 0xB4,
    LDY_ABS     = 0xAC,
    LDY_ABSX    = 0xBC,
    //LSR - Logical Shift Right
    LSR_A       = 0x4A,
    LSR_ZP      = 0x46,
    LSR_ZPX     = 0x56,
    LSR_ABS     = 0x4E,
    LSR_ABSX    = 0x5E,
    //NOP - No Operation
    NOP         = 0xEA,
    //ORA - Logical ORA
    ORA_IM      = 0x09,
    ORA_ZP      = 0x05,
    ORA_ZPX     = 0x15,
    ORA_ABS     = 0x0D,
    ORA_ABSX    = 0x1D,
    ORA_ABSY    = 0x19,
    ORA_INDX    = 0x01,
    ORA_INDY    = 0x11,
    //PHA - Push Accumulator to Stack
    PHA         = 0x48,
    //PHA - Push Accumulator to Stack
    PHP         = 0x08,
    //PHA - Push Accumulator to Stack
    PLA         = 0x68,
    //PHA - Push Accumulator to Stack
    PLP         = 0x28,
    //RTI - Return from Interrupt
    RTI         = 0x40,
    //RTS - Return from Subroutine
    RTS         = 0x60,
    //ROL - Rotate Left
    ROL_A       = 0x2A,
    ROL_ZP      = 0x26,
    ROL_ZPX     = 0x36,
    ROL_ABS     = 0x2E,
    ROL_ABSX    = 0x3E,
    //ROR - Rotate Left
    ROR_A       = 0x6A,
    ROR_ZP      = 0x66,
    ROR_ZPX     = 0x76,
    ROR_ABS     = 0x6E,
    ROR_ABSX    = 0x7E,
    //SBC - subtract with Carry
    SBC_IM      = 0xE9,
    SBC_ZP      = 0xE5,
    SBC_ZPX     = 0xF5,
    SBC_ABS     = 0xED,
    SBC_ABSX    = 0xFD,
    SBC_ABSY    = 0xF9,
    SBC_INDX    = 0xE1,
    SBC_INDY    = 0xF1,
    //SEC - Set Carry Flag
    SEC         = 0x38,
    //SEC - Set Decimal Flag
    SED         = 0xF8,
    //SEI - Set Interrupt Flag
    SEI         = 0x78,
    //STA - Store A Register
    STA_ZP      = 0x85,
    STA_ZPX     = 0x95,
    STA_ABS     = 0x8D,
    STA_ABSX    = 0x9D,
    STA_ABSY    = 0x99,
    STA_INDX    = 0x81,
    STA_INDY    = 0x91,
    //STX - Store X Register
    STX_ZP      = 0x86,
    STX_ZPY     = 0x96,
    STX_ABS     = 0x8E,
    //STY - Store Y Register
    STY_ZP      = 0x84,
    STY_ZPX     = 0x94,
    STY_ABS     = 0x8C,
    //TAX
    TAX         = 0xAA,
    TAY         = 0xA8,
    TSX         = 0xBA,
    TXA         = 0x8A,
    TXS         = 0x9A,
    TYA         = 0x98,
}
Object.freeze(Instruction);
module.exports = Instruction;