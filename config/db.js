const { PrismaClient } = require("@prisma/client");
require("dotenv").config()

const prisma = globalThis.prisma ?? new PrismaClient({
    log: ['query', 'error', 'warn']
})

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// Connection test function
const connectToDatabase = async() => {
    try {
        await prisma.$connect()
        console.log('Successfully connected to database')
    } catch (error) {
        console.error('Failed to connect to database:', error)
        throw error
    }
}

module.exports = { prisma, connectToDatabase }
