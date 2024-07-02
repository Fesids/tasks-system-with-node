class SetorModel {
    constructor(pool) {
        this.pool = pool;
    }

    async createTable() {
        return new Promise((resolve, reject) => {
            this.pool.query(`
                CREATE TABLE IF NOT EXISTS Setores (
                    id int primary key not null auto_increment,
                    nome varchar(44),
                    lotation int default 0,
                    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
                    updatedAt datetime DEFAULT CURRENT_TIMESTAMP
                )
            `, (err, results) => {
                if (err) {
                    console.error("Falha ao tentar criar a tabela `Setores`:", err);
                    reject(err);
                } else {
                    console.log("Tabela Setores criada com sucesso!!!.");
                    // --foreign key (supervisor_id) references Usuarios(id)
                    this.pool.query(`
                        CREATE TABLE IF NOT EXISTS setor_supervisor (
                            id int primary key not null auto_increment,
                            setor_id int,
                            supervisor_id int,
                            foreign key (setor_id) references Setores(id)
                           
                        )
                    `, (err, results) => {
                        if (err) {
                            console.error("Falha ao tentar criar a tabela `setor_supervisor`:", err);
                            reject(err);
                        } else {
                            console.log("Tabela setor_supervisor criada com sucesso!!!.");
                            resolve();
                        }
                    });
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
    /*async create(data) {
        const { nome, supervisor_id} = data;
        await this.createTable();
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                    reject(err);
                    return;
                }

                connection.query(
                    `INSERT INTO Setores(nome, supervisor_id) VALUES (?, ?)`,
                    [nome, supervisor_id],
                    (err, results, fields) => {
                        connection.release();
                        if (err) {
                            console.error("Erro ao inserir setor:", err);
                            reject(err);
                        } else {
                            const setorId = results.insertId;
                            connection.query(
                                'SELECT * FROM Setores WHERE id = ?',
                                [setorId],
                                (err, rows) => {
                                    if (err) {
                                        console.error("Erro ao retornar setor recém criado:", err);
                                        reject(err);
                                    } else {
                                        console.log("Setor criado com sucesso.");
                                        resolve(rows[0]);
                                    }
                                }
                            );
                        }
                    }
                );
            });
        });
    }*/

    async create(data) {
        const { nome, supervisores } = data;
       
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se conectar com o Pool:', err);
                    reject(err);
                    return;
                }
    
                connection.beginTransaction((err) => {
                    if (err) {
                        console.error('Erro ao iniciar transação:', err);
                        reject(err);
                        return;
                    }
    
                    connection.query(
                        `INSERT INTO Setores(nome) VALUES (?)`,
                        [nome],
                        (err, results, fields) => {
                            if (err) {
                                connection.rollback(() => {
                                    console.error("Erro ao inserir setor:", err);
                                    reject(err);
                                });
                                return;
                            }
    
                            const setorId = results.insertId;
    
                           
                            if (supervisores && supervisores.length > 0) {
                                const supervisorValues = supervisores.map(supervisor_id => [setorId, supervisor_id]);
                                connection.query(
                                    `INSERT INTO setor_supervisor (setor_id, supervisor_id) VALUES ?`,
                                    [supervisorValues],
                                    (err, results) => {
                                        if (err) {
                                            connection.rollback(() => {
                                                console.error("Erro ao inserir supervisores do setor:", err);
                                                reject(err);
                                            });
                                            return;
                                        }
    
                                        connection.commit((err) => {
                                            if (err) {
                                                connection.rollback(() => {
                                                    console.error('Erro ao realizar commit da transação:', err);
                                                    reject(err);
                                                });
                                            } else {
                                                console.log("Setor criado com sucesso.");
                                                resolve({ setorId, nome, supervisores});
                                            }
                                        });
                                    }
                                );
                            } else {
                                
                                connection.commit((err) => {
                                    if (err) {
                                        connection.rollback(() => {
                                            console.error('Erro ao realizar commit da transação:', err);
                                            reject(err);
                                        });
                                    } else {
                                        console.log("Setor criado com sucesso (sem supervisores).");
                                        resolve({ setorId, nome, supervisores });
                                    }
                                });
                            }
                        }
                    );
                });
            });
        });
    }
    

}




module.exports = {SetorModel}