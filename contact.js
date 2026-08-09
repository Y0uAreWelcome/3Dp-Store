document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const success = document.getElementById('form-success');
    const submitButton = form.querySelector('button[type="submit"]');

    const setError = (message) => {
        if (!status) return;
        status.textContent = message;
        status.classList.add('error');
        if (success) {
            success.hidden = true;
        }
    };

    const clearError = () => {
        if (!status) return;
        status.textContent = '';
        status.classList.remove('error');
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('visitor-email')?.value.trim();
        const message = document.getElementById('note')?.value.trim();

        if (!email || !message) {
            setError('Please fill in both your email and your message.');
            return;
        }

        clearError();

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        if (status) {
            status.textContent = 'Sending your message...';
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                if (success) {
                    success.hidden = false;
                }
                if (status) {
                    status.textContent = '';
                    status.classList.remove('error');
                }
                return;
            }

            let errorMessage = 'Something went wrong while sending your message. Please try again.';
            try {
                const data = await response.json();
                if (data?.errors?.[0]?.message) {
                    errorMessage = data.errors[0].message;
                }
            } catch (err) {
                // Ignore JSON parsing errors and use the fallback message.
            }

            setError(errorMessage);
        } catch (error) {
            setError('We could not reach the server. Please try again in a moment or email us directly.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }
    });
});
