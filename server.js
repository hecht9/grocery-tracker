require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./google-credentials.json'); // Import credentials

const app = express();
app.use(express.json());
app.use(cors());

const SHEET_ID = '1aruTH3cOPHElRmWj2ude7eZlZMsUUVFXJlJWMK9BSNM'; // Replace with your Google Sheet ID

async function accessSheet() {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    return doc.sheetsByIndex[0]; // First sheet
}

// API route to add grocery item
app.post('/add-item', async (req, res) => {
    try {
        const sheet = await accessSheet();
        await sheet.addRow({
            Item: req.body.item,
            Price: req.body.price,
            Store: req.body.store,
            Date: new Date().toLocaleDateString()
        });
        res.json({ message: "Item added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add item" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
