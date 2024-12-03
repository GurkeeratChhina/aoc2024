const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    return text.trim()
}

const find_mults = function(str) {
    const re = /mul\(\d{1,3}\,\d{1,3}\)/g
    return str.match(re)
}

const find_mult_dos = function(str) {
    const re = /mul\(\d{1,3}\,\d{1,3}\)|do\(\)|don\'t\(\)/g
    return str.match(re)
}

const eval_mults = function(str) {
    let nums = str.slice(4,-1).split(',')
    return Number(nums[0])*Number(nums[1])
}

const p1 = function(filename) {
    let sum = 0
    for (let mult of find_mults(parse(filename))) {
        sum += eval_mults(mult)
    }
    return sum
}

const p2 = function(filename) {
    let sum = 0
    let evaluate = true
    for (let expr of find_mult_dos(parse(filename))) {
        if (expr == "do()") {
            evaluate = true
        } else if (expr == "don't()") {
            evaluate = false
        } else if (evaluate == true) {
            sum += eval_mults(expr)
        }
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d3.txt")
const time1 = process.hrtime(start1)

const start2 = process.hrtime()
const result2 = p2("data/d3.txt")
const time2 = process.hrtime(start2)

console.log("Day 3, part 1 answer: ", result1, " took ", time1[1]/1000000, "milliseconds")
console.log("Day 3, part 2 answer: ", result2, " took ", time2[1]/1000000, "milliseconds")