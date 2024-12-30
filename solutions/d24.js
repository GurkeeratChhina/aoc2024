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

const parse2 = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = text.trim().split("\n\n")
    let network = new Map()
    for (const line of data[1].split("\n")) {
        let temp = line.split(" -> ")
        network.set(temp[0], temp[1])
    }
    
    return network
}

const find_key = function(map, value) {
    for (const [k, v] of map.entries()) {
        if (v == value) {
            return k;
        }  
    }
    return undefined;
}

const swap = function(map, v1, v2, swapped) {
    swapped.push(v1)
    swapped.push(v2)
    let k1 = find_key(map, v1)
    let k2 = find_key(map, v2)
    map.set(k1, v2)
    map.set(k2, v1)
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
    let N = parse2(filename)
    let swapped = []

    let errors_found = true
    while(errors_found) {
        errors_found = false
        let xors = [] //xi xor yi
        let ands = [] //xi and yi
        let partial_carry = ["tss"]// carries[i-1] and xor[i-1]
        let carries = ["tss"] // partial_carries[i] or and[i-1]
        let zis = ["z00"] // carries[i] xor xor[i] 
        

        var S1, S2, S3, S4, z
        for (let i = 0; i<45; i++) {
            if (i < 10) {
                S1 = `x0${i} XOR y0${i}`
                S2 = `y0${i} XOR x0${i}`
                S3 = `x0${i} AND y0${i}`
                S4 = `y0${i} AND x0${i}`
                z = `z0${i}`
            } else {
                S1 = `x${i} XOR y${i}`
                S2 = `y${i} XOR x${i}`
                S3 = `x${i} AND y${i}`
                S4 = `y${i} AND x${i}`
                z = `z${i}`
            }
            let value = N.get(S1) || N.get(S2)
            xors.push(value)
            value = N.get(S3) || N.get(S4)
            ands.push(value)

            if (i >= 1) {
                S1 = `${carries[i-1]} XOR ${xors[i]}`
                S2 = `${xors[i]} XOR ${carries[i-1]}`
                value = N.get(S1) || N.get(S2)
                if (!value) {
                    // console.log("z value not found")
                    //carries i-1 or xors i are wrong
                    let correct_z = find_key(N,z).split(" XOR ")
                    // console.log(S1, S2, correct_z)
                    if (correct_z[0] == carries[i-1]) {
                        swap(N, xors[i], correct_z[1], swapped)
                    } else if (correct_z[0] = xors[i]) {
                        swap(N, carries[i-1], correct_z[1], swapped)
                    } else if (correct_z[1] == carries[i-1]) {
                        swap(N, xors[i], correct_z[0], swapped)
                    } else if (correct_z[1] = xors[i]) {
                        swap(N, carries[i-1], correct_z[0], swapped)
                    }
                    errors_found = true
                    break
                } else if (value != z) {
                    // console.log("found but not z")
                    // carries i-1 and xors i are correct, but z has been swapped
                    swap(N, z, value, swapped)
                    errors_found = true
                    break
                }
                
                S1 = `${carries[i-1]} AND ${xors[i]}`
                S2 = `${xors[i]} AND ${carries[i-1]}`
                value = N.get(S1) || N.get(S2)
                // console.log(S1, S2, " -> ", value)
                if (!value) {
                    console.log(i, "partial not found")
                    errors_found = true
                    break
                }
                partial_carry.push(value)
                S1 = `${partial_carry[i]} OR ${ands[i]}`
                S2 = `${ands[i]} OR ${partial_carry[i]}`
                value = N.get(S1) || N.get(S2)
                // console.log(S1, S2, " -> ", value)
                if (!value) {
                    console.log(i, "carry not found")
                    errors_found = true
                    break
                }
                carries.push(value)
            }
        }
        // console.log("breaking for loop", errors_found)
    }
    
    return swapped.sort().join(",")
}

const start1 = process.hrtime()
const result1 = p1("data/d24.txt")
const time1 = process.hrtime(start1)

console.log("Day 24, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d24.txt")
const time2 = process.hrtime(start2)

console.log("Day 24, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")