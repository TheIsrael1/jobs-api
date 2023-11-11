const {StatusCodes} = require('http-status-codes')
const { object } = require('joi')

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
       statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
       msg: err.message || 'Something went wrong, pleas try again in a short while' 
    }

    if(err.name === 'ValidationError'){
        console.log('see', err)
        customError.msg = Object.values(err.errors)
        .map((item) => item.message)
        .join(', ')
        customError.statusCode = 400
    }

    if(err.code && err.code === 11000){
        customError.msg = `${
            Object.keys(err.keyValue)
        } already exists, please enter another ${Object.keys(err.keyValue)}`
        customError.statusCode = 400
    }

    if(err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`
        customError.statusCode = 404
    }

    return res.status(customError.statusCode).json({msg: customError.msg})  
}

module.exports =  errorHandlerMiddleware