document.addEventListener("DOMContentLoaded", function () {
    let isDirty = false; // Flag to track unsaved changes
    const modal = document.getElementById("paperModal");
    const addPaperBtn = document.getElementById("addPaperBtn");
    const closeModal = document.querySelector(".close");
    const paperForm = document.getElementById("paperForm");
    const papersTableBody = document.querySelector("#papersTable tbody");

    let papers = []; // Store paper data

    // Function to render the table
    function renderTable() {
        // Sort the papers array by title using localeCompare for a proper alphabetical sort.
        papers.sort((a, b) => a.title.localeCompare(b.title));
      
        papersTableBody.innerHTML = ""; // Clear table first
      
        papers.forEach((paper, index) => {
          // Determine the HTML for the paper link.
          const paperLinkHtml = paper.link
            ? `<a href="${paper.link}" target="_blank">View</a>`
            : `<span class="no-link">No link</span>`;
      
          // Determine the HTML for the code link.
          const codeLinkHtml = paper.codeLink
            ? `<a href="${paper.codeLink}" target="_blank">View</a>`
            : `<span class="no-link">No link</span>`;
      
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${paper.title}</td>
            <td><div class="abstract-column">${paper.abstract.replace(/\n/g, "<br>")}</div></td>
            <td><div class="notes-column">${paper.notes.replace(/\n/g, "<br>")}</div></td>
            <td>${paperLinkHtml}</td>
            <td>${codeLinkHtml}</td>
            <td class="actions">
                <button class="edit-btn" onclick="editPaper(${index})">Edit</button>
                <button class="delete-btn" onclick="deletePaper(${index})">Delete</button>
            </td>
          `;
          papersTableBody.appendChild(row);
        });
      }
      

    // Open modal
    addPaperBtn.addEventListener("click", function () {
        modal.style.display = "flex";
        paperForm.reset(); // Clear form on open
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
        const codeLink = document.getElementById("codeLink").value;
        const bibtex   = document.getElementById("bibtexField").value; // New BibTeX value


        papers.push({ title, abstract, notes, link, codeLink, bibtex });
        isDirty = true; // Mark data as changed
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
        isDirty = false; // Reset flag as the latest changes are now saved
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
                try {
                    papers = JSON.parse(e.target.result);
                    renderTable(); // Display uploaded data
                    isDirty = false; // Data is now "saved"
                    alert("File uploaded successfully!");
                } catch (error) {
                    alert("Error parsing JSON file: " + error.message);
                }
            };
            reader.readAsText(file);
        }
        // Reset the input so that selecting the same file again will trigger a change event
        event.target.value = "";
    });

    // Edit Paper
    window.editPaper = function (index) {
        document.getElementById("paperTitle").value = papers[index].title;
        document.getElementById("paperAbstract").value = papers[index].abstract;
        document.getElementById("paperNotes").value = papers[index].notes;
        document.getElementById("paperLink").value = papers[index].link;
        document.getElementById("codeLink").value = papers[index].codeLink;
        document.getElementById("bibtexField").value   = papers[index].bibtex || ""; // Set BibTeX value


        modal.style.display = "flex";
        papers.splice(index, 1); // Remove the old entry so we can replace it
        isDirty = true; // Mark data as changed
    };

    // Delete Paper
    window.deletePaper = function (index) {
        if (confirm("Are you sure you want to delete this paper?")) {
            papers.splice(index, 1);
            isDirty = true; // Mark data as changed
            renderTable(); // Refresh table
        }
    };
    window.addEventListener("beforeunload", function (e) {
        if (isDirty) {
            const confirmationMessage = "You have unsaved changes in your JSON. Are you sure you want to leave?";
            (e || window.event).returnValue = confirmationMessage; // For older browsers
            return confirmationMessage; // For modern browsers
        }
    });
});
