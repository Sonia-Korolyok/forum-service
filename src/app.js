import express from 'express'
import postRoutes from './routes/post.routes.js'
import userAccountRoutes from "./routes/user.account.router.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express()

app.use(express.json())

app.use('/forum', postRoutes)
app.use('/account', userAccountRoutes)

app.use((req, res, next) => {
    const err = new Error(`Route ${req.method} ${req.originalUrl} not found`)
    err.statusCode = 404
    next(err)
})

app.use(errorHandler)

export default app
