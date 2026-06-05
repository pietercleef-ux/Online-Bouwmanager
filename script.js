// ========== DATA MANAGEMENT ==========
let costs = [];
let projectData = {
    name: 'Mijn Project',
    budget: null
};

// Load data from localStorage on page load
function loadData() {
    const savedCosts = localStorage.getItem('costs');
    const savedProject = localStorage.getItem('projectData');
    
    if (savedCosts) {
        costs = JSON.parse(savedCosts);
    }
    if (savedProject) {
        projectData = JSON.parse(savedProject);
        document.getElementById('projectName').value = projectData.name;
        if (projectData.budget) {
            document.getElementById('projectBudget').value = projectData.budget;
        }
    }
    
    updateDisplay();
}

// ========== PROJECT MANAGEMENT ==========
function saveProject() {
    projectData.name = document.getElementById('projectName').value || 'Mijn Project';
    projectData.budget = parseFloat(document.getElementById('projectBudget').value) || null;
    
    localStorage.setItem('projectData', JSON.stringify(projectData));
    
    alert(`Project "${projectData.name}" opgeslagen!`);
    updateDisplay();
}

// ========== COST MANAGEMENT ==========
function addCost() {
    const category = document.getElementById('costCategory').value;
    const description = document.getElementById('costDescription').value;
    const amount = parseFloat(document.getElementById('costAmount').value);
    const quantity = parseInt(document.getElementById('costQuantity').value) || 1;
    
    // Validation
    if (!category || !description || !amount || amount <= 0) {
        alert('Vul alstublieft alle velden correct in!');
        return;
    }
    
    // Add cost item
    const costItem = {
        id: Date.now(),
        category,
        description,
        amount,
        quantity,
        total: amount * quantity
    };
    
    costs.push(costItem);
    
    // Save to localStorage
    localStorage.setItem('costs', JSON.stringify(costs));
    
    // Clear form
    document.getElementById('costCategory').value = '';
    document.getElementById('costDescription').value = '';
    document.getElementById('costAmount').value = '';
    document.getElementById('costQuantity').value = '1';
    
    updateDisplay();
    document.getElementById('costDescription').focus();
}

function deleteCost(id) {
    if (confirm('Weet u zeker dat u deze kostpost wilt verwijderen?')) {
        costs = costs.filter(cost => cost.id !== id);
        localStorage.setItem('costs', JSON.stringify(costs));
        updateDisplay();
    }
}

