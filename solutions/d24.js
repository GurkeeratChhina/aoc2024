const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = text.trim().split("\n\n")
    let network = new Map()
    for (const line of data[0].split("\n")) {
        let temp = line.split(": ")
        network.set(temp[0], Boolean(Number(temp[1])))
    }
    for (const line of data[1].split("\n")) {
        let temp = line.split(" -> ")
        network.set(temp[1], temp[0].split(" "))
    }
    
    return network
}



const p1 = function(filename) {
    let network = parse(filename)
    // console.log(network)

    const eval = function (x) {
        if (typeof network.get(x) == "boolean") {
            return network.get(x)
        } else {
            let [a, op, b] = network.get(x)
            var res
            switch (op) {
                case "OR":
                    res = eval(a) || eval(b)
                    break
                case "AND":
                    res = eval(a) && eval(b)
                    break
                case "XOR":
                    res = eval(a) != eval(b)
                    break
            }
            network.set(x, res)
            return res
        }
    }

    let sum = 0
    for (let [key, _] of network) {
        if (key[0] == 'z') {
            let val = eval(key)
            // console.log(key, val)
            if (val) {
                sum += 2**Number(key.slice(1))
            }
        }
    }
    return sum
}

const p2 = function(filename) {
    // let data = parse(filename)
    return
}

const start1 = process.hrtime()
const result1 = p1("data/d24.txt")
const time1 = process.hrtime(start1)

console.log("Day 24, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d24.txt")
const time2 = process.hrtime(start2)

console.log("Day 24, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")