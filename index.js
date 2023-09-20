const connectToMongo=require('./db');

connectToMongo();
const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello Harsh !')
// })
//Avaliable routes using use
app.use('/api/auth' ,require('./routes/auth.js'));
// app.use('api/notes',require('./routes/notes.js'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
