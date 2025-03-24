-- Up: Create Table
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dob DATETIME NOT NULL,
    gender ENUM('M', 'F', 'O') NOT NULL,
    address VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'artist_manager', 'artist') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    artist_id INT,
    FOREIGN KEY (artist_id) REFERENCES artist(id)
);

-- Down: Drop Table
DROP TABLE IF EXISTS user;