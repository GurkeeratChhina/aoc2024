const fs = require('fs')

const cache = new Map()

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = []
    for (const line of text.trim().split("\n")) {
        data.push(line.trim())
    }
    return data
}

const pad_distance = function(a,b) {
    let dx = x_coord(b)-x_coord(a)
    let dy = y_coord(b)-y_coord(a)
    let up = 'U'.repeat(Math.max(0, -1*dy))
    let down = 'D'.repeat(Math.max(0, dy))
    let left = 'L'.repeat(Math.max(0, -1*dx))
    let right = 'R'.repeat(Math.max(0, dx))
    if (x_coord(a) == 0 && y_coord(a)+dy == 3) {
        // single path
        return [left.concat(right).concat(up).concat(down).concat('A')]
    } else if (y_coord(a) == 3 && x_coord(a)+dx == 0) {
        // also single path
        return [up.concat(down).concat(left).concat(right).concat('A')]
    } else {
        return [up.concat(down).concat(left).concat(right).concat('A'), left.concat(right).concat(up).concat(down).concat('A')]
    }
}

const x_coord = function(a) {
    if (a == 'A' || a == 'R') {
        return 2
    } else if (a == '0' || a == 'U' || a == 'D') {
        return 1
    } else if (a == 'L') {
        return 0
    }
    return (Number(a) -1 )%3
}

const y_coord = function(a) {
    if (a == 'A' || a == '0' || a == 'U') {
        return 3
    } else if (a == 'R' || a == 'D' || a == 'L') {
        return 4
    }
    return 2-Math.floor((Number(a)-1)/3)
}

const instr_length = function(string, iterations) {
    // console.log(string, iterations)
    if (iterations == 0) {
        return string.length
    }
    if (cache.has(JSON.stringify([string, iterations]))) {
        return cache.get(JSON.stringify([string, iterations]))
    }
    let sum = 0
    sum += Math.min(...pad_distance('A',string[0]).map(x=>instr_length(x, iterations-1)))
    for (let i = 0; i < string.length-1; i++) {
        let paths = pad_distance(string[i],string[i+1])
        // console.log(paths, iterations)
        sum += Math.min(...paths.map(x=>instr_length(x, iterations-1)))
    }
    cache.set(JSON.stringify([string, iterations]), sum)
    // console.log(string, iterations, sum)
    return sum
}

const p1 = function(filename) {
    let data = parse(filename)
    let sum = 0
    for (let line of data) {
        // console.log(instr_length(line, 3), Number(line.match(/\d+/)))
        sum += instr_length(line, 3)*Number(line.match(/\d+/))
    }
    return sum
}

const p2 = function(filename) {
    let data = parse(filename)
    let sum = 0
    for (let line of data) {
        // console.log(instr_length(line, 26), Number(line.match(/\d+/)))
        sum += instr_length(line, 26)*Number(line.match(/\d+/))
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d21.txt")
const time1 = process.hrtime(start1)

console.log("Day 21, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d21.txt")
const time2 = process.hrtime(start2)

console.log("Day 21, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")