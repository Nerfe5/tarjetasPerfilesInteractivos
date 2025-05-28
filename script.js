let profilesData = [];
const storedProfiles = localStorage.getItem('profilesData');
if (storedProfiles) {
    profilesData = JSON.parse(storedProfiles);
} else {
    profilesData = [
        // ...tu array original de perfiles...
    ];
}

const profilesContainer = document.getElementById('profiles-container');
const searchInput = document.getElementById('search-input');
const noResultsMessage = document.getElementById('no-results-message');
const selectedProfilesCountDisplay = document.getElementById('selected-profiles-count');
const loadingMessage = document.getElementById('loading-message'); // Mensaje de carga
const profilesPerPageSelect = document.getElementById('profiles-per-page'); // Nuevo elemento

const SELECTED_PROFILES_KEY = 'selectedProfiles';
const selectedProfileIds = new Set(JSON.parse(localStorage.getItem(SELECTED_PROFILES_KEY)) || []);

const searchIcon = document.querySelector('.search-icon');

searchIcon.addEventListener('click', () => {
    searchInput.classList.add('active');
    searchInput.focus();
    // Si quieres buscar inmediatamente:
    handleSearch();
});


// --- NUEVAS VARIABLES PARA LA PAGINACIÓN ---
let profilesPerPage = parseInt(profilesPerPageSelect.value); // Inicializar con el valor seleccionado
let currentPage = 1;
let currentFilteredProfiles = []; // Almacenaremos los resultados de la búsqueda aquí


// --- Elementos de paginación ---
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageNumbersContainer = document.getElementById('page-numbers');

function getTotalPages(profiles = profilesData) {
    return Math.ceil(profiles.length / profilesPerPage);
}

function createPageNumberButton(pageNumber) {
    const button = document.createElement('button');
    button.textContent = pageNumber;
    button.classList.add('page-number-button');
    if (pageNumber === currentPage) {
        button.classList.add('active');
    }
      button.addEventListener('click', () => {
        currentPage = pageNumber;
        displayCurrentPage(currentPage, currentFilteredProfiles.length > 0 ? currentFilteredProfiles : profilesData);
        updatePaginationUI(currentFilteredProfiles.length > 0 ? currentFilteredProfiles : profilesData);
    });
    return button;
}

function renderPageNumberButtons(profiles = profilesData) {
    pageNumbersContainer.innerHTML = '';
    const totalPages = getTotalPages(profiles);
    for (let i = 1; i <= totalPages; i++) {
        const button = createPageNumberButton(i);
        pageNumbersContainer.appendChild(button);
    }
}

function updatePaginationUI(profiles = profilesData) {
    const totalPages = getTotalPages(profiles);
    const pageNumberButtons = document.querySelectorAll('.page-number-button');
    pageNumberButtons.forEach(button => {
        button.classList.remove('active');
        if (parseInt(button.textContent) === currentPage) {
            button.classList.add('active');
        }
    });
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}


function goToPrevPage() {
    if (currentPage > 1) {
        loadingMessage.classList.remove('hidden'); // Mostrar "Cargando..."
        setTimeout(() => {
            currentPage--;
            displayCurrentPage(currentPage, currentFilteredProfiles.length > 0 ? currentFilteredProfiles : profilesData);
            updatePaginationUI(currentFilteredProfiles.length > 0 ? currentFilteredProfiles : profilesData);
            loadingMessage.classList.add('hidden'); // Ocultar "Cargando..."
        }, 150); // Un pequeño delay para que se vea el mensaje (opcional)
    }
}

