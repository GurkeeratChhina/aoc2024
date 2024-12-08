const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')

    const data = []

    for (const line of text.trim().split("\n")) {
        let halves = line.split(":")
        let first = Number(halves[0].trim())
        let rest = halves[1].trim().split(/\s+/)
        rest = rest.map(x => Number(x))
        data.push([first].concat(rest))
    }
    // console.log(data)
    return data
}

const isequal = function(x, list) {
    if (list.length == 1) {
        return x == list[0]
    }
    let mult = list[0]*list[1]
    let add = list[0]+list[1]
    return (isequal(x, [mult].concat(list.slice(2))) || isequal(x, [add].concat(list.slice(2))))
}

const isequal2 = function(x, list) {
    if (list.length == 1) {
        return x == list[0]
    }
    let mult = list[0]*list[1]
    let add = list[0]+list[1]
    let concat = Number(list[0].toString().concat(list[1].toString()));
    return (isequal2(x, [mult].concat(list.slice(2))) || isequal2(x, [add].concat(list.slice(2))) || isequal2(x, [concat].concat(list.slice(2))))
}

const p1 = function(filename) {
    let data = parse(filename)
    let sum = 0
    for (let row of data) {
        let first = row[0]
        let rest = row.slice(1)
        if (isequal(first, rest)){
            sum+=first
        }
    }
    return sum
}

const p2 = function(filename) {
    let data = parse(filename)
    let sum = 0
    for (let row of data) {
        let first = row[0]
        let rest = row.slice(1)
        if (isequal2(first, rest)){
            sum+=first
        }
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d7.txt")
const time1 = process.hrtime(start1)

console.log("Day 7, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d7.txt")
const time2 = process.hrtime(start2)

console.log("Day 7, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")