const fs = require('fs')

const parse = function(filename) {
    const output = []

    var text = fs.readFileSync(filename,'utf8')

    for (const line of text.trim().split("\n")) {
        let newline = line.trim().split(/\s+/)
        newline.forEach(element => Number(element))
        output.push(newline)
    }
    return output
}

const is_safe = function(arr) {
    if (arr.length == 1) {
        return true
    } else if (arr.length == 2) {
        const diff = Math.abs(arr[1] - arr[0])
        return diff >= 1 && diff <= 3
    } else {
        const gradient = arr[1] - arr[0]
        for (let i = 1; i < arr.length; i++) {
            diff = arr[i] - arr[i-1]
            if (Math.sign(diff) != Math.sign(gradient)) {
                return false
            } else if (Math.abs(diff) < 1 || Math.abs(diff) > 3 ) {
                return false
            }
        }
        return true
    }
}

const is_safe_damped = function(arr) {
    for (let i = 0; i< arr.length; i++) {
        if (is_safe(arr.toSpliced(i, 1))) {
            return true
        }
    }
    return false
}

const p1 = function(filename) {
    let sum = 0
    for (line of parse(filename)) {
        if (is_safe(line)) {
            sum++
        }
    }
    return sum
}

const p2 = function(filename) {
    let sum = 0
    for (line of parse(filename)) {
        if (is_safe_damped(line)) {
            sum++
        }
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d2.txt")
const time1 = process.hrtime(start1)

const start2 = process.hrtime()
const result2 = p2("data/d2.txt")
const time2 = process.hrtime(start2)

console.log("Day 2, part 1 answer: ", result1, " took ", time1[1]/1000000, "milliseconds")
console.log("Day 2, part 2 answer: ", result2, " took ", time2[1]/1000000, "milliseconds")