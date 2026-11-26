
const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const search = document.getElementById("search");
const studentCount = document.getElementById("studentCount");

let students = JSON.parse(localStorage.getItem("students") || "[]");
let editIndex = -1;

// Sauvegarder les étudiants
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Afficher les étudiants
function displayStudents() {
    studentList.innerHTML = "";

    const keyword = search.value.toLowerCase().trim();

    const filteredStudents = students
        .map((student, index) => ({ student, index }))
        .filter(({ student }) =>
            student.nom.toLowerCase().includes(keyword) ||
            student.prenom.toLowerCase().includes(keyword) ||
            student.email.toLowerCase().includes(keyword)
        );

    studentCount.textContent =
        "Nombre d'étudiants : " + students.length;

    if (filteredStudents.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.textContent = "Aucun étudiant trouvé";

        row.appendChild(cell);
        studentList.appendChild(row);
        return;
    }

    filteredStudents.forEach(({ student, index }) => {
        const row = document.createElement("tr");

        const nomCell = document.createElement("td");
        nomCell.textContent = student.nom;

        const prenomCell = document.createElement("td");
        prenomCell.textContent = student.prenom;

        const emailCell = document.createElement("td");
        emailCell.textContent = student.email;

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Modifier";
        editButton.onclick = () => editStudent(index);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Supprimer";
        deleteButton.onclick = () => deleteStudent(index);

        actionCell.append(editButton, deleteButton);

        row.append(nomCell, prenomCell, emailCell, actionCell);

        studentList.appendChild(row);
    });
}

// Ajouter ou modifier un étudiant
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const student = {
        nom: document.getElementById("nom").value.trim(),
        prenom: document.getElementById("prenom").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    if (!student.nom || !student.prenom || !student.email) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
        alert("Veuillez saisir un email valide !");
        return;
    }

    // Vérifier si l'email existe déjà
    const emailExists = students.some((s, index) =>
        s.email.toLowerCase() === student.email.toLowerCase()
        && index !== editIndex
    );

    if (emailExists) {
        alert("Cet email existe déjà !");
        return;
    }

    if (editIndex === -1) {
        students.push(student);
        alert("Étudiant ajouté avec succès !");
    } else {
        students[editIndex] = student;
        alert("Étudiant modifié avec succès !");
        editIndex = -1;
    }

    saveStudents();
    form.reset();

    form.querySelector("button[type='submit']").textContent = "Ajouter";

    displayStudents();
});

// Supprimer un étudiant
function deleteStudent(index) {
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
        students.splice(index, 1);

        saveStudents();
        displayStudents();

        alert("Étudiant supprimé avec succès !");
    }
}

// Modifier un étudiant
function editStudent(index) {
    const student = students[index];

    document.getElementById("nom").value = student.nom;
    document.getElementById("prenom").value = student.prenom;
    document.getElementById("email").value = student.email;

    editIndex = index;

    form.querySelector("button[type='submit']").textContent = "Modifier";

    document.getElementById("nom").focus();
}

// Annuler la modification
function cancelEdit() {
    editIndex = -1;
    form.reset();

    form.querySelector("button[type='submit']").textContent = "Ajouter";
}

// Recherche
search.addEventListener("input", displayStudents);

// Affichage initial
displayStudents();



