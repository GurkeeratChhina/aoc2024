const fs = require('fs')
const math = require('mathjs')

const directions = [math.complex("-1"), math.complex("-i"), math.complex("1"), math.complex("i")]

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = []
    for (const line of text.trim().split("\n")) {
        data.push(line.trim().split(''))
    }
    return data
}

const find_start = function (grid) {
    for (let i = 0; i< grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == 'S') {
                grid[i][j] = '.'
                return math.complex(j, i)
            }
        }
    }
}

const find_end = function (grid) {
    for (let i = 0; i< grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == 'E') {
                grid[i][j] = '.'
                return math.complex(j, i)
            }
        }
    }
}

const l1_dist = function(a, b) {
    return Math.abs(a.re-b.re) + Math.abs(a.im-b.im)
}


const p1 = function(filename) {
    let grid = parse(filename)
    let width = grid[0].length
    const start = find_start(grid)
    const end = find_end(grid)


    const encode = function(position) {
        return position.im*width + position.re
    }

    const decode = function(code) {
        return math.complex(code%width, Math.floor(code/width))
    }

    const l1_sphere = function(point, distance) {
        let circle = new Set()
        circle.add(point)
        let next_circle = new Set()
        let sphere = []
        sphere.push(circle)
        for (let i = 0; i < distance; i++) {
            for (let p of circle){
                for (let dir of directions) {
                    let next_point = math.add(decode(p),dir)
                    next_circle.add(encode(next_point))
                }
            }
            // console.log(next_circle)
            sphere.push(next_circle)
            circle = next_circle
            next_circle = new Set()
        }
        return sphere
    }

    let visited = new Map()
    visited.set(encode(start),0)
    let queue = []
    queue.push(start)

    while (queue.length > 0) {
        let curr = queue.shift()
        for (let dir of directions) {
            let next = math.add(curr, dir)
            if (grid[next.im][next.re] == '#') {
                continue
            }
            let val = visited.get(encode(curr))
            if (visited.has(encode(next))) {
                if (visited.get(encode(next)) > val + 1) {
                    visited.set(encode(next), val+1)
                    queue.push(next)
                }
            } else {
                visited.set(encode(next), val+1)
                queue.push(next)
            }
        }
    }

    let count = 0
    for (let [key, val] of visited) {
        let l1_distances = l1_sphere(key, 2)
        for (let i = 1; i<l1_distances.length; i++) {
            for (let p of l1_distances[i]) {
                if (visited.has(p) && visited.get(p) - val >= (100+i)) {
                    count++
                }
            }            
        }
    }
    return count
}

const p2 = function(filename) {
    let grid = parse(filename)
    let width = grid[0].length
    let height = grid.length
    const start = find_start(grid)
    const end = find_end(grid)


    const encode = function(position) {
        return position.im*width + position.re
    }

    const decode = function(code) {
        return math.complex(code%width, Math.floor(code/width))
    }

    let visited = new Map()
    visited.set(encode(start),0)
    let queue = []
    queue.push(start)

    while (queue.length > 0) {
        let curr = queue.shift()
        for (let dir of directions) {
            let next = math.add(curr, dir)
            if (grid[next.im][next.re] == '#') {
                continue
            }
            let val = visited.get(encode(curr))
            if (visited.has(encode(next))) {
                if (visited.get(encode(next)) > val + 1) {
                    visited.set(encode(next), val+1)
                    queue.push(next)
                }
            } else {
                visited.set(encode(next), val+1)
                queue.push(next)
            }
        }
    }

    let count = 0
    for (let [key1, val1] of visited) {
        for (let [key2, val2] of visited) {
            let d = l1_dist(decode(key1), decode(key2))
            if (d <= 20 && val1 - val2 - d >= 100) {
                count++
            }
        }
    }
    return count
}

const start1 = process.hrtime()
const result1 = p1("data/d20.txt")
const time1 = process.hrtime(start1)

console.log("Day 20, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d20.txt")
const time2 = process.hrtime(start2)

console.log("Day 20, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")