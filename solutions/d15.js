const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let grid = []
    let halves = text.trim().split('\n\n')
    let moves = []
    for (const line of halves[0].trim().split('\n')) {
        grid.push(line.trim().split(''))
    }
    for (const line of halves[1].trim().split('\n')) {
        moves = moves.concat(line.trim().split(''))
    }
    
    return [grid, moves]
}

const move = function(grid, x, y, dx, dy) {
    let nx = x +dx
    let ny = y +dy
    while(grid[ny][nx] == 'O') {
        nx += dx
        ny += dy
    }
    if(grid[ny][nx] == '#') {
        return [x,y]
    }
    grid[ny][nx] = 'O'
    grid[y][x] = '.'
    grid[y+dy][x+dx] = '@'
    return [x+dx, y+dy]
}

const find_robot = function(grid) {
    for (let i =0; i<grid.length; i++) {
        for (let j = 0; j<grid[0].length;j++) {
            if (grid[i][j] == '@') {
                return [j,i]
            }
        }
    }
}

const arrow_to_dir = function(arrow) {
    switch(arrow) {
        case '^':
            return [0,-1]
        case 'v':
            return [0,1]
        case '<':
            return [-1,0]
        case '>':
            return [1,0]
    }
}

const widen = function(grid) {
    let newgrid = []
    for (let i =0; i<grid.length; i++) {
        let newline = []
        for (let j = 0; j<grid[0].length;j++) {
            const char = grid[i][j]
            switch(char) {
                case '#':
                    newline.push('#');
                    newline.push('#');
                    break;
                case '.':
                    newline.push('.');
                    newline.push('.');
                    break;
                case 'O':
                    newline.push('[');
                    newline.push(']');
                    break;
                case '@':
                    newline.push('@');
                    newline.push('.');
                    break;
            }
        }
        newgrid.push(newline)
    }
    // console.log(newgrid)
    return newgrid
    
}

const move_wide = function(grid, x, y, dx, dy) {
    // console.log(x,y,dx,dy)
    const width = grid[0].length
    let stack = []
    stack.push((y+dy)*width+x+dx)
    // console.log(stack)
    let to_move_lefts = new Set()
    let to_move_rights = new Set()
    while(stack.length>0) {
        const parsing = stack.shift()
        const ny = Math.floor(parsing/width)
        const nx = parsing%width
        // console.log(parsing, ny, nx)
        switch (grid[ny][nx]) {
            case '#':
                return [x,y]
            case '.':
                continue

            // check these cases for infinite loops
            case '[':
                if (to_move_lefts.has(parsing)) {
                    continue
                }
                stack.push((ny+dy)*width+nx+dx)
                stack.push((ny+dy)*width+nx+1+dx)
                to_move_lefts.add(ny*width+nx)
                break;
            case ']':
                if (to_move_rights.has(parsing)) {
                    continue
                }
                stack.push((ny+dy)*width+nx+dx)
                stack.push((ny+dy)*width+nx-1+dx)
                to_move_rights.add(ny*width+nx)
                break;
        }
    }

    for (const left of to_move_lefts) {
        const ny = Math.floor(left/width)
        const nx = left%width
        grid[ny][nx] = '.'
        grid[ny][nx+1] = '.'
    }
    for (const right of to_move_rights) {
        const ny = Math.floor(right/width)
        const nx = right%width
        grid[ny][nx] = '.'
        grid[ny][nx-1] = '.'
    }

    for (const left of to_move_lefts) {
        const ny = Math.floor(left/width)
        const nx = left%width
        grid[ny+dy][nx+dx] = '['
        grid[ny+dy][nx+1+dx] = ']'
    }
    for (const right of to_move_rights) {
        const ny = Math.floor(right/width)
        const nx = right%width
        grid[ny+dy][nx+dx] = ']'
        grid[ny+dy][nx-1 +dx] = '['
    }

    grid[y+dy][x+dx] = '@'
    grid[y][x] = '.'
    return [x+dx, y+dy]
}

const p1 = function(filename) {
    let [grid, moves] = parse(filename)
    let [curr_x, curr_y] = find_robot(grid)
    while(moves.length > 0) {
        const [dx, dy] = arrow_to_dir(moves.shift());
        [curr_x, curr_y] = move(grid, curr_x, curr_y, dx, dy)
    }

    let sum = 0
    for (let i =0; i<grid.length; i++) {
        for (let j = 0; j<grid[0].length;j++) {
            if (grid[i][j] == 'O') {
                sum += 100*i + j
            }
        }
    }
    // console.log(grid)

    return sum
}

const p2 = function(filename) {
    let [grid, moves] = parse(filename)
    grid = widen(grid)
    let [curr_x, curr_y] = find_robot(grid)
    while(moves.length > 0) {
        const [dx, dy] = arrow_to_dir(moves.shift());
        // console.log("moves left", moves.length, "direction", dx, dy)
        [curr_x, curr_y] = move_wide(grid, curr_x, curr_y, dx, dy)
    }
    
    // console.log(grid)
    
    let sum = 0
    for (let i =0; i<grid.length; i++) {
        for (let j = 0; j<grid[0].length;j++) {
            if (grid[i][j] == '[') {
                sum += 100*i + j
            }
        }
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d15.txt")
const time1 = process.hrtime(start1)

console.log("Day 15, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d15.txt")
const time2 = process.hrtime(start2)

console.log("Day 15, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")