
const MySQLConfig = require("../config/db/db.config");
const { cargoCreateFields, STATUS_CODES, setorCreateFields } = require("../helpers/constants");
const { AppError } = require("../helpers/error");
const { isAvailable, sendResponse } = require("../helpers/utils");
const { CargoModel } = require("../models/cargo/cargo.model");
const { SetorModel } = require("../models/setor/setor.model");

class SetorController {

    static async createSetor(req, res, next){
        const {body: requestBody} = req;
        const setorModel = new SetorModel(MySQLConfig);
        const allFieldsPresent = isAvailable(requestBody, Object.values(setorCreateFields), false);

        if(!allFieldsPresent) return next(new AppError("Alguns campos obrigatórios não foram inseridos", STATUS_CODES.BAD_REQUEST))

       
      
        //console.log("teste id",res.locals.user.id)
        try{

            await setorModel.createTable()
            
            const setor = await setorModel.create({nome: requestBody.nome, supervisores: requestBody.supervisores})
          
            return sendResponse(res, STATUS_CODES.SUCCESSFULLY_CREATED, "O setor foi registrado com sucesso!!", {id: setor.id, nome: setor.nome, lotation: setor.lotation})
     
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

module.exports = {SetorController}