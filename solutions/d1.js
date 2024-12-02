const fs = require('fs')

//parse
const parse = function(filename) {
    const arraya = []
    const arrayb = []
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        //todo: for each line, add to the arrays
        console.log(data)
    })
    return [arraya, arrayb]
}


const pairwise_diff = function(arraya, arrayb) {
    const output = []
    for (let i = 0; i< arraya.length; i++) {
        output[i] = arraya[i] - arrayb[i]
    }
    return output
}

const abs_sum = function(input_array) {
    let n
    for (a in input_array) {
        n += Math.abs(a)
    }
    return n
}

const p1 = function(filename) {
    return abs_sum(pairwise_diff.apply(this, parse(filename)))
}

const p2 = function(filename) {
    return
}

const start1 = process.hrtime()
const result1 = p1("../data/d1.txt")
const time1 = process.hrtime(start1)

const start2 = process.hrtime()
const result2 = p2("../data/d1.txt")
const time2 = process.hrtime(start2)

console.log(result1, " took ", time1, " nanoseconds")
console.log(result2, " took ", time2, " nanoseconds")