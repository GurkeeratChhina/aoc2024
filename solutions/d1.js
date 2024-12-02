const fs = require('fs')

const parse = function(filename) {
    const arraya =[]
    const arrayb = []
    var text = fs.readFileSync(filename,'utf8')

    for (const line of text.trim().split("\n")) {
        const nums = line.trim().split(/\s+/)
        arraya.push(Number(nums[0]))
        arrayb.push(Number(nums[1]))
    }
    return [arraya, arrayb]
}

const sort = function(array) {
    array.sort(function(a, b){return a - b})
}

const pairwise_diff = function(arraya, arrayb) {
    const output = []
    for (let i = 0; i < arraya.length; i++) {
        output[i] = arraya[i] - arrayb[i]
    }
    return output
}

const abs_sum = function(input_array) {
    let n = 0
    for (const a of input_array) {
        n += Math.abs(a)
    }
    return n
}

const p1 = function(filename) {
    const [data1, data2] = parse(filename)
    sort(data1)
    sort(data2)
    return abs_sum(pairwise_diff(data1, data2))
}

const p2 = function(filename) {
    const [data1, data2] = parse(filename)
    sort(data1)
    sort(data2)
    let sum = 0
    for (let i = 0, j = 0; i< data1.length && j < data2.length;) {
        num = data1[i]
        let count1 = 0
        let count2 = 0
        while (i < data1.length && data1[i] == num) {
            count1++
            i++
        }
        while (j < data2.length && data2[j]<num) {
            j++
        }
        while (j < data2.length && data2[j]==num) {
            count2++
            j++
        }
        sum += num*count1*count2
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d1.txt")
const time1 = process.hrtime(start1)

const start2 = process.hrtime()
const result2 = p2("data/d1.txt")
const time2 = process.hrtime(start2)

console.log("Day 1, part 1 answer: ", result1, " took ", time1[1]/1000000, "milliseconds")
console.log("Day 1, part 2 answer: ", result2, " took ", time2[1]/1000000, "milliseconds")