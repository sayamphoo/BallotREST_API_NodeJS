const EXP = module.exports
//--------------LoginAdmin--------

let login_admin = {}

EXP.login = (s = false, ...data) => {
    login_admin = {
        state: s,
        code: (s ? '200' : '404'),
        token: '',
    }

    return login_admin
}