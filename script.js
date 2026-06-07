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
// PRIJZEN 2026 - NEDERLAND (BIJGEWERKT)
// Gebaseerd op huidige marktprijzen en CBS/IGG indexen
// =========================

const PRICES = {
    "Sloopwerk": {
        "Binnenwand slopen (m²)": { unit: "m²", price: 52 },
        "Buitenwand slopen (m²)": { unit: "m²", price: 95 },
        "Vloer verwijderen (m²)": { unit: "m²", price: 42 },
        "Dak/dakpannen verwijderen (m²)": { unit: "m²", price: 75 },
        "Dakbeschot verwijderen (m²)": { unit: "m²", price: 35 },
        "Badkamer verwijderen (m²)": { unit: "m²", price: 115 }
    },
    "Metselwerk": {
        "Kalkzandsteen muur (m²)": { unit: "m²", price: 125 },
        "Baksteen muur (m²)": { unit: "m²", price: 185 },
        "Isolatiebaksteen (m²)": { unit: "m²", price: 165 },
        "Cellenbeton blokken (m²)": { unit: "m²", price: 95 },
        "Voegen herstellen (m²)": { unit: "m²", price: 45 }
    },
    "Timmerwerk": {
        "Houten vloer (m²)": { unit: "m²", price: 145 },
        "Ondervloering (m²)": { unit: "m²", price: 55 },
        "Dakconstructie (m²)": { unit: "m²", price: 210 },
        "Deurkozijn plaatsen (stuks)": { unit: "st", price: 115 },
        "Raamkozijn plaatsen (stuks)": { unit: "st", price: 215 }
    },
    "Elektriciteit": {
        "Stopcontact plaatsen (stuks)": { unit: "st", price: 110 },
        "Lichtpunt plaatsen (stuks)": { unit: "st", price: 95 },
        "Schakelaar plaatsen (stuks)": { unit: "st", price: 85 },
        "Groepenkast vervangen (stuks)": { unit: "st", price: 495 },
        "Elektriciteit aansluiting (m)": { unit: "m", price: 42 }
    },
    "Sanitair": {
        "Toilet plaatsen (stuks)": { unit: "st", price: 215 },
        "Wastafel plaatsen (stuks)": { unit: "st", price: 165 },
        "Douche installeren (stuks)": { unit: "st", price: 375 },
        "Badkamer tegels (m²)": { unit: "m²", price: 95 },
        "Loodgieter werkzaamheden (uur)": { unit: "uur", price: 75 }
    },
    "Afwerking": {
        "Pleisterwerk (m²)": { unit: "m²", price: 38 },
        "Muurverf (m²)": { unit: "m²", price: 22 },
        "Vloertegel (m²)": { unit: "m²", price: 82 },
        "Vinyl vloer (m²)": { unit: "m²", price: 62 },
        "Behang (m²)": { unit: "m²", price: 32 },
        "Deurkruk montage (stuks)": { unit: "st", price: 30 }
    },
    "Isolatie & Thermisch": {
        "Muurisolatie (m²)": { unit: "m²", price: 58 },
        "Dakisolatie (m²)": { unit: "m²", price: 52 },
        "Vloerisolatie (m²)": { unit: "m²", price: 45 },
        "Double glazing raam (m²)": { unit: "m²", price: 315 },
        "Deur isoleren (stuks)": { unit: "st", price: 195 }
    },
    "Dakbedekking": {
        "Dakpan leggen (m²)": { unit: "m²", price: 65 },
        "Bitumen dakbedekking (m²)": { unit: "m²", price: 52 },
        "Zinkwerk/goten (m)": { unit: "m", price: 35 },
        "Dakramen plaatsen (stuks)": { unit: "st", price: 285 }
    },
    "Schilderwerk": {
        "Muur schilderen (m²)": { unit: "m²", price: 22 },
        "Plafond schilderen (m²)": { unit: "m²", price: 26 },
        "Deur/Raam schilderen (stuks)": { unit: "st", price: 42 },
        "Grondlaag aanbrengen (m²)": { unit: "m²", price: 15 }
    },
    "Bouwhuisvesting": {
        "Locatietoilet huur/maand": { unit: "maand", price: 165 },
        "Bouwkeet huur/week": { unit: "week", price: 145 },
        "Afzetting/hekwerk (m)": { unit: "m", price: 18 },
        "Steiger huur/week (m²)": { unit: "week", price: 9 }
    }
};

// =========================
// SNELLE CALCULATOR PRIJZEN (2026)
// =========================

const QUICK_PRICES = {
    "verbouwing": {
        "basis": {
            keuken: 9500,
            badkamer: 7000,
            elektra: 4200,
            verwarming: 4800,
            sloopwerk: 2500,
            dakkapel: 18000,
            kozijnen: 6000,
            vloeren: 4800,
            isolatie: 3600,
            zonnepanelen: 14000
        },
        "midden": {
            keuken: 14000,
            badkamer: 10500,
            elektra: 5400,
            verwarming: 6500,
            sloopwerk: 3500,
            dakkapel: 23000,
            kozijnen: 8500,
            vloeren: 7200,
            isolatie: 5400,
            zonnepanelen: 17500
        },
        "luxe": {
            keuken: 21000,
            badkamer: 15000,
            elektra: 7200,
            verwarming: 9000,
            sloopwerk: 4800,
            dakkapel: 29000,
            kozijnen: 12000,
            vloeren: 10800,
            isolatie: 7800,
            zonnepanelen: 21000
        }
    },
    "aanbouw": {
        "basis": {
            keuken: 6000,
            badkamer: 4800,
            elektra: 3000,
            verwarming: 3600,
            sloopwerk: 0,
            dakkapel: 0,
            kozijnen: 4200,
            vloeren: 3600,
            isolatie: 3000,
            zonnepanelen: 12000
        },
        "midden": {
            keuken: 9500,
            badkamer: 7000,
            elektra: 4200,
            verwarming: 4800,
            sloopwerk: 0,
            dakkapel: 0,
            kozijnen: 6000,
            vloeren: 5400,
            isolatie: 4200,
            zonnepanelen: 14000
        },
        "luxe": {
            keuken: 14000,
            badkamer: 10500,
            elektra: 6000,
            verwarming: 7200,
            sloopwerk: 0,
            dakkapel: 0,
            kozijnen: 9000,
            vloeren: 7800,
            isolatie: 6600,
            zonnepanelen: 17500
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
