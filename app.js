const mongoose = require('mongoose')
const express = require('express')

const bodyParser = require('body-parser')
const multer = require('multer')
const graphqlHttp = require('express-graphql').graphqlHTTP

const app = express()


const graphqlResolver = require('./graphql/resolvers')
const graphqlSchema = require('./graphql/schema')
const auth = require('./middleware/auth')


app.use(auth)
app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err){
        if (!err.originalError){
            return err
        }
        const data = err.originalError.data
        const message = err.message || "An error occurred"
        const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
}))

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });
  
const MONGO_URI = 'mongodb+srv://minhnguyen_2024:Nerfrecon098.@cluster0.yz24zit.mongodb.net/courses?retryWrites=true'

mongoose.connect(MONGO_URI)
    .then(result =>{
        app.listen(8000)
        console.log("8000 connected")
    })
    .catch(err => console.log(err))