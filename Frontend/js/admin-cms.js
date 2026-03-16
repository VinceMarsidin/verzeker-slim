
// ADMIN DASHBOARD 

// GLOBALE STATE 
let editModeM = false;
let editIdM = null;
let editModeP = false;
let editIdP = null;

// SECTIE MANAGEMENT 
function showSection(event, sectionId) {
    // Verwijder active class van alle secties
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));

    // Verwijder active class van alle nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Toon de gekozen sectie
    document.getElementById(sectionId).classList.add('active');

    // Maak de geklikte knop active
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
        const title = event.currentTarget.innerText;
        document.getElementById('current-section-title').innerText = title;
    }

    // Data inladen op basis van sectie
    if (sectionId === 'section-maatschappijen') laadMaatschappijenTabel();
    if (sectionId === 'section-premies') laadPremiesTabel();
    if (sectionId === 'section-users') laadAdminsTabel();
    if (sectionId === 'section-contact') laadContactBerichten();
}

// MODAL MANAGEMENT 
const formMaatschappij = document.getElementById('form-maatschappij');
const formPremie = document.getElementById('form-premie');

function openModal() {
    editModeM = false;
    editIdM = null;
    formMaatschappij.reset();
    document.getElementById('modal-title').innerText = "Nieuwe Maatschappij Toevoegen";
    document.getElementById('modal-maatschappij').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-maatschappij').style.display = 'none';
}

function openPremieModal() {
    editModeP = false;
    editIdP = null;
    formPremie.reset();
    document.querySelector('#modal-premie h3').innerText = "Nieuwe Premie Toevoegen";
    document.getElementById('modal-premie').style.display = 'flex';
    vulMaatschappijDropdown();
}

function closePremieModal() {
    document.getElementById('modal-premie').style.display = 'none';
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
        closePremieModal();
    }
}

// --- 3. DATA LADEN (READ) ---

async function laadMaatschappijenTabel() {
    const tbody = document.getElementById('maatschappijen-list');
    const token = localStorage.getItem('adminToken');
    try {
        const response = await fetch('/api/admin/maatschappijen', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        tbody.innerHTML = '';
        data.forEach(m => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${m.logoUrl || '/img/default-logo.png'}" class="table-logo"></td>
                    <td>${m.naam}</td>
                    <td>${m.contactEmail}</td>
                    <td class="actions">
                        <button class="btn-edit" onclick="editM(${m.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteM(${m.id})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
        });
    } catch (err) { console.error(err); }
}

