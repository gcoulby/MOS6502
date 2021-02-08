class CodeEditor{
    /*
        This is an adaptation of Brad Robinson's
        Source: https://stackoverflow.com/a/45396754/2107659
        Change Log:
        - Removed the dependancy to jQuery
        - Integrated into TypeScript class
    */
    enabled : boolean
    textarea: HTMLInputElement
    constructor(){
        this.textarea = <HTMLInputElement>document.getElementById("code");
        this.textarea.height = ctx.canvas.height;
        this.textarea.addEventListener("keydown", this.keydown.bind(this));
        this.enabled = true;
    }

    keydown(evt: KeyboardEvent){
        this.textarea = <HTMLInputElement>evt.target;
        switch(evt.key){
            case "Escape":
                evt.preventDefault();
                this.enabled = !this.enabled;
                return false;
            case "Enter":
                //break;
                if (this.textarea.selectionStart == this.textarea.selectionEnd)
                {
                    // find start of the current line
                    var sel = this.textarea.selectionStart;
                    var text = this.textarea.value;
                    while (sel > 0 && text[sel-1] != '\n')
                    {
                        sel--;
                    }
                    
                    var lineStart = sel;
                    while (text[sel] == ' ' || text[sel]=='\t')
                    sel++;
                    
                    if (sel > lineStart)
                    {
                        evt.preventDefault();
                        // Insert carriage return and indented text
                        document.execCommand('insertText', false, "\n" + text.substr(lineStart, sel-lineStart));

                        // Scroll caret visible
                        this.textarea.blur();
                        this.textarea.focus();
                        return false;
                    }
                }
                break;
            case "Tab":
                if(!this.enabled) break;
                evt.preventDefault();
                // selection?
                if (this.textarea.selectionStart == this.textarea.selectionEnd)
                {
                    // These single character operations are undoable
                    if (!evt.shiftKey)
                    {
                        document.execCommand('insertText', false, "\t");
                    }
                    else
                    {
                        var text = this.textarea.value;
                        if (this.textarea.selectionStart > 0 && text[this.textarea.selectionStart-1]=='\t')
                        {
                            document.execCommand('delete');
                        }
                    }
                }
                else
                {
                    // Block indent/unindent trashes undo stack.
                    // Select whole lines
                    var selStart = this.textarea.selectionStart;
                    var selEnd = this.textarea.selectionEnd;
                    var text = this.textarea.value;
                    while (selStart > 0 && text[selStart-1] != '\n')
                        selStart--;
                    while (selEnd > 0 && text[selEnd-1]!='\n' && selEnd < text.length)
                        selEnd++;

                    // Get selected text
                    let lines = text.substr(selStart, selEnd - selStart).split('\n');

                    // Insert tabs
                    for (var i=0; i<lines.length; i++)
                    {
                        // Don't indent last line if cursor at start of line
                        if (i==lines.length-1 && lines[i].length==0)
                            continue;

                        // Tab or Shift+Tab?
                        if (evt.shiftKey)
                        {
                            if (lines[i].startsWith('\t'))
                                lines[i] = lines[i].substr(1);
                            else if (lines[i].startsWith("    "))
                                lines[i] = lines[i].substr(4);
                        }
                        else
                            lines[i] = "\t" + lines[i];
                    }
                    let output = lines.join('\n');

                    // Update the text area
                    this.textarea.value = text.substr(0, selStart) + output + text.substr(selEnd);
                    this.textarea.selectionStart = selStart;
                    this.textarea.selectionEnd = selStart + output.length; 
                }
                return false;
        }
        this.enabled = true;
        return true;
    }  
}