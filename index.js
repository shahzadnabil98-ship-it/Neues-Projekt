const express = require('express');
const mongoose = require('mongoose');
const app = express();

const dbUrl = process.env.MONGO_URL || 'mongodb://admin:password@mongodb:27017/tasks?authSource=admin';

mongoose.connect(dbUrl).then(() => console.log('✅ MongoDB verbunden')).catch(err => console.log(err));

const Task = mongoose.model('Task', { name: String });

app.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.send(`<h1>V2 Läuft!</h1><p>Datenbank-Einträge: ${tasks.length}</p>`);
});

app.listen(3000, () => console.log('Server auf 3000'));

