const fs = require('fs')
const math = require('mathjs')

const cardinals = [math.complex("-1"), math.complex("-i"), math.complex("1"), math.complex("i")]

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

const dir_to_int = function(dir) {
    for (let i = 0; i<cardinals.length; i++) {
        if (dir.equals(cardinals[i])) {
            return i
        }
    }
}

const encode = function (pos, dir, width) {
    return (pos.im*width+pos.re)*4 + dir_to_int(dir)
}

const decode = function(encoded, width) {
    let dir = cardinals[encoded%4]
    let pos = Math.floor(encoded/4)
    let x = pos%width
    let y = Math.floor(pos/width)
    return [math.complex(x,y),dir]
}

const p1 = function(filename) {
    let grid = parse(filename)
    let width = grid[0].length
    const start = find_start(grid)
    const initial_direction = cardinals[0]
    const end = find_end(grid)

    let visited = new Map()
    visited.set(encode(start, initial_direction, width),0)
    let queue = []
    queue.push([start, initial_direction, 0])

    while (queue.length > 0) {
        let [pos, dir, cv] = queue.shift()
        if (pos.equals(end)) {
            continue
        }
        let forward = math.add(pos, dir)
        if (grid[forward.im][forward.re] == '.') {
            let nv = cv +1
            if (visited.has(encode(forward, dir, width))) {
                if (visited.get(encode(forward,dir,width)) > nv ) {
                    visited.set(encode(forward,dir,width), nv)
                    queue.push([forward, dir, nv])
                }
            } else {
                visited.set(encode(forward,dir,width), nv)
                queue.push([forward, dir, nv])
            }
        }
        let left = math.multiply(dir, math.complex("i"))
        let right = math.multiply(dir, math.complex("-i"))
        let nv = cv + 1000
        if (visited.has(encode(pos, left, width))) {
            if (visited.get(encode(pos,left,width)) > nv ) {
                visited.set(encode(pos,left,width), nv)
                queue.push([pos, left, nv])
            }
        } else {
            visited.set(encode(pos,left,width), nv)
            queue.push([pos, left, nv])
        }
        if (visited.has(encode(pos, right, width))) {
            if (visited.get(encode(pos,right,width)) > nv ) {
                visited.set(encode(pos,right,width), nv)
                queue.push([pos, right, nv])
            }
        } else {
            visited.set(encode(pos,right,width), nv)
            queue.push([pos, right, nv])
        }
    }
    let min = 1e100
    for (let i = 0; i<cardinals.length; i++) {
        if (visited.has(encode(end, cardinals[i], width))) {
            min = Math.min(min, visited.get(encode(end, cardinals[i], width)))
        }
    }
    return min
}

const p2 = function(filename) {
    let grid = parse(filename)
    let width = grid[0].length
    let start = find_start(grid)
    let initial_direction = cardinals[0]
    const end = find_end(grid)

    let visited = new Map()
    visited.set(encode(start, initial_direction, width),0)
    let queue = []
    queue.push([start, initial_direction, 0])

    while (queue.length > 0) {
        let [pos, dir, cv] = queue.shift()
        if (pos.equals(end)) {
            continue
        }
        let forward = math.add(pos, dir)
        if (grid[forward.im][forward.re] == '.') {
            let nv = cv +1
            if (visited.has(encode(forward, dir, width))) {
                if (visited.get(encode(forward,dir,width)) > nv ) {
                    visited.set(encode(forward,dir,width), nv)
                    queue.push([forward, dir, nv])
                }
            } else {
                visited.set(encode(forward,dir,width), nv)
                queue.push([forward, dir, nv])
            }
        }
        let left = math.multiply(dir, math.complex("i"))
        let right = math.multiply(dir, math.complex("-i"))
        let nv = cv + 1000
        if (visited.has(encode(pos, left, width))) {
            if (visited.get(encode(pos,left,width)) > nv ) {
                visited.set(encode(pos,left,width), nv)
                queue.push([pos, left, nv])
            }
        } else {
            visited.set(encode(pos,left,width), nv)
            queue.push([pos, left, nv])
        }
        if (visited.has(encode(pos, right, width))) {
            if (visited.get(encode(pos,right,width)) > nv ) {
                visited.set(encode(pos,right,width), nv)
                queue.push([pos, right, nv])
            }
        } else {
            visited.set(encode(pos,right,width), nv)
            queue.push([pos, right, nv])
        }
    }

    let min = 1e100
    for (let i = 0; i<cardinals.length; i++) {
        if (visited.has(encode(end, cardinals[i], width))) {
            min = Math.min(min, visited.get(encode(end, cardinals[i], width)))
        }
    }

    let onpath = new Set()
    for (let [key, val] of visited.entries()) {
        [start, initial_direction] = decode(key, width)
        if (onpath.has((start.im*width+start.re))) {
            continue
        }
        let visited2 = new Map()
        visited2.set(encode(start, initial_direction, width),val)
        queue = []
        queue.push([start, initial_direction, val])

        while (queue.length > 0) {
            let [pos, dir, cv] = queue.shift()
            if (pos.equals(end) || val > min) {
                continue
            }
            let forward = math.add(pos, dir)
            if (grid[forward.im][forward.re] == '.') {
                let nv = cv +1
                if (visited2.has(encode(forward, dir, width))) {
                    if (visited2.get(encode(forward,dir,width)) > nv ) {
                        visited2.set(encode(forward,dir,width), nv)
                        queue.push([forward, dir, nv])
                    }
                } else {
                    visited2.set(encode(forward,dir,width), nv)
                    queue.push([forward, dir, nv])
                }
            }
            let left = math.multiply(dir, math.complex("i"))
            let right = math.multiply(dir, math.complex("-i"))
            let nv = cv + 1000
            if (visited2.has(encode(pos, left, width))) {
                if (visited2.get(encode(pos,left,width)) > nv ) {
                    visited2.set(encode(pos,left,width), nv)
                    queue.push([pos, left, nv])
                }
            } else {
                visited2.set(encode(pos,left,width), nv)
                queue.push([pos, left, nv])
            }
            if (visited2.has(encode(pos, right, width))) {
                if (visited2.get(encode(pos,right,width)) > nv ) {
                    visited2.set(encode(pos,right,width), nv)
                    queue.push([pos, right, nv])
                }
            } else {
                visited2.set(encode(pos,right,width), nv)
                queue.push([pos, right, nv])
            }
        }
        let min2 = 1e100
        for (let i = 0; i<cardinals.length; i++) {
            if (visited2.has(encode(end, cardinals[i], width))) {
                min2 = Math.min(min2, visited2.get(encode(end, cardinals[i], width)))
            }
        }
        if (min2 == min) {
            // console.log("min2", min2, "is on the shortest path")
            onpath.add((start.im*width+start.re))
        }
    }
    // for (let key of onpath) {
    //     console.log(Math.floor(key/width), key%width)
    // }
    return onpath.size
}

