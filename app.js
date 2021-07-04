const express = require('express');
const app = express();
const PORT = 5000
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys')

app.use(express.json());


require('./models/user')
require('./models/post')

app.use(require('./routes/auth'))
app.use(require('./routes/post'))




mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('mongoose connection successful');
})




app.listen(PORT, () => {
    console.log('SERVER IS RUNNING', PORT)
})