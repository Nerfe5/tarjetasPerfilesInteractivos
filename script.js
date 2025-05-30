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

const FAVORITE_PROFILES_KEY = 'favoriteProfiles';
const favoriteProfileIds = new Set(JSON.parse(localStorage.getItem(FAVORITE_PROFILES_KEY)) || []);

const clearSearchBtn = document.getElementById('clear-search');

const exportCsvBtn = document.getElementById('export-csv-btn');
if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportSelectedProfilesToCSV);
}

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

const showFavoritesOnlyCheckbox = document.getElementById('show-favorites-only');
if (showFavoritesOnlyCheckbox) {
    showFavoritesOnlyCheckbox.addEventListener('change', () => {
        displayProfiles();
    });
}

function displayProfiles() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let profilesToShow = [];
    let paginated = false;

    // Filtrar favoritos si está activado
    let baseProfiles = profilesData;
    if (showFavoritesOnlyCheckbox && showFavoritesOnlyCheckbox.checked) {
        baseProfiles = profilesData.filter(p => favoriteProfileIds.has(p.name));
    }

    if (searchTerm) {
        currentFilteredProfiles = baseProfiles.filter(profile => {
            const nameLower = profile.name.toLowerCase();
            const titleLower = profile.title.toLowerCase();
            return nameLower.includes(searchTerm) || titleLower.includes(searchTerm);
        });
        const startIndex = (currentPage - 1) * profilesPerPage;
        const endIndex = startIndex + profilesPerPage;
        profilesToShow = currentFilteredProfiles.slice(startIndex, endIndex);
        paginated = true;
    } else {
        currentFilteredProfiles = [];
        profilesToShow = baseProfiles;
        paginated = false;
    }

    renderProfileCards(profilesToShow);
    updateProfilesCount();

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
    // Crea el contenedor principal de la tarjeta
    const card = document.createElement('div');
    card.classList.add('profile-card');
    card.dataset.profileName = profile.name;

    // Marca como seleccionada si corresponde
    if (selectedProfileIds.has(profile.name)) {
        card.classList.add('selected');
    }

    // Listener para seleccionar/deseleccionar la tarjeta
    card.addEventListener('click', (event) => {
        const clickedElement = event.target;
        // Evita seleccionar si se hace clic en un botón o enlace
        if (clickedElement.classList.contains('profile-button') || clickedElement.closest('a')) {
            return;
        }
        const profileName = card.dataset.profileName;
        if (selectedProfileIds.has(profileName)) {
            selectedProfileIds.delete(profileName);
            card.classList.remove('selected');
        } else {
            selectedProfileIds.add(profileName);
            card.classList.add('selected');
        }
        updateSelectedCount();
        saveSelectedProfiles();
    });

    // Imagen de perfil
    const img = document.createElement('img');
    img.classList.add('profile-image');
    img.src = profile.image;
    img.alt = `Foto de perfil de ${profile.name}`;

    // Nombre
    const name = document.createElement('h2');
    name.classList.add('profile-name');
    name.textContent = profile.name;

    // Título
    const title = document.createElement('h3');
    title.classList.add('profile-title');
    title.textContent = profile.title;

    // Biografía
    const bio = document.createElement('p');
    bio.classList.add('profile-bio');
    bio.textContent = profile.bio;

    // Redes sociales
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

    // Botón Contactar
    const button = document.createElement('button');
    button.classList.add('profile-button');
    button.textContent = "Contactar";
    let contactSent = false;
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        contactSent = !contactSent;
        if (contactSent) {
            button.textContent = "Contacto Enviado ✅";
            button.classList.add('sent');
        } else {
            button.textContent = "Contactar";
            button.classList.remove('sent');
        }
    });

    // Botón de favorito (estrella)
    const favoriteBtn = document.createElement('button');
    favoriteBtn.classList.add('favorite-btn');
    favoriteBtn.title = "Marcar como favorito";
    favoriteBtn.innerHTML = favoriteProfileIds.has(profile.name) ? '★' : '☆';
    favoriteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (favoriteProfileIds.has(profile.name)) {
            favoriteProfileIds.delete(profile.name);
            favoriteBtn.innerHTML = '☆';
        } else {
            favoriteProfileIds.add(profile.name);
            favoriteBtn.innerHTML = '★';
        }
        saveFavoriteProfiles();
    });

    // Botón Editar
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
        displayProfiles();
    });

    // Botón Eliminar
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-profile-btn');
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        showConfirmModal(`¿Seguro que deseas eliminar el perfil de ${profile.name}?`, (confirmed) => {
            if (confirmed) {
                const idx = profilesData.findIndex(p =>
                    p.name === profile.name &&
                    p.title === profile.title &&
                    p.bio === profile.bio
                );
                if (idx !== -1) {
                    selectedProfileIds.delete(profile.name);
                    card.classList.add('profile-card--exit');
                    setTimeout(() => {
                        profilesData.splice(idx, 1);
                        saveProfilesToLocalStorage();
                        showToast(`Perfil de ${profile.name} eliminado correctamente.`, "success");
                        currentPage = 1;
                        displayProfiles();
                        cleanSelectedProfiles();
                        updateSelectedCount();
                    }, 300);
                }
            }
        });
    });

    // Contenedor para los botones de acción (editar y eliminar)
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('profile-actions');
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);


    const detailBtn = document.createElement('button');
