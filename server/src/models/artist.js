import { connection } from "../db/migrate.js";
import { injectPaginationToQuery } from "../utils/pagination.js";

export async function create(artistData, trx) {
  const {
    name,
    dob,
    email,
    gender,
    address,
    firstReleaseYear,
    noOfAlbumsReleased,
  } = artistData;

  const query = `
     INSERT INTO artist (name, dob, email, gender, address, first_release_year, no_of_albums_released)
     VALUES (?, ?, ?, ?, ?, ?, ?)
   `;
  return new Promise((resolve, reject) => {
    const conn = trx || connection;

    conn.query(
      query,
      [name, dob, email, gender, address, firstReleaseYear, noOfAlbumsReleased],
      (err, results) => {
        if (err) reject(err);
        else resolve({ id: results.insertId });
      }
    );
  });
}

// get artist by email
export async function getArtistByEmail(email) {
  const query = `SELECT * FROM artist WHERE email = ?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [email], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
}

// Get All Artists
export async function getAll(page, size) {
  let query = `SELECT id, name, email, dob, gender, address, first_release_year, no_of_albums_released FROM artist`;

  const countQuery = `SELECT COUNT(*) AS total FROM artist`;

  query = injectPaginationToQuery(query, page, size);

  return new Promise((resolve, reject) => {
    connection.query(countQuery, [], (err, countResults) => {
      if (err) return reject(err);

      const count = countResults[0].total;
      connection.query(query, [], (err, results) => {
        if (err) return reject(err);
        const data = results.map((artist) => ({
          id: artist.id,
          name: artist.name,
          email: artist.email,
          dob: artist.dob,
          gender: artist.gender,
          address: artist.address,
          firstReleaseYear: artist.first_release_year,
          noOfAlbumsReleased: artist.no_of_albums_released,
        }));

        resolve({ data, count });
      });
    });
  });
}

// Get Artist by ID
export async function get(artistId) {
  const query = `SELECT * FROM artist WHERE id = ?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [artistId], (err, results) => {
      if (err) reject(err);
      const data = results.map((artist) => ({
        id: artist.id,
        name: artist.name,
        email: artist.email,
        dob: artist.dob,
        gender: artist.gender,
        address: artist.address,
        firstReleaseYear: artist.first_release_year,
        noOfAlbumsReleased: artist.no_of_albums_released,
      }));
      return resolve(data[0]);
    });
  });
}

// Update Artist
export async function update(artistId, artistData) {
  const {
    name,
    dob,
    email,
    gender,
    address,
    firstReleaseYear,
    noOfAlbumsReleased,
  } = artistData;

  const query = `
     UPDATE artist
     SET name = ?, dob = ?, email = ?, gender = ?, address = ?, first_release_year = ?, no_of_albums_released = ?
     WHERE id = ?
   `;
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [
        name,
        dob,
        email,
        gender,
        address,
        firstReleaseYear,
        noOfAlbumsReleased,
        artistId,
      ],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
}

// Delete Artist
export async function deleteArtist(artistId, trx) {
  const query = `DELETE FROM artist WHERE id = ?`;
  return new Promise((resolve, reject) => {
    const conn = trx || connection;

    conn.query(query, [artistId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}
