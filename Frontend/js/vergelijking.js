const companyUrls = {
    'assuria': 'https://www.assuria.sr/',
    'fatum': 'https://fatum-suriname.com/',
    'self': 'https://self-reliance.sr/',
    'par': 'https://www.parsasco.com/'
};

let actieveMaatschappijen = [];

async function initialiseerPagina() {
    try {
        // 1. Haal maatschappijen op voor de tabelkoppen
        const res = await fetch('/api/maatschappijen');
        actieveMaatschappijen = await res.json();

        // 2. Maak de tabelkoppen (TH) aan
        const headerRow = document.getElementById('table-header-row');
        actieveMaatschappijen.forEach(m => {
            const safeName = m.naam.toLowerCase().replace(/\s+/g, '-');
            const th = document.createElement('th');
            th.id = `th-${safeName}`;
            th.className = `col-${safeName}`;
            th.innerText = m.naam;
            headerRow.appendChild(th);
        });

        // 3. Laad de eerste categorie
        const urlParams = new URLSearchParams(window.location.search);
        laadVerzekeringen(urlParams.get('type') || 'motor');

        setupFilterEvents();
    } catch (error) {
        console.error("Fout bij opstarten:", error);
    }
}

async function laadVerzekeringen(type) {
    const tableBody = document.getElementById('table-body');
    const response = await fetch(`/api/vergelijking/${type}`);
    const data = await response.json();

    const gegroepeerd = {};
    data.forEach(item => {
        const dekking = item.type || "Standaard";
        if (!gegroepeerd[dekking]) {
            gegroepeerd[dekking] = { naam: dekking };
            actieveMaatschappijen.forEach(m => {
                gegroepeerd[dekking][m.id] = '-';
            });
        }
        if (item.maatschappijId) {
            gegroepeerd[dekking][item.maatschappijId] = `SRD ${item.premie_bedrag.toLocaleString()}`;
        }
    });

    tableBody.innerHTML = "";
    Object.values(gegroepeerd).forEach(row => {
        const tr = document.createElement('tr');
        let html = `<td class="col-sticky"><strong>${row.naam}</strong></td>`;
        actieveMaatschappijen.forEach(m => {
            const safeName = m.naam.toLowerCase().replace(/\s+/g, '-');
            html += `<td class="col-${safeName}">${row[m.id]}</td>`;
        });
        tr.innerHTML = html;
        tableBody.appendChild(tr);
    });
}

function setupFilterEvents() {
    const buttons = document.querySelectorAll('.company-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const company = btn.getAttribute('data-company');

            // Highlight kolom
            document.querySelectorAll('td, th').forEach(el => el.classList.remove('highlight-col'));
            document.querySelectorAll(`.col-${company}`).forEach(el => el.classList.add('highlight-col'));

            // Toon link
            const visitContainer = document.getElementById('visit-website-container');
            if (companyUrls[company]) {
                document.getElementById('external-link').href = companyUrls[company];
                document.getElementById('company-name-display').innerText = btn.innerText;
                visitContainer.style.display = 'block';
            }
        });
    });
}

function veranderCategorie(val) {
    window.history.pushState({}, '', `?type=${val}`);
    laadVerzekeringen(val);
}

document.addEventListener('DOMContentLoaded', initialiseerPagina);


// Bereken premie
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

function setupInteractions() {
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        calcBtn.onclick = berekenPremie;
    }
}

// Vergelijk nu knop DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const geselecteerdType = urlParams.get('type') || 'motor';

    laadVerzekeringen(geselecteerdType);

    const selector = document.querySelector('.category-selector select');
    if (selector) {
        selector.value = geselecteerdType;
    }

    if (typeof setupInteractions === 'function') {
        setupInteractions();
    }
});


