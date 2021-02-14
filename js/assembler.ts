// // @ts-expect-error - not a module - but this allows Jest test
// import Instruction from "./instruction";

interface Label{
    label_name: string;
    // rel_addr: number;
    placeholder_byte: number;
}

class Assembler{
    lbl_ptn = RegExp('([a-zA-Z][a-zA-Z0-9]+)[:]');
    ins_ptn = RegExp('([ ]+|\t+)([a-zA-Z]{3})([ ]*|\t+)(.*)([;].*|)');
    im_ptn = RegExp('[#]([$]|)([0-9a-fA-F]{1,2})(?![0-9a-fA-F,])');
    zp_xy_ptn = RegExp('(?<![(])[$]()([0-9a-fA-F]{1,2})[,]([xX]|[yY])');
    zp_ptn = RegExp('(?<![(])[$]()([0-9a-fA-F]{1,2})(?![0-9a-fA-F,])');
    abs_ptn = RegExp('(?<![(])[$]([0-9a-fA-F]{2})([0-9a-fA-F]{2})(?![0-9a-fA-F,])');
    abs_xy_ptn = RegExp('(?<![(])[$]([0-9a-fA-F]{2})([0-9a-fA-F]{2})[,]([xX]|[yY])');
    ind_ptn = RegExp('[(][$]([0-9a-fA-F]{2})([0-9a-fA-F]{2})[)]');
    ind_x_ptn = RegExp('[(][$]()([0-9a-fA-F]{2})[,]([xX])[)]');
    ind_y_ptn = RegExp('[(][$]()([0-9a-fA-F]{2})[)][,]([yY])');
    label_ptn = RegExp('([a-zA-Z][0-9a-zA-Z]+)');
    labels : Label[] = new Array();
    bytes : (number|Label)[]  = new Array();
    start_addr: number;
    placeholder_byte: number = -1;

    public constructor(start_addr: number = 0x0600){
        this.start_addr = start_addr;
    }

    public parse_line(str : string){
        let lbl = str.match(this.lbl_ptn);
        let ins = str.match(this.ins_ptn);

        // Check for labels first
        if(lbl != undefined && lbl.length > 0){
            let label : Label = this.labels.find(l => l.label_name == lbl[1].toUpperCase().trim());
            if(label == undefined){
                let label : Label = <Label>{label_name: lbl[1].toUpperCase().trim()};
                this.labels.push(label);
                this.bytes.push(label);
            }
            else{
                this.bytes.push(label);
                // label.rel_addr = this.bytes.length;
            }
        }
        // Then check instructions
        else if(ins != undefined && ins.length > 0){
            /*
            CPA was used to match the format of CPX, CPY 
            This way the 3rd letter can be queried to know
            which register to compare. CMP therefore must
            be changed to CPA.
            */
            let instruction = ins[2] == "CMP" ? "CPA" : ins[2]; 
            let parameters = ins[4].trim();
            let match : RegExpMatchArray = null; 
            //Check for implied instructions
            if(Instruction[instruction]){
                //instruction is implied (e.g. BRK, DEX, TAX) and
                //requires no parameters
                this.push_instruction_byte(instruction, "");
            }
            /*
            Check for other instructons and query the paramter 
            format to understand which addressing mode to use
            for each instruction
            */
            else{
                //Accumulator
                if(parameters == "A"){
                    this.push_instruction_byte(instruction, "_A");
                }
                //Label
                else if(match = parameters.match(this.label_ptn)){
                    //this.push_instruction_byte(instruction, "_IM");
                    // this.parse_parameters_byte(match);
                    this.parse_parameters_label(match, instruction, parameters);
                }
                //Immediate
                else if(match = parameters.match(this.im_ptn)){
                    this.push_instruction_byte(instruction, "_IM");
                    this.parse_parameters_byte(match);
                    //TODO: #HI|LO LABEL
                }
                //Zero Page,X|Y
                else if(match = parameters.match(this.zp_xy_ptn)){
                    let reg = match[3];
                    this.push_instruction_byte(instruction, "_ZP" + reg);
                    this.parse_parameters_byte(match);
                }
                //Zero Page
                else if(match = parameters.match(this.zp_ptn)){
                    this.push_instruction_byte(instruction, "_ZP");
                    this.parse_parameters_byte(match);
                }
                //TODO: Relative
                //Absolute,X|Y
                else if(match = parameters.match(this.abs_xy_ptn)){
                    let reg = match[3];
                    this.push_instruction_byte(instruction, "_ABS" + reg);
                    this.parse_parameters_word(match);
                }
                //Absolute
                else if(match = parameters.match(this.abs_ptn)){
                    this.push_instruction_byte(instruction, "_ABS");
                    this.parse_parameters_word(match);
                }
                //Indirect
                else if(match = parameters.match(this.ind_ptn)){
                    this.push_instruction_byte(instruction, "_IND");
                    this.parse_parameters_word(match);
                }
                //Indexed Indirect X
                else if(match = parameters.match(this.ind_x_ptn)){
                    this.push_instruction_byte(instruction, "_INDX");
                    this.parse_parameters_byte(match);
                }
                //Indirect Indexed Y
                else if(match = parameters.match(this.ind_y_ptn)){
                    this.push_instruction_byte(instruction, "_INDY");
                    this.parse_parameters_byte(match);
                }            
            }
        }
    }
    