detailBtn.classList.add('detail-profile-btn');
detailBtn.textContent = "Ver más";
detailBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    showProfileDetailModal(profile);
});

    // Añade los elementos al card en el orden correcto
    card.appendChild(favoriteBtn); // Estrella arriba a la derecha
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(title);
    card.appendChild(bio);
    card.appendChild(socialDiv);
    card.appendChild(button);      // Botón Contactar
    card.appendChild(detailBtn);   // Botón Ver más
    card.appendChild(actionsDiv);  // Botones Editar y Eliminar debajo




    return card;
}



function updateExportBtnVisibility() {
    if (exportCsvBtn) {
        exportCsvBtn.style.display = selectedProfileIds.size > 0 ? 'inline-block' : 'none';
    }
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
    updateExportBtnVisibility();
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

function saveFavoriteProfiles() {
    localStorage.setItem(FAVORITE_PROFILES_KEY, JSON.stringify(Array.from(favoriteProfileIds)));
}

function exportSelectedProfilesToCSV() {
    // Filtra los perfiles seleccionados
    const selectedProfiles = profilesData.filter(profile => selectedProfileIds.has(profile.name));
    if (!selectedProfiles.length) {
        showToast("No hay perfiles seleccionados para exportar.", "error");
        return;
    }

    const headers = ["name", "title", "image", "bio", "twitter", "linkedin"];
    const csvRows = [headers.join(",")];

    selectedProfiles.forEach(profile => {
        const row = headers.map(key => {
            let value = profile[key] || "";
            value = String(value).replace(/"/g, '""');
            if (value.includes(",") || value.includes('"') || value.includes('\n')) {
                value = `"${value}"`;
            }
            return value;
        });
        csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "perfiles_seleccionados.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const importBtn = document.getElementById('import-btn');
const importFileInput = document.getElementById('import-file-input');

if (importBtn && importFileInput) {
    importBtn.addEventListener('click', () => {
        importFileInput.value = ''; // Limpia selección previa
        importFileInput.click();
    });

    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            let importedProfiles = [];
            try {
                if (file.name.endsWith('.json')) {
                    importedProfiles = JSON.parse(event.target.result);
                } else if (file.name.endsWith('.csv')) {
                    importedProfiles = parseCSVProfiles(event.target.result);
                } else {
                    showToast("Formato de archivo no soportado.", "error");
                    return;
                }
            } catch (err) {
                showToast("Error al leer el archivo.", "error");
                return;
            }

            // Filtra duplicados por nombre
            let addedCount = 0;
            importedProfiles.forEach(profile => {
                if (
                    profile.name &&
                    !profilesData.some(p => p.name === profile.name)
                ) {
                    profilesData.unshift(profile);
                    addedCount++;
                }
            });

            if (addedCount > 0) {
                saveProfilesToLocalStorage();
                displayProfiles();
                showToast(`Se importaron ${addedCount} perfiles.`, "success");
            } else {
                showToast("No se importaron perfiles nuevos.", "info");
            }
        };

        reader.readAsText(file);
    });
}

// Función para parsear CSV a objetos de perfil
function parseCSVProfiles(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const profiles = [];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        const profile = {};
        headers.forEach((header, idx) => {
            profile[header] = row[idx] ? row[idx].replace(/^"|"$/g, '').replace(/""/g, '"') : '';
        });
        profiles.push(profile);
    }
    return profiles;
}

function showProfileDetailModal(profile) {
    const modal = document.getElementById('profile-detail-modal');
    const content = document.getElementById('profile-detail-content');
    content.innerHTML = `
        <div class="profile-detail-modal-content">
            <img src="${profile.image}" alt="Foto de perfil de ${profile.name}" style="width:120px;height:120px;border-radius:50%;margin-bottom:16px;">
            <h2>${profile.name}</h2>
            <h3>${profile.title}</h3>
            <p style="margin:16px 0;">${profile.bio}</p>
            <div>
                ${profile.twitter ? `<a href="${profile.twitter}" target="_blank">Twitter</a>` : ''}
                ${profile.linkedin ? `<a href="${profile.linkedin}" target="_blank">LinkedIn</a>` : ''}
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

// Cerrar modal
document.getElementById('close-detail-modal').addEventListener('click', () => {
    document.getElementById('profile-detail-modal').classList.add('hidden');
});
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

// Modal de confirmación reutilizable
function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const msg = document.getElementById('confirm-modal-message');
    const yesBtn = document.getElementById('confirm-modal-yes');
    const noBtn = document.getElementById('confirm-modal-no');

    msg.textContent = message;
    modal.classList.remove('hidden');

    // Limpia listeners previos
    yesBtn.onclick = null;
    noBtn.onclick = null;

    yesBtn.onclick = () => {
        modal.classList.add('hidden');
        onConfirm(true);
    };
    noBtn.onclick = () => {
        modal.classList.add('hidden');
        onConfirm(false);
    };
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
const themeToggleBtn = document.getElementById('theme-toggle');

// Cargar preferencia de tema
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggleBtn.textContent = '🌙';
    }
}

function getSavedTheme() {
    return localStorage.getItem('theme') || 'light';
}

// Inicializa el tema al cargar
applyTheme(getSavedTheme());

// Cambia el tema al hacer click
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

displayProfiles(); // <-- Siempre después de definir todo lo anterior
updateExportBtnVisibility(); // Actualiza la visibilidad del botón de exportación al cargar
