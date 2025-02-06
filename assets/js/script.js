document.addEventListener("DOMContentLoaded", function () {
    let papers = JSON.parse(localStorage.getItem("papers")) || [];
    const tableBody = document.querySelector("#papersTable tbody");
    const paperModal = document.getElementById("paperModal");
    const addPaperBtn = document.getElementById("addPaperBtn");
    const closeModalSpan = document.querySelector(".close");
    const paperForm = document.getElementById("paperForm");
  
    function savePapers() {
      localStorage.setItem("papers", JSON.stringify(papers));
    }
  
    function renderTable() {
      tableBody.innerHTML = "";
      papers.forEach((paper, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${paper.title}</td>
          <td>${paper.abstract}</td>
          <td>${paper.notes.replace(/\n/g, "<br>")}</td>
          <td><a href="${paper.paperLink}" target="_blank">View</a></td>
          <td><a href="${paper.codeLink}" target="_blank">Code</a></td>
          <td><button class="edit-btn" data-index="${index}">Edit</button> <button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    addPaperBtn.addEventListener("click", () => {
      paperForm.reset();
      paperModal.style.display = "flex";
    });
  
    closeModalSpan.addEventListener("click", () => {
      paperModal.style.display = "none";
    });
  
    paperForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const newPaper = {
        title: document.getElementById("paperTitle").value,
        abstract: document.getElementById("paperAbstract").value,
        notes: document.getElementById("paperNotes").value,
        paperLink: document.getElementById("paperLink").value,
        codeLink: document.getElementById("codeLink").value
      };
      papers.push(newPaper);
      savePapers();
      renderTable();
      paperModal.style.display = "none";
    });
  
    renderTable();
  });
  