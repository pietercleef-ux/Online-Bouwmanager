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
// PRIJZEN 2026 - NEDERLAND
// =========================

const PRICES = {
    "Sloopwerk": {
        "Binnenwand slopen (m²)": { unit: "m²", price: 45 },
        "Buitenwand slopen (m²)": { unit: "m²", price: 85 },
        "Vloer verwijderen (m²)": { unit: "m²", price: 35 },
        "Dak/dakpannen verwijderen (m²)": { unit: "m²", price: 65 },
        "Dakbeschot verwijderen (m²)": { unit: "m²", price: 28 }
    },
    "Metselwerk": {
        "Kalkzandsteen muur (m²)": { unit: "m²", price: 95 },
        "Baksteen muur (m²)": { unit: "m²", price: 165 },
        "Isolatiebaksteen (m²)": { unit: "m²", price: 145 },
        "Cellenbeton blokken (m²)": { unit: "m²", price: 72 },
        "Voegen herstellen (m²)": { unit: "m²", price: 38 }
    },
    "Timmerwerk": {
        "Houten vloer (m²)": { unit: "m²", price: 125 },
        "Ondervloering (m²)": { unit: "m²", price: 45 },
        "Dakconstructie (m²)": { unit: "m²", price: 185 },
        "Deurkozijn plaatsen (stuks)": { unit: "st", price: 95 },
        "Raamkozijn plaatsen (stuks)": { unit: "st", price: 185 }
    },
    "Elektriciteit": {
        "Stopcontact plaatsen (stuks)": { unit: "st", price: 95 },
        "Lichtpunt plaatsen (stuks)": { unit: "st", price: 85 },
        "Schakelaar plaatsen (stuks)": { unit: "st", price: 75 },
        "Groepenkast vervangen (stuks)": { unit: "st", price: 425 },
        "Elektriciteit aansluiting (m)": { unit: "m", price: 35 }
    },
    "Sanitair": {
        "Toilet plaatsen (stuks)": { unit: "st", price: 185 },
        "Wastafel plaatsen (stuks)": { unit: "st", price: 145 },
        "Douche installeren (stuks)": { unit: "st", price: 325 },
        "Badkamer tegels (m²)": { unit: "m²", price: 85 },
        "Loodgieter werkzaamheden (uur)": { unit: "uur", price: 65 }
    },
    "Afwerking": {
        "Pleisterwerk (m²)": { unit: "m²", price: 32 },
        "Muurverf (m²)": { unit: "m²", price: 18 },
        "Vloertegel (m²)": { unit: "m²", price: 72 },
        "Vinyl vloer (m²)": { unit: "m²", price: 52 },
        "Behang (m²)": { unit: "m²", price: 28 },
        "Deurkruk montage (stuks)": { unit: "st", price: 25 }
    },
    "Isolatie & Thermisch": {
        "Muurisolatie (m²)": { unit: "m²", price: 48 },
        "Dakisolatie (m²)": { unit: "m²", price: 42 },
        "Vloerisolatie (m²)": { unit: "m²", price: 35 },
        "Double glazing raam (m²)": { unit: "m²", price: 275 },
        "Deur isoleren (stuks)": { unit: "st", price: 165 }
    },
    "Dakbedekking": {
        "Dakpan leggen (m²)": { unit: "m²", price: 55 },
        "Bitumen dakbedekking (m²)": { unit: "m²", price: 42 },
        "Zinkwerk/goten (m)": { unit: "m", price: 28 },
        "Dakramen plaatsen (stuks)": { unit: "st", price: 245 }
    },
    "Schilderwerk": {
        "Muur schilderen (m²)": { unit: "m²", price: 18 },
        "Plafond schilderen (m²)": { unit: "m²", price: 22 },
        "Deur/Raam schilderen (stuks)": { unit: "st", price: 35 },
        "Grondlaag aanbrengen (m²)": { unit: "m²", price: 12 }
    },
    "Bouwhuisvesting": {
        "Locatietoilet huur/maand": { unit: "maand", price: 145 },
        "Bouwkeet huur/week": { unit: "week", price: 125 },
        "Afzetting/hekwerk (m)": { unit: "m", price: 15 },
        "Steiger huur/week (m²)": { unit: "week", price: 8 }
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
