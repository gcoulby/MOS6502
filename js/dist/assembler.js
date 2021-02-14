"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error - not a module - but this allows Jest test
const instruction_1 = require("./instruction");
class Assembler {
    constructor(memory, start_addr) {
        this.lbl_ptn = RegExp('([a-zA-Z][a-zA-Z0-9]+)[:]');
        this.ins_ptn = RegExp('([ ]+|\t+)([a-zA-Z]{3})([ ]*|\t+)(.*)([;].*|)');
        this.im_ptn = RegExp('[#]([$]|)([0-9a-fA-F]{1,2})(?![0-9a-fA-F,])');
        this.zp_xy_ptn = RegExp('[$]()([0-9a-fA-F]{1,2})[,]([xX]|[yY])');
        this.zp_ptn = RegExp('[$]()([0-9a-fA-F]{1,2})(?![0-9a-fA-F,])');
        this.abs_ptn = RegExp('[$]()([0-9a-fA-F]{2})([0-9a-fA-F]{2})(?![0-9a-fA-F,])');
        this.abs_xy_ptn = RegExp('[$]()([0-9a-fA-F]{2})([0-9a-fA-F]{2})[,]([xX]|[yY])');
        this.labels = new Array();
        this.bytes = new Array();
        this.memory = memory;
        this.start_addr = start_addr;
    }
    parse_line(str) {
        // split str by ';' ignore comment
        let lbl = str.match(this.lbl_ptn);
        let ins = str.match(this.ins_ptn);
        if (lbl != undefined && lbl.length > 0) {
            let label = { label_name: lbl[1].trim(), rel_addr: this.bytes.length };
            if (!this.labels.includes(label))
                this.labels.push(label);
        }
        else if (ins != undefined && ins.length > 0) {
            let instruction = ins[2] == "CMP" ? "CPA" : ins[2];
            let parameters = ins[4];
            let match = null;
            if (instruction_1.default[instruction]) {
                //instruction is implied (e.g. BRK, DEX, TAX) and
                //requires no parameters
                this.push_instruction_byte(instruction, "");
            }
            else {
                // console.log(`parameters: ${parameters}`);
                //Accumulator
                if (parameters == "A") {
                    this.push_instruction_byte(instruction, "_A");
                }
                //Immediate
                else if (match = parameters.match(this.im_ptn)) {
                    this.push_instruction_byte(instruction, "_IM");
                    this.parse_parameters_single_byte(match);
                    //TODO: #HI|LO LABEL
                }
                //Zero Page,X|Y
                else if (match = parameters.match(this.zp_xy_ptn)) {
                    let reg = match[3];
                    this.push_instruction_byte(instruction, "_ZP" + reg);
                    this.parse_parameters_single_byte(match);
                    //TODO: labels
                }
                //Zero Page
                else if (match = parameters.match(this.zp_ptn)) {
                    this.push_instruction_byte(instruction, "_ZP");
                    this.parse_parameters_single_byte(match);
                    //TODO: labels
                }
                //TODO: Relative
                //TODO: Absolute,X|Y
                else if (match = parameters.match(this.abs_xy_ptn)) {
                    let reg = match[4];
                    this.push_instruction_byte(instruction, "_ABS" + reg);
                    this.parse_parameters_word(match);
                    //TODO: labels
                }
                //TODO: Absolute
                else if (match = parameters.match(this.abs_ptn)) {
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
    assemble(text) {
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
    push_instruction_byte(instruction, suffix) {
        let instruction_byte = instruction_1.default[instruction + suffix];
        if (instruction_byte) {
            this.bytes.push(instruction_byte);
        }
        else {
            console.log(`Error parsing byte ${this.bytes.length + 1}: ${instruction}${suffix} is not a valid instruction`);
        }
    }
    parse_instruction(instruction, parameters, param_ptn, ins_suffix) {
        let byte = parameters.match(param_ptn);
        if (byte && byte.length > 0) {
            //immediate
            this.push_instruction_byte(instruction, ins_suffix);
            this.bytes.push(parseInt(`0x${byte[1]}`));
        }
    }
    parse_parameters_single_byte(match) {
        // console.log(match);
        if (match.length > 0) {
            //immediate
            this.bytes.push(parseInt(`0x${match[2]}`));
        }
    }
    parse_parameters_word(match) {
        // console.log(match);
        if (match.length > 0) {
            //immediate
            this.bytes.push(parseInt(`0x${match[3]}`));
            this.bytes.push(parseInt(`0x${match[2]}`));
        }
    }
}
module.exports = Assembler;