const p2_2 = function(filename) {
    let grid = parse(filename)
    let width = grid[0].length
    let start = find_start(grid)
    let initial_direction = cardinals[0]
    const end = find_end(grid)

    let visited = new Map()
    visited.set(encode(start, initial_direction, width),0)
    let queue = []
    queue.push([start, initial_direction, 0])

    while (queue.length > 0) {
        let [pos, dir, cv] = queue.shift()
        if (pos.equals(end)) {
            continue
        }
        let forward = math.add(pos, dir)
        if (grid[forward.im][forward.re] == '.') {
            let nv = cv +1
            if (visited.has(encode(forward, dir, width))) {
                if (visited.get(encode(forward,dir,width)) > nv ) {
                    visited.set(encode(forward,dir,width), nv)
                    queue.push([forward, dir, nv])
                }
            } else {
                visited.set(encode(forward,dir,width), nv)
                queue.push([forward, dir, nv])
            }
        }
        let left = math.multiply(dir, math.complex("i"))
        let right = math.multiply(dir, math.complex("-i"))
        let nv = cv + 1000
        if (visited.has(encode(pos, left, width))) {
            if (visited.get(encode(pos,left,width)) > nv ) {
                visited.set(encode(pos,left,width), nv)
                queue.push([pos, left, nv])
            }
        } else {
            visited.set(encode(pos,left,width), nv)
            queue.push([pos, left, nv])
        }
        if (visited.has(encode(pos, right, width))) {
            if (visited.get(encode(pos,right,width)) > nv ) {
                visited.set(encode(pos,right,width), nv)
                queue.push([pos, right, nv])
            }
        } else {
            visited.set(encode(pos,right,width), nv)
            queue.push([pos, right, nv])
        }
    }

    let onpath = new Set()
    onpath.add(end.im*width+end.re)
    queue = []
    for (let i = 0; i<cardinals.length; i++) {
        if (visited.has(encode(end, cardinals[i], width)) && visited.get(encode(end, cardinals[i], width)) == min) {
            queue.push([end, cardinals[i]])
            
        }
    }
    while (queue.length > 0) {
        let [pos, dir] = queue.shift()
        let curr_val = visited.get(encode(pos, dir, width))

        let backward = math.add(pos, dir.neg())
        let left = math.multiply(dir, math.complex("i"))
        let right = math.multiply(dir, math.complex("-i"))

        let b_val = visited.get(encode(backward, dir, width)) || 1e100
        let l_val = visited.get(encode(pos, left, width)) || 1e100
        let r_val = visited.get(encode(pos, right, width)) || 1e100

        if (b_val < curr_val) {
            onpath.add(backward.im*width+backward.re)
            queue.push([backward,dir])
        }
        if (l_val < curr_val) {
            queue.push([pos,left])
        }
        if (r_val < curr_val) {
            queue.push([pos,right])
        }
    }

    return onpath.size
}

const start1 = process.hrtime()
const result1 = p1("data/d16.txt")
const time1 = process.hrtime(start1)

console.log("Day 16, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d16.txt")
const time2 = process.hrtime(start2)

console.log("Day 16, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")