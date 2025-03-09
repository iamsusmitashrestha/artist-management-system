import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const migrationSQL = fs.readFileSync('./db/makeMigration.sql', 'utf8');

// Execute the migration
connection.query(migrationSQL, (err, results) => {
    if (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    } else {
        console.log('✅ Migration completed successfully');
    }
    connection.end();
});

