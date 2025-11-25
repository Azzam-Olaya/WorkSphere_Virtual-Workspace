const container = document.getElementById("container");
const persoList = document.getElementById("persolist");

const GlobalAWorks = [];
const allExperience = [];

const roomConfig = {
    reception: ["Réceptionniste", "Manager", "Nettoyage"], 
    conference: ["Réceptionniste", "Technicien IT", "Manager", "Nettoyage", "FS Developer"], 
    serveurs: ["Technicien IT", "Manager", "Nettoyage", "FS Developer"], 
    securite: ["Agent de sécurité", "Manager", "Nettoyage"], 
    personnel: ["Réceptionniste", "Technicien IT", "Agent de sécurité", "Manager", "Nettoyage", "FS Developer"], 
    archives: ["Réceptionniste", "Technicien IT", "Agent de sécurité", "Manager", "FS Developer"] 
};

const roomLimits = {
    conference: 10,
    securite: 3,
    serveurs: 5,
    reception: 2,
    personnel: 8,
    archives: 4
};

const RoomArr = {
    conference: [],
    securite: [],
    serveurs: [],
    reception: [],
    personnel: [],
    archives: []
};

function RoomStatus() {
    const requiredRooms = ['reception', 'serveurs', 'securite', 'archives'];
    
    requiredRooms.forEach(zone => {
        const roomDiv = document.querySelector(`.${zone}`);
        
        if (RoomArr[zone].length === 0) {
            roomDiv.classList.add('empty-required');
        } else {
            roomDiv.classList.remove('empty-required');
        }
    });
}

function ZoneCounter(zone) {
    const roomDiv = document.querySelector(`.${zone}`);
    
    let counter = roomDiv.querySelector('.zone-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'zone-counter';
        roomDiv.appendChild(counter);
    }
    
    counter.textContent = `${RoomArr[zone].length}/${roomLimits[zone]}`;
}

function updatePlusButton(zone) {
    const btn = document.querySelector(`.plusbtn[data-zone="${zone}"]`);
    const roomDiv = document.querySelector(`.${zone}`);
    
    if (RoomArr[zone].length >= roomLimits[zone]) {
        btn.classList.add('disabled');
        btn.disabled = true;
        roomDiv.classList.add('zone-limit-reached');
    } else {
        btn.classList.remove('disabled');
        btn.disabled = false;
        roomDiv.classList.remove('zone-limit-reached');
    }
}

function ProfileModal(name) {
    const employee = GlobalAWorks.find(emp => emp.name === name);
    if (!employee) return;
    
    let location = "Non assigné";
    for (let zone in RoomArr) {
        if (RoomArr[zone].some(emp => emp.name === name)) {
            location = zone.toUpperCase();
            break;
        }
    }
    
    const modal = document.createElement('div');
    modal.className = 'profile-modal active';
    modal.id = 'profileModal';
    
    const experiencesHTML = employee.experiences.length > 0 
        ? employee.experiences.map(exp => `
            <div class="info-row">
                <span class="info-label">Expérience</span>
                <span class="info-value">${exp.role} chez ${exp.entreprise}<br>${exp.debut} → ${exp.fin}</span>
            </div>
        `).join('')
        : '<div class="info-row"><span class="info-value">Aucune expérience</span></div>';
    
    modal.innerHTML = `
        <div class="btncancel">
            <h1>Profil de l'employé</h1>
            <button type="button" id="closeProfileModal">X</button>
        </div>
        <div class="profile-header">
            <img src="${employee.image}" class="profile-photo" alt="${employee.name}">
            <h2 class="profile-name">${employee.name}</h2>
            <span class="profile-role">${employee.role}</span>
        </div>
        <div class="profile-info">
            <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value">${employee.email}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Téléphone</span>
                <span class="info-value">${employee.phone}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Localisation</span>
                <span class="info-value">${location}</span>
            </div>
            ${experiencesHTML}
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById("modalOverlay").classList.add("active");
    
    document.getElementById("closeProfileModal").addEventListener("click", () => {
        modal.remove();
        // Ne retirer l'overlay que s'il n'y a plus de modales actives
        const activeModals = document.querySelectorAll('.validationForm.active, .profile-modal.active');
        if (activeModals.length === 0) {
            document.getElementById("modalOverlay").classList.remove("active");
        }
    });
}

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
        if (!/^[a-zA-ZÀ-ÿ ]+$/.test(Fname)) {
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

document.querySelectorAll('.plusbtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const zone = e.target.dataset.zone;
        const allowedRoles = roomConfig[zone];

        if (RoomArr[zone].length >= roomLimits[zone]) {
            alert(`Cette salle est pleine ! Maximum : ${roomLimits[zone]} personnes`);
            return;
        }

        const ValidForm = document.createElement("div");
        ValidForm.className = "validationForm active";
        ValidForm.id = "validationForm";

        ValidForm.innerHTML = `
            <div class="btncancel">
                <h1>Assigner à ${zone.toUpperCase()}</h1>
                <button type="button" id="closeModal2">X</button>
            </div>
            <div class="personnel-selection" id="personnelSelection"></div>
        `;

        const selectionDiv = ValidForm.querySelector('#personnelSelection');

        // Filtrer les employés non assignés et qui ont le bon rôle
        const availableEmployees = GlobalAWorks.filter(emp => {
            const isInRoom = RoomArr[zone].some(r => r.name === emp.name);
            return !isInRoom && allowedRoles.includes(emp.role);
        });

        if (availableEmployees.length === 0) {
            selectionDiv.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <p>Aucun personnel disponible pour cette salle</p>
                </div>
            `;
        } else {
            availableEmployees.forEach(emp => {
                const carte = document.createElement("div");
                carte.classList.add("pronalinfo");
                carte.style.cursor = "pointer";
                carte.innerHTML = `
                    <img src="${emp.image}" alt="userlogo">
                    <div class="info">
                        <h1>${emp.name}</h1>
                        <p>${emp.role}</p>
                    </div>
                `;

                carte.addEventListener('click', () => {
                    assignToRoom(zone, emp);
                    ValidForm.remove();
                    document.getElementById("modalOverlay").classList.remove("active");
                });

                selectionDiv.appendChild(carte);
            });
        }

        container.appendChild(ValidForm);
        document.getElementById("modalOverlay").classList.add("active");

        document.getElementById("closeModal2").addEventListener("click", () => {
            ValidForm.remove();
            document.getElementById("modalOverlay").classList.remove("active");
        });
    });
});

