const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8')
    return text.trim()
}

const p1 = function(filename) {
    const string = parse(filename)
    let sum = 0
    let pos = 0
    let parity = true
    let i = 0
    let j = string.length-1
    let ilen = Number(string[i])
    let jlen = Number(string[j])

    // console.log(string, string.length)
    loop:
    while(i<j) {
        if (parity) {
            for (let k = 0; k<ilen; k++) {
                sum+= pos*i/2
                pos++
            }
            i++
            ilen = Number(string[i])
            parity = !parity
        } else {
            for (let k = 0; k<ilen; k++) {
                if (jlen==0) {
                    j = j-2
                    if (j<i) {
                        break loop
                    }
                    jlen = Number(string[j])
                }
                sum+= pos*j/2
                pos++
                jlen--
            }
            i++
            ilen = Number(string[i])
            parity = !parity
        }
    }
    while (jlen >0) {
        sum += pos*j/2
        pos++
        jlen--
    }
    return sum
}

const p2 = function(filename) {

    let string = parse(filename)

    let sum = 0
    let j = string.length-1
    let id = (string.length-1)/2
    let pass = []
    while (j>=0) {
        let found = false
        if (pass.includes(j)) {
            j = j-2
            continue
        }
        let position = 0
        let len = Number(string[j])
        
        for (let i=0; i<j; i++) {
            if( i%2 == 1 && Number(string[i]) >= Number(string[j]) ) {
                // console.log("found")
                string = string.slice(0,i).concat('0').concat(string[j]).concat((Number(string[i])-Number(string[j])).toString()).concat(string.slice(i+1,j-1))
                
                for (let k = 0; k<pass.length;k++) {
                    if (pass[k] > i) {
                        pass[k] = pass[k]+2
                    }
                }
                pass.push(i+1)

                found = true
                break
                //move j
            }
            position += Number(string[i])
        }
        sum+=id*(2*position+len-1)*(len)/2
        id -- 
        if(!found) {
            // console.log("not found")
            j = j-2
        }
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d9.txt")
const time1 = process.hrtime(start1)

console.log("Day 9, part 1 answer:", result1, "took", time1[0], "seconds and", time1[1]/1000000, "milliseconds")


const start2 = process.hrtime()
const result2 = p2("data/d9.txt")
const time2 = process.hrtime(start2)

console.log("Day 9, part 2 answer:", result2, "took", time2[0], "seconds and", time2[1]/1000000, "milliseconds")