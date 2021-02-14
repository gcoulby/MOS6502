// @ts-expect-error - not a module - but this allows Jest test
import Instruction from "./instruction";

interface Label{
    label_name: string;
    rel_addr: number;
    place_holder_byte: number;
}

class Assembler{
    lbl_ptn = RegExp('([a-zA-Z][a-zA-Z0-9]+)[:]');
    ins_ptn = RegExp('([ ]+|\t+)([a-zA-Z]{3})([ ]*|\t+)(.*)([;].*|)');
    im_ptn = RegExp('[#]([$]|)([0-9a-fA-F]{1,2})(?![0-9a-fA-F,])');
    zp_xy_ptn = RegExp('[$]()([0-9a-fA-F]{1,2})[,]([xX]|[yY])');
    zp_ptn = RegExp('[$]()([0-9a-fA-F]{1,2})(?![0-9a-fA-F,])');
    abs_ptn = RegExp('[$]()([0-9a-fA-F]{2})([0-9a-fA-F]{2})(?![0-9a-fA-F,])');
    abs_xy_ptn = RegExp('[$]()([0-9a-fA-F]{2})([0-9a-fA-F]{2})[,]([xX]|[yY])');
    labels : Label[] = new Array();
    bytes : number[] = new Array();
    memory: Memory;
    start_addr: number;

    public constructor(memory: Memory, start_addr: number){
        this.memory = memory;
        this.start_addr = start_addr;
    }

    public parse_line(str : string){
        // split str by ';' ignore comment
        let lbl = str.match(this.lbl_ptn);
        let ins = str.match(this.ins_ptn);

        if(lbl != undefined && lbl.length > 0){
            let label : Label = <Label>{label_name: lbl[1].trim(), rel_addr: this.bytes.length};
            if(!this.labels.includes(label))
                this.labels.push(label)
        }
        else if(ins != undefined && ins.length > 0){
            let instruction = ins[2] == "CMP" ? "CPA" : ins[2];
            let parameters = ins[4];
            let match : RegExpMatchArray = null; 

            if(Instruction[instruction]){
                //instruction is implied (e.g. BRK, DEX, TAX) and
                //requires no parameters
                this.push_instruction_byte(instruction, "");
            }
            else{
                console.log(`parameters: ${parameters}`);
                //Accumulator
                if(parameters == "A"){
                    this.push_instruction_byte(instruction, "_A");
                }
                //Immediate
                else if(match = parameters.match(this.im_ptn)){
                    this.push_instruction_byte(instruction, "_IM");
                    this.parse_parameters_single_byte(match);
                    //TODO: #HI|LO LABEL
                }
                //Zero Page,X|Y
                else if(match = parameters.match(this.zp_xy_ptn)){
                    let reg = match[3];
                    this.push_instruction_byte(instruction, "_ZP" + reg);
                    this.parse_parameters_single_byte(match);
                    //TODO: labels
                }
                //Zero Page
                else if(match = parameters.match(this.zp_ptn)){
                    this.push_instruction_byte(instruction, "_ZP");
                    this.parse_parameters_single_byte(match);
                    //TODO: labels
                }
                //TODO: Relative
                //TODO: Absolute,X|Y
                else if(match = parameters.match(this.abs_xy_ptn)){
                    let reg = match[4];
                    this.push_instruction_byte(instruction, "_ABS" + reg);
                    this.parse_parameters_word(match);
                    //TODO: labels
                }
                //TODO: Absolute
                else if(match = parameters.match(this.abs_ptn)){
                    this.push_instruction_byte(instruction, "_ABS");
                    this.parse_parameters_word(match);
                    //TODO: labels
                }
                //TODO: Indirect
                //TODO: Indexed Indirect X
                //TODO: Indirect Indexed Y
                // this.parse_instruction(instruction, parameters, this.im_ptn, "_IM");
            
            }
        }
    }
    
    public assemble(text: string): number[] {
        this.labels = new Array();
        this.bytes = new Array();
        let lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            this.parse_line(line);
        }
        // console.log(this.labels);
        // let b = ""
        // for (let i = 0; i < this.bytes.length; i++) {
        //     const byte = this.bytes[i];
        //     b += byte.toString(16).toUpperCase() + ",";
        // }
        // console.log(b);
        return this.bytes;
    }

    push_instruction_byte(instruction: string, suffix : string){
        let instruction_byte = Instruction[instruction + suffix];
        if(instruction_byte){
            this.bytes.push(instruction_byte);
        }
        else{
            console.log(`Error parsing byte ${this.bytes.length + 1}: ${instruction}${suffix} is not a valid instruction`)
        }
    }

    public parse_instruction(instruction: string, parameters: string, param_ptn : RegExp, ins_suffix : string){
        let byte = parameters.match(param_ptn);
        if(byte && byte.length > 0){
            //immediate
            this.push_instruction_byte(instruction, ins_suffix);
            this.bytes.push(parseInt(`0x${byte[1]}`));
        }
    }

    private parse_parameters_single_byte(match: RegExpMatchArray){
        // console.log(match);
        if(match.length > 0){
            //immediate
            this.bytes.push(parseInt(`0x${match[2]}`));
        }
    }

    private parse_parameters_word(match: RegExpMatchArray){
        // console.log(match);
        if(match.length > 0){
            //immediate
            this.bytes.push(parseInt(`0x${match[3]}`));
            this.bytes.push(parseInt(`0x${match[2]}`));
        }
    }

    // private parse_parameters_zero_page(match: RegExpMatchArray){
    //     console.log(match);
    //     if(match.length > 0){
    //         //immediate
    //         let byte = this.memory.get(parseInt(`0x${match[2]}`));
    //         this.bytes.push(byte);
    //     }
    // }
}
module.exports = Assembler;