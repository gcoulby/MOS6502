// here we are just getting the canvas and asigning it the to the vairable context
var canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('screen');
var ctx = canvas.getContext('2d');

// no we get with of content and asign the same hight as the with. this gives up aspect ration 1:1.
ctx.canvas.height = ctx.canvas.width;