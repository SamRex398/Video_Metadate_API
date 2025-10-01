const express = require('express'); 
const {connectToDatabase} = require('./config/db') 
require('dotenv').config() 

const app = express();
const PORT = process.env.SERVER_PORT


const startApp = async () => {
    
    await connectToDatabase()

    app.listen(PORT,() => {
        console.log(`Server Start on Port: ${PORT}`)
    })
}

startApp().catch(console.error)