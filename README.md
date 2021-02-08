# MOS 6502 Emulator (WIP)

I wanted to learn 6502 Assembly so began exploring different resources. I first came across `Nick Morgan's` 6502 tutorial [[1][1]], which I found to be very helpful for grasping the basics. However, I quickly hit a wall and began exploring different Assembly resources, C64 literature as well as Assembly for Zilog z80, Sharp LR35902 (Gameboy), Motorolla 68k (Sega Genesis). I found myself coming back to 6502 when I found Dave Poo's [[2][2]] video on reverse engineering the 6502 to make an emulator in C++. After watching Dave's process for creating instructions in C++ ( Read instruction definitions [[3][3]], code the functionality, run tests to ensure the instruction works as it is supposed to), I decided the best way to learn would be to move away from the 'Copy along' coding and just follow his methods to do it myself. I chose to do it in Javascript as I remembered Morgan's tutorial and liked how interactive the whole experience was. 

This is the product of this CPD exercise. 

This project is not original in idea, but its not copied code either. The aim here is purely a learning exercise.   



## Current Features

### CPU 💠*partial support*

The main focus of this project is the CPU instructions. I am currently working through the instruction sets and refactoring while I go (as many of the instructions share functionality). 

### Interactive Memory Monitor ✅

I wanted to make my own UI and not just copy Morgan's. While his had all of the information available, I found myself wanting more from the UX when using Morgan's tutorials. Consequently, I made my own memory monitor, which has byte highlighting and also ASCII character translation of bytes. My monitor always returns 256 bytes *(where possible)* and has *(in my opinion)* a clearer program status output. However Morgan's app is designed to have multiple instances on the same page, so neither solution is right, wrong, good or bad

### Screen ✅

The code for the screen is based on Morgan's implementation. I just transposed it into a TypeScript class as opposed to an inline function of functions. 

### ~~Code Editor~~ ❌

The code editor does not work as an assembly editor at the moment. I am still working on the CPU instructions and load programs using the following syntax:

```typescript
/*
	LDA #$69 	; Load Hex 69 into Accumulator
	PHA 	 	; Push Accumulator to Stack (and decrement stack pointer)
	LDA #$00	; Load Hex 00 into Accumulator
	PLA			; Pull a byte from the stack and Load it into the Accumulator (incrementing the Stack Pointer)
*/
let program = new Uint8Array([Instruction.LDA_IM, 0x69, Instruction.PHA, Instruction.LDA_IM, 0x00, Instruction.PLA])

// Load the program into Address $F000;
memory.load_bytes(program, 0xF000);
```

I will use this functionality to `Assemble` programs writing in the code editor, but for now this is good for testing - its also helps me understand Assembly code is assembled. 

#### Tab Support ✅

Currently, text can be entered and tab support is implemented based on Brad Robinson's StackOverflow answer [[4][4]] 

## Jest Testing 

There is a known issue with this code. At the top of `./js/cpu.js` the following code block must be commented out when running: 

```typescript
// @ts-expect-error - not a module - but this allows Jest test
import Flag from "./flag";
// @ts-expect-error - not a module - but this allows Jest test
import Instruction from  "./instruction";
// @ts-expect-error - not a module - but this allows Jest test
import Register from  "./register";
```

These lines are added so that I could get Jest to work. At the bottom of each file the follow line is also present:

```typescript
module.exports = <CLASS_NAME>;
```

However classes are not exported. This causes a warning to appear in the console. Again, both of these solutions were done to get Jest working. Once I have finished developing this I will likely go back and try to solve the issue more directly, but for now I am able to run tests as I am developing and that's all that matters. 

## License

[![License: CC BY 4.0](https://camo.githubusercontent.com/bca967b18143b8a5b2ffe78bd4a1a30f6bc21de83bd8336f748e96498af38b38/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d43432532304259253230342e302d6c69676874677265792e737667)](https://creativecommons.org/licenses/by/4.0/)


## References

[1]: https://github.com/skilldrick/6502js  "(Nick Morgan, 2020)"
[2]: https://www.youtube.com/watch?v=qJgsuQoy9bc	"(Dave Poo, 2020)"
[3]: http://www.obelisk.me.uk/6502/ "(Andrew Jacobs, 2009)"
[4]: https://stackoverflow.com/a/45396754/2107659 "Brad Robinson, 2017"

[1] Morgan, N. (2020). skilldrick/easy6502. Retrieved 15 January 2021, from [https://github.com/skilldrick/easy6502](https://github.com/skilldrick/easy6502)

[2] Poo, D. (2020). Emulating a CPU in C++ (6502). Retrieved 1 February 2021, from [https://www.youtube.com/watch?v=qJgsuQoy9bc](https://www.youtube.com/watch?v=qJgsuQoy9bc)

[3] Jacobs, A. (2009) 6502 Introduction. Retrieved 1 February 2021, from [http://www.obelisk.me.uk/6502/](http://www.obelisk.me.uk/6502/)

[4] Robinson, B. (2017). Use tab to indent in textarea - StackOverflow. Retreived 4 February 2021, from [https://stackoverflow.com/a/45396754/2107659](https://stackoverflow.com/a/45396754/2107659)