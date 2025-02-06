document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("paperModal");
    const addPaperBtn = document.getElementById("addPaperBtn");
    const closeModal = document.querySelector(".close");
    const paperForm = document.getElementById("paperForm");

    // Open modal
    addPaperBtn.addEventListener("click", function () {
        modal.style.display = "flex";  // Use flex to center it
        paperForm.reset(); // Clear form on open
    });

    // Close modal
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Save paper
    paperForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Paper saved! (This needs local storage or a backend to persist)");
        modal.style.display = "none";
    });

    // Download JSON
    document.getElementById("downloadJsonBtn").addEventListener("click", function () {
        const sampleData = [
            { title: "Sample Paper", abstract: "This is a test abstract.", notes: "Some notes", link: "https://example.com" }
        ];
        const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "papers.json";
        a.click();
    });

    // Upload JSON
    document.getElementById("uploadJsonBtn").addEventListener("click", function () {
        document.getElementById("uploadJsonInput").click();
    });

    document.getElementById("uploadJsonInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const papers = JSON.parse(e.target.result);
                console.log("Loaded Papers:", papers);
                alert("File uploaded successfully! (Display logic needs implementation)");
            };
            reader.readAsText(file);
        }
    });
});