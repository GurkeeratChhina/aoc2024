const fs = require('fs')

const directions = [[0,1],[0,-1],[1,0],[-1,0]]

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = []
    for (const line of text.trim().split("\n")) {
        data.push(line.trim().split('').map(x=>to_number(x)))
    }
    return data
}

const find_start = function (grid) {
    for (let i = 0; i< grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == 0) {
                return [j, i]
            }
        }
    }
}

const to_number = function(char) {
    switch (char) {
        case 'S':
            return 0
        case 'E':
        case '.':
            return 1e20
        case '#':
            return -1
    }
}

const min_path = function(grid) {
    const start = find_start(grid)
    let queue = []
    queue.push(start)

    while (queue.length > 0) {
        let [cx, cy] = queue.shift()
        let curr_val = grid[cy][cx]
        for (let dir of directions) {
            let nx = cx + dir[0]
            let ny = cy + dir[1]
            let next_val = grid[ny][nx]
            if (next_val == -1) {
                continue
            } else if (next_val > curr_val + 1) {
                grid[ny][nx] = curr_val + 1
                queue.push([nx, ny])
            }
        }
    }
}

const find_cheats = function(grid, radius, saving) {
    let count = 0
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            count += find_cheats_pointed(grid, j, i, radius, saving)
        }
    }
    return count
}

const find_cheats_pointed = function(grid, x, y, radius, saving) {
    let count = 0
    for (let dx = -1*radius; dx <= radius; dx++) {
        let leftover = radius - Math.abs(dx)
        for (let dy = -1*leftover; dy <= leftover ;dy++) {
            let nx = x+dx
            let ny = y+dy
            if (nx < 0 || nx >= grid[0].length || ny < 0 || ny >= grid.length) {
                continue
            } else if (grid[ny][nx] == -1){
                continue
            }
            let d = Math.abs(dx) + Math.abs(dy)
            if (grid[y][x] - grid[ny][nx] - d >= saving) {
                count++
            }
        }
    }
    return count
}


const p1 = function(filename) {
    let grid = parse(filename)
    min_path(grid)
    return find_cheats(grid, 2, 100)
}

const p2 = function(filename) {
    let grid = parse(filename)
    min_path(grid)
    return find_cheats(grid, 20, 100)
}

const start1 = process.hrtime()
const result1 = p1("data/d20.txt")
const time1 = process.hrtime(start1)

console.log("Day 20, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d20.txt")
const time2 = process.hrtime(start2)

console.log("Day 20, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")