function goToNextPage() {
    const totalPages = getTotalPages(currentFilteredProfiles.length > 0 ? currentFilteredProfiles : profilesData);
   if (currentPage < totalPages) {
        loadingMessage.classList.remove('hidden'); // Mostrar "Cargando..."
        setTimeout(() => {
            currentPage++;
            displayCurrentPage(currentPage, currentFilteredProfiles.length > 0 ? currentFilteredProfiles : profilesData);
            updatePaginationUI(currentFilteredProfiles.length > 0 ? currentFilteredProfiles : profilesData);
            loadingMessage.classList.add('hidden'); // Ocultar "Cargando..."
        }, 150); // Un pequeño delay para que se vea el mensaje (opcional)
    }
}

function saveSelectedProfiles() {
    localStorage.setItem(SELECTED_PROFILES_KEY, JSON.stringify(Array.from(selectedProfileIds)));
}

function saveProfilesToLocalStorage() {
    localStorage.setItem('profilesData', JSON.stringify(profilesData));
}

function updateSelectedCount() {
    // Añadimos la clase 'pulsing' para activar la animación
    selectedProfilesCountDisplay.classList.add('pulsing');
    selectedProfilesCountDisplay.textContent = `Perfiles seleccionados: ${selectedProfileIds.size}`;
    // Removemos la clase después de un breve tiempo para que la animación pueda volver a activarse
    setTimeout(() => {
        selectedProfilesCountDisplay.classList.remove('pulsing');
    }, 300); // 300ms es la duración de nuestra animación
}
function createProfileCard(profile) {
    const card = document.createElement('div');
    card.classList.add('profile-card'); // ¡Asegúrate de que NO haya un punto aquí!
    card.dataset.profileName = profile.name;

    if (selectedProfileIds.has(profile.name)) {
        card.classList.add('selected');
    }

    // Listener de clic para la tarjeta
    card.addEventListener('click', (event) => {
        const clickedElement = event.target;

        // DEBUG: Loguear el elemento clickeado
        console.log('Clicked Element:', clickedElement);
        console.log('Is button:', clickedElement.classList.contains('profile-button'));
        console.log('Is link or inside link:', clickedElement.closest('a'));

        // Si el elemento clickeado es el botón de contactar o un enlace (o un elemento dentro de un enlace),
        // salimos de este listener para permitir que su funcionalidad nativa o específica actúe.
        if (clickedElement.classList.contains('profile-button') || clickedElement.closest('a')) {
            console.log('Clicked interactive element (button or link), preventing card action.');
            return; // Detener la ejecución del listener de la tarjeta
        }

        // Si llegamos aquí, el clic no fue en un botón ni en un enlace,
        // así que manejamos la expansión y selección de la tarjeta.
        console.log('Toggling expanded class and selection logic');
        card.classList.toggle('expanded');
        const profileName = card.dataset.profileName;
        const wasSelected = selectedProfileIds.has(profileName);
        if (wasSelected) {
            selectedProfileIds.delete(profileName);
            card.classList.remove('selected');
        } else {
            selectedProfileIds.add(profileName);
            card.classList.add('selected');
        }
        updateSelectedCount();
        saveSelectedProfiles();
    });

    const img = document.createElement('img');
    img.classList.add('profile-image');
    img.src = profile.image;
    img.alt = `Foto de perfil de ${profile.name}`;

    const name = document.createElement('h2');
    name.classList.add('profile-name');
    name.textContent = profile.name;

    const title = document.createElement('h3');
    title.classList.add('profile-title');
    title.textContent = profile.title;

    const bio = document.createElement('p');
    bio.classList.add('profile-bio');
    bio.textContent = profile.bio;

    const socialDiv = document.createElement('div');
    socialDiv.classList.add('profile-social');
    const socialList = document.createElement('ul');

    if (profile.twitter) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = profile.twitter;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "Twitter";
        li.appendChild(a);
        socialList.appendChild(li);
    }
    if (profile.linkedin) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = profile.linkedin;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "LinkedIn";
        li.appendChild(a);
        socialList.appendChild(li);
    }
    socialDiv.appendChild(socialList);

    const button = document.createElement('button');
    button.classList.add('profile-button');
    button.textContent = "Contactar";

    let contactSent = false;
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // ¡MUY IMPORTANTE! Detiene la propagación para que el listener de la tarjeta no se active.
        contactSent = !contactSent;
        if (contactSent) {
            button.textContent = "Contacto Enviado ✅";
            button.classList.add('sent');
        } else {
            button.textContent = "Contactar";
            button.classList.remove('sent');
        }
        console.log('Contact button clicked!'); // DEBUG: Log para el botón
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(title);
    card.appendChild(bio);
    card.appendChild(socialDiv);
    card.appendChild(button);

    // Botones de eliminar y editar

