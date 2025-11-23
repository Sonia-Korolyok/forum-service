import express from 'express';
import mongoose from 'mongoose';
import config from "./config/config.js";
import postRoutes from "./routes/post.routes.js";
import {errorHandler} from "./middlewares/error.middleware.js";

const app =  express()

app.use(express.json());
app.use(errorHandler);


app.use('/forum', postRoutes);
//todo app.use error middleware

const connectDB = async () => {
    try{
        await mongoose.connect(config.mongodb.uri, config.mongodb.db);
        console.log("Connected to MongoDB successfully!");
    }catch(err){
        console.log("MongoDB connection error:", err);
    }
}
const startServer = async () => {
    await connectDB();
    app.listen(config.port, () => console.log(`Server started on port ${config.port}. Press Ctrl-C to finish`));
}
startServer();