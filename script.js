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
        "Dakbeschot verwijderen (m²)": { unit: "m²", price: 28 },
        "Badkamer verwijderen (m²)": { unit: "m²", price: 100 }
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

// =========================
// SNELLE CALCULATOR PRIJZEN
// =========================

const QUICK_PRICES = {
    "verbouwing": {
        "basis": {
            keuken: 8000,
            badkamer: 6000,
            elektra: 3500,
            verwarming: 4000,
            sloopwerk: 2000,
            dakkapel: 15000,
            kozijnen: 5000,
            vloeren: 4000,
            isolatie: 3000,
            zonnepanelen: 12000
        },
        "midden": {
            keuken: 12000,
            badkamer: 9000,
            elektra: 4500,
            verwarming: 5500,
            sloopwerk: 3000,
            dakkapel: 20000,
            kozijnen: 7000,
            vloeren: 6000,
            isolatie: 4500,
            zonnepanelen: 15000
        },
        "luxe": {
            keuken: 18000,
            badkamer: 13000,
            elektra: 6000,
            verwarming: 7500,
            sloopwerk: 4000,
            dakkapel: 25000,
            kozijnen: 10000,
            vloeren: 9000,
            isolatie: 6500,
            zonnepanelen: 18000
        }
    },
    "aanbouw": {
        "basis": {
            keuken: 5000,
            badkamer: 4000,
            elektra: 2500,
            verwarming: 3000,
            sloopwerk: 0,
            dakkapel: 0,
            kozijnen: 3500,
            vloeren: 3000,
            isolatie: 2500,
            zonnepanelen: 10000
        },
        "midden": {
            keuken: 8000,
            badkamer: 6000,
            elektra: 3500,
            verwarming: 4000,
            sloopwerk: 0,
            dakkapel: 0,
            kozijnen: 5000,
            vloeren: 4500,
            isolatie: 3500,
            zonnepanelen: 12000
        },
        "luxe": {
            keuken: 12000,
            badkamer: 9000,
            elektra: 5000,
            verwarming: 6000,
            sloopwerk: 0,
            dakkapel: 0,
            kozijnen: 7500,
            vloeren: 6500,
            isolatie: 5500,
            zonnepanelen: 15000
        }
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
// SNELLE CALCULATOR
// =========================

function quickCalc() {
    const type = document.getElementById("type").value;
    const m2 = +document.getElementById("m2").value;
    const kwaliteit = document.getElementById("kwaliteit").value;

    const basePrices = QUICK_PRICES[type][kwaliteit];

    let totalCost = 0;

    // Controleer alle checkboxes en tel op
    const checkboxes = ["keuken", "badkamer", "elektra", "verwarming", "sloopwerk", "dakkapel", "kozijnen", "vloeren", "isolatie", "zonnepanelen"];

    checkboxes.forEach(checkbox => {
        const element = document.getElementById(checkbox);
        if (element && element.checked) {
            totalCost += basePrices[checkbox];
        }
    });

    // Vermenigvuldig met oppervlakte (per m²)
    const estimate = totalCost * (m2 / 40); // 40m² is basis

    document.getElementById("quickEstimate").innerText = "€" + estimate.toFixed(2);
}

function applyQuickSelection() {
    const type = document.getElementById("type").value;
    const m2 = +document.getElementById("m2").value;
    const kwaliteit = document.getElementById("kwaliteit").value;

    const basePrices = QUICK_PRICES[type][kwaliteit];

    const checkboxes = ["keuken", "badkamer", "elektra", "verwarming", "sloopwerk", "dakkapel", "kozijnen", "vloeren", "isolatie", "zonnepanelen"];

    checkboxes.forEach(checkbox => {
        const element = document.getElementById(checkbox);
        if (element && element.checked) {
            const pricePerM2 = basePrices[checkbox] / 40; // Deel door basis m²
            const totalPrice = pricePerM2 * m2;

            costs.push({
                cat: "Snelle Selectie",
                desc: checkbox.charAt(0).toUpperCase() + checkbox.slice(1) + ` (${kwaliteit})`,
                unit: "m²",
                qty: m2,
                unitPrice: pricePerM2,
                total: totalPrice
            });
        }
    });

    render();
    alert("✅ Geselecteerde items toegevoegd aan de calculator!");
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
