import { connection } from "../db/migrate.js";

export async function create(artistData) {
  const { name, dob, gender, address, firstReleaseYear, noOfAlbumsReleased } =
    artistData;

  const query = `
      INSERT INTO artist (name, dob, gender, address, first_release_year, no_of_albums_released)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [name, dob, gender, address, firstReleaseYear, noOfAlbumsReleased],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
}

// Get All Artists
export async function getAll(page, size) {
  const query = `SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released FROM artist`;

  const countQuery = `SELECT COUNT(*) AS total FROM artist`;

  return new Promise((resolve, reject) => {
    connection.query(countQuery, [], (err, countResults) => {
      if (err) return reject(err);

      const count = countResults[0].total;
      connection.query(query, [], (err, results) => {
        if (err) return reject(err);
        const data = results.map((artist) => ({
          id: artist.id,
          name: artist.name,
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
        dob: artist.dob,
        gender: artist.gender,
        address: artist.address,
        firstReleaseYear: artist.first_release_year,
        noOfAlbumsReleased: artist.no_of_albums_released,
      }));
      resolve(data[0]);
    });
  });
}

// Update Artist
export async function update(artistId, artistData) {
  const { name, dob, gender, address, firstReleaseYear, noOfAlbumsReleased } =
    artistData;

  const query = `
      UPDATE artist
      SET name = ?, dob = ?, gender = ?, address = ?, first_release_year = ?, no_of_albums_released = ?
      WHERE id = ?
    `;
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [
        name,
        dob,
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
export async function deleteArtist(artistId) {
  const query = `DELETE FROM artist WHERE id = ?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [artistId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}
