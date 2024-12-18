const fs = require('fs')

const dirctions = [[0,1], [0,-1], [1,0], [-1,0]]

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = []
    for (const line of text.trim().split("\n")) {
        data.push(line.match(/\d+/g))
    }
    return data
}

const build_grid = function(max_x, max_y, obstuctions, iterations) {
    let grid = []
    for (let i = 0; i< max_y; i++) {
        let line = []
        for (let j = 0; j < max_x; j++) {
            line.push(1e100)
        }
        grid.push(line)
    }
    for (let i = 0; i < iterations; i++) {
        let [x, y] = obstuctions[i]
        grid[y][x] = -1
    }
    return grid
}

const p1 = function(filename) {
    let bytes = parse(filename)
    let width = 71
    let height = 71
    let grid = build_grid(width,height,bytes,1024)
    grid[0][0] = 0

    let queue = []
    queue.push([0,0])
    while (queue.length > 0) {
        let [x,y] = queue.shift()
        let curr_val = grid[y][x]
        for (let dir of dirctions) {
            let nx = x + dir[0]
            let ny = y + dir[1]
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                if (grid[ny][nx] != -1 && grid[ny][nx] > curr_val + 1) {
                    grid[ny][nx] = curr_val + 1
                    queue.push([nx,ny])
                }
            }
        }
    }
    return grid[height-1][width-1]
}

const p2 = function(filename) {
    let bytes = parse(filename)
    let width = 71
    let height = 71
    let i = 1024

    while (true) {
        let grid = build_grid(width,height,bytes,i)
        grid[0][0] = 0
        let queue = []
        queue.push([0,0])
        while (queue.length > 0) {
            let [x,y] = queue.shift()
            let curr_val = grid[y][x]
            for (let dir of dirctions) {
                let nx = x + dir[0]
                let ny = y + dir[1]
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    if (grid[ny][nx] != -1 && grid[ny][nx] > curr_val + 1) {
                        grid[ny][nx] = curr_val + 1
                        queue.push([nx,ny])
                    }
                }
            }
        }
        if (grid[height-1][width-1] > 1e99) {
            break
        }
        i++
    }
    return bytes[i-1]
}

const start1 = process.hrtime()
const result1 = p1("data/d18.txt")
const time1 = process.hrtime(start1)

console.log("Day 18, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d18.txt")
const time2 = process.hrtime(start2)

console.log("Day 18, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")