// =========================
// app.js
// Online Bouwmanager 2026
// =========================

let costs = [];
let project = {
    name: "",
    budget: 0,
    region: 1.0
};

// =========================
// PRIJZEN 2026
// =========================

const PRICES = {
    "Sloopwerk": {
        "Binnenwand slopen": { unit: "m²", price: 45 },
        "Vloer verwijderen": { unit: "m²", price: 22 }
    },
    "Metselwerk": {
        "Kalkzandsteen": { unit: "m²", price: 95 },
        "Baksteen": { unit: "m²", price: 165 }
    },
    "Installatie": {
        "Stopcontact": { unit: "st", price: 95 },
        "Lichtpunt": { unit: "st", price: 85 }
    }
};

// AK / W&R / BTW
const SETTINGS = {
    ak: 0.08,
    wr: 0.05,
    btw: 0.21
};

// =========================
// INIT
// =========================

window.onload = () => {
    loadDropdowns();
    load();
};

// =========================
// DROPDOWNS
// =========================

function loadDropdowns() {
    const cat = document.getElementById("category");
    cat.innerHTML = Object.keys(PRICES)
        .map(c => `<option>${c}</option>`)
        .join("");

    updateDescriptions();
    cat.onchange = updateDescriptions;
}

function updateDescriptions() {
    const cat = document.getElementById("category").value;
    const desc = document.getElementById("description");

    desc.innerHTML = Object.keys(PRICES[cat])
        .map(d => `<option>${d}</option>`)
        .join("");
}

// =========================
// PROJECT OPSLAAN
// =========================

function saveProject() {
    project.name = document.getElementById("projectName").value;
    project.budget = +document.getElementById("projectBudget").value;
    project.region = +document.getElementById("regionFactor").value;

    localStorage.setItem("project", JSON.stringify(project));
}

// =========================
// KOST TOEVOEGEN
// =========================

function addCost() {

    const cat = document.getElementById("category").value;
    const desc = document.getElementById("description").value;
    const qty = +document.getElementById("quantity").value;

    const item = PRICES[cat][desc];

    const unitPrice = item.price * project.region;

    const total = unitPrice * qty;

    costs.push({
        cat,
        desc,
        unit: item.unit,
        qty,
        unitPrice,
        total
    });

    render();
}

// =========================
// RENDER
// =========================

function render() {
    const body = document.getElementById("rows");

    body.innerHTML = costs.map((c, i) => `
        <tr>
            <td>${c.cat}</td>
            <td>${c.desc}</td>
            <td>${c.unit}</td>
            <td>${c.qty}</td>
            <td>€${c.unitPrice.toFixed(2)}</td>
            <td>€${c.total.toFixed(2)}</td>
            <td><button onclick="remove(${i})">X</button></td>
        </tr>
    `).join("");

    updateTotals();
}

// =========================
// TOTALEN
// =========================

function updateTotals() {

    const direct = costs.reduce((a,b)=>a+b.total,0);

    const ak = direct * SETTINGS.ak;
    const wr = direct * SETTINGS.wr;
    const subtotal = direct + ak + wr;
    const btw = subtotal * SETTINGS.btw;
    const total = subtotal + btw;

    document.getElementById("directCost").innerText = "€" + direct.toFixed(2);
    document.getElementById("ak").innerText = "€" + ak.toFixed(2);
    document.getElementById("wr").innerText = "€" + wr.toFixed(2);
    document.getElementById("btw").innerText = "€" + btw.toFixed(2);
    document.getElementById("total").innerText = "€" + total.toFixed(2);
}

// =========================
// VERWIJDEREN
// =========================

function remove(i) {
    costs.splice(i, 1);
    render();
}

// =========================
// LOAD
// =========================

function load() {
    const p = localStorage.getItem("project");
    if (p) project = JSON.parse(p);
}
```
