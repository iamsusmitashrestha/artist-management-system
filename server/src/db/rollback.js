import mysql from 'mysql2';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import logger from '../utils/logger.js';

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
        logger.error('Failed to read rollback files:', err);
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
            logger.error('Rollback failed:', err);
            process.exit(1);
        } else {
            logger.info('Rollback completed successfully');
        }
    });
});
