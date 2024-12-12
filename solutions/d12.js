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

const count_sides = function(point_set) {
    let c = 0
    for (let p of point_set) {
        let x = JSON.parse(p)[0]
        let y = JSON.parse(p)[1]
        let u = JSON.stringify([x-1, y])
        let d = JSON.stringify([x+1, y])
        let l = JSON.stringify([x, y-1])
        let r = JSON.stringify([x, y+1])
        let ul = JSON.stringify([x-1, y-1])
        let ur = JSON.stringify([x-1, y+1])
        let dl = JSON.stringify([x+1, y-1])
        let dr = JSON.stringify([x+1, y+1])

        if (!point_set.has(u) && !point_set.has(l) && !point_set.has(ul)) {
            c+=1
        }
        if (!point_set.has(d) && !point_set.has(r) && !point_set.has(dr)) {
            c+=1
        }
        if (!point_set.has(u) && !point_set.has(r) && !point_set.has(ur)) {
            c+=1
        }
        if (!point_set.has(d) && !point_set.has(l) && !point_set.has(dl)) {
            c+=1
        }
    }
    return c
}

const count_sides_inverse = function(point_set, mheight, mwidth) {
    let c = 0
    for (let p of point_set) {
        let x = JSON.parse(p)[0]
        let y = JSON.parse(p)[1]
        let u = JSON.stringify([x-1, y])
        let d = JSON.stringify([x+1, y])
        let l = JSON.stringify([x, y-1])
        let r = JSON.stringify([x, y+1])
        if (x-1 >= 0 && y-1 >= 0 && !point_set.has(u) && !point_set.has(l)) {
            c+=1
        }
        if (x+1 < mheight && y+1 < mwidth && !point_set.has(d) && !point_set.has(r)) {
            c+=1
        }
        if (x-1 >= 0 && y+1 < mwidth && !point_set.has(u) && !point_set.has(r)) {
            c+=1
        }
        if (x+1 < mheight && y-1 >= 0 && !point_set.has(d) && !point_set.has(l)) {
            c+=1
        }
    }
    return c
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
            let perimeter = 0
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

    let full_set = new Set()
    for (let i = 0; i < height; i++) {
        for (let j = 0; j<width; j++) {
            key = JSON.stringify([i,j])
            full_set.add(key)
        }
    }

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
            let found = new Set()
            while (to_check.size > 0) {
                let a = setpop(to_check)   
                let x = JSON.parse(a)[0]
                let y = JSON.parse(a)[1]
                if (x >= height || x <0 || y>=width || y < 0) {
                    continue
                }
                checked.add(a)
                if (grid[x][y] == id) {
                    found.add(a)
                    area ++
                    for (const dir of directions) {
                        let key2 = JSON.stringify([x+dir[0],y+dir[1]])
                        if (!checked.has(key2)) {
                            to_check.add(key2)
                        }
                    }
                }
            }
            visited = visited.union(found)
            let unvisited = full_set.difference(found)
            // console.log(id, count_sides(found), count_sides_inverse(unvisited, height, width))
            let sides = count_sides(found) + count_sides_inverse(unvisited, height, width)
            // console.log(id, sides)
            sum += area*sides
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