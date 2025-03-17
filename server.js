const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');


const app = express();
const port = 3000;

// Database connection setup
const pool = new Pool({
  user: 'u3m7grklvtlo6',
  host: '35.209.89.182',
  database: 'dbzvtfeophlfnr',
  password: 'AekAds@24',
  port: 5432,
});


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Home route: Show societies
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT *, (rent_per_screen * no_of_screens) AS total_rent FROM societies ORDER BY id DESC');
    res.render('index', { societies: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Error fetching societies');
  }
});

// Add society
app.post('/add-society', async (req, res) => {
  const {
    society_name, start_date, end_date, rent_per_screen, no_of_screens,
    city, chairman_name, chairman_contact, secretary_name, secretary_contact,
    pdf_url, remark
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO societies
      (society_name, start_date, end_date, rent_per_screen, no_of_screens,
      city, chairman_name, chairman_contact, secretary_name, secretary_contact,
      pdf_url, remark)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [society_name, start_date, end_date, rent_per_screen, no_of_screens,
        city, chairman_name, chairman_contact, secretary_name, secretary_contact,
        pdf_url, remark]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error adding society');
  }
});

// Edit page
app.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM societies WHERE id = $1', [id]);
    const societies = await pool.query('SELECT *, (rent_per_screen * no_of_screens) AS total_rent FROM societies ORDER BY id DESC');
    res.render('index', { society: result.rows[0], societies: societies.rows });
  } catch (err) {
    console.error(err);
    res.send('Error loading edit form');
  }
});

// Update society
app.post('/update-society', async (req, res) => {
  const {
    id, society_name, start_date, end_date, rent_per_screen, no_of_screens,
    city, chairman_name, chairman_contact, secretary_name, secretary_contact,
    pdf_url, remark
  } = req.body;

  try {
    await pool.query(
      `UPDATE societies SET
      society_name = $1,
      start_date = $2,
      end_date = $3,
      rent_per_screen = $4,
      no_of_screens = $5,
      city = $6,
      chairman_name = $7,
      chairman_contact = $8,
      secretary_name = $9,
      secretary_contact = $10,
      pdf_url = $11,
      remark = $12
      WHERE id = $13`,
      [society_name, start_date, end_date, rent_per_screen, no_of_screens,
        city, chairman_name, chairman_contact, secretary_name, secretary_contact,
        pdf_url, remark, id]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error updating society');
  }
});

// Delete society (optional)
app.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM societies WHERE id = $1', [id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Error deleting society');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
