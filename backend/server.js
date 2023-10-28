const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const markersDB = new sqlite.Database('markers.db', err => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("connected to markers db");
    }
})

markersDB.serialize(() => {
    markersDB.run('CREATE TABLE IF NOT EXISTS markers (id INTEGER PRIMARY KEY AUTOINCREMENT, lat STRING(50), lng STRING(50), reserved STRING(50))');

    const initialMarkers = [
        { lat: 45.76782506542521, lng: 21.230684766559914, reserved: "true" },
        { lat: 45.766028855370735, lng: 21.221908579090137, reserved: "false" },
        { lat: 45.76721134657924, lng: 21.223496431306803, reserved: "false" },
    ]

    const insertStatement = markersDB.prepare('INSERT INTO markers (lat, lng, reserved) VALUES (?, ?, ?)');
    initialMarkers.forEach(marker => {
        insertStatement.run(marker.lat, marker.lng, marker.reserved);
    })

    insertStatement.finalize();
})

const usersDB = new sqlite.Database('users.db', err => {
    if (err) {
        console.err(err.message);
    }
    else {
        console.log("connected to users db");
    }
})

usersDB.serialize(() => {
    usersDB.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email STRING(50), password STRING(50), role STRING(50))');

    const initialUsers = [
        { email: "admin@example.com", password: "adminpassword", role: "admin" },
        { email: "user@example.com", password: "userpassword", role: "user" }
    ]

    const insertStatement = usersDB.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    initialUsers.forEach(user => {
        insertStatement.run(user.email, user.password, user.role);
    })
});

app.get('/users', (req, res) => {
    const { email, password } = req.query;

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    usersDB.get(query, [email, password], (err, row) => {
        if (err) {
            res.status(500).json({ message: 'Error finding the user' });
        } else if (!row) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(row);
        }
    });
});

app.get('/getMarkers', (req, res) => {
    markersDB.all('SELECT * FROM markers', (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving markers' });
        } else {
            res.json(rows);
        }
    });
});

app.post('/addMarkers', (req, res) => {
    const { lat, lng, reserved } = req.body;

    markersDB.run('INSERT INTO markers (lat, lng, reserved) VALUES (?, ?, ?)', [lat, lng, reserved], function (err) {
        if (err) {
            res.status(500).json({ message: 'Error adding a marker' });
        } else {
            res.status(201).json({ message: 'Marker added successfully', id: this.lastID });
        }
    });
});

app.delete('/deleteMarker/:lat/:lng', (req, res) => {
    const lat = req.params.lat;
    const lng = req.params.lng;

    const query = 'DELETE FROM markers WHERE lat == ? AND lng == ?';
    markersDB.run(query, [lat, lng], function (err) {
        if (err) {
            res.status(500).json({ message: 'Failed to delete the marker.' });
        } else {
            res.status(200).json({ message: 'Marker deleted successfully.' });
        }
    });
});

app.put('/toggleReserved/:lat/:lng/:reserved', (req, res) => {
    const lat = req.params.lat;
    const lng = req.params.lng;
    const reserved = req.params.reserved;

    const query = 'UPDATE markers SET reserved = ? WHERE lat == ? AND lng == ?';
    markersDB.run(query, [reserved, lat, lng], function (err) {
        if (err) {
            res.status(500).json({ message: "Failed to update reserved status" });
        }
        else {
            res.status(200).json({ message: "Reserved status updated successfully" });
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});