    public assemble(text: string): Uint8Array {
        this.labels = new Array();
        this.placeholder_byte = -1;
        this.bytes = new Array();
        let lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            this.parse_line(line);
        }
        this.replace_placeholder_bytes();
        let bytes = <number[]> this.bytes.filter(el=>typeof el == "number");
        let program = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
            const byte = bytes[i];
            program[i] = byte;
        }
        return program;
    }
    
    /*
        Find Labels in the byte array and with a placeholder
        byte defined and replace all placeholders with the 
        position of the label in the array place start_addr
    */
    private replace_placeholder_bytes(){
        let defined_labels = <Label[]> this.bytes.filter(l=>typeof l != "number");
        defined_labels = defined_labels.filter(l=>l.placeholder_byte != undefined);
        for (let i = 0; i < defined_labels.length; i++) {
            const label = defined_labels[i];

            let filtered = this.bytes.filter(l=>typeof l == "number" || l == label);
            let label_addr =  this.start_addr + filtered.indexOf(label);
            if(label_addr >= 0 && label_addr <= 65535){
                let ho = (label_addr >> 8) & 0xFF;
                let lo = (label_addr & 0xFF);

                let placeholders = this.bytes.filter(l=>typeof l == "number" && (l == label.placeholder_byte || l == label.placeholder_byte - 0.1));

                for (let i = 0; i < this.bytes.length; i++) {
                    const byte = this.bytes[i];
                    if(byte == label.placeholder_byte){
                        this.bytes[i] = lo;
                    }
                    else if(byte == label.placeholder_byte - 0.1){
                        this.bytes[i] = ho;
                    }
                }
            }
            else{
                console.log(`Address ${label_addr} is invalid. Address must be between 0 and 65535`);
            }
        }
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

    private parse_parameters_byte(match: RegExpMatchArray){
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
            this.bytes.push(parseInt(`0x${match[2]}`));
            this.bytes.push(parseInt(`0x${match[1]}`));
        }
    }

    private parse_parameters_label(match: RegExpMatchArray, instruction : string, parameters: string){
        let label = this.labels.find(l => l.label_name == match[1].toUpperCase().trim());
        if(label == undefined){
            if(label == undefined && this.placeholder_byte > -256){
                let label : Label = <Label>{label_name: match[1].toUpperCase().trim(), placeholder_byte: this.placeholder_byte};
                this.placeholder_byte--
                this.labels.push(label);
            }
            else{
                console.log(`Too many labels are referenced before declaration, this assembler can only store 256 bytes of undeclared labels`);
            }
            label = this.labels.find(l => l.label_name == match[1].toUpperCase().trim());
            
            this.parse_labelled_instruction(0xFFFF, instruction, parameters);//set to max to ensure ABS
            this.bytes.push(label.placeholder_byte);
            this.bytes.push(label.placeholder_byte - 0.1);
        }
        else{
            let idx = this.bytes.indexOf(label);
            let addr = this.start_addr + idx;
            if(addr >= 0x00 && addr <= 0xFFFF){
                if(addr > 0xFF){
                    let ho = (addr >> 8) & 0xFF;
                    let lo = (addr & 0xFF);
                    
                    this.parse_labelled_instruction(addr, instruction, parameters);

                    this.bytes.push(lo);
                    this.bytes.push(ho);
                }
                else{ 
                    this.parse_labelled_instruction(addr, instruction, parameters);
                    this.bytes.push(addr);
                }
            }
            else{
                console.log(`Address ${addr} is invalid. Address must be between 0 and 65535`);
            }
        }
    }

    parse_labelled_instruction(addr: number, instruction: string, parameters: string){
        if(addr <= 0xFF){ //Address is < 256 so in Zero Page
            if(parameters.endsWith("),Y")){
                this.push_instruction_byte(instruction, "_INDY");
            }
            else if(parameters.endsWith(",X)")){
                this.push_instruction_byte(instruction, "_INDX");
            }
            else if(parameters.endsWith(")")){
                this.push_instruction_byte(instruction, "_IND");
            }
            else if(parameters.endsWith(",X") || parameters.endsWith(",Y")){
                this.push_instruction_byte(instruction, "_ZP" + parameters.substr(-1));
            }
        }
        else{
            switch(instruction){
                case "BCC":
                case "BCS":
                case "BEQ":
                case "BMI":
                case "BNE":
                case "BPL":
                case "BVC":
                case "BVS":
                    this.push_instruction_byte(instruction, "_REL");
                    break;
                default:
                    if(parameters.endsWith(",X") || parameters.endsWith(",Y")){
                        this.push_instruction_byte(instruction, "_ABS" + parameters.substr(-1));
                    }
                    else{
                        this.push_instruction_byte(instruction, "_ABS");
                    }
                    break;
            }
            
        }
    }
}
module.exports = Assembler;