const deleteBtn = document.createElement('button');
deleteBtn.classList.add('delete-profile-btn');
deleteBtn.textContent = "Eliminar";
deleteBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (confirm(`¿Seguro que deseas eliminar el perfil de ${profile.name}?`)) {
        const idx = profilesData.findIndex(p =>
            p.name === profile.name &&
            p.title === profile.title &&
            p.bio === profile.bio
        );
        if (idx !== -1) {
            profilesData.splice(idx, 1);
            saveProfilesToLocalStorage();
            showToast(`Perfil de ${profile.name} eliminado correctamente.`, "success");
            currentPage = 1; // Opcional: vuelve a la primera página
            displayProfiles(); // <-- SIEMPRE refresca así
        }
    }
});
card.appendChild(deleteBtn);

const editBtn = document.createElement('button');
editBtn.classList.add('edit-profile-btn');
editBtn.textContent = "Editar";
editBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    document.getElementById('new-name').value = profile.name;
    document.getElementById('new-title').value = profile.title;
    document.getElementById('new-image').value = profile.image;
    document.getElementById('new-bio').value = profile.bio;
    document.getElementById('new-twitter').value = profile.twitter || '';
    document.getElementById('new-linkedin').value = profile.linkedin || '';
    addProfileForm.dataset.editingIndex = profilesData.findIndex(p =>
        p.name === profile.name &&
        p.title === profile.title &&
        p.bio === profile.bio
    );
    addProfileForm.querySelector('button[type="submit"]').textContent = "Guardar cambios";
    updateProfilesCount();
});
card.appendChild(editBtn);

    return card;
}
function renderProfileCards(profilesToRender) {
    const profilesContainer = document.getElementById('profiles-container');
    profilesContainer.innerHTML = ''; // <-- Esto limpia el contenedor SIEMPRE

    loadingMessage.classList.remove('hidden'); // Mostrar "Cargando..." al inicio de la renderización
    setTimeout(() => {
        if (profilesToRender.length === 0) {
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
            profilesToRender.forEach(profile => {
                const newCard = createProfileCard(profile);
                profilesContainer.appendChild(newCard);
            });
        }
        updateSelectedCount();
        loadingMessage.classList.add('hidden'); // Ocultar "Cargando..." al finalizar
    }, 100); // Un pequeño delay para simular carga 
}

function displayCurrentPage(page, profiles = profilesData) {
    const startIndex = (page - 1) * profilesPerPage;
    const endIndex = startIndex + profilesPerPage;
    const profilesToShow = profiles.slice(startIndex, endIndex);
    renderProfileCards(profilesToShow);
}

function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        currentFilteredProfiles = profilesData.filter(profile => {
            const nameLower = profile.name.toLowerCase();
            const titleLower = profile.title.toLowerCase();
            return nameLower.includes(searchTerm) || titleLower.includes(searchTerm);
        });
    } else {
        currentFilteredProfiles = [];
    }
    currentPage = 1;
    displayProfiles();
}


searchInput.addEventListener('input', () => {
    currentPage = 1;
    displayProfiles();
});

profilesPerPageSelect.addEventListener('change', () => {
    profilesPerPage = parseInt(profilesPerPageSelect.value);
    currentPage = 1;
    displayProfiles();
});


displayProfiles();




