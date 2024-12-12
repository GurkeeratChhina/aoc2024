const fs = require('fs')

const directions = [[1,0],[-1,0],[0,-1],[0,1]]

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = []
    for (const line of text.trim().split("\n")) {
        data.push(line.trim())
    }
    
    return data
}

const setpop = function(S) {
    for (const value of S) {
        S.delete(value)
        return value
    }
}


const p1 = function(filename) {
    let grid = parse(filename)
    let visited = new Set()
    let sum = 0

    let height = grid.length
    let width = grid[0].length

    for (let i = 0; i < height; i++) {
        for (let j = 0; j<width; j++) {
            key = JSON.stringify([i,j])
            if (visited.has(key)) {
                continue
            }
            
            let id = grid[i][j]
            let area = 0
            let to_check = new Set()
            to_check.add(key)
            let checked = new Set()
            while (to_check.size > 0) {
                let a = setpop(to_check)   
                let x = JSON.parse(a)[0]
                let y = JSON.parse(a)[1]
                if (x >= height || x <0 || y>=width || y < 0) {
                    continue
                }
                checked.add(a)
                if (grid[x][y] == id) {
                    visited.add(a)
                    area ++
                    for (const dir of directions) {
                        let key2 = JSON.stringify([x+dir[0],y+dir[1]])
                        if (!checked.has(key2)) {
                            to_check.add(key2)
                        }
                    }
                }

                
            }
            sum += area
        }
    }
    return sum
}

const p2 = function(filename) {
    let grid = parse(filename)
    let visited = new Set()
    let sum = 0

    let height = grid.length
    let width = grid[0].length

    for (let i = 0; i < height; i++) {
        for (let j = 0; j<width; j++) {
            key = JSON.stringify([i,j])
            if (visited.has(key)) {
                continue
            }
            
            let id = grid[i][j]
            // console.log("not continuing", id)
            let area = 0
            let perimeter = 0
            let to_check = new Set()
            to_check.add(key)
            let checked = new Set()
            while (to_check.size > 0) {
                // console.log(area)
                let a = setpop(to_check)   
                let x = JSON.parse(a)[0]
                let y = JSON.parse(a)[1]
                // console.log(a,x,y)
                if (x >= height || x <0 || y>=width || y < 0) {
                    continue
                }
                checked.add(a)
                if (grid[x][y] == id) {
                    visited.add(a)
                    area ++
                    perimeter+= 4
                    for (const dir of directions) {
                        if (x+dir[0] >= height || x+dir[0] <0 || y+dir[1]>=width || y+dir[1] < 0) {
                            continue
                        }
                        if (grid[x+dir[0]][y+dir[1]] == id) {
                            perimeter--
                        }
                    }
                    for (const dir of directions) {
                        let key2 = JSON.stringify([x+dir[0],y+dir[1]])
                        if (!checked.has(key2)) {
                            to_check.add(key2)
                        }
                    }
                }

                
            }
            sum += area*perimeter
            // console.log(sum)
        }
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d12.txt")
const time1 = process.hrtime(start1)

console.log("Day 12, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d12.txt")
const time2 = process.hrtime(start2)

console.log("Day 12, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")