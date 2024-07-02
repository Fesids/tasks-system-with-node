
const { userAuthRequiredFields, STATUS_CODES, dbErrorCodes, userLoginRequiredFields, cookieAttributeForJwtToken } = require("../helpers/constants");
const { AppError } = require("../helpers/error");
const { isAvailable, validate, sendResponse, saveCookie } = require("../helpers/utils");
const { signUpUser, logInUser } = require("../services/auth.service");

class AuthController {

    static async RegisterUser(req, res, next){
        const {body: requestBody} = req;

        const allFieldsPresent = isAvailable(requestBody, Object.values(userAuthRequiredFields));

        if(!allFieldsPresent) return next(new AppError("Alguns campos obrigatórios não foram inseridos", STATUS_CODES.BAD_REQUEST));

        const {nome, sobrenome, email, senha, cargo,setor, supervisionado_por} = requestBody;

        if(!validate.password(senha)) return next(new AppError('Senha inválida, utlize outra senha', STATUS_CODES.BAD_REQUEST));

        const createUserBody = {
            nome,
            sobrenome,
            email,
            senha,
            cargo,
            setor,
            supervisionado_por
        }
        try{
            const createUser = await signUpUser(createUserBody);

            return sendResponse(res, STATUS_CODES.SUCCESSFULLY_CREATED, "O usuário foi registrado com sucesso!!", {id: createUser.id, nome})
        }  catch(error){
            if (error.code === dbErrorCodes.ER_DUP_ENTRY) delete error.sql;
        
            return next(
                new AppError(
                  error.code === dbErrorCodes.ER_DUP_ENTRY ? 'Email já utilizado' : error.message || 'Internal Server Error',
                  error.code === dbErrorCodes.ER_DUP_ENTRY ? STATUS_CODES.BAD_REQUEST : error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
                  error.response || error
                )
              );

        }

    }

    static async logInUser(req, res, next) {
        const {body: requestBody} = req;

        const allFieldsPresent = isAvailable(requestBody, Object.values(userLoginRequiredFields))

        if(!allFieldsPresent) return next(new AppError("Alguns campos obrigatórios não foram inseridos", STATUS_CODES.BAD_REQUEST));

        const {email, senha} = requestBody;

        try{
            const { userExists, token: access_token } = await logInUser(email, senha);

            saveCookie(res, cookieAttributeForJwtToken, access_token);

            return sendResponse(res, STATUS_CODES.OK, "Usuario logado com sucesso!", {userId: userExists.id, nome: userExists.nome})

        } catch (error) {
            console.log(error)
            next(
                new AppError(
                    error.message || "Internal Server Error",
                    error.message === 'Email incorreto'
                    || error.message  === "Senha incorreta"
                        ? STATUS_CODES.BAD_REQUEST
                        : error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
                    error.response || error
                )
            )

        }

    }

    static logOutUser(req, res, next) {
        if (req.cookies[`${cookieAttributeForJwtToken}`]) {
            res.clearCookie(cookieAttributeForJwtToken);

            return sendResponse(res, STATUS_CODES.OK, 'Usuario deslogado com sucesso');
        }
 
        return next(new AppError('Você precisa estar logado antes', STATUS_CODES.BAD_REQUEST))
    }
}

module.exports = {AuthController}