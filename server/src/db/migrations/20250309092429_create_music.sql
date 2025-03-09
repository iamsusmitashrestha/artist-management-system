-- Up: Create Table
CREATE TABLE IF NOT EXISTS music (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    album_name VARCHAR(255) NOT NULL,
    genre ENUM('rnb', 'country', 'classic', 'rock', 'jazz') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE
);

-- Down: Drop Table
DROP TABLE IF EXISTS music;

