const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware, um Formulardaten zu lesen (wichtig für den POST-Befehl)
app.use(express.urlencoded({ extended: true }));

// Deine funktionierende Verbindung mit dem festen Passwort
const dbUrl = `mongodb://admin:shahzad-1998@mongodb:27017/tasks?authSource=admin`;

mongoose.connect(dbUrl)
  .then(() => console.log('✅ MongoDB verbunden'))
  .catch(err => console.log('❌ DB Verbindungsfehler:', err));

const Task = mongoose.model('Task', { name: String });

app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(`
            <body style="font-family: sans-serif; text-align: center; background: #f0f2f5; padding-top: 50px;">
                <div style="background: white; display: inline-block; padding: 40px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                    <h1 style="color: #1a73e8;">📝 DevOps Task-Manager</h1>
                    <p style="color: #5f6368;">Datenbank-Einträge: <strong>${tasks.length}</strong></p>
                    
                    <form action="/add" method="POST" style="margin: 20px 0;">
                        <input type="text" name="taskName" placeholder="Was steht an?" required 
                               style="padding: 12px; width: 250px; border: 1px solid #dadce0; border-radius: 8px; outline: none;">
                        <button type="submit" style="padding: 12px 20px; background: #1a73e8; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Hinzufügen</button>
                    </form>

                    <ul style="list-style: none; padding: 0; text-align: left; max-width: 350px; margin: 0 auto;">
                        ${tasks.map(t => `<li style="padding: 10px; border-bottom: 1px solid #f1f3f4; color: #3c4043;">🔹 ${t.name}</li>`).join('')}
                    </ul>
                    ${tasks.length === 0 ? '<p style="color: #9aa0a6;">Die Liste ist noch leer.</p>' : ''}
                </div>
            </body>
        `);
    } catch (err) {
        res.status(500).send("Fehler beim Abrufen der Daten: " + err.message);
    }
});

// Neue Route zum Speichern von Daten
app.post('/add', async (req, res) => {
    try {
        const newTask = new Task({ name: req.body.taskName });
        await newTask.save();
        res.redirect('/'); // Zurück zur Hauptseite
    } catch (err) {
        res.status(500).send("Fehler beim Speichern: " + err.message);
    }
});

app.listen(3000, () => console.log('Server läuft auf Port 3000'));
