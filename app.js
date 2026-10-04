const table = document.getElementById("inventoryTable");
const form = document.getElementById("productForm");

const COL = {
    number: 0,
    name: 1,
    location: 2,
    stock: 3,
    add: 4,
    remove: 5,
    status: 6,
    shape: 7,
    edit: 8
};

// Save inventory
function saveInventory() {
    const products = [];

    table.querySelectorAll("tr").forEach(row => {
        products.push({
            name: row.cells[COL.name].textContent,
            location: row.cells[COL.location].textContent,
            shape: row.cells[COL.shape].textContent,
            quantity: Number(row.cells[COL.stock].textContent)
        });
    });

    localStorage.setItem("inventory", JSON.stringify(products));
}

// Update product numbers
function updateNumbers() {
    table.querySelectorAll("tr").forEach((row, index) => {
        row.cells[COL.number].textContent = index + 1;
    });
}

// Update stock status
function updateStatus(row) {
    const quantity = Number(row.cells[COL.stock].textContent);
    const status = row.cells[COL.status];

    status.textContent = quantity < 10
        ? "Low Stock"
        : "Available";

    status.className = quantity < 10
        ? "low-stock"
        : "";
}

// Create product
function createProduct(name, location, shape, quantity) {
    const row = table.insertRow();

    const values = [
        "",
        name,
        location,
        quantity,
        "",
        "",
        "",
        shape,
        ""
    ];

    values.forEach(value => {
        const cell = row.insertCell();
        cell.textContent = value;
    });

    // Add button
    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.className = "add-btn";
    row.cells[COL.add].appendChild(addButton);

    // Remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "−";
    removeButton.className = "remove-btn";
    row.cells[COL.remove].appendChild(removeButton);

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    row.cells[COL.edit].appendChild(editButton);

    updateStatus(row);
    updateNumbers();
}

// Edit product
function editProduct(row) {
    const name = prompt(
        "Product name:",
        row.cells[COL.name].textContent
    );

    if (name === null) return;

    if (!name.trim()) {
        alert("Product name cannot be empty.");
        return;
    }

    const location = prompt(
        "Location:",
        row.cells[COL.location].textContent
    );

    if (location === null) return;

    const shape = prompt(
        "Shape:",
        row.cells[COL.shape].textContent
    );

    if (shape === null) return;

    const quantityInput = prompt(
        "Stock quantity:",
        row.cells[COL.stock].textContent
    );

    if (quantityInput === null) return;

    const quantity = Number(quantityInput);

    if (
        quantityInput.trim() === "" ||
        !Number.isSafeInteger(quantity) ||
        quantity < 0
    ) {
        alert("Enter a valid stock quantity.");
        return;
    }

    row.cells[COL.name].textContent = name.trim();
    row.cells[COL.location].textContent = location;
    row.cells[COL.shape].textContent = shape;
    row.cells[COL.stock].textContent = quantity;

    updateStatus(row);
    saveInventory();
}

// Handle buttons
table.addEventListener("click", function(event) {
    const button = event.target.closest("button");
    if (!button) return;

    const row = button.closest("tr");
    if (!row) return;

    // Edit
    if (button.classList.contains("edit-btn")) {
        editProduct(row);
        return;
    }

    const stock = row.cells[COL.stock];
    let quantity = Number(stock.textContent);

    // Add
    if (button.classList.contains("add-btn")) {
        quantity++;
    }

    // Remove
    else if (button.classList.contains("remove-btn")) {
        quantity = Math.max(0, quantity - 1);
    }

    else {
        return;
    }

    stock.textContent = quantity;

    updateStatus(row);
    saveInventory();
});

// Show or hide Add Product form
document.getElementById("addProductBtn").onclick = function() {
    form.hidden = !form.hidden;
};

// Save new product
document.getElementById("saveProductBtn").onclick = function() {
    const name =
        document.getElementById("productName").value.trim();

    const quantityInput =
        document.getElementById("productQuantity").value;

    const location =
        document.getElementById("productLocation").value;

    const shape =
        document.getElementById("productShape").value;

    const quantity = Number(quantityInput);

    if (
        !name ||
        quantityInput.trim() === "" ||
        !Number.isSafeInteger(quantity) ||
        quantity < 0
    ) {
        alert("Please enter a valid name and quantity.");
        return;
    }

    createProduct(name, location, shape, quantity);
    saveInventory();

    form.querySelectorAll("input").forEach(input => {
        input.value = "";
    });

    form.hidden = true;
};

// Restore existing products
const savedInventory = localStorage.getItem("inventory");

if (savedInventory !== null) {
    try {
        const products = JSON.parse(savedInventory);

        if (Array.isArray(products)) {
            table.innerHTML = "";

            products.forEach(product => {
                createProduct(
                    product.name,
                    product.location,
                    product.shape,
                    product.quantity
                );
            });
        }
    } catch (error) {
        console.error("Could not load inventory.", error);
    }
} else {
    // Convert original HTML rows
    const existingProducts = [];

    table.querySelectorAll("tr").forEach(row => {
        existingProducts.push({
            name: row.cells[0].textContent,
            location: row.cells[1].textContent,
            shape: row.cells[2].textContent,
            quantity: Number(row.cells[3].textContent)
        });
    });

    table.innerHTML = "";

    existingProducts.forEach(product => {
        createProduct(
            product.name,
            product.location,
            product.shape,
            product.quantity
        );
    });

    saveInventory();
}

const routeElement = document.getElementById("productRoute");

table.addEventListener("click", function(event) {
    if (event.target.closest("button")) return;

    const row = event.target.closest("tr");
    if (!row) return;

    const location = row.cells[COL.location].textContent.trim().toUpperCase();

    const routes = {
        "AREA A": "300,350 300,190 130,190 130,140",
        "AREA B": "300,350 300,190 470,190 470,140",
        "AREA C": "300,350 300,190 130,190 130,250",
        "AREA D": "300,350 300,190 470,190 470,250"
    };

    if (routes[location] && routeElement) {
        routeElement.setAttribute("points", routes[location]);
    }
    const productMarker = document.getElementById("productMarker");

const markers = {
    "AREA A": [130, 140],
    "AREA B": [470, 140],
    "AREA C": [130, 250],
    "AREA D": [470, 250]
};

if (productMarker && markers[location]) {
    productMarker.setAttribute("cx", markers[location][0]);
    productMarker.setAttribute("cy", markers[location][1]);
}
});
