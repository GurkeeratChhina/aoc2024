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

const extended_euclid = function(M, N) {
    let r1 = M
    let r2 = N
    let s1 = 1
    let s2 = 0
    let t1 = 0
    let t2 = 1
    while(r2 > 0) {
        let rtemp = r1 % r2
        let q = (r1-rtemp)/r2
        let stemp = s1 - q*s2
        let ttemp = t1 - q*t2
        r1 = r2
        r2 = rtemp
        s1 = s2
        s2 = stemp
        t1 = t2
        t2 = ttemp
    }
    return [s1, t1]
}

// x = a mod M, b mod N
const CRT = function(a, b, M, N) {
    let [c, d] = extended_euclid(M,N)
    let X = (a*N*d +b*M*c) % (M*N)
    if (X < 0) {
        X += M*N
    }
    return X
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

const p2 = function(filename) {
    let data = parse(filename)
    let mx = 101
    let my = 103
    let hband = 0
    let vband = 0
    let treeheight = 33
    let treewidgth = 31
    for (let i = 0; i< Math.max(mx, my); i++) {
        let points = new Set()
        for (let X of data) {
            let [fx, fy] = iterate_looping.apply(this, X.concat([i,mx,my]))
            points.add(fx*mx+fy)
        }
        if (hband >0 && vband >0) {
            break
        } else if (vband > 0) {
            let height_map = new Map()
            for (let n = 0; n < my; n++) {
                height_map.set(n, 0)
            }

            for (let p of points) {
                let y = p%mx
                height_map.set(y, height_map.get(y)+1)
            }

            let count = 0
            for (let k = 0; k <treeheight; k++) {
                count += height_map.get(k)
            }
            for (let j = 0; j<my-treeheight; j++) {
                if (count > points.size/2) {
                    hband = i
                    break
                }
                count -= height_map.get(j)
                count += height_map.get(j+treeheight)
            }
        } else if (hband > 0) {
            let width_map = new Map()
            for (let n = 0; n < mx; n++) {
                width_map.set(n, 0)
            }

            for (let p of points) {
                let x = Math.floor(p/mx)
                width_map.set(x, width_map.get(x)+1)
            }

            count = 0
            for (let k = 0; k <treewidgth; k++) {
                count += width_map.get(k)
            }
            for (let j = 0; j<my-treewidgth; j++) {
                if (count > points.size/2) {
                    vband = i
                    break
                }
                count -= width_map.get(j)
                count += width_map.get(j+treewidgth)
            }
        } else {
            let height_map = new Map()
            let width_map = new Map()
            for (let n = 0; n < mx; n++) {
                width_map.set(n, 0)
            }
            for (let n = 0; n < my; n++) {
                height_map.set(n, 0)
            }

            for (let p of points) {
                let y = p%mx
                let x = Math.floor(p/mx)
                height_map.set(y, height_map.get(y)+1)
                width_map.set(x, width_map.get(x)+1)
            }

            let count = 0
            for (let k = 0; k <treeheight; k++) {
                count += height_map.get(k)
            }
            for (let j = 0; j<my-treeheight; j++) {
                if (count > points.size/2) {
                    hband = i
                    break
                }
                count -= height_map.get(j)
                count += height_map.get(j+treeheight)
            }

            count = 0
            for (let k = 0; k <treewidgth; k++) {
                count += width_map.get(k)
            }
            for (let j = 0; j<my-treewidgth; j++) {
                if (count > points.size/2) {
                    vband = i
                    break
                }
                count -= width_map.get(j)
                count += width_map.get(j+treewidgth)
            }
            
        }
    }
    // console.log(hband, vband)
    // X = hband mod my, X = vband mod mx
    return CRT(hband, vband, my, mx)
}

const start1 = process.hrtime()
const result1 = p1("data/d14.txt")
const time1 = process.hrtime(start1)

console.log("Day 14, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d14.txt")
const time2 = process.hrtime(start2)

console.log("Day 14, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")

