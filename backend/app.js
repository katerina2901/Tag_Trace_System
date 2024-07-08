const express = require('express');
const pillsRoutes = require('./routes/Routes');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: '*', // Allow gets from frontend only  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use('/api/pills', pillsRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});