const app = require('./api/index.js');
const express = require('express');
const path = require('path');


app.use(express.static(path.join(__dirname, '')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🛡️  SERVER PENJAGA API KEY (NODE.JS) MENYALA!`);
    console.log(`🚀 API berjalan di: http://localhost:${PORT}/api/chat`);
    console.log(`👉 Silakan buka file index.html di browser Anda.`);
    console.log(`=================================================\n`);
});
