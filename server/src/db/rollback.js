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

// Read and execute SQL rollbacks (Down part) in reverse order
const migrationFolder = path.join(process.cwd(), 'src/db/migrations');

fs.readdir(migrationFolder, (err, files) => {
    if (err) {
        console.error('❌ Failed to read rollback files:', err);
        process.exit(1);
    }

    const sqlFiles = files.filter(file => file.endsWith('.sql')).sort().reverse();

    let sqlStatements = '';
    sqlFiles.forEach(file => {
        const fileContent = fs.readFileSync(path.join(migrationFolder, file), 'utf8');
        const downSql = fileContent.split('-- Down: Drop Table')[1]; 
        sqlStatements += downSql + '\n';
    });

    connection.query(sqlStatements, (err) => {
        if (err) {
            console.error('❌ Rollback failed:', err);
            process.exit(1);
        } else {
            console.log('✅ Rollback completed successfully');
        }
        connection.end();
    });
});