async function laadPremiesTabel() {
    const tbody = document.getElementById('premies-list');
    const token = localStorage.getItem('adminToken');
    try {
        const response = await fetch('/api/admin/insurances', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        tbody.innerHTML = '';
        data.forEach(p => {
            const maatschappijNaam = p.maatschappij ? p.maatschappij.naam : 'Onbekend';
            tbody.innerHTML += `
                <tr>
                    <td>${maatschappijNaam}</td>
                    <td>${p.type}</td>
                    <td>SRD ${p.premie_bedrag}</td>
                    <td class="actions">
                        <button class="btn-edit" onclick="editP(${p.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteP(${p.id})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
        });
    } catch (err) { console.error(err); }
}

async function vulMaatschappijDropdown() {
    const dropdown = document.getElementById('p-maatschappij');
    const token = localStorage.getItem('adminToken');
    try {
        const response = await fetch('/api/admin/maatschappijen', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const maatschappijen = await response.json();
        dropdown.innerHTML = '<option value="">-- Kies een maatschappij --</option>';
        maatschappijen.forEach(m => {
            let optie = document.createElement('option');
            optie.value = m.id;
            optie.text = m.naam;
            dropdown.add(optie);
        });
    } catch (err) { console.error(err); }
}

// --- 4. BEWERKEN LOGICA ---

async function editM(id) {
    editModeM = true;
    editIdM = id;
    const token = localStorage.getItem('adminToken');
    try {
        const res = await fetch(`/api/admin/maatschappijen/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const m = await res.json();
        document.getElementById('m-naam').value = m.naam;
        document.getElementById('m-logo').value = m.logoUrl || '';
        document.getElementById('m-contact').value = m.contactEmail;
        document.getElementById('modal-title').innerText = "Maatschappij Bewerken";
        document.getElementById('modal-maatschappij').style.display = 'flex';
    } catch (err) { alert("Kon data niet ophalen"); }
}

async function editP(id) {
    editModeP = true;
    editIdP = id;
    const token = localStorage.getItem('adminToken');

    try {
        // 1. Eerst de dropdown vullen met alle beschikbare maatschappijen
        await vulMaatschappijDropdown();

        // 2. Dan de specifieke verzekeringsdata ophalen
        const res = await fetch(`/api/admin/insurances/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Server fout");

        const data = await res.json();

        // 3. Nu de velden invullen
        // Omdat vulMaatschappijDropdown nu klaar is, kan JS de juiste ID selecteren
        document.getElementById('p-maatschappij').value = data.maatschappijId;
        document.getElementById('p-categorie').value = data.type;
        document.getElementById('p-bedrag').value = data.premie_bedrag;
        document.getElementById('p-type').value = data.type;
        document.querySelector('#modal-premie h3').innerText = "Premie Bewerken";
        document.getElementById('modal-premie').style.display = 'flex';

    } catch (err) {
        console.error("Edit fout:", err);
        alert("Kon de data niet ophalen.");
    }
}

// --- 5. OPSLAAN LOGICA ---

formMaatschappij.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const data = {
        naam: document.getElementById('m-naam').value,
        logoUrl: document.getElementById('m-logo').value,
        contactEmail: document.getElementById('m-contact').value
    };
    const method = editModeM ? 'PUT' : 'POST';
    const url = editModeM ? `/api/admin/maatschappijen/${editIdM}` : '/api/admin/maatschappijen';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        closeModal();
        laadMaatschappijenTabel();
    }
});

formPremie.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    // We halen de waardes op en zetten ze direct om naar de juiste types
    const bedragInput = document.getElementById('p-bedrag').value;
    const maatschappijInput = document.getElementById('p-maatschappij').value;

    // We pakken de geselecteerde waarde uit de dropdown (bijv. "Brand" of "WA")
    const geselecteerdeDekking = document.getElementById('p-categorie').value;

    const data = {
        // 'p-categorie' is de dropdown (bijv: motor, reis)
        categorie: document.getElementById('p-categorie').value,

        // 'p-type' is het nieuwe tekstveld dat je hebt toegevoegd (bijv: WA, Casco)
        type: document.getElementById('p-type').value,

        // Voor de zekerheid als je database nog op de oude naam checkt
        dekking_naam: document.getElementById('p-type').value,

        premie_bedrag: parseFloat(document.getElementById('p-bedrag').value),
        maatschappijId: parseInt(document.getElementById('p-maatschappij').value)
    };

    console.log("Dit sturen we naar de server:", data);



    // BELANGRIJK: We gebruiken voor zowel POST als PUT dezelfde basis URL
    // Als we in edit-mode zijn, plakken we het ID erachter
    const method = editModeP ? 'PUT' : 'POST';
    const url = editModeP
        ? `/api/admin/insurances/${editIdP}`
        : '/api/admin/insurances';

    console.log("Poging tot opslaan naar:", url, data); // Check je F12 console!

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("Premie succesvol opgeslagen!");
            closePremieModal();
            laadPremiesTabel(); // Ververs de lijst
        } else {
            const errorData = await res.json();
            alert("Fout van de server: " + (errorData.error || "Onbekende fout"));
        }
    } catch (err) {
        console.error("Netwerkfout:", err);
        alert("Kan geen verbinding maken met de server.");
    }
});

// --- 6. VERWIJDEREN ---
async function deleteM(id) {
    if (!confirm("Weet je zeker?")) return;
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/admin/maatschappijen/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) laadMaatschappijenTabel();
}

async function deleteP(id) {
    if (!confirm("Weet je zeker?")) return;
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/admin/insurances/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) laadPremiesTabel();
}

// Global expose
window.editM = editM; window.deleteM = deleteM;
window.editP = editP; window.deleteP = deleteP;

document.addEventListener('DOMContentLoaded', () => {
    laadPremiesTabel();
    laadMaatschappijenTabel();
});

async function laadAdminsTabel() {
    const tbody = document.getElementById('admins-list'); // Zorg dat dit ID in je HTML staat
    const token = localStorage.getItem('adminToken');

    try {
        const response = await fetch('/api/admin/admins', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        tbody.innerHTML = '';
        data.forEach(admin => {
            tbody.innerHTML += `
                <tr>
                    <td>${admin.id}</td>
                    <td>${admin.username}</td>
                    <td class="actions">
                        <button class="btn-delete" onclick="deleteAdmin(${admin.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
        });
    } catch (err) {
        console.error("Fout bij laden admins:", err);
    }
}


// ------------------------------------------------------------------------------------------

// --- 7. ADMIN USER LOGICA ---

function openUserModal() {
    document.getElementById('form-user').reset();
    document.getElementById('modal-user').style.display = 'flex';
}

function closeUserModal() {
    document.getElementById('modal-user').style.display = 'none';
}

// Functie om de lijst op te halen
async function laadAdminsTabel() {
    const tbody = document.getElementById('admins-list');
    const token = localStorage.getItem('adminToken');
    if (!tbody) return;

    try {
        const response = await fetch('/api/admin/admins', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        tbody.innerHTML = '';
        data.forEach(admin => {
            tbody.innerHTML += `
                <tr>
                    <td>${admin.id}</td>
                    <td><strong>${admin.username}</strong></td>
                    <td class="actions">
                        <button class="btn-delete" onclick="deleteAdmin(${admin.id})">
                            <i class="fas fa-trash"></i> Verwijderen
                        </button>
                    </td>
                </tr>`;
        });
    } catch (err) {
        console.error("Fout bij laden admins:", err);
    }
}

// Formulier afhandeling (Nieuwe Admin aanmaken)
document.getElementById('form-user').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    const data = {
        username: document.getElementById('u-username').value,
        password: document.getElementById('u-password').value
        // De 'rol' kun je later toevoegen aan je Prisma schema als je dat wilt
    };

    try {
        const res = await fetch('/api/admin/admins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            closeUserModal();
            laadAdminsTabel();
            alert("Nieuwe admin succesvol aangemaakt!");
        } else {
            const errData = await res.json();
            alert("Fout: " + errData.error);
        }
    } catch (err) {
        console.error("Fout bij aanmaken admin:", err);
    }
});

// Admin verwijderen
async function deleteAdmin(id) {
    if (!confirm("Weet je zeker dat je deze beheerder wilt verwijderen?")) return;

    const token = localStorage.getItem('adminToken');
    try {
        const res = await fetch(`/api/admin/admins/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) laadAdminsTabel();
    } catch (err) {
        console.error("Verwijderen mislukt:", err);
    }
}

// --- 8. CONTACT BERICHTEN LOGICA ---

async function laadContactBerichten() {
    const tbody = document.getElementById('contact-list');
    const token = localStorage.getItem('adminToken');
    if (!tbody) return;

    try {
        const response = await fetch('/api/admin/messages', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        tbody.innerHTML = '';
        data.forEach(msg => {
            const datum = new Date(msg.createdAt).toLocaleString('nl-NL', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            tbody.innerHTML += `
            <tr>
                <td>${datum}</td>
                <td><strong>${msg.name}</strong><br><small>${msg.email}</small></td>
                <td>${msg.phone || 'Niet ingevuld'}</td> <td><span class="badge">${msg.subject}</span></td>
                <td>${msg.message.substring(0, 40)}...</td>
                <td class="actions">
                    <button class="btn-edit" onclick="viewMessage(${msg.id})" title="Bekijken">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteContactBericht(${msg.id})" title="Verwijderen">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
        });
    } catch (err) {
        console.error("Fout bij laden berichten:", err);
    }
}

