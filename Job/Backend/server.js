require("dotenv").config()
const app = require("./app")
const connectToDB = require("./src/config/db")
const cookieParser = require("cookie-parser");

app.use(cookieParser());


async function startServer() {
    await connectToDB()

    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}

startServer().catch((error) => {
    console.error(`Server startup failed: ${error.message}`)
    
})