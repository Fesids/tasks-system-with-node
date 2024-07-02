const { AppError } = require("../helpers/error");
const { userAuthRequiredFields, STATUS_CODES, dbErrorCodes, userLoginRequiredFields, cookieAttributeForJwtToken, userUpdateFields } = require("../helpers/constants");
const { isAvailable, validate, sendResponse, saveCookie } = require("../helpers/utils");
const { UserModel } = require("../models/user/user.model");
const MySQLConfig = require("../config/db/db.config");


class UserController {
   
    static async DeleteUser(req, res, next){
       
        const userModel = new UserModel(MySQLConfig);

       
        const userId = parseInt(req.params.id);
        console.log("id", userId)
      
        //console.log("teste id",res.locals.user.id)
        try{
            const user = await userModel.getUserById(userId);
            //console.log("Usuario", await userModel.getUserById(userId))
            if (!user) return next(new AppError(`Usuário com id ${userId} não existe`, STATUS_CODES.NOT_FOUND));
           
            if (user.id !== res.locals.user.id) return next(new AppError("Você não está autorizado", STATUS_CODES.FORBIDDEN));
          
            const updatedUserResult = await userModel.deleteUser(userId);
           
            if(updatedUserResult) return sendResponse(res, STATUS_CODES.OK, `Usuario com id ${userId} deletado com sucesso!`)
            return next(new AppError(`Usuário com id ${userId} não pode ser deletado`, STATUS_CODES.BAD_REQUEST));
        } catch(error){
            console.log(error)
            return next(
                new AppError(
                    error.message || "Internal Server Error",
                    error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
                    error.response || error
                )
            )
        }

    }
    
    static async UpdateUser(req, res, next){
        const {body: requestBody} = req;
        const userModel = new UserModel(MySQLConfig);

        const fieldsToBeUpdatedExist = isAvailable(requestBody, Object.values(userUpdateFields), false);

        if(!fieldsToBeUpdatedExist) return next(new AppError('Esse campo não existe ou não é mutável', STATUS_CODES.BAD_REQUEST))

        const userId = parseInt(req.params.id);
        console.log("id", userId)
      
        //console.log("teste id",res.locals.user.id)
        try{
            const user = await userModel.getUserById(userId);
            //console.log("Usuario", await userModel.getUserById(userId))
            if (!user) return next(new AppError(`Usuário com id ${userId} não existe`, STATUS_CODES.NOT_FOUND));
           
            if (user.id !== res.locals.user.id) return next(new AppError("Você não está autorizado", STATUS_CODES.FORBIDDEN));
          
            const updatedUserResult = await userModel.updateUser(requestBody, userId);
           
            if(updatedUserResult) return sendResponse(res, STATUS_CODES.OK, `Usuario com id ${userId} atualizado com sucesso!`)
            return next(new AppError(`Usuário com id ${userId} não pode ser atualizado`, STATUS_CODES.BAD_REQUEST));
        } catch(error){
            console.log(error)
            return next(
                new AppError(
                    error.message || "Internal Server Error",
                    error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
                    error.response || error
                )
            )
        }

    }
}

module.exports = {UserController}