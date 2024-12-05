const fs = require('fs')

const parse = function(filename) {
    var text = fs.readFileSync(filename,'utf8').trim().split("\n\n")
    const rules = Object.create(null)
    const lists = []

    for (const line of text[0].split("\n")) {
        let rule = line.trim().split("|").map(Number)
        if (rule[0] in rules) {
            rules[rule[0]].push(rule[1])
        } else {
            rules[rule[0]] = [rule[1]]
        }
    }

    for (const line of text[1].split("\n")) {
        let nums = line.trim().split(",").map(Number)
        lists.push(nums)
    }
    return [rules, lists]
}

const check_valid_index = function(x, priors, rules) {
    for (let a of priors) {
        if (rules[x].includes(a)) {
            return false
        }
    }
    return true
}

const check_valid_list = function(list, rules) {
    for (let i = list.length-1; i>=0; i--) {
        if (!check_valid_index(list[i], list.slice(0,i), rules)) {
            return false
        }
    }
    return true
}

const sort_partial_order = function(list, rules) {
    for (let i = list.length-1; i>=0; i--) {
        for (let j = i-1; j>=0; j--) {
            if (rules[list[i]].includes(list[j])) {
                let x = list[i]
                let y = list[j]
                list[i] = y
                list[j] = x
                j = i-1
            }
        }
    }
}

const p1 = function(filename) {
    const [rules, lists] = parse(filename)
    let sum = 0
    for (let list of lists) {
        if (check_valid_list(list, rules)) {
            sum+= list[(list.length-1)/2]
        }
    }
    return sum
}

const p2 = function(filename) {
    const [rules, lists] = parse(filename)
    let sum = 0
    for (let list of lists) {
        if (!check_valid_list(list, rules)) {
            sort_partial_order(list, rules)
            sum+= list[(list.length-1)/2]
        }
    }
    return sum
}

const start1 = process.hrtime()
const result1 = p1("data/d5.txt")
const time1 = process.hrtime(start1)

const start2 = process.hrtime()
const result2 = p2("data/d5.txt")
const time2 = process.hrtime(start2)

console.log("Day 5, part 1 answer: ", result1, " took ", time1[1]/1000000, "milliseconds")
console.log("Day 5, part 2 answer: ", result2, " took ", time2[1]/1000000, "milliseconds")