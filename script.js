const container = document.getElementById("container");
const persoList = document.getElementById("persolist");

const GlobalAWorks = [];
const allExperience = [];

const roomConfig = {
    conference: ["Technicien IT", "Manager", "FS Developer"],
    securite: ["Agent de sécurité", "Manager"],
    serveurs: ["Manager", "Technicien IT", "FS Developer"],
    reception: ["Réceptionniste", "Manager", "Nettoyage", "Agent de sécurité"],
    personnel: ["Manager", "Nettoyage"],
    archives: ["Agent de sécurité", "Manager"]
};

const RoomArr = {
    conference: [],
    securite: [],
    serveurs: [],
    reception: [],
    personnel: [],
    archives: []
};

// Bouton pour ajouter un employé
document.getElementById("validation").addEventListener("click", () => {
    const ValidForm = document.createElement("div");
    ValidForm.className = "validationForm active";
    ValidForm.id = "validationForm";

    ValidForm.innerHTML = `
        <div class="validationForm1" id="validationForm1">
            <div class="btncancel">
                <h1>Ajouter un Employé</h1>
                <button type="button" id="closeModal">X</button>
            </div>

            <form class="formAjout" id="formAjout">
                <div class="input-group1">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="Profile" class="profileimg" id="profileimg">
                    <div style="flex: 1;">
                        <label for="Nom_et_prenom">Nom et Prénom</label>
                        <input type="text" id="Nom_et_prenom" placeholder="Nom et Prénom" required>
                        <p id="fnamemessage"></p>
                    </div>
                </div>

                <label for="Photo_employe">Photo (URL)</label>
                <input type="url" id="Photo_employe" placeholder="https://image.png">

                <label for="Role">Rôle</label>
                <select id="Role" required>
                    <option value="">Sélectionner un rôle</option>
                    <option value="Réceptionniste">Réceptionniste</option>
                    <option value="Technicien IT">Technicien IT</option>
                    <option value="Agent de sécurité">Agent de sécurité</option>
                    <option value="Manager">Manager</option>
                    <option value="Nettoyage">Nettoyage</option>
                    <option value="FS Developer">FS Developer</option>
                </select>

                <label for="Email_employe">Email</label>
                <input type="email" id="Email_employe" placeholder="exemple@gmail.com" required>
                <p id="emailmessage"></p>

                <label for="telePhone">Téléphone</label>
                <input type="text" id="telePhone" placeholder="0123456789" required>
                <p id="phonemessage"></p>

                <div class="experienceforms">
                    <div class="input-group3">
                        <h1>EXPERIENCE</h1>
                        <label>Rôle</label>
                        <input type="text" class="exprole">

                        <label>Entreprise</label>
                        <input type="text" class="expentreprise">

                        <label>Date début</label>
                        <input type="date" class="debut">

                        <label>Date fin</label>
                        <input type="date" class="fin">
                    </div>
                </div>

                <button type="button" id="addexperience" class="addexperience">Ajouter expérience</button>
                <p id="experiencemessage"></p>

                <button type="submit" id="submitt">ENVOYER</button>
            </form>
        </div>
    `;

    container.appendChild(ValidForm);
    document.getElementById("modalOverlay").classList.add("active");

    // AFFICHAGE DE L'IMAGE
    const profileInput = document.getElementById("Photo_employe");
    const profileImg = document.getElementById("profileimg");

    profileInput.addEventListener('input', function (e) {
        if (e.target.value) {
            profileImg.src = e.target.value;
            profileImg.classList.add("active");
        }
    });

    // AJOUT DYNAMIQUE D'EXPERIENCE
    const Forms = document.querySelector(".experienceforms");
    const addBtn = document.getElementById("addexperience");
    const ExperienceForme = document.querySelector(".input-group3");

    addBtn.addEventListener("click", () => {
        const clone = ExperienceForme.cloneNode(true);
        clone.querySelectorAll("input").forEach((input)=>{
            input.value = "";
        })
        Forms.appendChild(clone);
    });

    // VALIDATION DU FORMULAIRE
    document.getElementById("formAjout").addEventListener("submit", (e) => {
        e.preventDefault();

        const Fname = document.getElementById("Nom_et_prenom").value.trim();
        const Image = document.getElementById("Photo_employe").value.trim() || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";
        const Email = document.getElementById("Email_employe").value.trim();
        const Telephone = document.getElementById("telePhone").value.trim();
        const Role = document.getElementById("Role").value.trim();

        const Fnamemessage = document.getElementById("fnamemessage");
        const EmailMessage = document.getElementById("emailmessage");
        const PhoneMessage = document.getElementById("phonemessage");
        const ExperMessage = document.getElementById("experiencemessage");

        // VALIDATION FULL NAME
        if (!/^[a-zA-Z ]+$/.test(Fname)) {
            Fnamemessage.innerText = "Nom invalide (lettres uniquement)";
            Fnamemessage.style.color = "red";
            return;
        } else Fnamemessage.innerText = "";

        // VALIDATION TELEPHONE
        if (!/^0[5-7][0-9]{8}$/.test(Telephone)) {
            PhoneMessage.innerText = "Téléphone marocain invalide";
            PhoneMessage.style.color = "red";
            return;
        } else PhoneMessage.innerText = "";

        // VALIDATION EMAIL
        if (!/^[\w.-]+@[a-zA-Z\d.-]+\.(com|ma)$/.test(Email)) {
            EmailMessage.innerText = "Email invalide";
            EmailMessage.style.color = "red";
            return;
        } else EmailMessage.innerText = "";

        // VALIDATION DES DATES D'EXPERIENCE
        allExperience.length = 0;

        const expForms = document.querySelectorAll('.input-group3');
        for (let ex of expForms) {
            const role = ex.querySelector('.exprole').value;
            const entreprise = ex.querySelector('.expentreprise').value;
            const debut = ex.querySelector('.debut').value;
            const fin = ex.querySelector('.fin').value;

            if (debut && fin && fin < debut) {
                ExperMessage.innerText = "Date de fin < date début !";
                ExperMessage.style.color = "red";
                return;
            }

            if (role || entreprise || debut || fin) {
                allExperience.push({ role, entreprise, debut, fin });
            }
        }

        ExperMessage.innerText = "";

        // VERIFIER SI PERSONNE EXISTE DÉJÀ
        const exist = GlobalAWorks.some(p => p.name === Fname);
        if (exist) {
            alert("Cet employé existe déjà !");
            return;
        }

        // AJOUT DANS LA LISTE GLOBALE
        GlobalAWorks.push({
            name: Fname,
            image: Image,
            email: Email,
            phone: Telephone,
            role: Role,
            experiences: [...allExperience]
        });

        // Créer la carte de personnel
        createPersonnelCard(Fname, Image, Role, Email, Telephone, [...allExperience]);

        alert("Employé ajouté avec succès !");
        ValidForm.remove();
        document.getElementById("modalOverlay").classList.remove("active");
    });

    // FERMETURE
    document.getElementById("closeModal").addEventListener("click", () => {
        ValidForm.remove();
        document.getElementById("modalOverlay").classList.remove("active");
    });
});

function createPersonnelCard(Fname, Image, Role, Email, Telephone, Experiences) {
    const emptyState = persoList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const carte = document.createElement("div");
    carte.classList.add("pronalinfo");
    carte.dataset.name = Fname;
    carte.innerHTML = `
        <img src="${Image}" alt="userlogo">
        <div class="info" data-profile="${Fname}">
            <h1>${Fname}</h1>
            <p>${Role}</p>
        </div>
    `;

    persoList.appendChild(carte);
}

