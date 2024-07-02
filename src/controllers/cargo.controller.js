
const MySQLConfig = require("../config/db/db.config");
const { cargoCreateFields, STATUS_CODES } = require("../helpers/constants");
const { AppError } = require("../helpers/error");
const { isAvailable, sendResponse } = require("../helpers/utils");
const { CargoModel } = require("../models/cargo/cargo.model");

class CargoController {

    static async createCargo(req, res, next){
        const {body: requestBody} = req;
        const cargoModel = new CargoModel(MySQLConfig);
        const allFieldsPresent = isAvailable(requestBody, Object.values(cargoCreateFields), false);

        if(!allFieldsPresent) return next(new AppError("Alguns campos obrigatórios não foram inseridos", STATUS_CODES.BAD_REQUEST))

       
      
        //console.log("teste id",res.locals.user.id)
        try{

            await cargoModel.createTable()
            
            const cargo = await cargoModel.create({nome: requestBody.nome})
            console.log(cargo)
            return sendResponse(res, STATUS_CODES.SUCCESSFULLY_CREATED, "O cargo foi registrado com sucesso!!", {id: cargo.id, nome: cargo.nome})
     
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

module.exports = {CargoController}