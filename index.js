document.getElementById("saveNameBtn").addEventListener("click", function() {
    const name = document.getElementById("nameInput").value.trim();

    if (name) {
        localStorage.setItem("username", name);
        window.location.href = 'app.html';  // Redirect to app.html after saving the name
    } else {
        alert("Please enter a valid name.");
    }
});
