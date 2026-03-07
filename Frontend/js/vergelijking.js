/**
 * VerzekerSlim - Vergelijkingen & Calculator Script
 */

// 1. URL's van de maatschappijen voor de "Bezoek Website" knop
const companyUrls = {
    'assuria': 'https://www.assuria.sr/',
    'fatum': 'https://fatum-suriname.com/',
    'self': 'https://self-reliance.sr/',
    'par': 'https://www.parsasco.com/'
};

/**
 * Functie voor de Categorie Dropdown
 */
function veranderCategorie(nieuweCategorie) {
    const nieuweUrl = `${window.location.pathname}?type=${nieuweCategorie}`;
    window.history.pushState({ path: nieuweUrl }, '', nieuweUrl);
    laadVerzekeringen(nieuweCategorie);
}

/**
 * Haalt de tabelgegevens op uit de SQLite database
 */
async function laadVerzekeringen(type) {
    const tableBody = document.getElementById('table-body');
    const pageTitle = document.querySelector('.comparison-header h1');
    const tableTitle = document.getElementById('table-title'); 
    const typeSelect = document.getElementById('typeSelect');
    const visitContainer = document.getElementById('visit-website-container');
    
    const titels = {
        'motor': 'Motorrijtuigverzekering',
        'reis': 'Reisverzekering',
        'woon': 'Woonverzekering',
        'leven': 'Levensverzekering'
    };

    const gekozenNaam = titels[type] || 'Verzekering';

    // Update UI Teksten
    if (pageTitle) pageTitle.innerText = "Verzekeringen Vergelijken";
    if (tableTitle) tableTitle.innerText = `Vergelijking ${gekozenNaam} - Suriname`;
    if (typeSelect) typeSelect.value = type;
    if (visitContainer) visitContainer.style.display = 'none'; 

    if (!tableBody) return;

    try {
        tableBody.innerHTML = "<tr><td colspan='5'>Laden...</td></tr>";

        const response = await fetch(`http://localhost:3000/api/vergelijking/${type}`);
        if (!response.ok) throw new Error('Server niet bereikbaar');
        
        const data = await response.json();
        tableBody.innerHTML = ""; 

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan='5'>Geen data gevonden voor ${gekozenNaam}</td></tr>`;
            return;
        }

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align:left; font-weight:bold; background:#f9f9f9;">${row.dekking_naam}</td>
                <td class="col-assuria">${row.assuria}</td>
                <td class="col-fatum">${row.fatum}</td>
                <td class="col-self">${row.self_reliance}</td>
                <td class="col-par">${row.parsasco}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Fout bij laden:", error);
        tableBody.innerHTML = "<tr><td colspan='5' style='color:red;'>Fout bij laden. Start 'npm run dev'!</td></tr>";
    }
}

/**
 * Backend Premie Calculator Logica (POST-request)
 */
async function berekenPremie() {
    const carValueInput = document.getElementById('carValue');
    const resultDiv = document.getElementById('calc-result');
    
    if (!carValueInput || !resultDiv) return;

    const dagwaarde = carValueInput.value;

    if (!dagwaarde || dagwaarde <= 0) {
        resultDiv.innerHTML = "Voer a.u.b. een geldige dagwaarde in.";
        return;
    }

    try {
        resultDiv.innerHTML = "Berekenen...";

        const response = await fetch('http://localhost:3000/api/bereken-premie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dagwaarde: parseFloat(dagwaarde) })
        });

        const data = await response.json();

        if (data.premie) {
            resultDiv.innerHTML = `Geschatte premie: <strong>SRD ${data.premie}</strong> per jaar.<br><small>${data.uitleg}</small>`;
        } else {
            resultDiv.innerHTML = "Fout bij berekening.";
        }
    } catch (error) {
        console.error("Calculator Error:", error);
        resultDiv.innerHTML = "Server niet bereikbaar.";
    }
}

/**
 * Klik-interacties Setup
 */
function setupInteractions() {
    // 1. Markeer Kolom & Website Link
    const companyButtons = document.querySelectorAll('.company-btn');
    const visitContainer = document.getElementById('visit-website-container');
    const externalLink = document.getElementById('external-link');
    const nameDisplay = document.getElementById('company-name-display');

    companyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const company = btn.getAttribute('data-company');
            
            document.querySelectorAll('td, th').forEach(el => el.classList.remove('highlight-col'));
            document.querySelectorAll(`.col-${company}`).forEach(td => td.classList.add('highlight-col'));
            
            const headerCell = document.getElementById(`th-${company}`);
            if(headerCell) headerCell.classList.add('highlight-col');

            if (companyUrls[company] && visitContainer) {
                externalLink.href = companyUrls[company];
                nameDisplay.innerText = btn.innerText;
                visitContainer.style.display = 'block';
            }
        });
    });

    // 2. Calculator button koppelen
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', berekenPremie);
    }
}

/**
 * INITIALISATIE BIJ LADEN PAGINA
 */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const geselecteerdType = urlParams.get('type') || 'motor';

    laadVerzekeringen(geselecteerdType);
    setupInteractions();
});