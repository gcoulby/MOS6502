class Display {
    constructor(memory) {
        this.palette = [
            "#000000", "#ffffff", "#880000", "#aaffee",
            "#cc44cc", "#00cc55", "#0000aa", "#eeee77",
            "#dd8855", "#664400", "#ff7777", "#333333",
            "#777777", "#aaff66", "#0088ff", "#bbbbbb"
        ];
        this.start_addr = 0x0200;
        this.canvas = document.getElementById("screen");
        this.memory = memory;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.pixelsPerRow = 32;
        this.end_addr = this.start_addr + (this.pixelsPerRow * this.pixelsPerRow) - 1;
        this.pixelSize = this.width / this.pixelsPerRow;
        this.ctx = this.canvas.getContext('2d');
        this.reset();
    }
    reset() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);
    }
    update() {
        for (let i = this.start_addr; i < this.end_addr; i++) {
            this.updatePixel(i);
        }
    }
    updatePixel(addr) {
        this.ctx.fillStyle = this.palette[memory.get(addr) & 0x0f];
        let y = Math.floor((addr - this.start_addr) / this.pixelsPerRow);
        let x = (addr - this.start_addr) % this.pixelsPerRow;
        this.ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
    }
}
// module.exports = Display
