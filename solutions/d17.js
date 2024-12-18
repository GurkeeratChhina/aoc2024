const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let halves = text.trim().split("\n\n")
    let regs = halves[0].match(/\d+/g).map(x=>Number(x))
    state.RegA = BigInt(regs[0])
    state.RegB = BigInt(regs[1])
    state.RegC = BigInt(regs[2])
    state.instructions = halves[1].match(/\d+/g).map(x=>Number(x))
    return halves[1].match(/\d+/g).map(x=>Number(x))
}

const state = {
    RegA: 0n,
    RegB: 0n,
    RegC: 0n,
    instructions: [],
    pointer: 0,
    output: [],
    combo: function(x) {
        switch (x) {
            case 4n: return this.RegA
            case 5n: return this.RegB
            case 6n: return this.RegC
            case 7n: throw("combo value 7 error")
            default: return x
        }
    },
    run: function() {
        while(this.pointer < this.instructions.length-1) {
            let operand = BigInt(this.instructions[this.pointer+1])
            switch (this.instructions[this.pointer]) {
                case 0: this.RegA = this.RegA/(2n**this.combo(operand)); break;
                case 1: this.RegB = (this.RegB ^ operand); break;
                case 2: this.RegB = this.combo(operand)%8n; break;
                case 3: if (this.RegA != 0n) {this.pointer = Number(operand)-2}; break;
                case 4: this.RegB = this.RegB ^ this.RegC; break;
                case 5: this.output.push(Number(this.combo(operand)%8n)); break;
                case 6: this.RegB = this.RegA/(2n**this.combo(operand)); break;
                case 7: this.RegC = this.RegA/(2n**this.combo(operand)); break;
            }
            this.pointer+=2
        }
        return state.output
    },
    reset: function(x) {
        state.RegA = BigInt(x)
        state.RegB = 0n
        state.RegC = 0n
        state.pointer = 0
        state.output = []
    }
}


const p1 = function(filename) {
    parse(filename)
    // console.log(state)
    return JSON.stringify(state.run())
}

const p2 = function(filename) {
    let instructs = parse(filename)
    let queue = [];
    queue.push(0);
    let answer = 1e100
    while (queue.length >0) {
        let i = queue.shift()
        // console.log(i, result)
        for (let j = 0; j<8; j++) {
            state.reset(i+j)
            result = state.run()
            if (result.length>instructs.length) {continue}
            if (JSON.stringify(result) == JSON.stringify(instructs)) {answer = Math.min(answer, i+j)}
            if (result[0] == instructs[instructs.length-result.length]) {queue.push((i+j)*8)}
        }
    }
    return answer
}

const start1 = process.hrtime()
const result1 = p1("data/d17.txt")
const time1 = process.hrtime(start1)

console.log("Day 17, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")

const start2 = process.hrtime()
const result2 = p2("data/d17.txt")
const time2 = process.hrtime(start2)

console.log("Day 17, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")