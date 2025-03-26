vdocument.getElementById("groceryForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let item = document.getElementById("item").value;
    let store = document.getElementById("store").value;
    let price = document.getElementById("price").value;
    
    let table = document.getElementById("priceTable");
    let newRow = table.insertRow(-1);
    newRow.innerHTML = `<td>${item}</td><td>${store}</td><td>$${price}</td>`;

    let groceries = JSON.parse(localStorage.getItem("groceries")) || [];
    groceries.push({ item, store, price });
    localStorage.setItem("groceries", JSON.stringify(groceries));

    document.getElementById("groceryForm").reset();
});

window.onload = function() {
    let groceries = JSON.parse(localStorage.getItem("groceries")) || [];
    let table = document.getElementById("priceTable");
    groceries.forEach(grocery => {
        let newRow = table.insertRow(-1);
        newRow.innerHTML = `<td>${grocery.item}</td><td>${grocery.store}</td><td>$${grocery.price}</td>`;
    });
};
function processReceipt() {
    let file = document.getElementById('receiptUpload').files[0];
    if (!file) {
        alert("Please upload a receipt image.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(event) {
        let image = event.target.result;

        Tesseract.recognize(
            image,
            'eng', // Language: English
            { logger: m => console.log(m) } // Logs progress
        ).then(({ data: { text } }) => {
            console.log("Extracted Text: ", text);
            analyzeReceiptText(text);
        });
    };
    reader.readAsDataURL(file);
}
function analyzeReceiptText(text) {
    let lines = text.split("\n"); // Split text by lines
    let extractedItems = [];

    // Loop through each line to find prices
    lines.forEach(line => {
        let match = line.match(/(.*)\s+(\$?\d+\.\d{2})/); // Detect "Item Name $Price"
        if (match) {
            let item = match[1].trim();
            let price = match[2].replace("$", "");
            extractedItems.push({ item, price });
        }
    });

    // Auto-fill the grocery tracker table
    let store = "Unknown Store"; // Later, we can improve store detection
    extractedItems.forEach(({ item, price }) => {
        addToTracker(item, store, price);
    });

    console.log("Extracted Items:", extractedItems);
}

function addToTracker(item, store, price) {
    let table = document.getElementById("priceTable");
    let newRow = table.insertRow(-1);
    newRow.innerHTML = `<td>${item}</td><td>${store}</td><td>$${price}</td>`;

    let groceries = JSON.parse(localStorage.getItem("groceries")) || [];
    groceries.push({ item, store, price });
    localStorage.setItem("groceries", JSON.stringify(groceries));
}
async function addGroceryItem(item, price, store) {
    const url = "https://script.google.com/macros/s/AKfycbxVC2DP4suuBswdbdKwFC9u-lY45Iz_zb7BKy0oMymsBNUgZAMW-8jKnK3W4huAOLI3/exec";  // Paste your Apps Script Web App URL
    const data = { item, price, store };
    
    console.log(item, store, price);  // Check what you're sending

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    });

    const result = await response.text();
    console.log(result);  // Should print: ✅ Item added!
}
