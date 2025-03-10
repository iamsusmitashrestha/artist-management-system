import { connection } from "../db/migrate.js";


/**
 * Inserts a new user into the database
 * @param {Object} userData - User details
 */
export async function create(userData) {
    const { firstName, lastName, email, password, phone, dob, gender, address, role } = userData;
    const query = `INSERT INTO user (first_name, last_name, email, password, phone, dob, gender, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        connection.query(query, [firstName, lastName, email, password, phone, dob, gender, address, role], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

export async function getUserByEmail(email) {
    const query = `SELECT * FROM user WHERE email = ?`;
    
    return new Promise((resolve, reject) => {
      connection.query(query, [email], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }