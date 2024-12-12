const { count } = require('console')
const fs = require('fs')

const cache = new Map()

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    const data = []
    for (const num of text.trim().split(/\s+/)) {
        data.push(Number(num))
    }
    
    return data
}

const update = function(arr) {
    const newarr = []
    for (const num of arr) {
        if (num == 0) {
            newarr.push(1)
        } else if (num.toString().length%2 == 0) {
            const x = num.toString()
            const first = x.slice(0,x.length/2)
            const second = x.slice(x.length/2, x.length)
            newarr.push(Number(first))
            newarr.push(Number(second))
        } else {
            newarr.push(2024*num)
        }
    }
    return newarr
}

const update_memoized = function(iters, n) {
    const key = JSON.stringify([iters, n])
    let result = 0
    if (cache.has(key)) {
        return cache.get(key);
    } else if (iters == 0) {
        result = 1
    } else if (n == 0) {
        result = update_memoized(iters-1,1)
    } else if (n.toString().length%2 == 0) {
        const x = n.toString()
        const first = x.slice(0,x.length/2)
        const second = x.slice(x.length/2, x.length)
        result =  update_memoized(iters-1, Number(first)) + update_memoized(iters-1,Number(second))
    } else {
        result = update_memoized(iters-1, 2024*n)   
    }
    cache.set(key, result)
    return result
}


const f = function(iters, x) {
    const key = JSON.stringify([iters, x])
    let result = 0
    if (cache.has(key)) {
        return cache.get(key);
    } else if (iters==0) {
        result = 1
    }
    switch(x) {
        case 0:
            if (iters>=1) {
                result = f(iters-1,1)
            } else {
                result = update_memoized(iters,x)
            }
        case 1:
            if (iters>=3) {
                result = 2*f(iters-3,2) + f(iters-3,0) + f(iters-3, 4)
            } else {
                result = update_memoized(iters,x)
            }
        case 2:
            if (iters>=3) {
                result = 2*f(iters-3,4) + f(iters-3,0) + f(iters-3, 8)
            } else {
                result = update_memoized(iters,x)
            }
        case 3:
            if (iters>=3) {
                result = f(iters-3,6) + f(iters-3,0) + f(iters-3, 7) + f(iters-3, 2)
            } else {
                result = update_memoized(iters,x)
            }
        case 4:
            if (iters>=3) {
                result = f(iters-3,8) + f(iters-3,0) + f(iters-3, 9) + f(iters-3, 6)
            } else {
                result = update_memoized(iters,x)
            }
        case 5:
            if (iters>=5) {
                result = 2*f(iters-5,2) + 2*f(iters-5,0) + 3*f(iters-5, 8) + f(iters-5, 4)
            } else {
                result = update_memoized(iters,x)
            }
        case 6:
            if (iters>=5) {
                result = 2*f(iters-5,4) + 2*f(iters-5,5) + f(iters-5, 2) + f(iters-5, 7) + f(iters-5, 9) + f(iters-5, 6)
            } else {
                result = update_memoized(iters,x)
            }
        case 7:
            if (iters>=5) {
                result = 2*f(iters-5,2) + 2*f(iters-5,6) + f(iters-5, 8) + f(iters-5, 7) + f(iters-5, 0) + f(iters-5, 3)
            } else {
                result = update_memoized(iters,x)
            }
        case 8:
            if (iters>=5) {
                result = 2*f(iters-5,2) + 2*f(iters-5,7) + f(iters-5, 3) + f(iters-5, 6) + f(iters-4, 8)
            } else {
                result = update_memoized(iters,x)
            }
        case 9:
            if (iters>=5) {
                result = 2*f(iters-5,6) + 2*f(iters-5,8) + f(iters-5, 3) + f(iters-5, 1) + f(iters-5, 9) + f(iters-5, 4)
            } else {
                result = update_memoized(iters,x)
            }
    }
    cache.set(key, result)
    return result
}



const count_len = function(arr, n) {
    if (arr.length == 0) {
        return 0
    }
    if (n == 0) {
        return arr.length
    }
    let sum = 0
    const newarr = []
    for (let num of arr) {
        if (num.toString().length == 1) {
            sum += f(n,num)
        } else if (num.toString().length%2 == 0) {
            x = num.toString()
            first = x.slice(0,x.length/2)
            second = x.slice(x.length/2, x.length)
            newarr.push(Number(first))
            newarr.push(Number(second))
        } else {
            newarr.push(2024*num)
        }
    }
    sum += count_len(newarr, n-1)
    return sum
}

const p1 = function(filename) {
    nums = parse(filename)
    let sum = 0
    for (let num of nums) {
        sum += update_memoized(25, num)
    }
    return sum
}

const p2 = function(filename) {
    nums = parse(filename)
    let sum = 0
    for (let num of nums) {
        sum += update_memoized(75, num)
    }
    return sum
}



const start1 = process.hrtime()
const result1 = p1("data/d11.txt")
const time1 = process.hrtime(start1)

console.log("Day 11, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d11.txt")
const time2 = process.hrtime(start2)

console.log("Day 11, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")