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
        // Sort the papers array by title.
        papers.sort((a, b) => a.title.localeCompare(b.title));
      
        // Clear table first
        papersTableBody.innerHTML = "";
      
        papers.forEach((paper, index) => {
          // Create a new row
          const row = document.createElement("tr");
      
          // Numbering cell
          const numCell = document.createElement("td");
          numCell.textContent = index + 1;
          row.appendChild(numCell);
      
          // Title cell
          const titleCell = document.createElement("td");
          titleCell.textContent = paper.title;
          row.appendChild(titleCell);
      
          // Abstract cell with scrollable container
          const abstractCell = document.createElement("td");
          const abstractDiv = document.createElement("div");
          abstractDiv.classList.add("abstract-column");
          abstractDiv.innerHTML = paper.abstract.replace(/\n/g, "<br>");
          abstractCell.appendChild(abstractDiv);
          row.appendChild(abstractCell);
      
          // Notes cell with scrollable container
          const notesCell = document.createElement("td");
          const notesDiv = document.createElement("div");
          notesDiv.classList.add("notes-column");
          notesDiv.innerHTML = paper.notes.replace(/\n/g, "<br>");
          notesCell.appendChild(notesDiv);
          row.appendChild(notesCell);
      
          // Paper link cell: if link exists, create an anchor; otherwise, gray out text.
          const linkCell = document.createElement("td");
          if (paper.link) {
            const linkAnchor = document.createElement("a");
            linkAnchor.href = paper.link;
            linkAnchor.target = "_blank";
            linkAnchor.textContent = "View";
            linkCell.appendChild(linkAnchor);
          } else {
            const noLinkSpan = document.createElement("span");
            noLinkSpan.classList.add("no-link");
            noLinkSpan.textContent = "No link";
            linkCell.appendChild(noLinkSpan);
          }
          row.appendChild(linkCell);
      
          // Code link cell: similar to the paper link cell.
          const codeLinkCell = document.createElement("td");
          if (paper.codeLink) {
            const codeLinkAnchor = document.createElement("a");
            codeLinkAnchor.href = paper.codeLink;
            codeLinkAnchor.target = "_blank";
            codeLinkAnchor.textContent = "View";
            codeLinkCell.appendChild(codeLinkAnchor);
          } else {
            const noCodeLinkSpan = document.createElement("span");
            noCodeLinkSpan.classList.add("no-link");
            noCodeLinkSpan.textContent = "No link";
            codeLinkCell.appendChild(noCodeLinkSpan);
          }
          row.appendChild(codeLinkCell);
      
          // Actions cell (Edit & Delete buttons)
          const actionsCell = document.createElement("td");
          actionsCell.classList.add("actions");
      
          const editBtn = document.createElement("button");
          editBtn.classList.add("edit-btn");
          editBtn.textContent = "Edit";
          editBtn.addEventListener("click", () => { editPaper(index); });
          actionsCell.appendChild(editBtn);
      
          const deleteBtn = document.createElement("button");
          deleteBtn.classList.add("delete-btn");
          deleteBtn.textContent = "Delete";
          deleteBtn.addEventListener("click", () => { deletePaper(index); });
          actionsCell.appendChild(deleteBtn);
      
          row.appendChild(actionsCell);
      
          // Append the row to the table body
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
