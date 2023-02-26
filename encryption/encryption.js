const bcrypt = require("bcryptjs")

const EXP = module.exports

EXP.encrypt = async (pass) => {
    return await bcrypt.hash(pass, 10)
}

EXP.decode = async (pass, hash) => {
    return await bcrypt.compare(pass, hash)
}