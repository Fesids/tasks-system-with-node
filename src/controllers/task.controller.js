const MySQLConfig = require("../config/db/db.config");
const { cargoCreateFields, STATUS_CODES, taskCreateFields } = require("../helpers/constants");
const { AppError } = require("../helpers/error");
const { isAvailable, sendResponse } = require("../helpers/utils");
const { TaskModel } = require("../models/tasks/task.model");

class TaskController {

    static async createTask(req, res, next){
        const {body: requestBody} = req;
        const taskModel = new TaskModel(MySQLConfig);
        const allFieldsPresent = isAvailable(requestBody, Object.values(taskCreateFields), false);

        if(!allFieldsPresent) return next(new AppError("Alguns campos obrigatórios não foram inseridos", STATUS_CODES.BAD_REQUEST))

        try{

            await taskModel.createTable()
            
            const task = await taskModel.create(
                {
                usuario_id: requestBody.usuario_id, 
                assunto : requestBody.assunto, 
                content_type : requestBody.content_type, 
                content : requestBody.content, 
                setor : requestBody.setor
                }
                
            )
            console.log(task)
            return sendResponse(res, STATUS_CODES.SUCCESSFULLY_CREATED, "A tarefa foi registrada com sucesso!!", {id: task.id, assunto: task.assunto})
     
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

    static async getTasksByUserId(req, res, next){
        const taskId = req.params.id
        const taskModel = new TaskModel(MySQLConfig);
        try{

            if (!taskId) return next(new AppError(`Nenhum ID valído foi inserido`, STATUS_CODES.NOT_FOUND));
           
            const tasks = await taskModel.getTasksByUserId(taskId)
            return sendResponse(res, STATUS_CODES.OK, "Tarefas retornadas com sucesso!!", tasks)
     
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

    static async getTasksBySetorId(req, res, next){
        const setorId = req.params.id
        const taskModel = new TaskModel(MySQLConfig);
        try{

            if (!setorId) return next(new AppError(`Nenhum ID valído foi inserido`, STATUS_CODES.NOT_FOUND));
           
            const tasks = await taskModel.getTasksBySetorId(setorId)
            return sendResponse(res, STATUS_CODES.OK, "Tarefas retornadas com sucesso!!", tasks)
     
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

module.exports = {TaskController}