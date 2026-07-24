const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

// Load environment variables if not already loaded
require('dotenv').config();

const connection = createClient({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const adapter = new PrismaLibSql(connection);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
