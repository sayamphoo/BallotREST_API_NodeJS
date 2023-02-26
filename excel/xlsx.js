const reader = require('xlsx')
const EXP = module.exports

EXP.readFile = (files) => {
    const file = reader.readFile(files)
    let data = []
    const sheets = file.SheetNames

    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
        temp.forEach((res) => {
            data.push(res)
        })
    }

    return data
}
