const fs = require('fs')

const cache = new Map()

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8').split("\n\n")
    let towels = text[0].trim().match(/[a-z]+/g)
    let arrangements = []
    for (const line of text[1].trim().split("\n")) {
        arrangements.push(line.trim())
    }
    return [towels, arrangements]
}

const is_possible = function(arrangement, towels) {
    if (cache.has(arrangement)) {
        return cache.get(arrangement)
    }
    if (arrangement.length == 0) {
        cache.set(arrangement, 1)
        return 1
    }
    let sum = 0
    for (let towel of towels) {
        let regex = new RegExp('^'.concat(towel))
        if (regex.test(arrangement)) {
            let remainder = arrangement.slice(towel.length)
            if (is_possible(remainder,towels)) {
                sum += cache.get(remainder)
            }
        }
    }
    cache.set(arrangement, sum)
    return sum
}

const p1 = function(filename) {
    let [towels, arrangements] = parse(filename)
    let count = 0
    for (let arrangement of arrangements) {
        if (is_possible(arrangement, towels)) {
            count++
        }
    }
    return count
}

const p2 = function(filename) {
    let [towels, arrangements] = parse(filename)
    let count = 0
    for (let arrangement of arrangements) {
        count += is_possible(arrangement, towels)
    }
    return count
}

const start1 = process.hrtime()
const result1 = p1("data/d19.txt")
const time1 = process.hrtime(start1)

console.log("Day 19, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d19.txt")
const time2 = process.hrtime(start2)

console.log("Day 19, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")