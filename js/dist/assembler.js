class Label {
}
class Assembler {
    constructor(code_editor) {
        this.lbl_ptn = RegExp('([a-zA-Z]+)[:]');
        this.ins_ptn = RegExp('\s([a-zA-Z]{3})\s*(.*)([;].*|)');
        this.code_editor = code_editor;
        this.assemble_btn = document.getElementById("assemble-btn");
        this.assemble_btn.addEventListener("click", this.assemble);
        this.parse_line = this.parse_line.bind(this);
    }
    // get labels
    get_labels() {
    }
    parse_line(str) {
        // split str by ';' ignore comment
        let label = str.match(this.lbl_ptn);
        let ins = str.match(this.ins_ptn);
        if (label.length > 0) {
            console.log(`Label: ${label[0]}`);
        }
        else if (ins.length > 0) {
            console.log(`Instruction: ${str[0]}`);
            console.log(`Parameters: ${str[1]}`);
        }
    }
}
() => {
    let text = code_editor.textarea.value;
    let lines = text.split('\n');
    console.log(lines.length);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        console.log(this);
        this.parse_line(line);
    }
};
