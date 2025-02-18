const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL Connection
const pool = new Pool({
    user: 'u3m7grklvtlo6',
    host: '35.209.89.182',
    database: 'dbzvtfeophlfnr',
    password: 'AekAds@24',
    port: 5432,
});
// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware for parsing POST request bodies
app.use(express.urlencoded({ extended: true }));

// Route to display all societies
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Societies');
        res.render('index', { societies: result.rows, society: null });
    } catch (error) {
        console.error(error);
        res.send("Error retrieving societies");
    }
});

// Route to add a new society
app.post('/add-society', async (req, res) => {
    const {
        society_name,
        start_date,
        end_date,
        rent_per_screen,
        no_of_screens,
        city,
        chairman_name,
        chairman_contact,
        secretary_name,
        secretary_contact,
        remark,
    } = req.body;

    try {
        await pool.query(
            `INSERT INTO Societies (society_name, start_date, end_date, rent_per_screen, 
            no_of_screens, city, chairman_name, chairman_contact, secretary_name, 
            secretary_contact, remark)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [society_name, start_date, end_date, rent_per_screen, no_of_screens, city, chairman_name, 
            chairman_contact, secretary_name, secretary_contact, remark]
        );
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send("Error adding society");
    }
});

// Route to edit a society
app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Societies WHERE id = $1', [id]);
        res.render('index', { society: result.rows[0], societies: [] });
    } catch (error) {
        console.error(error);
        res.send("Error retrieving society details");
    }
});

// Route to update society
app.post('/update-society', async (req, res) => {
    const {
        id, society_name, start_date, end_date, rent_per_screen, 
        no_of_screens, city, chairman_name, chairman_contact, 
        secretary_name, secretary_contact, remark
    } = req.body;

    try {
        await pool.query(
            `UPDATE Societies SET society_name = $1, start_date = $2, end_date = $3, 
            rent_per_screen = $4, no_of_screens = $5, city = $6, chairman_name = $7, 
            chairman_contact = $8, secretary_name = $9, secretary_contact = $10, 
            remark = $11 WHERE id = $12`,
            [society_name, start_date, end_date, rent_per_screen, no_of_screens, city, 
            chairman_name, chairman_contact, secretary_name, secretary_contact, remark, id]
        );
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send("Error updating society");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
