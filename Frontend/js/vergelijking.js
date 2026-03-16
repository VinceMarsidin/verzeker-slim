const companyUrls = {
    'assuria': 'https://www.assuria.sr/',
    'fatum': 'https://fatum-suriname.com/',
    'self': 'https://self-reliance.sr/',
    'par': 'https://www.parsasco.com/'
};

function veranderCategorie(nieuweCategorie) {
    const nieuweUrl = `${window.location.pathname}?type=${nieuweCategorie}`;
    window.history.pushState({ path: nieuweUrl }, '', nieuweUrl);
    laadVerzekeringen(nieuweCategorie);
}

async function laadVerzekeringen(type) {
    const tableBody = document.getElementById('table-body');
    const tableTitle = document.getElementById('table-title');

    const titels = {
        'motor': 'Motorrijtuigverzekering',
        'reis': 'Reisverzekering',
        'woon': 'Woonverzekering',
        'leven': 'Levensverzekering'
    };

    const gekozenNaam = titels[type] || 'Verzekering';
    if (tableTitle) tableTitle.innerText = `Vergelijking ${gekozenNaam} - Suriname`;

    try {
        tableBody.innerHTML = "<tr><td colspan='5'>Gegevens ophalen uit database...</td></tr>";

        const response = await fetch(`/api/vergelijking/${type}`);
        const data = await response.json();

        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan='5'>Geen data gevonden voor ${gekozenNaam}</td></tr>`;
            return;
        }

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.dekking_naam}</td>
                <td class="col-assuria">${row.assuria}</td>
                <td class="col-fatum">${row.fatum}</td>
                <td class="col-self">${row.self_reliance}</td>
                <td class="col-par">${row.parsasco}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        tableBody.innerHTML = "<tr><td colspan='5' style='color:red;'>Fout bij laden database.</td></tr>";
    }
}

function setupInteractions() {
    const companyButtons = document.querySelectorAll('.company-btn');
    const visitContainer = document.getElementById('visit-website-container');
    const externalLink = document.getElementById('external-link');
    const nameDisplay = document.getElementById('company-name-display');

    companyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const company = btn.getAttribute('data-company');

            // Reset alle highlights
            document.querySelectorAll('td, th').forEach(el => el.classList.remove('highlight-col'));

            // Highlight de nieuwe kolom
            document.querySelectorAll(`.col-${company}`).forEach(td => td.classList.add('highlight-col'));
            document.getElementById(`th-${company}`).classList.add('highlight-col');

            // Toon website link
            if (companyUrls[company]) {
                externalLink.href = companyUrls[company];
                nameDisplay.innerText = btn.innerText;
                visitContainer.style.display = 'block';
            }
        });
    });

    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) calcBtn.addEventListener('click', berekenPremie);
}

async function berekenPremie() {
    const carValue = document.getElementById('carValue').value;
    const resultDiv = document.getElementById('calc-result');

    if (!carValue) return resultDiv.innerHTML = "Voer een bedrag in.";

    const response = await fetch('/api/bereken-premie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dagwaarde: parseFloat(carValue) })
    });
    const data = await response.json();
    resultDiv.innerHTML = `Indicatie: <strong>SRD ${data.premie}</strong> p/j.<br><small>${data.uitleg}</small>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const geselecteerdType = urlParams.get('type') || 'motor';
    laadVerzekeringen(geselecteerdType);
    setupInteractions();
});