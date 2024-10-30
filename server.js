require("dotenv").config();
const express = require('express');

const app = express();


const PORT = process.env.PORT || 4800

app.get('/', (req, res) => {
  res.status(200).json({ message: "server is healthy", pid: process.pid, uptime: process.uptime() })
})

app.use('/api/v1/excel', require('./routes/exceljs'));

app.use('/api/v1/template', require('./routes/template'))


app.listen(PORT, () => {
  console.log(`server is listening on Port ${PORT}`)
})