require('dotenv').config();
const express = require('express');
const pillsRoutes = require('./routes/Routes');
const bodyParser = require('body-parser');
const cors = require('cors')

// console.log('INFURA_PROJECT_ID:', process.env.INFURA_PROJECT_ID);
// console.log('MANUFACTURER_PRIVATE_KEY:', process.env.MANUFACTURER_PRIVATE_KEY ? 'Loaded' : 'Not Loaded');
// console.log('CONSUMER_PRIVATE_KEY:', process.env.CONSUMER_PRIVATE_KEY ? 'Loaded' : 'Not Loaded');
// console.log('MANUFACTURER_CONTRACT_ADDRESS:', process.env.MANUFACTURER_CONTRACT_ADDRESS);
// console.log('CONSUMER_CONTRACT_ADDRESS:', process.env.CONSUMER_CONTRACT_ADDRESS);

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