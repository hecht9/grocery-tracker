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
