const token = localStorage.getItem('adminToken');
if (!token) window.location.href = '/admin-login.html';

async function loadCMSData() {
    try {
        const response = await fetch('/api/admin/data', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401 || response.status === 403) logout();

        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error("Fout bij laden:", error);
    }
}

function renderTable(data) {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = data.map(item => `
        <tr id="row-${item.id}">
            <td>${item.id}</td>
            <td><strong>${item.categorie}</strong></td>
            <td>${item.dekking_naam}</td>
            <td><input type="text" class="edit-input" data-field="assuria" value="${item.assuria || ''}"></td>
            <td><input type="text" class="edit-input" data-field="fatum" value="${item.fatum || ''}"></td>
            <td><input type="text" class="edit-input" data-field="self_reliance" value="${item.self_reliance || ''}"></td>
            <td><input type="text" class="edit-input" data-field="parsasco" value="${item.parsasco || ''}"></td>
            <td>
                <button class="save-btn" onclick="saveRow(${item.id})">Opslaan</button>
            </td>
        </tr>
    `).join('');
}

// Functie om de hele rij in één keer (of per veld) op te slaan
async function saveRow(id) {
    const row = document.getElementById(`row-${id}`);
    const btn = row.querySelector('.save-btn');
    const inputs = row.querySelectorAll('input');

    // Status: Bezig
    btn.classList.add('is-loading');
    const originalText = btn.innerText;
    btn.innerText = "Bezig...";

    try {
        for (let input of inputs) {
            const field = input.getAttribute('data-field');
            await fetch('/api/admin/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, field, value: input.value })
            });
        }

        // Status: Succes
        btn.classList.remove('is-loading');
        btn.classList.add('is-success');
        btn.innerText = "Opgeslagen!";
        row.classList.add('row-updated');

        // Na 2 seconden alles weer normaal maken
        setTimeout(() => {
            btn.classList.remove('is-success');
            btn.innerText = originalText;
            row.classList.remove('row-updated');
        }, 2000);

    } catch (error) {
        // Status: Fout
        btn.classList.remove('is-loading');
        btn.classList.add('is-error');
        btn.innerText = "Fout!";
        console.error(error);

        setTimeout(() => {
            btn.classList.remove('is-error');
            btn.innerText = originalText;
        }, 3000);
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login.html';
}

document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

loadCMSData();