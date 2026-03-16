document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Login formulier verstuurd...");

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        console.log("Response ontvangen van server:", response.status);

        const data = await response.json();
        console.log("Response data ontvangen:", data);

        if (data.success) {
            console.log("Inloggen geslaagd! Token opslaan...");
            localStorage.setItem('adminToken', data.token);
            window.location.href = 'admin-dashboard.html';
        } else {
            console.log("Inloggen mislukt!");
            errorMsg.style.display = 'block';
            errorMsg.innerText = data.error || 'Inloggen mislukt';
        }
    } catch (error) {
        console.error('Er is een vette fout opgetreden:', error);
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'Kan geen verbinding maken met de server';
    }
});