async function viewMessage(id) {
    const token = localStorage.getItem('adminToken');
    try {
        const res = await fetch(`/api/admin/messages/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const msg = await res.json();

        const detailHtml = `
            <p><strong>Van:</strong> ${msg.name} (${msg.email})</p>
            <p><strong>Telefoon:</strong> ${msg.phone || 'Niet opgegeven'}</p>
            <p><strong>Onderwerp:</strong> ${msg.subject}</p>
            <hr>
            <p><strong>Bericht:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
                ${msg.message.replace(/\n/g, '<br>')}
            </div>
        `;

        document.getElementById('contact-detail-content').innerHTML = detailHtml;
        document.getElementById('modal-view-contact').style.display = 'flex';
    } catch (err) {
        alert("Kon bericht niet laden");
    }
}

function closeContactModal() {
    document.getElementById('modal-view-contact').style.display = 'none';
}

async function deleteContactBericht(id) {
    if (!confirm("Weet je zeker dat je dit bericht wilt verwijderen?")) return;
    const token = localStorage.getItem('adminToken');
    try {
        const res = await fetch(`/api/admin/messages/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) laadContactBerichten();
    } catch (err) {
        console.error("Verwijderen mislukt:", err);
    }
}



// Vergeet niet de functies te exposen aan de window voor de onclick events
window.showSection = showSection;
window.openModal = openModal;
window.closeModal = closeModal;
window.openPremieModal = openPremieModal;
window.closePremieModal = closePremieModal;
window.openUserModal = openUserModal;
window.closeUserModal = closeUserModal;
window.editM = editM;
window.deleteM = deleteM;
window.editP = editP;
window.deleteP = deleteP;
window.deleteAdmin = deleteAdmin;
window.viewMessage = viewMessage;
window.closeContactModal = closeContactModal;
window.deleteContactBericht = deleteContactBericht;
window.laadContactBerichten = laadContactBerichten;
