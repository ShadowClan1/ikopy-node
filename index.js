const connectToMongo = require('./db')
const express = require('express')
connectToMongo();
const app = express()
var cors = require('cors')

app.use(express.json())
app.use(cors())
   

const port = 5000
// Availble Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/note'))
// app.use('/api/auth', require('./routes/auth'))
// app.get('/', (req, res) => {
//   res.send('Hello kon hai jo yha aya')
// })  
 


 app.listen(port, () => {
   console.log(`app listening on port ${port}`)
 })
