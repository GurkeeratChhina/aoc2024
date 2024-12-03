const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')

    for (const line of text.trim().split("\n")) {
    }
    
    return 
}

const p1 = function(filename) {
    return
}

const p2 = function(filename) {
    return
}

const start1 = process.hrtime()
const result1 = p1("data/d3.txt")
const time1 = process.hrtime(start1)

const start2 = process.hrtime()
const result2 = p2("data/d3.txt")
const time2 = process.hrtime(start2)

console.log("Day 3, part 1 answer: ", result1, " took ", time1[1]/1000000, "milliseconds")
console.log("Day 3, part 2 answer: ", result2, " took ", time2[1]/1000000, "milliseconds")