// public/js/admin-auth.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Login formulier verstuurd..."); // DEBUG

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        console.log("Response ontvangen van server:", response.status); // DEBUG

        const data = await response.json();
        console.log("Response data ontvangen:", data); // DEBUG

        if (data.success) {
            console.log("Inloggen geslaagd! Token opslaan..."); // DEBUG
            localStorage.setItem('adminToken', data.token);             // Sla het token op zodat we later kunnen bewijzen dat we admin zijn
            window.location.href = 'admin-dashboard.html';              // Stuur door naar het CMS dashboard
        } else {
            console.log("Inloggen mislukt!"); // DEBUG
            errorMsg.style.display = 'block';
            errorMsg.innerText = data.error || 'Inloggen mislukt';
        }
    } catch (error) {
        console.error('Er is een vette fout opgetreden:', error); // DEBUG
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'Kan geen verbinding maken met de server';
    }
});