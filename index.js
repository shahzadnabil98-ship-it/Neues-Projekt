const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Wir bauen die URL dynamisch mit dem Passwort aus der Umgebungsvariable
// Falls MONGO_PASS nicht da ist, nutzen wir 'password' als Sicherheitsnetz (Fallback)
const dbPassword = process.env.MONGO_PASS || 'password';
const dbUrl = `mongodb://admin:shahzad-1998@mongodb:27017/tasks?authSource=admin`;

mongoose.connect(dbUrl)
  .then(() => console.log('✅ MongoDB verbunden'))
  .catch(err => console.log('❌ DB Verbindungsfehler:', err));

const Task = mongoose.model('Task', { name: String });

app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(`
            <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
                <h1>🚀 V2 Läuft!</h1>
                <p>Datenbank-Einträge: <strong>${tasks.length}</strong></p>
                <hr>
                <p>Status: Verbindung zur MongoDB steht.</p>
            </body>
        `);
    } catch (err) {
        res.status(500).send("Fehler beim Abrufen der Daten: " + err.message);
    }
});

app.listen(3000, () => console.log('Server läuft auf Port 3000'));


