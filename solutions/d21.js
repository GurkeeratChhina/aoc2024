const fs = require('fs')

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
    if (dx == 0 && dy == 0) {
        return ['A']
    } else if (dx == 0 && dy > 0) {
        return ['D'.repeat(dy).concat('A')]
    } else if (dx == 0) {
        return ['U'.repeat(-1*dy).concat('A')]
    } else if (dy == 0 && dx > 0) {
        return ['R'.repeat(dx).concat('A')]
    } else if (dy == 0) {
        return ['L'.repeat(-1*dx).concat('A')]
    } else if (dx > 0 && dy >0) {
        return ['R'.repeat(dx).concat('D'.repeat(dy)).concat('A'),'D'.repeat(dy).concat('R'.repeat(dx)).concat('A')]
    } else if (dx > 0) {
        return ['R'.repeat(dx).concat('U'.repeat(-1*dy)).concat('A'),'U'.repeat(-1*dy).concat('R'.repeat(dx)).concat('A')]
    } else if (dy > 0) {
        return ['L'.repeat(-1*dx).concat('D'.repeat(dy)).concat('A'),'D'.repeat(dy).concat('L'.repeat(-1*dx)).concat('A')]
    } else if (y_coord(a) < 3 || x_coord(a) + dx > 0) {
        return ['L'.repeat(-1*dx).concat('U'.repeat(-1*dy)).concat('A'),'U'.repeat(-1*dy).concat('L'.repeat(-1*dx)).concat('A')]
    } else {
        return ['U'.repeat(-1*dy).concat('L'.repeat(-1*dx)).concat('A')]
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

const p1 = function(filename) {
    let data = parse(filename)
    let sum = 0
    for (let line of data) {
        let possibilities = new Set()
        possibilities.add('A'.concat(line))
        for (k = 0; k < 3; k++) {
            let new_possibilities = new Set()
            for (let p of possibilities) {
                let partial_possibilities = new Set()
                partial_possibilities.add('A')                
                for (let i = 0; i < p.length-1; i++) {
                    let new_partials = new Set()
                    for (let ending of pad_distance(p[i],p[i+1])) {
                        for (let p2 of partial_possibilities) {
                            new_partials.add(p2.concat(ending))
                        }
                    }
                    partial_possibilities = new_partials
                }
                new_possibilities = new_possibilities.union(partial_possibilities)
            }
            possibilities = new_possibilities
        }
        // console.log(possibilities)
        let min = 1e100
        for (let p of possibilities) {
            min = Math.min(min, p.length)
        }
        console.log(min-1, Number(line.match(/\d+/)))
        sum += (min-1)*Number(line.match(/\d+/))
    }
    return sum
}

const p2 = function(filename) {
    let data = parse(filename)
    return 
}

const start1 = process.hrtime()
const result1 = p1("data/d21.txt")
const time1 = process.hrtime(start1)

console.log("Day 21, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d21.txt")
const time2 = process.hrtime(start2)

console.log("Day 21, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")