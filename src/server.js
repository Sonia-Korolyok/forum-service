
import express from 'express'
import mongoose from 'mongoose'
import config from "./config/config.js"
import postRoutes from "./routes/post.routes.js"
import userAccountRoutes from "./routes/user.account.router.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express()

app.use(express.json())

app.use('/forum', postRoutes)
app.use('/account', userAccountRoutes);

app.use(errorHandler)

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodb.uri, config.mongodb.db)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.log('MongoDB connection error', error)
    }
}

const startServer = async () => {
    await connectDB()
    app.listen(config.port, () => console.log(`Server started on port ${config.port}. Press Ctrl-C to finish`));
}

startServer()
