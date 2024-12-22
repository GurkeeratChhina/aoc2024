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

const to_int = function(x) {
    let sum = 0
    for (let i = x.length-1; i >=0;i--){
        sum *= 2
        sum += x[i]
    }
    return sum
}

const update = function (x) {
    let y = x.slice()
    for (let i = 6; i < x.length; i++) {
        y[i] = (x[i]+x[i-6])%2
    }
    x = y
    y = x.slice()
    for (let i = 0; i < x.length-5; i++) {
        y[i] = (x[i]+x[i+5])%2
    }
    x = y
    y = x.slice()
    for (let i = 11; i < x.length; i++) {
        y[i] = (x[i]+x[i-11])%2
    }
    return y
}

const p1 = function(filename) {
    let data = parse(filename)
    let sum = 0
    for (let num of data) {
        let x = my_binary(num,24)
        // console.log(to_int(x))
        for (let i = 0; i < 2000; i++) {
            x = update(x)
        }
        sum += to_int(x)
    }
    return sum
}

const p2 = function(filename) {
    let data = parse(filename)
    first_occurances = new Map()
    for (let num of data) {
        let x = my_binary(num,24)
        let prev = to_int(x)%10
        let deltas = []
        for (let i = 0; i < 4; i++) {
            x = update(x)
            let score = to_int(x)%10
            deltas.push(score-prev)
            prev = score
        }
        // console.log(deltas)
        let key = JSON.stringify(deltas)
        if (!first_occurances.has(key)) {
            let val = new Map()
            val.set(num, prev)
            first_occurances.set(key, val)
        } else if (!first_occurances.get(key).has(num)){
            let val = first_occurances.get(key)
            val.set(num, prev)
        }
        for (let i = 4; i < 2000; i++) {
            x = update(x)
            let score = to_int(x)%10
            deltas.shift()
            deltas.push(score-prev)
            prev = score
            let key = JSON.stringify(deltas)
            if (!first_occurances.has(key)) {
                let val = new Map()
                val.set(num, prev)
                first_occurances.set(key, val)
            } else if (!first_occurances.get(key).has(num)){
                let val = first_occurances.get(key)
                val.set(num, prev)
            }
        }
    }
    // console.log(first_occurances)

    let max = 0
    for (let [key, map] of first_occurances) {
        let sum = 0
        for (let [num, score] of map) {
            sum += score
        }
        max = Math.max(max, sum)
    }
    return max
}

const start1 = process.hrtime()
const result1 = p1("data/d22.txt")
const time1 = process.hrtime(start1)

console.log("Day 22, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d22.txt")
const time2 = process.hrtime(start2)

console.log("Day 22, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")