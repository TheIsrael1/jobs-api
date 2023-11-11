require('dotenv').config();
require('express-async-errors');


// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// swagger

const express = require('express')
const app = express()

const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authMiddleware = require('./middleware/authentication')

// security configs
app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
}))
app.use(helmet())
app.use(cors())
app.use(xss())

app.use(express.json())


app.get('/', (req, res) => {
    res.send('<h1>Jobs API </h1> <a href="/docs">Go to Documentation</a>')
})

// swagger route

// app routes 
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authMiddleware, jobsRouter)

// extra middlewares
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// port
const port = process.env.PORT || 5000;


// start app function
const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=> {
            console.log(`Server is listening on port ${port}...`)
        })
    }catch(error){
        console.log(error)
    }
}

start()
