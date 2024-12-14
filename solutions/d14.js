const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = []
    for (const line of text.trim().split("\n")) {
        let nums = line.match(/-?\d+/g)
        data.push(nums.map(x => Number(x)))
    }
    return data
}

const iterate_looping = function(x, y, dx, dy, loops, mx, my) {
    let fx = (x+loops*dx)%mx
    let fy = (y+loops*dy)%my
    if (fx < 0) {
        fx += mx
    }
    if (fy <0) {
        fy += my
    }
    return [fx, fy]
}

const draw_grid = function(points, mx, my) {
    for (let i = 0; i<my;i++) {
        let line = ""
        for (let j = 0; j<mx;j++) {
            if (points.has(j*mx + i)){
                line = line.concat('#')
            } else {
                line = line.concat('.')
            }
        }
        console.log(line);
    }
    sleep(500);
    // console.log('\033[2J');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const p1 = function(filename) {
    let data = parse(filename)
    // console.log(data)
    let quad1 = 0
    let quad2 = 0
    let quad3 = 0
    let quad4 = 0
    let mx = 101
    let my = 103
    for (let X of data) {
        let [fx, fy] = iterate_looping.apply(this, X.concat([100,mx,my]))
        // console.log(fx, fy)
        if (fx < mx/2-1 && fy < my/2-1) {
            quad2++
        } else if (fx < mx/2-1 && fy > my/2) {
            quad3++
        } else if (fx > mx/2 && fy < my/2-1) {
            quad1++
        } else if (fx > mx/2 && fy > my/2) {
            quad4++
        }
    }
    // console.log(quad1,quad2,quad3,quad4)
    return quad1*quad2*quad3*quad4
}

const p2 = async function(filename) {
    let data = parse(filename)
    let mx = 101
    let my = 103
    for (let i = 0; i< Math.max(mx,my); i++) {
        let points = new Set()
        for (let X of data) {
            let [fx, fy] = iterate_looping.apply(this, X.concat([i,mx,my]))
            points.add(fx*mx+fy)
        }
        // visually find when the input produces "bands" and then CRT the result manually
        console.log(i); 
        draw_grid(points, mx, my);
        await sleep(100)
    }
}

const start1 = process.hrtime()
const result1 = p1("data/d14.txt")
const time1 = process.hrtime(start1)

console.log("Day 14, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d14.txt")
const time2 = process.hrtime(start2)

console.log("Day 14, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")

