const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    const data = []
    for (const line of text.trim().split("\n")) {
        data.push(line.trim())
    }
    
    return data
}

const find_antennae = function(data) {
    const height = data.length
    const width = data[0].length
    let points = new Map()
    for (let i = 0; i<height; i++) {
        for (let j = 0; j<width; j++) {
            if (data[i][j] != '.') {
                const char = data[i][j]
                let existing = points.get(char) || []
                existing.push(i*width+j)
                points.set(char, existing)
            }
        }
    }
    return points
}

const gcd = function(a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}

const p1 = function(filename) {
    let grid = parse(filename)
    let points = find_antennae(grid)
    const height = grid.length
    const width = grid[0].length

    let antinodes = new Set()
    for (let [key,coords] of points) {
        for (let i = 0; i< coords.length-1; i++) {
            for (let j = i+1; j< coords.length; j++) {
                let y1 = Math.floor(coords[i]/width)
                let x1 = coords[i] % width
                let y2 = Math.floor(coords[j]/width)
                let x2 = coords[j] % width

                let dx = x2 - x1
                let dy = y2 - y1

                let nx1 = x1 - dx
                let ny1 = y1 - dy

                let nx2 = x1 + 2*dx
                let ny2 = y1 + 2*dy

                if (nx1 >= 0 && nx1 < width && ny1 >= 0 && ny1 < height) {
                    antinodes.add(ny1*width+nx1)
                }

                if (nx2 >= 0 && nx2 < width && ny2 >= 0 && ny2 < height) {
                    antinodes.add(ny2*width+nx2)
                }
            }
        }
    }
    return antinodes.size
}

const p2 = function(filename) {
    let grid = parse(filename)
    let points = find_antennae(grid)
    const height = grid.length
    const width = grid[0].length

    let antinodes = new Set()
    for (let [key,coords] of points) {
        for (let i = 0; i< coords.length-1; i++) {
            for (let j = i+1; j< coords.length; j++) {
                let y1 = Math.floor(coords[i]/width)
                let x1 = coords[i] % width
                let y2 = Math.floor(coords[j]/width)
                let x2 = coords[j] % width

                let dx = x2 - x1
                let dy = y2 - y1

                let d = Math.abs(gcd(dx, dy))
                dx = dx/d
                dy = dy/d
            
                let nx1 = x1
                let ny1 = y1

                while (nx1 >= 0 && nx1 < width && ny1 >= 0 && ny1 < height) {
                    antinodes.add(ny1*width+nx1)
                    nx1 = nx1 - dx
                    ny1 = ny1 - dy
                }

                nx1 = x1 + dx
                ny1 = y1 + dy

                while (nx1 >= 0 && nx1 < width && ny1 >= 0 && ny1 < height) {
                    antinodes.add(ny1*width+nx1)
                    nx1 = nx1 + dx
                    ny1 = ny1 + dy
                }
            }
        }
    }
    return antinodes.size
}

const start1 = process.hrtime()
const result1 = p1("data/d8.txt")
const time1 = process.hrtime(start1)

console.log("Day 8, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d8.txt")
const time2 = process.hrtime(start2)

console.log("Day 8, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")