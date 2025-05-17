// Show the modal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const alertDiv = document.querySelector('.Alert');
    if (alertDiv) alertDiv.style.display = 'flex';
});

// Form elements
const usernameInput = document.getElementById("username");
const usernameError = document.getElementById("usernameError");
const submitBtn = document.getElementById("SubmitBtn");
const alertDiv = document.querySelector('.Alert');

// Validate and handle form submission
submitBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const usernameValue = usernameInput.value.trim();
    const validName = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñÇç\s'-]+$/;

    // Validation: empty value
    if (usernameValue === "") {
        usernameError.innerHTML = "Please enter your name.";
        usernameInput.focus();
        return;
    }

    // Validation: only letters, spaces, apostrophes, and hyphens allowed
    if (!validName.test(usernameValue)) {
        usernameError.innerHTML = "Name can only contain letters, spaces, apostrophes and hyphens.";
        usernameInput.focus();
        return;
    }

    // Capitalize the first letter
    const finalName = usernameValue.charAt(0).toUpperCase() + usernameValue.slice(1);

    // (Optional) Save the name, example:
    // localStorage.setItem('userName', finalName);

    // Clear error message
    usernameError.textContent = "";

    // Hide the modal
    if (alertDiv) alertDiv.style.display = 'none';

    // Update the header if exists
    const greeting = document.getElementById('greeting');
    if (greeting) {
        greeting.textContent = `${finalName}, I hope you have tons of fun while playing!`;
    }
});

// Optional: close the modal when clicking outside the form
alertDiv.addEventListener('click', (e) => {
    if (e.target === alertDiv) {
        // If you want to allow closing by clicking outside, uncomment:
        // alertDiv.style.display = 'none';
    }
});