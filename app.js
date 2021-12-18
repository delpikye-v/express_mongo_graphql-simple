const connection = require('./connections/mongodb')
const express = require('express')

// graphql
const graphqlHTTP = require('express-graphql').graphqlHTTP

const TodoSchema = require('./graphql/TodoQuery')

// connection db
connection()

const app = express()

app.use('/graphql', graphqlHTTP({
    schema: TodoSchema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('server start')
})