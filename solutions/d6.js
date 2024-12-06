const fs = require('fs')

const parse = function(filename) {
    const data = []
    var text = fs.readFileSync(filename,'utf8')

    for (let line of text.trim().split("\n")) {
        data.push(line.trim())
    }
    
    return data
}

const loops = function(map, x, y) {
    const visited = new Set()
    let dx = 0
    let dy = -1
    while (true) {
        let encoded = (x*map.length + y)*5+(dx*2+dy+2) 
        if (visited.has(encoded)) {
            return true
        } else {
            visited.add(encoded)
        }
        xnext = x+dx
        ynext = y+dy
        if (xnext == map[0].length || xnext == -1 || ynext == map.length || ynext == -1) {
            break
        } else if (map[ynext][xnext] == '#'){
            dxnext = -dy
            dynext = dx
            dx = dxnext
            dy = dynext
        } else {
            x = xnext
            y = ynext
        }
    }
    return false
}

const p1 = function(filename) {
    let x = 0
    let y = 0
    const map = parse(filename)

    loop1:
    for (let i = 0; i<map.length; i++) {  
        for (let j = 0; j<map[0].length; j++) {
            if (map[i][j] == '^') {
                x = j
                y = i
                break loop1
            }
        }
    }
    
    let dx = 0
    let dy = -1
    const visited = new Set()
    while (true) {
        if (!visited.has(x*map.length+y)) {
            visited.add(x*map.length+y)
        }
        xnext = x+dx
        ynext = y+dy
        if (xnext == map[0].length || xnext == -1 || ynext == map.length || ynext == -1) {
            break
        } else if (map[ynext][xnext] == '#'){
            dxnext = -dy
            dynext = dx
            dx = dxnext
            dy = dynext
        } else {
            x = xnext
            y = ynext
        }
    }
    return visited.size
}

const p2 = function(filename) {
    let xi = 0
    let yi = 0
    let map = parse(filename)

    loop1:
    for (let i = 0; i<map.length; i++) {  
        for (let j = 0; j<map[0].length; j++) {
            if (map[i][j] == '^') {
                xi = j
                yi = i
                break loop1
            }
        }
    }
    
    let x = xi
    let y = yi
    let dx = 0
    let dy = -1
    const visited = new Set()
    while (true) {
        if (!visited.has(x*map.length+y)) {
            visited.add(x*map.length+y)
        }
        xnext = x+dx
        ynext = y+dy
        if (xnext == map[0].length || xnext == -1 || ynext == map.length || ynext == -1) {
            break
        } else if (map[ynext][xnext] == '#'){
            dxnext = -dy
            dynext = dx
            dx = dxnext
            dy = dynext
        } else {
            x = xnext
            y = ynext
        }
    }

    let count = 0

    for (const val of visited) {
        let x = Math.floor(val / 130);
        let y = val % 130;
        let str = map[y]
        map[y] = str.substring(0,x) + '#' + str.substring(x+1)
        if (loops(map, xi, yi)) {
            count ++
        }
        map[y] = str.substring(0,x) + '.' + str.substring(x+1)
    }

    return count
}

const start1 = process.hrtime()
const result1 = p1("data/d6.txt")
const time1 = process.hrtime(start1)

console.log("Day 6, part 1 answer: ", result1, " took ", time1[0]*1000+time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d6.txt")
const time2 = process.hrtime(start2)

console.log("Day 6, part 2 answer: ", result2, " took ", time2[0]*1000+time2[1]/1000000, "milliseconds")