const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = []
    for (const line of text.trim().split("\n")) {
        data.push(Number(line))
    }
    
    return data
}

const my_binary = function(x, size) {
    let out = []
    for (let i = 0; i < size; i++) {
        out.push(x%2)
        x = Math.floor(x/2)
    }
    return out
}

const pseudo = function (x) {
    let temp = ((x << 6)^x)% (2**24)
    // console.log(temp)
    temp = (temp >> 5)^temp
    // console.log(temp)
    // console.log((temp << 11))
    return ((temp << 11)^temp) % (2**24)
}

const p1 = function(filename) {
    let data = parse(filename)
    let sum = 0
    for (let num of data) {
        let x = my_binary(num,24)
        for (let i = 0; i < 10; i++) {
            x = pseudo(x)
            // console.log(i, temp)
        }
        sum += temp
    }
    return sum
}

const p2 = function(filename) {
    let data = parse(filename)
    return
}

const start1 = process.hrtime()
const result1 = p1("data/d22a.txt")
const time1 = process.hrtime(start1)

console.log("Day 22, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d22.txt")
const time2 = process.hrtime(start2)

console.log("Day 22, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")