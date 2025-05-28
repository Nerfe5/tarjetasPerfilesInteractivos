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
        // Busca el índice del perfil en el array
        const idx = profilesData.findIndex(p => 
            p.name === profile.name &&
            p.title === profile.title &&
            p.bio === profile.bio
        );
      if (idx !== -1) {
    profilesData.splice(idx, 1);
    saveProfilesToLocalStorage();
    displayCurrentPage(1, profilesData);
    renderPageNumberButtons(profilesData);
    updatePaginationUI(profilesData);
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
});
card.appendChild(editBtn);

    return card;
}
function renderProfileCards(profilesToRender) {
    profilesContainer.innerHTML = '';
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
     const searchTerm = searchInput.value.toLowerCase();
    currentFilteredProfiles = profilesData.filter(profile => {
        const nameLower = profile.name.toLowerCase();
        const titleLower = profile.title.toLowerCase();
        return nameLower.includes(searchTerm) || titleLower.includes(searchTerm);
    });
    currentPage = 1; // Resetear la página al realizar una búsqueda
    displayCurrentPage(currentPage, currentFilteredProfiles);
    renderPageNumberButtons(currentFilteredProfiles);
    updatePaginationUI(currentFilteredProfiles);
}



searchInput.addEventListener('input', handleSearch);

profilesPerPageSelect.addEventListener('change', () => {
    profilesPerPage = parseInt(profilesPerPageSelect.value);
    currentPage = 1;
    displayCurrentPage(currentPage, currentFilteredProfiles.length > 0 ? currentFilteredProfiles : profilesData);
    renderPageNumberButtons(currentFilteredProfiles.length > 0 ? currentFilteredProfiles : profilesData);
    updatePaginationUI(currentFilteredProfiles.length > 0 ? currentFilteredProfiles : profilesData);
});

displayCurrentPage(currentPage);
renderPageNumberButtons();
updatePaginationUI();



prevPageButton.addEventListener('click', goToPrevPage);


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
        } else {
            profilesData.unshift(newProfile);
        }

        saveProfilesToLocalStorage(); // <-- ¡SIEMPRE guarda después de agregar o editar!

        displayCurrentPage(1, profilesData);
        addProfileForm.reset();
    });
}