const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')

    let data = []

    for (const line of text.trim().split("\n")) {
        let row = []
        for (const char of line.trim()) {
            row.push(Number(char))
        }
        data.push(row)
    }
    return data
}

const recursive_score = function(map, y, x, h) {
    const height = map.length
    const width = map[0].length
    let S = new Set()

    if (h == 9) {
        S.add(x + y*width)
        return S
    }
    
    if (x+1 < width && map[y][x+1] == h+1) {
        S = S.union(recursive_score(map, y, x+1, h+1))
    }
    if (x-1 >= 0 && map[y][x-1] == h+1) {
        S = S.union(recursive_score(map, y, x-1, h+1))
    }
    if (y+1 < height && map[y+1][x] == h+1) {
        S = S.union(recursive_score(map, y+1, x, h+1))
    }
    if (y-1 >= 0 && map[y-1][x] == h+1) {
        S = S.union(recursive_score(map, y-1, x, h+1))
    }
    return S

}

const score_trailhead = function(map, a, b) {
    const height = map.length
    const width = map[0].length
    let positions = new Set()
    positions.add(a*width+b)
    for (let i = 0; i<9; i++) {
        let next = new Set()
        for (let coord of positions) {
            let y = Math.floor(coord/width)
            let x = coord % width
            if (x+1 < width && map[y][x+1] == i+1) {
                next.add(x+1 +y*width)
            }
            if (x-1 >= 0 && map[y][x-1] == i+1) {
                next.add(x-1 +y*width)
            }
            if (y+1 < height && map[y+1][x] == i+1) {
                next.add(x +(y+1)*width)
            }
            if (y-1 >= 0 && map[y-1][x] == i+1) {
                next.add(x +(y-1)*width)
            }
        }        
        positions = next
    }
    return positions.size
}

const recursive_rate = function(map, y, x, h) {
    if (h == 9) {
        return 1
    }

    const height = map.length
    const width = map[0].length

    let sum = 0
    if (x+1 < width && map[y][x+1] == h+1) {
        sum += recursive_rate(map, y, x+1, h+1)
    }
    if (x-1 >= 0 && map[y][x-1] == h+1) {
        sum += recursive_rate(map, y, x-1, h+1)
    }
    if (y+1 < height && map[y+1][x] == h+1) {
        sum += recursive_rate(map, y+1, x, h+1)
    }
    if (y-1 >= 0 && map[y-1][x] == h+1) {
        sum += recursive_rate(map, y-1, x, h+1)
    }
    return sum

}

const rate_trailhead = function(map, a, b) {
    const height = map.length
    const width = map[0].length
    const bwidth = BigInt(width)
    let positions = []
    positions.push(BigInt(a*width+b))
    for (let i = 0; i<9; i++) {
        let next = []
        for (let coord of positions) {
            let x = coord % bwidth
            let y = ((coord % (bwidth**2n)) - BigInt(x))/bwidth
            
            if (x+1n < bwidth && map[y][x+1n] == i+1) {
                next.push(BigInt(coord*bwidth**2n + x+1n +y*bwidth))
            }
            if (x-1n >= 0 && map[y][x-1n] == i+1) {
                next.push(BigInt(coord*bwidth**2n + x-1n +y*bwidth))
            }
            if (y+1n < BigInt(height) && map[y+1n][x] == i+1) {
                next.push(BigInt(coord*bwidth**2n + x +(y+1n)*bwidth))
            }
            if (y-1n >= 0 && map[y-1n][x] == i+1) {
                next.push(BigInt(coord*bwidth**2n + x +(y-1n)*bwidth))
            }
        }
        positions = next
    }
    return positions.length
}

const p1 = function(filename) {
    let map = parse(filename)
    let sum = 0
    for (let i = 0; i<map.length;i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 0) {
                // sum += recursive_score(map, i, j, 0).size
                sum += score_trailhead(map, i, j)
            }
        }
    }
    return sum
}

const p2 = function(filename) {
    let map = parse(filename)
    let sum = 0
    for (let i = 0; i<map.length;i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 0) {
                // sum += recursive_rate(map, i, j, 0)
                sum += rate_trailhead(map, i, j)
            }
        }
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d10.txt")
const time1 = process.hrtime(start1)

console.log("Day 10, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d10.txt")
const time2 = process.hrtime(start2)

console.log("Day 10, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")