prevPageButton.addEventListener('click', () => {
    if (currentPage > 1 && searchInput.value.trim()) {
        currentPage--;
        displayProfiles();
    }
});

nextPageButton.addEventListener('click', () => {
    const totalPages = getTotalPages(currentFilteredProfiles);
    if (currentPage < totalPages && searchInput.value.trim()) {
        currentPage++;
        displayProfiles();
    }
});

// --- Lógica para agregar y editar perfiles manualmente ---
const addProfileForm = document.getElementById('add-profile-form');
if (addProfileForm) {
    addProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('new-name').value.trim();
        const title = document.getElementById('new-title').value.trim();
        const image = document.getElementById('new-image').value.trim();
        const bio = document.getElementById('new-bio').value.trim();
        const twitter = document.getElementById('new-twitter').value.trim();
        const linkedin = document.getElementById('new-linkedin').value.trim();

        // --- Validaciones ---
        if (!name || !title || !image || !bio) {
            showToast("Por favor, completa todos los campos obligatorios.", "error");
            return;
        }
        try {
            new URL(image);
        } catch {
            showToast("La URL de la imagen no es válida.", "error");
            return;
        }
        if (twitter && !/^https?:\/\/(www\.)?twitter\.com\/.+/.test(twitter)) {
            showToast("La URL de Twitter debe ser válida (ejemplo: https://twitter.com/usuario).", "error");
            return;
        }
        if (linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(linkedin)) {
            showToast("La URL de LinkedIn debe ser válida (ejemplo: https://linkedin.com/in/usuario).", "error");
            return;
        }
        // --- Fin validaciones ---

        const newProfile = {
            name,
            title,
            image,
            bio,
            twitter: twitter || null,
            linkedin: linkedin || null
        };

        // ¿Estamos editando?
        const editingIndex = addProfileForm.dataset.editingIndex;
        if (editingIndex && editingIndex !== "-1") {
            profilesData[editingIndex] = newProfile;
            delete addProfileForm.dataset.editingIndex;
            addProfileForm.querySelector('button[type="submit"]').textContent = "Agregar perfil";
            showToast("Perfil editado correctamente.", "success");
        } else {
            profilesData.unshift(newProfile);
            showToast("Perfil agregado correctamente.", "success");
        }

        saveProfilesToLocalStorage(); // Guarda siempre

        displayProfiles(); // <-- SIEMPRE refresca así
        addProfileForm.reset();
    });
}

// Función para mostrar notificaciones tipo toast
function showToast(message, type = "info") {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (type === "error") toast.style.background = "#d32f2f";
    if (type === "success") toast.style.background = "#388e3c";
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2500);
}

function displayProfiles() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let profilesToShow = [];
    let paginated = false;

    if (searchTerm) {
        // Si hay búsqueda, filtra y pagina
        currentFilteredProfiles = profilesData.filter(profile => {
            const nameLower = profile.name.toLowerCase();
            const titleLower = profile.title.toLowerCase();
            return nameLower.includes(searchTerm) || titleLower.includes(searchTerm);
        });
        const startIndex = (currentPage - 1) * profilesPerPage;
        const endIndex = startIndex + profilesPerPage;
        profilesToShow = currentFilteredProfiles.slice(startIndex, endIndex);
        paginated = true;
    } else {
        // Sin búsqueda, muestra todos los perfiles (sin paginación)
        profilesToShow = profilesData;
        paginated = false;
    }

    renderProfileCards(profilesToShow);
    updateProfilesCount();

    // Mostrar/ocultar controles de paginación
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
        paginationContainer.style.display = paginated ? '' : 'none';
    }
    if (paginated) {
        renderPageNumberButtons(currentFilteredProfiles);
        updatePaginationUI(currentFilteredProfiles);
    }
}

function updateProfilesCount() {
    const countDiv = document.getElementById('profiles-count');
    countDiv.textContent = `Total de perfiles: ${profilesData.length}`;
}
