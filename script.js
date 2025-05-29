// =====================
// 1. VARIABLES GLOBALES Y ELEMENTOS DEL DOM
// =====================

// Datos de perfiles (carga desde localStorage o array inicial)
let profilesData = [];
const storedProfiles = localStorage.getItem('profilesData');
if (storedProfiles) {
    profilesData = JSON.parse(storedProfiles);
} else {
    profilesData = [
        // ...tu array original de perfiles...
    ];
}

// Elementos del DOM
const profilesContainer = document.getElementById('profiles-container');
const searchInput = document.getElementById('search-input');
const noResultsMessage = document.getElementById('no-results-message');
const selectedProfilesCountDisplay = document.getElementById('selected-profiles-count');
const loadingMessage = document.getElementById('loading-message');
const profilesPerPageSelect = document.getElementById('profiles-per-page');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageNumbersContainer = document.getElementById('page-numbers');
const addProfileForm = document.getElementById('add-profile-form');
const SELECTED_PROFILES_KEY = 'selectedProfiles';
const selectedProfileIds = new Set(JSON.parse(localStorage.getItem(SELECTED_PROFILES_KEY)) || []);
const searchIcon = document.querySelector('.search-icon');

const clearSearchBtn = document.getElementById('clear-search');

searchInput.addEventListener('input', () => {
    currentPage = 1;
    displayProfiles();
    // Mostrar u ocultar el botón "X"
    clearSearchBtn.style.display = searchInput.value ? 'flex' : 'none';
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    currentPage = 1;
    displayProfiles();
    searchInput.focus();
});

// Variables de paginación y búsqueda
let profilesPerPage = parseInt(profilesPerPageSelect.value);
let currentPage = 1;
let currentFilteredProfiles = [];
let renderTimeoutId = null;

// =====================
// 2. FUNCIONES DE PAGINACIÓN
// =====================

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
        displayProfiles();
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

// =====================
// 3. FUNCIONES DE RENDERIZADO Y UI
// =====================

function renderProfileCards(profilesToRender) {
    if (renderTimeoutId) clearTimeout(renderTimeoutId);
    profilesContainer.innerHTML = '';
    loadingMessage.classList.remove('hidden');
    renderTimeoutId = setTimeout(() => {
        if (profilesToRender.length === 0) {
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
            profilesToRender.forEach(profile => {
                const newCard = createProfileCard(profile);
                newCard.classList.add('profile-card--enter'); // Animación de entrada
                profilesContainer.appendChild(newCard);
                setTimeout(() => {
                    newCard.classList.remove('profile-card--enter');
                }, 10); // Deja que el DOM pinte antes de quitar la clase
            });
        }
        updateSelectedCount();
        loadingMessage.classList.add('hidden');
        renderTimeoutId = null;
    }, 100);
}

function displayProfiles() {
    // Decide qué perfiles mostrar según búsqueda y paginación
    const searchTerm = searchInput.value.trim().toLowerCase();
    let profilesToShow = [];
    let paginated = false;

    if (searchTerm) {
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
        // ¡AQUÍ EL CAMBIO CLAVE!
        currentFilteredProfiles = [];
        profilesToShow = profilesData;
        paginated = false;
    }

    renderProfileCards(profilesToShow);
    updateProfilesCount();

    console.log('profilesData:', profilesData.map(p => p.name)); // DEBUG: Log de perfiles cargados
    console.log('currentFilteredProfiles:', currentFilteredProfiles.map(p => p.name)); // DEBUG: Log de perfiles filtrados
    // Mostrar/ocultar controles de paginación
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginated) {
        // Solo si hay búsqueda, muestra y actualiza la paginación
        paginationContainer.style.display = '';
        renderPageNumberButtons(currentFilteredProfiles);
        updatePaginationUI(currentFilteredProfiles);
    } else {
        // Si NO hay búsqueda, oculta la paginación
        paginationContainer.style.display = 'none';
    }
}

function updateProfilesCount() {
    const countDiv = document.getElementById('profiles-count');
    countDiv.textContent = `Total de perfiles: ${profilesData.length}`;
}

function handleSearch() {
    currentPage = 1;
    displayProfiles();
}

// =====================
// 4. FUNCIONES DE PERFIL Y SELECCIÓN
// =====================

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
        //rd.classList.toggle('expanded');
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
            // Quita del set de seleccionados si estaba seleccionado
            selectedProfileIds.delete(profile.name);
            // Animación de salida
            card.classList.add('profile-card--exit');
            setTimeout(() => {
                profilesData.splice(idx, 1);
                saveProfilesToLocalStorage();
                showToast(`Perfil de ${profile.name} eliminado correctamente.`, "success");
                currentPage = 1;
                displayProfiles();
                cleanSelectedProfiles();
                updateSelectedCount(); // <-- Actualiza el contador después de eliminar
            }, 300); // Debe coincidir con la duración de la animación CSS
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
    displayProfiles(); // <-- SIEMPRE refresca así
});
card.appendChild(editBtn);

    return card;
}
// =====================
// 5. FUNCIONES DE UTILIDAD Y LOCALSTORAGE
// =====================

function saveSelectedProfiles() {
    localStorage.setItem(SELECTED_PROFILES_KEY, JSON.stringify(Array.from(selectedProfileIds)));
}

function saveProfilesToLocalStorage() {
    localStorage.setItem('profilesData', JSON.stringify(profilesData));
}

function updateSelectedCount() {
    selectedProfilesCountDisplay.classList.add('pulsing');
    selectedProfilesCountDisplay.textContent = `Perfiles seleccionados: ${selectedProfileIds.size}`;
    setTimeout(() => {
        selectedProfilesCountDisplay.classList.remove('pulsing');
    }, 300);
}

function cleanSelectedProfiles() {
    // Elimina del set cualquier nombre que ya no esté en profilesData
    const validNames = new Set(profilesData.map(p => p.name));
    for (const name of selectedProfileIds) {
        if (!validNames.has(name)) {
            selectedProfileIds.delete(name);
        }
    }
    saveSelectedProfiles();
}

// =====================
// 6. FUNCIONES DE FORMULARIO (AGREGAR/EDITAR)
// =====================

if (addProfileForm) {
    addProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtén los valores de los campos del formulario
        const name = document.getElementById('new-name').value.trim();
        const title = document.getElementById('new-title').value.trim();
        const image = document.getElementById('new-image').value.trim();
        const bio = document.getElementById('new-bio').value.trim();
        const twitter = document.getElementById('new-twitter').value.trim();
        const linkedin = document.getElementById('new-linkedin').value.trim();

        // Validación básica
        if (!name || !title || !image || !bio) {
            showToast("Por favor, completa todos los campos obligatorios.", "error");
            return;
        }

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

        saveProfilesToLocalStorage();
        displayProfiles();
        addProfileForm.reset();
    });
}

// =====================
// 7. FUNCIONES DE TOAST
// =====================

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

// =====================
// 8. EVENTOS Y LISTENERS
// =====================

searchIcon.addEventListener('click', () => {
    searchInput.classList.add('active');
    searchInput.focus();
    // Simula el evento de input para disparar la búsqueda
    currentPage = 1;
    displayProfiles();
});

searchInput.addEventListener('input', () => {
    currentPage = 1;
    displayProfiles();
});

profilesPerPageSelect.addEventListener('change', () => {
    profilesPerPage = parseInt(profilesPerPageSelect.value);
    currentPage = 1;
    displayProfiles();
});

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

// =====================
// 9. INICIALIZACIÓN
// =====================

displayProfiles(); // <-- Siempre después de definir todo lo anterior

