import { connection } from "../db/migrate.js";
import { injectPaginationToQuery } from "../utils/pagination.js";

/**
 * Inserts a new user into the database
 * @param {Object} userData - User details
 */
export async function create(userData, trx) {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    gender,
    address,
    role,
    artistId,
  } = userData;
  const query = `INSERT INTO user (first_name, last_name, email, password, phone, dob, gender, address, role, artist_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`;

  return new Promise((resolve, reject) => {
    const conn = trx || connection;

    conn.query(
      query,
      [
        firstName,
        lastName,
        email,
        password,
        phone,
        dob,
        gender,
        address,
        role,
        artistId,
      ],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
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

/**
 * Get all users
 */
export async function getAllUsers(page, size) {
  let query = `SELECT id, first_name, last_name, email, phone, dob, gender, address, role FROM user`;

  const countQuery = `SELECT COUNT(*) AS total FROM user`;

  query = injectPaginationToQuery(query, page, size);

  return new Promise((resolve, reject) => {
    connection.query(countQuery, [], (err, countResults) => {
      if (err) return reject(err);

      const count = countResults[0].total;
      connection.query(query, [], (err, results) => {
        if (err) return reject(err);
        const data = results.map((user) => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          gender: user.gender,
          address: user.address,
          role: user.role,
          artistId: user.artist_id,
        }));

        resolve({ data, count });
      });
    });
  });
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  const query = `SELECT id, first_name, last_name, email, phone, dob, gender, address, role, artist_id FROM user WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      const data = results.map((user) => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        role: user.role,
        artistId: user.artist_id,
      }));
      resolve(data[0]);
    });
  });
}

/**
 * Update user by ID
 */
export async function updateUser(userId, updatedData) {
  const { firstName, lastName, email, phone, dob, gender, address, role } =
    updatedData;
  const query = `UPDATE user SET first_name=?, last_name=?, email=?, phone=?, dob=?, gender=?, address=?, role=? WHERE id=?`;

  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [firstName, lastName, email, phone, dob, gender, address, role, userId],
      (err, results) => {
        if (err || results.affectedRows === 0) return reject(err);
        resolve("User updated successfully");
      }
    );
  });
}

/**
 * Delete user by ID
 */
export async function deleteUser(userId, trx) {
  const query = `DELETE FROM user WHERE id = ?`;

  return new Promise((resolve, reject) => {
    const conn = trx || connection;

    conn.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve("User deleted successfully");
    });
  });
}

//Delete user by artistId
export async function deleteUserByArtistId(artistId, trx) {
  const query = `DELETE FROM user WHERE artist_id = ?`;
  return new Promise((resolve, reject) => {
    const conn = trx || connection;

    conn.query(query, [artistId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}
