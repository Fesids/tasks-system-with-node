const MySQLConfig = require("../config/db/db.config")
const { getHashPassword, verifyUserPassword, getJwtToken } = require("../helpers/utils")
const { UserModel } = require("../models/user/user.model")

const signUpUser = async (data)  => {
    const {senha, email} = data
    const user = new UserModel(MySQLConfig);
    await user.createTable()
    const senhaHash = await getHashPassword(senha)

    const userExists = await user.getUserByEmail(email);

    if(userExists){
        throw new Error("Email já registrado!!")
    }

    const saveBody = {
        ...data,
        senha: senhaHash
    }
    const createdUser = await user.create(saveBody)
    
    return createdUser;

}

const logInUser = async (email, senha) =>{
    const user = new UserModel(MySQLConfig);

    const userExists = await user.getUserByEmail(email);

    if(userExists){
        const authCheck = await verifyUserPassword(senha, userExists.senha);
       
        if(authCheck){
            
            const jwtPayload = {
                usuarioId: userExists.id,
                nome: userExists.nome,
                cargo: userExists.cargo,
                setor: userExists.setor,
                supervisionado_por: userExists.supervisionado_por
            };

            const token = getJwtToken(jwtPayload);

            return{
                userExists,
                token
            }
        }throw Error("Senha incorreta")

    }throw Error("Email incorreto")

}

module.exports = {logInUser, signUpUser}