const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'shriyash27@',
  database: 'contactbook'
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL connected");
});

// Add note
app.post('/contacts/:id/notes', (req, res) => {
  const { id } = req.params;
  const { note_text } = req.body;
  db.query('INSERT INTO contact_notes (contact_id, note_text) VALUES (?, ?)', [id, note_text], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Note added' });
  });
});

// Get all notes for a contact
app.get('/contacts/:id/notes', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM contact_notes WHERE contact_id = ? ORDER BY created_at DESC', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// Delete note
app.delete('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  db.query('DELETE FROM contact_notes WHERE id = ?', [noteId], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Note deleted' });
  });
});

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
