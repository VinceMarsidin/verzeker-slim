document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const responseDiv = document.getElementById('formResponse');
    const submitBtn = document.getElementById('submitBtn');

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Bezig met verzenden...";

        const response = await fetch('/api/contact/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        responseDiv.style.display = 'block';
        if (response.ok) {
            responseDiv.style.background = '#d4edda';
            responseDiv.style.color = '#155724';
            responseDiv.innerText = result.message || "Bedankt! Je bericht is succesvol verzonden.";
            document.getElementById('contactForm').reset();
        } else {
            throw new Error(result.error || "Fout bij verzenden");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        responseDiv.style.display = 'block';
        responseDiv.style.background = '#f8d7da';
        responseDiv.style.color = '#721c24';
        responseDiv.innerText = error.message || "Oeps! Er ging iets mis. Probeer het later opnieuw.";
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Verstuur bericht";
    }
});