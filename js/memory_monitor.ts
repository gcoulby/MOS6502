class MemoryMonitor{
    memory: Memory;
    cpu: CPU;
    bank: string;
    //CPU Registers
    a_reg: HTMLElement;
    x_reg: HTMLElement;
    y_reg: HTMLElement;
    pc_reg: HTMLElement;
    sp_reg: HTMLElement;
    //CPU Flags
    n_flag: HTMLInputElement;
    v_flag: HTMLInputElement;
    b_flag: HTMLInputElement;
    d_flag: HTMLInputElement;
    i_flag: HTMLInputElement;
    z_flag: HTMLInputElement;
    c_flag: HTMLInputElement;
    //Monitor Table
    byte_body: HTMLElement;
    ascii_body: HTMLElement;

    constructor(memory: Memory, cpu: CPU){
        this.memory = memory;
        this.cpu = cpu;
        this.bank = "FF00";
        //CPU Registers
        this.a_reg = document.getElementById("a-reg");
        this.x_reg = document.getElementById("x-reg");
        this.y_reg = document.getElementById("y-reg");
        this.pc_reg = document.getElementById("pc-reg");
        this.sp_reg = document.getElementById("sp-reg");
        //CPU Flags
        this.n_flag = <HTMLInputElement> document.getElementById("n-flag");
        this.v_flag = <HTMLInputElement> document.getElementById("v-flag");
        this.b_flag = <HTMLInputElement> document.getElementById("b-flag");
        this.d_flag = <HTMLInputElement> document.getElementById("d-flag");
        this.i_flag = <HTMLInputElement> document.getElementById("i-flag");
        this.z_flag = <HTMLInputElement> document.getElementById("z-flag");
        this.c_flag = <HTMLInputElement> document.getElementById("c-flag");
        //Monitor table
        let byte_table = document.getElementById("memory-window");
        this.byte_body = byte_table.getElementsByTagName("tbody")[0];
        let ascii_table = document.getElementById("ascii-window");
        this.ascii_body = ascii_table.getElementsByTagName("tbody")[0];
    }

    update_memory_monitor(startAddr: string){
        //Initialise a variable to hold the new HTML data
        let byte_row = "";
        let ascii_row = "";
        
        //Clear the table ready for new data
        this.byte_body.innerHTML = "";
        this.ascii_body.innerHTML = "";

        //Loop through the memory banks and populate the table with byte data
        for(let i = hex2Int(startAddr); i < this.memory.Data.length; i++){
            // let ADDR = this.pad(i.toString(16).toUpperCase(), 4);
            let ADDR = int2Hex(i, 4);
            let byte = ADDR.substr(-2);
            let nybble = ADDR.substr(-1);
            let nybble_int = hex2Int(nybble);
            let data_val = this.memory.Data[i];
            let data = int2Hex(data_val, 2);
            let ascii = String.fromCharCode(data_val);
            
            if(data_val == 0)
                ascii = "."
                      
            if(ADDR == startAddr || nybble == "0"){
                byte_row += `<tr><td>${ADDR}</td>`
                ascii_row += `<tr>`
            }          
            if(ADDR == startAddr && nybble_int > 0)
            {
                for(let j = 0; j < nybble_int; j++){
                    byte_row += `<td >-</td>`
                    ascii_row += `<td></td>`
                }
            }
            byte_row += `<td class="${ADDR}" onmouseenter="memory_monitor.bank_mouseenter(this)" onmouseleave="memory_monitor.bank_mouseleave(this)">${data}</td>`
            ascii_row += `<td class="${ADDR}" onmouseenter="memory_monitor.bank_mouseenter(this)" onmouseleave="memory_monitor.bank_mouseleave(this)">${ascii}</td>`

            if(nybble == "F")
            {
                byte_row += "</tr>";
                ascii_row += "</tr>";
            }
            if(i == (hex2Int(this.bank) + 255)){

                if(nybble_int < 15)
                {
                    for(let j = 0; j < (15 - nybble_int); j++)
                    {
                        byte_row += `<td>-</td>`
                        ascii_row += `<td></td>`
                    }
                }
                break;
            }
        }
        this.byte_body.innerHTML += byte_row;
        this.ascii_body.innerHTML += ascii_row;
    }

    public update(){
        // Update CPU registers
        this.a_reg.innerHTML = int2Hex(this.cpu.A, 2, true);
        this.x_reg.innerHTML = int2Hex(this.cpu.X, 2, true);
        this.y_reg.innerHTML = int2Hex(this.cpu.Y, 2, true);
        this.pc_reg.innerHTML = int2Hex(this.cpu.PC, 4, true);
        this.sp_reg.innerHTML = int2Hex(this.cpu.SP, 4, true);

        //Update CPU Flags
        this.n_flag.checked = this.cpu.check_flag(Flag.N);
        this.v_flag.checked = this.cpu.check_flag(Flag.V);
        this.b_flag.checked = this.cpu.check_flag(Flag.B);
        this.d_flag.checked = this.cpu.check_flag(Flag.D);
        this.i_flag.checked = this.cpu.check_flag(Flag.I);
        this.z_flag.checked = this.cpu.check_flag(Flag.Z);
        this.c_flag.checked = this.cpu.check_flag(Flag.C);

        // Update memory monitor
        this.bank_select();
    }

    bank_select(){
        let bank = (<HTMLInputElement>document.getElementById("bank")).value;
        let memory_monitor_alert = document.getElementById("memory-monitor-alert");
        
        let bank_int = parseInt(bank, 16);
        if(bank_int <= 65535){
            //this.bank = this.pad(bank_int.toString(16).toUpperCase(), 4);
            this.bank = int2Hex(bank_int, 4);
            this.update_memory_monitor(this.bank);
            //let end_addr = this.pad((bank_int + 255).toString(16).toUpperCase(), 4); 
            let end_addr = int2Hex(bank_int + 255, 4);
            memory_monitor_alert.innerHTML = `Showing memory bank <span id="memory-bank" style="font-weight: 700;">\$${this.bank} - \$${end_addr}</span>`;
        }  
        else{
            memory_monitor_alert.innerHTML = "Cannot parse the address entered. Please enter a valid 4-16bit address"
        }      
    }

    bank_keypress(evt: KeyboardEvent){
        if(evt.key == "Enter"){
            this.bank_select();
        }  
    }

    bank_mouseenter(el){
        var els = document.getElementsByClassName(el.className);
        for(let i = 0; i < els.length; i++){
            els[i].classList.add("hovered");
        }
    }

    bank_mouseleave(el){
        let els = document.getElementsByClassName(el.classList[0]);
        
        for(let i = 0; i < els.length; i++){
            els[i].classList.remove("hovered");
        }
    }
}