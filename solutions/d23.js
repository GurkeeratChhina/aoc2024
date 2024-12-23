const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    let data = new Map()
    for (const line of text.trim().split("\n")) {
        edge = line.split("-")
        if (data.has(edge[0])) {
            let connections = data.get(edge[0])
            connections.add(edge[1])
        } else {
            let connections = new Set()
            connections.add(edge[1])
            data.set(edge[0], connections)
        }
        if (data.has(edge[1])) {
            let connections = data.get(edge[1])
            connections.add(edge[0])
        } else {
            let connections = new Set()
            connections.add(edge[0])
            data.set(edge[1], connections)
        }
    }
    return data
}



const p1 = function(filename) {
    let graph = parse(filename)
    let found = new Set()
    for (let [vertex, edges] of graph) {
        if (edges.size < 2) {
            continue
        }
        for (let second of edges) {
            for (let third of edges) {
                if (third == second || ! graph.get(second).has(third)) {
                    continue
                }
                if (vertex[0] == 't' || second[0] == 't' || third[0] == 't') {
                    found.add(JSON.stringify([vertex,second,third].sort()))
                }
            }
        }
    }
    // console.log(found)
    return found.size
}

const p2 = function(filename) {
    let graph = parse(filename)
    let maximum_thus_far = []
    let max_size = 0
    let cache = new Set()

    for (let [vertex, edges] of graph) {
        let queue = []
        queue.push([vertex])
        while (queue.length > 0) {
            let C = queue.shift()
            if (cache.has(JSON.stringify(C))) {
                continue
            } else {
                cache.add(JSON.stringify(C))
            }

            if (C.length > max_size) {
                max_size = C.length
                maximum_thus_far = C
            }
            for (let e of edges) {
                let valid_extension = true
                for (let v of C) {
                    // console.log(v, graph.get(v))
                    if (!graph.get(v).has(e)) {
                        valid_extension = false
                        break
                    }
                }
                if (valid_extension) {
                    queue.push(C.concat([e]).sort())
                }
            }
            
        }
        
    }
    return maximum_thus_far.join(',')
}

const start1 = process.hrtime()
const result1 = p1("data/d23.txt")
const time1 = process.hrtime(start1)

console.log("Day 23, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d23.txt")
const time2 = process.hrtime(start2)

console.log("Day 23, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")