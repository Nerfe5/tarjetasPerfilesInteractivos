/**
 * ============================
 * CONFIGURACIÓN INICIAL
 * ============================
 */

// Constantes para almacenamiento local
const SELECTED_PROFILES_KEY = 'selectedProfiles';
const FAVORITE_PROFILES_KEY = 'favoriteProfiles';

// Variables globales
let profilesData = [];
let profilesPerPage = 3;
let currentPage = 1;
let currentFilteredProfiles = [];
let renderTimeoutId = null;

// Conjuntos para almacenar IDs
const selectedProfileIds = new Set(JSON.parse(localStorage.getItem(SELECTED_PROFILES_KEY)) || []);
const favoriteProfileIds = new Set(JSON.parse(localStorage.getItem(FAVORITE_PROFILES_KEY)) || []);

/**
 * ============================
 * INICIALIZACIÓN DE DATOS
 * ============================
 */

// Cargar perfiles desde localStorage o usar datos por defecto
const storedProfiles = localStorage.getItem('profilesData');
console.log('Perfiles almacenados:', storedProfiles);

if (storedProfiles) {
    profilesData = JSON.parse(storedProfiles);
    console.log('Perfiles cargados:', profilesData);
} else {
    console.log('No hay perfiles almacenados');
    // Agregar perfiles por defecto si no hay ninguno
    profilesData = [
        {
            name: "Perfil de Ejemplo",
            title: "Desarrollador Web",
            image: "https://via.placeholder.com/150",
            bio: "Este es un perfil de ejemplo para mostrar cuando no hay perfiles guardados.",
            twitter: "https://twitter.com",
            linkedin: "https://linkedin.com"
        }
    ];
    // Guardar el perfil de ejemplo en localStorage
    localStorage.setItem('profilesData', JSON.stringify(profilesData));
}

/**
 * ============================
 * ELEMENTOS DEL DOM
 * ============================
 */

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
const clearSearchBtn = document.getElementById('clear-search');
const exportCsvBtn = document.getElementById('export-csv-btn');
const searchIcon = document.querySelector('.search-icon');
const showFavoritesOnlyCheckbox = document.getElementById('show-favorites-only');

// Elementos del formulario
const toggleFormBtn = document.getElementById('toggle-add-form');
const closeFormBtn = document.getElementById('close-add-form');
const addProfileContainer = document.querySelector('.add-profile-container');

/**
 * ============================
 * FUNCIONES DE PAGINACIÓN
 * ============================
 */

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

/**
 * ============================
 * FUNCIONES DE RENDERIZADO
 * ============================
 */

function renderProfileCards(profilesToRender) {
    console.log('Renderizando tarjetas:', profilesToRender);
    
    if (renderTimeoutId) clearTimeout(renderTimeoutId);
    profilesContainer.innerHTML = '';
    loadingMessage.classList.remove('hidden');
    
    renderTimeoutId = setTimeout(() => {
        if (profilesToRender.length === 0) {
            console.log('No hay perfiles para mostrar');
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
            profilesToRender.forEach(profile => {
                console.log('Creando tarjeta para:', profile.name);
                const newCard = createProfileCard(profile);
                newCard.classList.add('profile-card--enter');
                profilesContainer.appendChild(newCard);
                setTimeout(() => {
                    newCard.classList.remove('profile-card--enter');
                }, 10);
            });
        }
        updateSelectedCount();
        loadingMessage.classList.add('hidden');
        renderTimeoutId = null;
    }, 100);
}

function highlightText(text, searchTerm) {
    if (!searchTerm || !text) {
        return text;
    }
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
}

