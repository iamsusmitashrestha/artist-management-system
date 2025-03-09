-- Up: Create Table
CREATE TABLE IF NOT EXISTS artist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATETIME NOT NULL,
    gender ENUM('M', 'F', 'O') NOT NULL,
    address VARCHAR(255) NOT NULL,
    first_release_year YEAR NOT NULL,
    no_of_albums_released INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Down: Drop Table
DROP TABLE IF EXISTS artist;
