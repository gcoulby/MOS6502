enum Flag {
    N   = 0b10000000,
    V   = 0b01000000,
    B   = 0b00010000,
    D   = 0b00001000,
    I   = 0b00000100,
    Z   = 0b00000010,
    C   = 0b00000001,
    CLR = 0b00100000,
}
Object.freeze(Flag);
module.exports = Flag;