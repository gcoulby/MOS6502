var memory : Memory
var memory_monitor : MemoryMonitor
var cpu : CPU
var code_editor : CodeEditor
var display : Display
var assembler :  Assembler;
var start_addr: number;

function int2Hex(n: number, pad: number, include_dollar: boolean = false): string{
    let s = "000" + n.toString(16);
    let hex = s.substr(s.length-pad).toUpperCase();
    return include_dollar ? `\$${hex}` : hex;
}

function hex2Int(hex: string): number{
    return parseInt(hex, 16);
}

function update(){
    memory_monitor.update();
    display.update();
    // let run_btn = <HTMLButtonElement> document.getElementById("run-btn");
    let step_btn = <HTMLButtonElement> document.getElementById("step-btn");
    let dump_btn = <HTMLButtonElement> document.getElementById("hex-dump-btn");
    let reset_btn = <HTMLButtonElement> document.getElementById("reset-btn");
    // run_btn.disabled = cpu.loaded_program == null;
    step_btn.disabled = cpu.loaded_program == null;
    dump_btn.disabled = cpu.loaded_program == null;
    reset_btn.disabled = cpu.loaded_program == null;
    if(cpu.loaded_program != null){
    }
}

function add_event_listeners(){
    let assemble_btn = <HTMLButtonElement> document.getElementById("assemble-btn");
    let run_btn = <HTMLButtonElement> document.getElementById("run-btn");
    let step_btn = <HTMLButtonElement> document.getElementById("step-btn");
    let dump_btn = <HTMLButtonElement> document.getElementById("hex-dump-btn");
    let reset_btn = <HTMLButtonElement> document.getElementById("reset-btn");
    let clipboard_btn = <HTMLButtonElement> document.getElementById("clipboard-btn");
    assemble_btn.addEventListener("click", function(){
        let program = assembler.assemble(code_editor.textarea.value);
        cpu.load_program(program);
        update();
    });
    run_btn.addEventListener("click", function(){
        cpu.execute();
        update();
    });
    step_btn.addEventListener("click", function(){
        cpu.step();
        update();
    });
    dump_btn.addEventListener("click", function(){
        let output = "";
        for (let i = 0; i < cpu.loaded_program.length; i++) {   
            const byte = cpu.loaded_program[i];  
            let hex = byte.toString(16).toUpperCase();
            let s = "000" + hex;
            output += s.substr(s.length-2) + " ";
        }
        console.log(output.trim());
        update();
    });
    reset_btn.addEventListener("click", function(){
        memory = new Memory();
        cpu.reset(memory, start_addr);
        memory_monitor = new MemoryMonitor(memory, cpu);
        update();
    });
    clipboard_btn.addEventListener("click", function(){
        code_editor.textarea.select();
        document.execCommand("copy");
        update();
    });

}

(function main(args : string[] = null){
    memory = new Memory();
    display = new Display(memory);
    start_addr = display.end_addr + 1;
    console.log(start_addr);
    code_editor = new CodeEditor();
    assembler = new Assembler();
    cpu = new CPU(memory, start_addr);
    add_event_listeners();

    console.log(cpu);
    


    memory_monitor = new MemoryMonitor(memory, cpu);
    memory_monitor.bank_select();
    
    // // cpu.A = 0xFF;
    // // cpu.A+=2;
    // // console.log(cpu.A);
    
    // // // let program = new Uint8Array([Instruction.LDA_IM, 0x80]);
    // // memory.set(0xff00, 0x69);
    // // let program = new Uint8Array([Instruction.LDA_IM, 0x69, 0xff]);
    // // memory.load_bytes(program, 0xF000);
    // hello();


    // let program = new Uint8Array([Instruction.ADC_IM, 0x68]);

    // // memory.load_bytes(program, 0xF000);
    // // memory.set(0x3074, 0x69);
    // // memory.set(0x24, 0x74);
    // // memory.set(0x25, 0x30);
    // cpu.set_flag(Flag.C);

    // cpu.execute();

    // memory.set(0x7F, 0x79);
    // memory.set(0x807F, 0x59);
    // memory.set(0x0200, 0x01);
    update();
})()


function hello(){
    let gfx = new Uint8Array([
        //Row1
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x00, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x02, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x04, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x05, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x06, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x08, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x0C, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x10, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x11, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x12, 0x02,
        
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x20, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x22, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x24, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x28, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x2C, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x30, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x32, 0x02,

        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x40, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x41, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x42, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x44, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x45, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x48, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x4C, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x50, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x52, 0x02,

        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x60, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x62, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x64, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x68, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x6C, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x70, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x72, 0x02,
        
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x80, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x82, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x84, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x85, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x86, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x84, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x88, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x89, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x8A, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x8C, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x8D, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x8E, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x90, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x91, 0x02,
        Instruction.LDA_IM, 0x01, 
        Instruction.STA_ABS, 0x92, 0x02,
    ]);
    memory.load_bytes(gfx,0xF000);
}