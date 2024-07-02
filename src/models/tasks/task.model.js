const mysql = require('mysql2');

class TaskModel {
    constructor(pool) {
        this.pool = pool;
    }

    async createTable() {
        return new Promise((resolve, reject) => {
            this.pool.query(`
            CREATE TABLE IF NOT EXISTS Tasks (
                id INT PRIMARY KEY AUTO_INCREMENT,
                usuario_id INT NOT NULL,
                assunto VARCHAR(255) NOT NULL,
                content_type ENUM('text', 'video', 'image') NOT NULL,
                content TEXT,
                setor INT(3) NOT NULL,
                completed TINYINT(1) DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) 
            );
            
            `, (err, results) => {
                if (err) {
                    console.error("Falha ao tentar criar a tabela `Tasks`:", err);
                    reject(err);
                } else {
                    console.log("Tabela Tasks criada com sucesso!!!.");
                    resolve();
                }
            });
        });
    }

    
    /**
     * @description
     * O metodo abaixo é responável por criar um usuário diretamente no banco de dados com as credenciais delegadas no Pool
     * @param {data} deve receber um objeto com os seguintes dados { nome, sobrenome, email, senha, cargo, supervisionado_por }
     * @returns retorna um objeto com  as propiedades do usuário criado
   */
    async create(data) {
        const { usuario_id, assunto, content_type, content, setor } = data;
        
        try {
            const result = await new Promise((resolve, reject) => {
                this.pool.getConnection((err, connection) => {
                    if (err) {
                        console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                        reject(err);
                        return;
                    }
        
                    connection.query(
                        `INSERT INTO Tasks(usuario_id, assunto, content_type, content, setor) VALUES (?, ?, ?, ?, ?)`,
                        [usuario_id, assunto, content_type, content, setor],
                        (err, results, fields) => {
                            connection.release();
                            if (err) {
                                console.error("Falha ao criar uma nova tarefa:", err);
                                reject(err);
                            } else {
                                const taskId = results.insertId;
                                connection.query(
                                    'SELECT * FROM Tasks WHERE id = ?',
                                    [taskId],
                                    (err, rows) => {
                                        if (err) {
                                            console.error("Erro ao retornar tarefa recém criada:", err);
                                            reject(err);
                                        } else {
                                            console.log("Tarefa criada com sucesso.");
                                            resolve(rows[0]);
                                        }
                                    }
                                );
                            }
                        }
                    );
                });
            });
    
            return result;
        } catch (error) {
            console.error('falha:', error);
            throw error; 
        }
    }

    async getTaskById(id) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                    reject(err);
                    return;
                }

                connection.query("SELECT * FROM Tasks WHERE id = ?", [id], (err, rows) => {
                    connection.release();
                    if (err) {
                        console.error("Falha ao executar a  query: ", err);
                        reject(err);
                    } else {
                        resolve(rows[0]);
                    }
                });
            });
        });
    }

    async getTasksByUserId(user_id) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                    reject(err);
                    return;
                }

                connection.query("SELECT * FROM Tasks WHERE usuario_id = ?", [user_id], (err, rows) => {
                    connection.release();
                    if (err) {
                        console.error("Falha ao executar a  query: ", err);
                        reject(err);
                    } else {
                        //console.log(resolve(rows[0]))
                        resolve(rows);
                    }
                });
            });
        });
    }

    async getTasksBySetorId(setor_id) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                    reject(err);
                    return;
                }

                connection.query("SELECT * FROM Tasks WHERE setor = ?", [setor_id], (err, rows) => {
                    connection.release();
                    if (err) {
                        console.error("Falha ao executar a  query: ", err);
                        reject(err);
                    } else {
                        //console.log(resolve(rows[0]))
                        resolve(rows);
                    }
                });
            });
        });
    }


    // CRUD METHODS
    async updateTask(data, taskId) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                    reject(err);
                    return;
                }
    
                let query = 'UPDATE Tasks SET ';
    
               
                const fieldsToUpdate = Object.keys(data).map((key, index) => {
                    if (index === Object.keys(data).length - 1) {
                        return `${key} = '${data[key]}'`;
                    } else {
                        return `${key} = '${data[key]}', `;
                    }
                }).join('');
    
                query += fieldsToUpdate + ' WHERE id = ?';
    
               
                connection.query(query, [taskId], (err, rows) => {
                    connection.release(); 
    
                    if (err) {
                        console.error('Falha ao executar a query:', err);
                        reject(err);
                    } else {
                        resolve(rows.affectedRows > 0); 
                    }
                });
            });
        });
    }

    async deleteTask(taskId) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                    reject(err);
                    return;
                }
    
                const query = 'DELETE FROM Tasks WHERE id = ?';
               
                connection.query(query, [taskId], (err, rows) => {
                    connection.release(); 
    
                    if (err) {
                        console.error('Falha ao executar a query:', err);
                        reject(err);
                    } else {
                        resolve(rows.affectedRows > 0); 
                    }
                });
            });
        });
    }
    
}

module.exports = { TaskModel };
