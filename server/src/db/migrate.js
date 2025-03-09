import mysql from 'mysql2';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';


dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
});

// Read and execute SQL migrations
const migrationFolder = path.join(process.cwd(), 'src/db/migrations');

fs.readdir(migrationFolder, (err, files) => {
    if (err) {
        console.error('❌ Failed to read migration files:', err);
        process.exit(1);
    }

    const sqlFiles = files.filter(file => file.endsWith('.sql')).sort();

    let sqlStatements = '';
    sqlFiles.forEach(file => {
        const fileContent = fs.readFileSync(path.join(migrationFolder, file), 'utf8');
        const upSql = fileContent.split('-- Down: Drop Table')[0];
        sqlStatements += upSql + '\n';
    });

    connection.query(sqlStatements, (err) => {
        if (err) {
            console.error('❌ Migration failed:', err);
            process.exit(1);
        } else {
            console.log('✅ Migrations applied successfully');
        }
        connection.end();
    });
});