function createProfileCard(profile) {
    const card = document.createElement('div');
    card.classList.add('profile-card');
    card.dataset.profileName = profile.name;

    if (selectedProfileIds.has(profile.name)) {
        card.classList.add('selected');
    }

    const searchTerm = searchInput.value.trim().toLowerCase();

    // Agregar contenido de la tarjeta
    card.innerHTML = `
        <button class="favorite-btn" title="Marcar como favorito">
            ${favoriteProfileIds.has(profile.name) ? '★' : '☆'}
        </button>
        <img class="profile-image" src="${profile.image}" alt="Foto de perfil de ${profile.name}">
        <h2 class="profile-name">${highlightText(profile.name, searchTerm)}</h2>
        <h3 class="profile-title">${highlightText(profile.title, searchTerm)}</h3>
        <p class="profile-bio">${highlightText(profile.bio, searchTerm)}</p>
        <div class="profile-social">
            ${profile.twitter ? `<a href="${profile.twitter}" target="_blank" rel="noopener noreferrer">Twitter</a>` : ''}
            ${profile.linkedin ? `<a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ''}
        </div>
        <button class="profile-button">Contactar</button>
        <button class="detail-profile-btn">Ver más</button>
        <div class="profile-actions">
            <button class="edit-profile-btn">Editar</button>
            <button class="delete-profile-btn">Eliminar</button>
        </div>
    `;

    // Eventos de la tarjeta
    setupCardEventListeners(card, profile);

    return card;
}

/**
 * ============================
 * FUNCIONES DE BÚSQUEDA Y FILTRADO
 * ============================
 */

function displayProfiles() {
    console.log('Ejecutando displayProfiles');
    console.log('Estado actual de profilesData:', profilesData);
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    let profilesToShow = [];

    // Filtrar favoritos si está activado
    let baseProfiles = profilesData;
    if (showFavoritesOnlyCheckbox && showFavoritesOnlyCheckbox.checked) {
        baseProfiles = profilesData.filter(p => favoriteProfileIds.has(p.name));
    }

    // Si hay término de búsqueda, filtrar perfiles
    if (searchTerm) {
        currentFilteredProfiles = baseProfiles.filter(profile => {
            const nameLower = profile.name.toLowerCase();
            const titleLower = profile.title.toLowerCase();
            const bioLower = profile.bio.toLowerCase();
            return nameLower.includes(searchTerm) || 
                   titleLower.includes(searchTerm) || 
                   bioLower.includes(searchTerm);
        });
    } else {
        currentFilteredProfiles = baseProfiles;
    }

    // Aplicar paginación
    const startIndex = (currentPage - 1) * profilesPerPage;
    const endIndex = startIndex + profilesPerPage;
    profilesToShow = currentFilteredProfiles.slice(startIndex, endIndex);

    console.log('Perfiles a mostrar:', profilesToShow);
    console.log('Página actual:', currentPage);
    console.log('Perfiles por página:', profilesPerPage);
    
    renderProfileCards(profilesToShow);
    updateProfilesCount();
    updatePaginationVisibility(true);
}

function updateProfilesCount() {
    const countDiv = document.getElementById('profiles-count');
    countDiv.textContent = `Total de perfiles: ${profilesData.length}`;
}

function handleSearch() {
    currentPage = 1;
    displayProfiles();
}

function updatePaginationVisibility(paginated) {
    const paginationContainer = document.querySelector('.pagination-container');
    const pageNumbers = document.getElementById('page-numbers');
    const searchTerm = searchInput.value.trim();

    if (paginationContainer) {
        paginationContainer.style.display = '';
        
        // Mostrar/ocultar números de página según si hay búsqueda
        if (pageNumbers) {
            pageNumbers.style.display = searchTerm ? '' : 'none';
        }

        // Actualizar botones según si hay búsqueda o no
        if (searchTerm) {
            renderPageNumberButtons(currentFilteredProfiles);
            updatePaginationUI(currentFilteredProfiles);
        } else {
            // Solo actualizar estado de botones anterior/siguiente
            const totalPages = getTotalPages(profilesData);
            prevPageButton.disabled = currentPage === 1;
            nextPageButton.disabled = currentPage === totalPages;
        }
    }
}

function updateGlobalActionsVisibility() {
    const globalActionsContainer = document.getElementById('global-profile-actions');
    if (globalActionsContainer) {
        if (selectedProfileIds.size > 0) {
            globalActionsContainer.classList.remove('hidden');
        } else {
            globalActionsContainer.classList.add('hidden');
        }
    }
}

/**
 * ============================
 * FUNCIONES DE UTILIDAD Y LOCALSTORAGE
 * ============================
 */

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
    updateGlobalActionsVisibility();
}

function cleanSelectedProfiles() {
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
        importFileInput.value = '';
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
            <img src="${profile.image}" alt="Foto de perfil de ${profile.name}" 
                 style="width:150px;height:150px;border-radius:50%;margin-bottom:20px;border:3px solid var(--color-primary);">
            <h2 style="font-size:24px;margin-bottom:10px;color:var(--color-text);">${profile.name}</h2>
            <h3 style="font-size:18px;margin-bottom:15px;color:var(--color-profile-title);">${profile.title}</h3>
            <p style="margin:20px 0;line-height:1.6;color:var(--color-profile-bio);">${profile.bio}</p>
            <div style="margin-top:20px;">
                ${profile.twitter ? 
                    `<a href="${profile.twitter}" target="_blank" rel="noopener noreferrer" 
                        style="margin:0 10px;color:var(--color-primary);text-decoration:none;">
                        <i class="fab fa-twitter"></i> Twitter
                    </a>` : ''}
                ${profile.linkedin ? 
                    `<a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer" 
                        style="margin:0 10px;color:var(--color-primary);text-decoration:none;">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </a>` : ''}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

document.getElementById('close-detail-modal').addEventListener('click', () => {
    document.getElementById('profile-detail-modal').classList.add('hidden');
});

if (addProfileForm) {
    addProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('new-name').value.trim();
        const title = document.getElementById('new-title').value.trim();
        const image = document.getElementById('new-image').value.trim();
        const bio = document.getElementById('new-bio').value.trim();
        const twitter = document.getElementById('new-twitter').value.trim();
        const linkedin = document.getElementById('new-linkedin').value.trim();

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

function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const msg = document.getElementById('confirm-modal-message');
    const yesBtn = document.getElementById('confirm-modal-yes');
    const noBtn = document.getElementById('confirm-modal-no');

    msg.textContent = message;
    modal.classList.remove('hidden');

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

searchIcon.addEventListener('click', () => {
    searchInput.classList.add('active');
    searchInput.focus();
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
    if (currentPage > 1) {
        currentPage--;
        displayProfiles();
    }
});

nextPageButton.addEventListener('click', () => {
    const totalPages = getTotalPages(currentFilteredProfiles);
    if (currentPage < totalPages) {
        currentPage++;
        displayProfiles();
    }
});

const themeToggleBtn = document.getElementById('theme-toggle');

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

applyTheme(getSavedTheme());

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

// Asegurarnos de que profilesPerPage se inicialice correctamente
document.addEventListener('DOMContentLoaded', () => {
    profilesPerPage = parseInt(profilesPerPageSelect.value) || 3;
    console.log('Inicializando profilesPerPage:', profilesPerPage);
    displayProfiles();
    updateGlobalActionsVisibility();
});

/**
 * ============================
 * FUNCIONES DE MANEJO DE TARJETAS
 * ============================
 */

function setupCardEventListeners(card, profile) {
    // Evento de selección de tarjeta
    card.addEventListener('click', (event) => {
        const clickedElement = event.target;
        // Evita seleccionar si se hace clic en un botón o enlace
        if (clickedElement.classList.contains('profile-button') || 
            clickedElement.closest('a') ||
            clickedElement.classList.contains('edit-profile-btn') ||
            clickedElement.classList.contains('delete-profile-btn') ||
            clickedElement.classList.contains('favorite-btn') ||
            clickedElement.classList.contains('detail-profile-btn')) {
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

    // Botón de contactar
    const contactBtn = card.querySelector('.profile-button');
    if (contactBtn) {
        let contactSent = false;
        contactBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            contactSent = !contactSent;
            if (contactSent) {
                contactBtn.textContent = "Contacto Enviado ✅";
                contactBtn.classList.add('sent');
            } else {
                contactBtn.textContent = "Contactar";
                contactBtn.classList.remove('sent');
            }
        });
    }

    // Botón Ver más
    const detailBtn = card.querySelector('.detail-profile-btn');
    if (detailBtn) {
        detailBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            showProfileDetailModal(profile);
        });
    }

    // Botón de favorito
    const favoriteBtn = card.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (favoriteProfileIds.has(profile.name)) {
                favoriteProfileIds.delete(profile.name);
                favoriteBtn.innerHTML = '☆';
                showToast(`${profile.name} eliminado de favoritos`, "info");
            } else {
                favoriteProfileIds.add(profile.name);
                favoriteBtn.innerHTML = '★';
                showToast(`${profile.name} agregado a favoritos`, "success");
            }
            saveFavoriteProfiles();
            if (showFavoritesOnlyCheckbox && showFavoritesOnlyCheckbox.checked) {
                currentPage = 1; // Resetear a la primera página
                displayProfiles();
            }
        });
    }

    // Botón de editar
    const editBtn = card.querySelector('.edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            addProfileContainer.classList.remove('hidden');
            document.getElementById('new-name').value = profile.name;
            document.getElementById('new-title').value = profile.title;
            document.getElementById('new-image').value = profile.image;
            document.getElementById('new-bio').value = profile.bio;
            document.getElementById('new-twitter').value = profile.twitter || '';
            document.getElementById('new-linkedin').value = profile.linkedin || '';
            
            const editingIndex = profilesData.findIndex(p => 
                p.name === profile.name && 
                p.title === profile.title && 
                p.bio === profile.bio
            );
            
            addProfileForm.dataset.editingIndex = editingIndex;
            addProfileForm.querySelector('button[type="submit"]').textContent = "Guardar cambios";
            
            // Scroll hacia el formulario
            addProfileContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Botón de eliminar
    const deleteBtn = card.querySelector('.delete-profile-btn');
    if (deleteBtn) {
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
                        favoriteProfileIds.delete(profile.name);
                        card.classList.add('profile-card--exit');
                        setTimeout(() => {
                            profilesData.splice(idx, 1);
                            saveProfilesToLocalStorage();
                            saveFavoriteProfiles();
                            showToast(`Perfil de ${profile.name} eliminado correctamente.`, "success");
                            currentPage = 1;
                            displayProfiles();
                            cleanSelectedProfiles();
                            cleanFavoriteProfiles();
                            updateSelectedCount();
                        }, 300);
                    }
                }
            });
        });
    }
}

// Función para mostrar/ocultar el formulario
function toggleAddProfileForm() {
    addProfileContainer.classList.toggle('hidden');
    if (!addProfileContainer.classList.contains('hidden')) {
        document.getElementById('new-name').focus();
    }
}

// Event listeners para el formulario
if (toggleFormBtn) {
    toggleFormBtn.addEventListener('click', toggleAddProfileForm);
}

if (closeFormBtn) {
    closeFormBtn.addEventListener('click', () => {
        addProfileContainer.classList.add('hidden');
        addProfileForm.reset();
        // Resetear el formulario al modo "agregar"
        if (addProfileForm.dataset.editingIndex) {
            delete addProfileForm.dataset.editingIndex;
            addProfileForm.querySelector('button[type="submit"]').textContent = "Agregar perfil";
        }
    });
}

// Agregar el evento de cambio para el checkbox de favoritos
if (showFavoritesOnlyCheckbox) {
    showFavoritesOnlyCheckbox.addEventListener('change', () => {
        currentPage = 1; // Resetear a la primera página cuando cambia el filtro
        displayProfiles();
    });
}

function cleanFavoriteProfiles() {
    const validNames = new Set(profilesData.map(p => p.name));
    for (const name of favoriteProfileIds) {
        if (!validNames.has(name)) {
            favoriteProfileIds.delete(name);
        }
    }
    saveFavoriteProfiles();
}