// ========== FILTERING & SEARCHING ==========
function filterCosts() {
    const searchTerm = document.getElementById('searchCost').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    
    const filteredCosts = costs.filter(cost => {
        const matchesSearch = cost.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || cost.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    displayCostsTable(filteredCosts);
}

// ========== DISPLAY & CALCULATIONS ==========
function updateDisplay() {
    displayCostsTable(costs);
    updateSummary();
    checkBudget();
}

function displayCostsTable(costsToDisplay) {
    const tableBody = document.getElementById('costTableBody');
    
    if (costsToDisplay.length === 0) {
        tableBody.innerHTML = '<tr class="empty-state"><td colspan="6">Nog geen kostposten ingevoerd</td></tr>';
        return;
    }
    
    tableBody.innerHTML = costsToDisplay.map(cost => `
        <tr>
            <td><strong>${cost.category}</strong></td>
            <td>${cost.description}</td>
            <td>€ ${formatNumber(cost.amount)}</td>
            <td>${cost.quantity}</td>
            <td class="cost-amount">€ ${formatNumber(cost.total)}</td>
            <td>
                <button class="btn btn-delete" onclick="deleteCost(${cost.id})">Verwijder</button>
            </td>
        </tr>
    `).join('');
}

function updateSummary() {
    // Calculate totals
    const totalCost = costs.reduce((sum, cost) => sum + cost.total, 0);
    const itemCount = costs.length;
    
    // Update summary cards
    document.getElementById('totalCost').textContent = `€ ${formatNumber(totalCost)}`;
    document.getElementById('itemCount').textContent = itemCount;
    
    // Update budget info if set
    if (projectData.budget) {
        const remainingBudget = projectData.budget - totalCost;
        document.getElementById('remainingBudgetCard').style.display = 'block';
        document.getElementById('remainingBudget').textContent = `€ ${formatNumber(remainingBudget)}`;
        document.getElementById('remainingBudget').style.color = 
            remainingBudget >= 0 ? '#16a34a' : '#dc2626';
    } else {
        document.getElementById('remainingBudgetCard').style.display = 'none';
    }
    
    // Update category breakdown
    updateCategoryBreakdown();
}

function updateCategoryBreakdown() {
    const breakdown = {};
    
    costs.forEach(cost => {
        if (!breakdown[cost.category]) {
            breakdown[cost.category] = 0;
        }
        breakdown[cost.category] += cost.total;
    });
    
    const breakdownContainer = document.getElementById('categoryBreakdown');
    
    if (Object.keys(breakdown).length === 0) {
        breakdownContainer.innerHTML = '<p>Nog geen categorieën beschikbaar</p>';
        return;
    }
    
    breakdownContainer.innerHTML = Object.entries(breakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([category, total]) => `
            <div class="breakdown-item">
                <div class="breakdown-item-name">${category}</div>
                <div class="breakdown-item-value">€ ${formatNumber(total)}</div>
            </div>
        `).join('');
}

function checkBudget() {
    const budgetSection = document.getElementById('budgetAlertSection');
    
    if (!projectData.budget) {
        budgetSection.style.display = 'none';
        return;
    }
    
    const totalCost = costs.reduce((sum, cost) => sum + cost.total, 0);
    const percentage = (totalCost / projectData.budget) * 100;
    
    if (percentage > 100) {
        budgetSection.style.display = 'block';
        const overBudget = totalCost - projectData.budget;
        document.getElementById('budgetMessage').textContent = 
            `U bent € ${formatNumber(overBudget)} over het budget heen! (${percentage.toFixed(1)}% van het budget)`;
    } else if (percentage > 80) {
        budgetSection.style.display = 'block';
        const remaining = projectData.budget - totalCost;
        document.getElementById('budgetMessage').textContent = 
            `U heeft nog € ${formatNumber(remaining)} over. (${percentage.toFixed(1)}% gebruikt)`;
    } else {
        budgetSection.style.display = 'none';
    }
}

// ========== EXPORT & PRINT ==========
function exportToCSV() {
    if (costs.length === 0) {
        alert('Geen kostposten om te exporteren!');
        return;
    }
    
    let csv = 'Bouwkosten Rapportage\n';
    csv += `Project: ${projectData.name}\n`;
    csv += `Datum: ${new Date().toLocaleDateString('nl-NL')}\n\n`;
    csv += 'Categorie,Omschrijving,Eenheidsprijs,Aantal,Totaal\n';
    
    costs.forEach(cost => {
        csv += `${cost.category},"${cost.description}",${cost.amount},${cost.quantity},${cost.total}\n`;
    });
    
    const totalCost = costs.reduce((sum, cost) => sum + cost.total, 0);
    csv += `\n,,,TOTAAL,${totalCost}`;
    
    // Create download link
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `bouwkosten_${projectData.name.replace(/\s/g, '_')}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('Rapportage succesvol gedownload!');
}

function printReport() {
    if (costs.length === 0) {
        alert('Geen kostposten om af te drukken!');
        return;
    }
    
    window.print();
}

function clearAll() {
    if (confirm('⚠️ WAARSCHUWING: Dit zal ALLE gegevens wissen! Bent u hier zeker van?')) {
        if (confirm('Dit kan niet ongedaan gemaakt worden. Doorgaan?')) {
            costs = [];
            projectData = { name: 'Mijn Project', budget: null };
            localStorage.clear();
            document.getElementById('projectName').value = '';
            document.getElementById('projectBudget').value = '';
            updateDisplay();
            alert('Alle gegevens zijn verwijderd!');
        }
    }
}

// ========== UTILITY FUNCTIONS ==========
function formatNumber(num) {
    return num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', loadData);