export function daysDiff(d1, d2) {
    let diffTime = Math.abs(d2 - d1)
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

export function weeksDiff(d1, d2) {
    let diffTime = Math.abs(d2 - d1)
    let diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
    return diffWeeks
}

export function monthsDiff(d1, d2) {
    let diffYears = d2.getFullYear() - d1.getFullYear()
    let diffMonths = diffYears*12
    diffMonths += d2.getMonth() - d1.getMonth()
    if (d2.getDate() < d1.getDate()) diffMonths--
    return diffMonths
}

export function yearsDiff(d1, d2) {
    let diffYears = d2.getFullYear() - d1.getFullYear()
    if (d2.getMonth() < d1.getMonth()) diffYears--
    else if (d2.getMonth() == d1.getMonth() && d2.getDate() < d1.getDate()) diffYears--
    return diffYears
}
