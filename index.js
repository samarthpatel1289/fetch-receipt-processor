const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json()); 

let receipts = {};

app.post('/receipts/process', (req, res) => {
    let receipt = req.body;
    receipt.id = uuidv4(); // Generate unique ID for the receipt.
    receipt.points = calculatePoints(receipt); // Calculate points based on the receipt.
    receipts[receipt.id] = receipt; // Store receipt in memory.

    res.json({ id: receipt.id }); // Respond with receipt ID.
});

app.get('/receipts/:id/points', (req, res) => {
    let id = req.params.id;
    let receipt = receipts[id];
    if (receipt) {
        res.json({ points: receipt.points });
    } else {
        res.status(404).json({ error: 'Receipt not found.' });
    }
});

function calculatePoints(receipt) {
    let points = 0;

    // Rule 1: One point for every alphanumeric character in the retailer name.
    points += (receipt.retailer.match(/[a-z0-9]/gi) || []).length; // Walgreens - 9, Target - 6

    // Rule 2: 50 points if the total is a round dollar amount with no cents.
    if (Number.isInteger(parseFloat(receipt.total))) {
        points += 50; // Walgreen - 0, Target - 0
    }
    // Rule 3: 25 points if the total is a multiple of 0.25.
    if (parseFloat(receipt.total) % 0.25 === 0) {
        points += 25;// Walgreen - 0, Target - 25
    }

    // Rule 4: 5 points for every two items on the receipt.
    points += Math.floor(receipt.items.length / 2) * 5; // Walgreen - 5

    // Rule 5: If the trimmed length of the item description is a multiple of 3, 
    // multiply the price by 0.2 and round up to the nearest integer. 
    // The result is the number of points earned.
    receipt.items.forEach(item => {
        if (item.shortDescription.trim().length % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2); // Walgreen - 1, Target - 0
        }
    });

    // Rule 6: 6 points if the day in the purchase date is odd.
    if (getDayFromDate(receipt.purchaseDate) % 2 !== 0) {
        points += 6; // Walgreen - 0, Target - 0
    }

    // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm.
    let purchaseTime = parseInt(receipt.purchaseTime.split(':')[0]);
    if (purchaseTime >= 14 && purchaseTime < 16) {
        points += 10;// Walgreen - 0, Target - 0
    }

    return points; // Walgreen - 15, Target - 31
}

// Function uses string manipulation rather than Date function and expect YYYY-MM-DD format. 
function getDayFromDate(dateString) {
    return parseInt(dateString.split('-')[2], 10);
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});