function assignToRoom(zone, employee) {
    const roomList = document.getElementById(`${zone}list`);

    // VÉRIFIER LA LIMITE (sécurité supplémentaire)
    if (RoomArr[zone].length >= roomLimits[zone]) {
        alert(`Cette salle est pleine ! Maximum : ${roomLimits[zone]} personnes`);
        return;
    }
    
    // Ajouter à l'array de la salle
    RoomArr[zone].push(employee);

    // Créer la carte dans la salle
    const carte = document.createElement("div");
    carte.classList.add("pronalinfor");
    carte.dataset.name = employee.name;
    carte.innerHTML = `
        <img src="${employee.image}" alt="userlogo">
        <div class="info" data-profile="${employee.name}">
            
        </div>
        <button class="remove-from-zone" data-zone="${zone}" data-name="${employee.name}">×</button>
    `;

    roomList.appendChild(carte);

    // Supprimer de la liste persolist
    const cardInPersolist = persoList.querySelector(`[data-name="${employee.name}"]`);
    if (cardInPersolist) {
        cardInPersolist.remove();
    }

    // Si persolist est vide, afficher l'état vide
    if (persoList.children.length === 0) {
        persoList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👤</div>
                <p>Aucun personnel non assigné</p>
            </div>
        `;
    }

    // METTRE À JOUR LES INDICATEURS
    ZoneCounter(zone);
    updatePlusButton(zone);
    RoomStatus();
}

// Gestion de la suppression d'une salle
document.addEventListener('click', (e) => {
    // SUPPRESSION D'UNE ZONE
    if (e.target.classList.contains('remove-from-zone')) {
        const zone = e.target.dataset.zone;
        const name = e.target.dataset.name;

        // Trouver l'employé dans l'array de la salle
        const employee = RoomArr[zone].find(emp => emp.name === name);
        
        if (employee) {
            // Supprimer de l'array de la salle
            RoomArr[zone] = RoomArr[zone].filter(emp => emp.name !== name);

            // Supprimer la carte de la salle
            const cardInRoom = document.querySelector(`#${zone}list [data-name="${name}"]`);
            if (cardInRoom) {
                cardInRoom.remove();
            }

            // Rajouter dans persolist
            const emptyState = persoList.querySelector('.empty-state');
            if (emptyState) {
                emptyState.remove();
            }

            createPersonnelCard(employee.name, employee.image, employee.role, employee.email, employee.phone, employee.experiences);

            // METTRE À JOUR LES INDICATEURS
            ZoneCounter(zone);
            updatePlusButton(zone);
            RoomStatus();
        }
    }

    // AFFICHAGE DU PROFIL
    if (e.target.closest('.info[data-profile]')) {
        const name = e.target.closest('.info').dataset.profile;
        ProfileModal(name);
    }
});

// Fermer les modales en cliquant sur l'overlay
document.getElementById("modalOverlay").addEventListener("click", () => {
    document.querySelectorAll('.validationForm.active').forEach(modal => modal.remove());
    document.querySelectorAll('.profile-modal.active').forEach(modal => modal.remove());
    document.getElementById("modalOverlay").classList.remove("active");
});

// INITIALISER LES COMPTEURS ET STATUTS AU CHARGEMENT
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(RoomArr).forEach(zone => {
        ZoneCounter(zone);
        updatePlusButton(zone);
    });
    RoomStatus();
});