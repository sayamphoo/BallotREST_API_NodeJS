const EXP = module.exports

const date = new Date()

EXP.getDateNow = () => {
    let d = (
        (date.getFullYear()) + "/" +
        (date.getMonth() + 1) + "/" +
        (date.getDate()) + "/" +
        (date.getHours() + 1) + ":" +
        (date.getMinutes()) + ":" +
        (date.getSeconds())
    )
    return d
}