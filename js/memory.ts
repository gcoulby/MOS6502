class Memory{
    MAX_MEM: number;
    Data: Uint8Array;

    constructor(random_bytes: boolean = false){
        // Set MAX_MEM to 64kb
        this.MAX_MEM = 1024 * 64;
        this.Data = new Uint8Array(this.MAX_MEM);

        // Initialise all byte
        for(let i = 0; i < this.MAX_MEM; i++)
		{
            this.Data[i] = 0;
            // random_bytes ? this.random_byte() : 0;
        }
    }

    get(addr: number) : number{
        return this.Data[addr];
    }

    // get_hex_string(addr: number){
    //     return this.pad(this.Data[addr].toString(16).toUpperCase(), 2);
    // }

    set(addr: number, value : number){
        this.Data[addr] = value;
    }

    get_word(addr: number) {
        // Example: ADDR    = 0x00F0
        //          0x00F0  = 0x42
        //          0x00F1  = 0x44
        //
        //            | base 16   | base 2                | base 10 |
        // -----------|-----------|-----------------------|---------|
        // 0x00F0     | 42        | 0100 0010             | 62      |
        // 0x00F1     | 44        | 0100 0100             | 68      |
        // 44 << 8    | 4400      | 0100 0100 0000 0000   | 17408   |
        // 4400 + 42  | 4442      | 0100 0100 0100 0010   | 17474   |
        return this.get(addr) + (this.get(addr + 1) << 8);
    }

    // random_byte(){
    //     return Math.floor(Math.random() * 256);  
    // }

    // pad(num: string, size: number) {
    //     var s = "000" + num;
    //     return s.substr(s.length-size);
    // }

    load_bytes(bytes: Uint8Array, addr: number){
        for(let i = 0; i < bytes.length; i++){
            this.set(addr + i, bytes[i]);
        }
    }
}

module.exports = Memory