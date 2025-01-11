import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

const app = express();
const __dirname = path.resolve(); // Resolve the current directory

app.use(bodyParser.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS
app.use(express.static(__dirname)); // Serve static files from the root directory

// MySQL Database connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cdac',
    database: 'volunteer_management',
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1); // Exit if unable to connect to the database
    }
    console.log('Connected to the MySQL database.');
});

// API Endpoints

// POST: Add a new shift
app.post('/api/add-shift', (req, res) => {
    const { shift_date, time, location, type, spots_available } = req.body;

    const insertQuery = `
        INSERT INTO shifts (shift_date, time, location, type, spots_available)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        insertQuery,
        [shift_date, time, location, type, spots_available],
        (error, result) => {
            if (error) {
                console.error('Error inserting shift:', error);
                return res.status(500).send({ message: 'Error adding the shift.' });
            }
            res.status(201).send({ message: 'New shift added successfully.' });
        }
    );
});

// GET: Fetch all shifts
app.get('/api/shifts', (req, res) => {
    const selectQuery = 'SELECT * FROM shifts';
    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error fetching shifts:', err);
            return res.status(500).send('Error fetching shifts');
        }
        res.json(results);
    });
});

// PUT: Update a shift by ID
app.put('/api/update-shift/:id', (req, res) => {
    const { id } = req.params;
    const { shift_date, time, location, type, spots_available } = req.body;

    const updateQuery = `
        UPDATE shifts
        SET shift_date = ?, time = ?, location = ?, type = ?, spots_available = ?
        WHERE id = ?
    `;

    connection.query(
        updateQuery,
        [shift_date, time, location, type, spots_available, id],
        (err, result) => {
            if (err) {
                console.error('Error updating shift:', err);
                return res.status(500).send('Error updating shift');
            }
            res.send('Shift updated successfully.');
        }
    );
});

// DELETE: Remove a shift by ID
app.delete('/api/delete-shift/:id', (req, res) => {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM shifts WHERE id = ?';

    connection.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.error('Error deleting shift:', err);
            return res.status(500).send('Error deleting shift');
        }
        res.send('Shift deleted successfully.');
    });
});

// Default Route for Serving `index.html`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
