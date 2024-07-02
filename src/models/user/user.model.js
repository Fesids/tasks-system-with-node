const mysql = require('mysql2');

class UserModel {
    constructor(pool) {
        this.pool = pool;
    }

    async createTable() {
        return new Promise((resolve, reject) => {
            this.pool.query(/*`
                CREATE TABLE IF NOT EXISTS Usuarios(
                    id int primary key not null auto_increment,
                    nome varchar(44),
                    sobrenome varchar(44),
                    email varchar(244),
                    senha varchar(244),
                    cargo int,
                    setor int,
                    supervisionado_por int,
                    ativo TINYINT(1) DEFAULT 1,
                    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
                    updatedAt datetime DEFAULT CURRENT_TIMESTAMP
                )
            `*/`CREATE TABLE IF NOT EXISTS Usuarios(
                    id int primary key not null auto_increment,
                    nome varchar(44),
                    sobrenome varchar(44),
                    email varchar(244),
                    senha varchar(244),
                    cargo int default 0,
                    setor int default 0,
                    supervisionado_por int,
                    ativo TINYINT(1) DEFAULT 1,
                    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
                    updatedAt datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (cargo) REFERENCES Cargos(id),
                    FOREIGN KEY (setor) REFERENCES Setores(id)
                )
            `, (err, results) => {
                if (err) {
                    console.error("Falha ao tentar criar a tabela `Usuarios`:", err);
                    reject(err);
                } else {
                    console.log("Tabela Usuarios criada com sucesso!!!.");
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
        const { nome, sobrenome, email, senha, cargo, setor, supervisionado_por } = data;
        
        try {
            const result = await new Promise((resolve, reject) => {
                this.pool.getConnection((err, connection) => {
                    if (err) {
                        console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                        reject(err);
                        return;
                    }
        
                    connection.query(
                        `INSERT INTO Usuarios(nome, sobrenome, email, senha, cargo,setor, supervisionado_por) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [nome, sobrenome, email, senha, cargo, setor, supervisionado_por],
                        (err, results, fields) => {
                            connection.release();
                            if (err) {
                                console.error("Falha ao criar usuário:", err);
                                reject(err);
                            } else {
                                const productId = results.insertId;
                                connection.query(
                                    'SELECT * FROM Usuarios WHERE id = ?',
                                    [productId],
                                    (err, rows) => {
                                        if (err) {
                                            console.error("Erro ao retornar usuário recém criado:", err);
                                            reject(err);
                                        } else {
                                            console.log("Usuário criado com sucesso.");
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

    async getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                    reject(err);
                    return;
                }

                connection.query("SELECT * FROM Usuarios WHERE email = ?", [email], (err, rows) => {
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

    async getUserById(id) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                    reject(err);
                    return;
                }

                connection.query("SELECT * FROM Usuarios WHERE id = ?", [id], (err, rows) => {
                    connection.release();
                    if (err) {
                        console.error("Falha ao executar a  query: ", err);
                        reject(err);
                    } else {
                        //console.log(resolve(rows[0]))
                        resolve(rows[0]);
                    }
                });
            });
        });
    }



    async getAll() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Falha ao se connectar com o Pool, verifque as credenciais ou a disponibilidade do seu banco:', err);
                    reject(err);
                    return;
                }

                connection.query("SELECT * FROM Usuarios", (err, rows) => {
                    connection.release();
                    if (err) {
                        console.error('Erro ao executar a  query:', err);
                        reject(err);
                    } else {
                        if (!rows || !Array.isArray(rows)) {
                            console.error('Nenhuma linha encontrada no banco de dados.');
                            reject(new Error('Nenhuma linha encontrada no banco de dados.'));
                            return;
                        }

                        console.log('Retorno de todos os usuários feito com sucesso!!.');

                        const products = rows.map(row => {
                            return {
                                id: row.id,
                                nome: row.nome,
                                sobrenome: row.sobrenome,
                                email: row.email,
                                cargo: row.cargo,
                                supervisionado_por: row.supervisionado_por,
                                createdAt: row.createdAt,
                                updatedAt: row.updatedAt
                            };
                        });

                        resolve(products);
                    }
                });
            });
        });
    }

    // CRUD METHODS
    async updateUser(data, userId) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Failed to connect to the database pool. Check your credentials or database availability:', err);
                    reject(err);
                    return;
                }
    
                let query = 'UPDATE Usuarios SET ';
    
               
                const fieldsToUpdate = Object.keys(data).map((key, index) => {
                    if (index === Object.keys(data).length - 1) {
                        return `${key} = '${data[key]}'`;
                    } else {
                        return `${key} = '${data[key]}', `;
                    }
                }).join('');
    
                query += fieldsToUpdate + ' WHERE id = ?';
    
               
                connection.query(query, [userId], (err, rows) => {
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

    async deleteUser(userId) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Failed to connect to the database pool. Check your credentials or database availability:', err);
                    reject(err);
                    return;
                }
    
                const query = 'DELETE FROM Usuarios WHERE id = ?';
               
                connection.query(query, [userId], (err, rows) => {
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

module.exports = { UserModel };
