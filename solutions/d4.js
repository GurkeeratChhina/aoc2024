const fs = require('fs')

const parse = function(filename) {
    let data = []
    var text = fs.readFileSync(filename,'utf8')

    for (const line of text.trim().split("\n")) {
        data.push(line.trim())
    }
    return data
}



const p1 = function(filename) {
    let count = 0
    let data = parse(filename)
    for (let i = 0; i< data.length; i++) {
        for (let j = 0; j<data[i].length; j++) {
            if (data[i][j] == 'X') {
                if (i>=3 && j>=3) { //up left
                    if (data[i-1][j-1] == 'M' && data[i-2][j-2] == 'A' && data[i-3][j-3] == 'S') {
                        count++
                    }
                } 
                if (i >= 3) { //up
                    if (data[i-1][j] == 'M' && data[i-2][j] == 'A' && data[i-3][j] == 'S') {
                        count++
                    }
                } 
                if (i >=3 && j<data[i].length-3) { //up right
                    if (data[i-1][j+1] == 'M' && data[i-2][j+2] == 'A' && data[i-3][j+3] == 'S') {
                        count++
                    }
                } 
                if (j >= 3) { //left
                    if (data[i][j-1] == 'M' && data[i][j-2] == 'A' && data[i][j-3] == 'S') {
                        count++
                    }
                }
                if (j<data[i].length-3) { //right
                    if (data[i][j+1] == 'M' && data[i][j+2] == 'A' && data[i][j+3] == 'S') {
                        count++
                    }
                }
                if (i< data.length-3) { //down
                    if (data[i+1][j] == 'M' && data[i+2][j] == 'A' && data[i+3][j] == 'S') {
                        count++
                    }
                }
                if (i< data.length-3 && j >= 3) { //down left
                    if (data[i+1][j-1] == 'M' && data[i+2][j-2] == 'A' && data[i+3][j-3] == 'S') {
                        count++
                    }
                }
                if (i< data.length-3 && j<data[i].length-3) { //down right
                    if (data[i+1][j+1] == 'M' && data[i+2][j+2] == 'A' && data[i+3][j+3] == 'S') {
                        count++
                    }
                }
            }      
        }
    }
    return count
}

const p2 = function(filename) {
    let count = 0
    let data = parse(filename)
    for (let i = 1; i< data.length-1; i++) {
        for (let j = 1; j<data[i].length-1; j++) {
            if (data[i][j] == 'A') {
                let diags = 0
                if (data[i-1][j-1] == 'M' && data[i+1][j+1] == 'S') {
                    diags++
                }
                if (data[i-1][j-1] == 'S' && data[i+1][j+1] == 'M') {
                    diags++
                }
                if (data[i-1][j+1] == 'M' && data[i+1][j-1] == 'S') {
                    diags++
                }
                if (data[i-1][j+1] == 'S' && data[i+1][j-1] == 'M') {
                    diags++
                }
                if (diags > 2) {
                    throw "this shouldnt happen"
                } else if (diags == 2) {
                    count++
                }
            }        
        }
    }
    return count
}

const start1 = process.hrtime()
const result1 = p1("data/d4.txt")
const time1 = process.hrtime(start1)

const start2 = process.hrtime()
const result2 = p2("data/d4.txt")
const time2 = process.hrtime(start2)

console.log("Day 4, part 1 answer: ", result1, " took ", time1[1]/1000000, "milliseconds")
console.log("Day 4, part 2 answer: ", result2, " took ", time2[1]/1000000, "milliseconds")