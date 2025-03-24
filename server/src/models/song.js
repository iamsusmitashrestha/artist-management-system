import { connection } from "../db/migrate.js";

export async function create(songData) {
  const { title, artistId, genre, albumName } = songData;

  const query = `
      INSERT INTO music (title, artist_id, genre, album_name)
      VALUES (?, ?, ?, ?)
    `;
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [title, artistId, genre, albumName],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
}

// Get All Songs
export async function getAll(artistId, page, size) {
  const query = `SELECT id, artist_id, title, album_name, genre FROM music WHERE artist_id = ?`;

  const countQuery = `SELECT COUNT(*) AS total FROM music`;

  return new Promise((resolve, reject) => {
    connection.query(countQuery, [], (err, countResults) => {
      if (err) return reject(err);

      const count = countResults[0].total;
      connection.query(query, [artistId], (err, results) => {
        if (err) return reject(err);
        const data = results.map((song) => ({
          id: song.id,
          artistId: song.artist_id,
          title: song.title,
          albumName: song.album_name,
          genre: song.genre,
        }));

        resolve({ data, count });
      });
    });
  });
}

// Get Song by ID
export async function get(songId) {
  const query = `SELECT * FROM music WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.query(query, [songId], (err, results) => {
      if (err) reject(err);
      const data = results.map((song) => ({
        id: song.id,
        artistId: song.artist_id,
        title: song.title,
        albumName: song.album_name,
        genre: song.genre,
      }));
      resolve(data[0]);
    });
  });
}

// Update Song
export async function update(songId, songData) {
  const { title, artistId, genre, albumName } = songData;

  const query = `
      UPDATE music
      SET title = ?, artist_id = ?, genre = ?, album_name = ?
      WHERE id = ?
    `;
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [title, artistId, genre, albumName, songId],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
}

// Delete Song
export async function deleteSong(songId) {
  const query = `DELETE FROM music WHERE id = ?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [songId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

//Delete song by artistId
export async function deleteSongByArtistId(artistId) {
  const query = `DELETE FROM music WHERE artist_id = ?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [artistId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}
