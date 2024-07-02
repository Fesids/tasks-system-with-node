class CargoModel {
    constructor(pool) {
        this.pool = pool;
    }

    async createTable() {
        return new Promise((resolve, reject) => {
            this.pool.query(`
                CREATE TABLE IF NOT EXISTS Cargos(
                    id int primary key not null auto_increment,
                    nome varchar(44),
                    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
                    updatedAt datetime DEFAULT CURRENT_TIMESTAMP
                )
            `, (err, results) => {
                if (err) {
                    console.error("Falha ao tentar criar a tabela `Cargos`:", err);
                    reject(err);
                } else {
                    console.log("Tabela Cargos criada com sucesso!!!.");
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
        const { nome} = data;
        await this.createTable();
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                    reject(err);
                    return;
                }

                connection.query(
                    `INSERT INTO Cargos(nome) VALUES (?)`,
                    [nome],
                    (err, results, fields) => {
                        connection.release();
                        if (err) {
                            console.error("Erro ao inserir cargo:", err);
                            reject(err);
                        } else {
                            const cargoId = results.insertId;
                            connection.query(
                                'SELECT * FROM Cargos WHERE id = ?',
                                [cargoId],
                                (err, rows) => {
                                    if (err) {
                                        console.error("Erro ao retornar cargo recém criado:", err);
                                        reject(err);
                                    } else {
                                        console.log("Cargo criado com sucesso.");
                                        resolve(rows[0]);
                                    }
                                }
                            );
                        }
                    }
                );
            });
        });
    }

}

module.exports = { CargoModel };