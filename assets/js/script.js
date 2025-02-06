document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("paperModal");
    const addPaperBtn = document.getElementById("addPaperBtn");
    const closeModal = document.querySelector(".close");
    const paperForm = document.getElementById("paperForm");
    const papersTableBody = document.querySelector("#papersTable tbody");

    let papers = []; // Store paper data here

    // Function to render table
    function renderTable() {
        papersTableBody.innerHTML = ""; // Clear table first

        papers.forEach((paper, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${paper.title}</td>
                <td>${paper.abstract}</td>
                <td>${paper.notes}</td>
                <td><a href="${paper.link}" target="_blank">View</a></td>
                <td><button onclick="editPaper(${index})">Edit</button> 
                    <button onclick="deletePaper(${index})">Delete</button>
                </td>
            `;
            papersTableBody.appendChild(row);
        });
    }

    // Open modal
    addPaperBtn.addEventListener("click", function () {
        modal.style.display = "flex";
        paperForm.reset(); // Clear form
    });

    // Close modal
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Save paper
    paperForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = document.getElementById("paperTitle").value;
        const abstract = document.getElementById("paperAbstract").value;
        const notes = document.getElementById("paperNotes").value;
        const link = document.getElementById("paperLink").value;

        papers.push({ title, abstract, notes, link });
        renderTable(); // Update table
        modal.style.display = "none";
    });

    // Download JSON
    document.getElementById("downloadJsonBtn").addEventListener("click", function () {
        const blob = new Blob([JSON.stringify(papers, null, 2)], { type: "application/json" });
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
                papers = JSON.parse(e.target.result);
                renderTable(); // Display uploaded data
                alert("File uploaded successfully!");
            };
            reader.readAsText(file);
        }
    });

    // Edit Paper
    window.editPaper = function (index) {
        document.getElementById("paperTitle").value = papers[index].title;
        document.getElementById("paperAbstract").value = papers[index].abstract;
        document.getElementById("paperNotes").value = papers[index].notes;
        document.getElementById("paperLink").value = papers[index].link;

        modal.style.display = "flex";
        papers.splice(index, 1); // Remove the old entry so we can replace it
    };

    // Delete Paper
    window.deletePaper = function (index) {
        if (confirm("Are you sure you want to delete this paper?")) {
            papers.splice(index, 1);
            renderTable(); // Refresh table
        }
    };
});
