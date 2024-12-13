const fs = require('fs')
const math = require('mathjs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = []
    for (const line of text.trim().split(/\n\n/)) {
        let nums = line.match(/\d+/g)
        data.push(nums.map(x => Number(x)))
    } 
    return data
}

const almost_int = function(a, delta) {
    if (math.abs(a - math.round(a)) < delta) {
        return true
    }
    return false
}

const tokens_used = function(x1, y1, x2, y2, x3, y3) {
    let M = math.matrix([[x1, x2], [y1, y2]])
    let B = math.matrix([[x3],[y3]])
    let X = math.multiply(math.inv(M), B)

    if (!almost_int(X.get([0,0]), 0.01) || !almost_int(X.get([1,0]), 0.01)) {
        return 0
    }

    let result = math.multiply(math.matrix([[3,1]]), X).get([0,0])
    return math.round(result)
}

const p1 = function(filename) {
    let data = parse(filename)
    let sum = 0
    for (let row of data) {
        sum += tokens_used.apply(this, row)
    }
    return sum
}

const p2 = function(filename) {
    let data = parse(filename)
    let sum = 0
    for (let row of data) {
        row[4] = row[4] + 10000000000000
        row[5] = row[5] + 10000000000000
        sum += tokens_used.apply(this, row)
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d13.txt")
const time1 = process.hrtime(start1)

console.log("Day 13, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d13.txt")
const time2 = process.hrtime(start2)

console.log("Day 13, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")