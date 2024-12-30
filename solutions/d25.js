const fs = require('fs')

const max = 7

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let locks = []
    let keys = []
    for (const schem of text.trim().split("\n\n")) {
        const lines = schem.split("\n")
        let nums = []
        for (let i = 0; i < lines[0].length; i++) {
            let count = 0
            for (let j = 0; j < lines.length; j++) {
                if (lines[j][i] == '#') {
                    count++
                }
            }
            nums.push(count)
        }
        if (lines[0][0]=='#') {
            locks.push(nums)
        } else {
            keys.push(nums)
        }
    }
    
    return [locks, keys]
}

const fits = function(lock, key) {
    for (let i = 0; i < lock.length; i++) {
        if ((lock[i] + key[i]) > max) {
            return false
        }
    }
    return true
}

const p1 = function(filename) {
    let [locks, keys] = parse(filename)
    let count = 0
    for (let lock of locks) {
        for (let key of keys) {
            if (fits(lock, key)) {
                count++
            }
        }
    }
    return count
}

const p2 = function(filename) {
    let data = parse(filename)
    return
}

const start1 = process.hrtime()
const result1 = p1("data/d25.txt")
const time1 = process.hrtime(start1)

console.log("Day 25, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d25.txt")
const time2 = process.hrtime(start2)

console.log("Day 25, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")