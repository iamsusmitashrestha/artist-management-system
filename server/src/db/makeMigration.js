import fs from 'fs';
import path from 'path';

const migrationFolder = path.join(process.cwd(), 'src/db/migrations');

// Ensure the migrations directory exists
if (!fs.existsSync(migrationFolder)) {
    fs.mkdirSync(migrationFolder, { recursive: true });
}

// Get the migration name from the command line
const migrationName = process.argv[2];

if (!migrationName) {
    console.error('❌ Please provide a migration name. Example: npm run make:migration create_users');
    process.exit(1);
}

// Create a timestamped filename
const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
const fileName = `${timestamp}_${migrationName}.sql`;
const filePath = path.join(migrationFolder, fileName);

// SQL Template
const template = `-- Up: Create Table

-- Down: Drop Table
`;

// Create the file
fs.writeFileSync(filePath, template);

console.log(`✅ Migration created: ${filePath}`);
