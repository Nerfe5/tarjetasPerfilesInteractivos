const profilesData = [
    {
        name: "Juan Pérez",
        title: "Desarrollador FrontEnd Júnior",
        bio: "Apasionado por crear interfaces de usuario atractivas y responsivas. Constantemente aprendiendo nuevas tecnologías. Apasionado por crear interfaces de usuario atractivas y responsivas. Constantemente aprendiendo nuevas tecnologías.",
        image: "https://via.placeholder.com/120/007bff/FFFFFF?text=JP",
        twitter: "https://twitter.com/juanp",
        linkedin: "https://linkedin.com/in/juanperez"
    },
    {
        name: "Ana García",
        title: "Diseñadora UX/UI",
        bio: "Enfocada en la experiencia de usuario y el diseño intuitivo para aplicaciones web y móviles.",
        image: "https://via.placeholder.com/120/FF5733/FFFFFF?text=AG",
        twitter: "https://twitter.com/anag",
        linkedin: "https://linkedin.com/in/anagarcia"
    },
    {
        name: "Carlos Díaz",
        title: "Especialista en SEO",
        bio: "Ayudo a las empresas a mejorar su visibilidad online y a alcanzar a su público objetivo.",
        image: "https://via.placeholder.com/120/33FF57/FFFFFF?text=CD",
        twitter: "https://twitter.com/carlosd",
        linkedin: "https://linkedin.com/in/carlosdiaz"
    },
    {
        name: "Laura Martínez",
        title: "Desarrolladora FullStack",
        bio: "Experta en construir aplicaciones robustas tanto en el frontend como en el backend. Siempre en busca de nuevos retos.",
        image: "https://via.placeholder.com/120/FFC107/FFFFFF?text=LM",
        twitter: "https://twitter.com/lauram",
        linkedin: "https://linkedin.com/in/lauramartinez"
    },
    {
        name: "Pedro Sánchez",
        title: "Analista de Datos",
        bio: "Transformo datos complejos en información valiosa para la toma de decisiones empresariales.",
        image: "https://via.placeholder.com/120/17A2B8/FFFFFF?text=PS",
        twitter: "https://twitter.com/pedros",
        linkedin: "https://linkedin.com/in/pedrosanchez"
    }
    ,
    {
        name: "Ana Pérez",
        title: "Desarrolladora Front-end",
        image: "https://via.placeholder.com/100/FFC0CB/000?Text=AP",
        bio: "Apasionada desarrolladora front-end con experiencia en React y Vue.js. Siempre aprendiendo nuevas tecnologías.",
        twitter: "https://twitter.com/anaperezdev",
        linkedin: "https://linkedin.com/in/anaperezdev"
    },
    {
        name: "Carlos López",
        title: "Ingeniero de Software",
        image: "https://via.placeholder.com/100/ADD8E6/000?Text=CL",
        bio: "Ingeniero de software con enfoque en el desarrollo back-end y la arquitectura de sistemas. Experto en Java y Python.",
        linkedin: "https://linkedin.com/in/carloslopezing",
    },
    {
        name: "Sofía Gómez",
        title: "Diseñadora UX/UI",
        image: "https://via.placeholder.com/100/90EE90/000?Text=SG",
        bio: "Diseñadora UX/UI con un fuerte sentido estético y enfoque en la experiencia del usuario. Figma y Adobe XD.",
        twitter: "https://twitter.com/sofiagomezux",
        linkedin: "https://linkedin.com/in/sofiagomezdesign"
    },
    {
        name: "Javier Vargas",
        title: "Científico de Datos",
        image: "https://via.placeholder.com/100/FFA07A/000?Text=JV",
        bio: "Científico de datos con experiencia en análisis estadístico, machine learning y visualización de datos. Python y R.",
        linkedin: "https://linkedin.com/in/javierdatascience"
    },
    {
        name: "Elena Ruiz",
        title: "Gerente de Proyectos",
        image: "https://via.placeholder.com/100/DDA0DD/000?Text=ER",
        bio: "Gerente de proyectos con habilidades en liderazgo de equipos y metodologías ágiles. Certificada en PMP.",
        linkedin: "https://linkedin.com/in/elenaruizprojectmanager"
    },
    // --- Nuevos perfiles ---
    {
        name: "Martín Flores",
        title: "Desarrollador Full-Stack",
        image: "https://via.placeholder.com/100/87CEEB/000?Text=MF",
        bio: "Desarrollador full-stack con experiencia en MERN stack. Amante del código limpio y las soluciones eficientes.",
        twitter: "https://twitter.com/martinflowdev",
        linkedin: "https://linkedin.com/in/martinfloresfullstack"
    },
    {
        name: "Isabel Castro",
        title: "Especialista en Marketing Digital",
        image: "https://via.placeholder.com/100/F08080/000?Text=IC",
        bio: "Especialista en marketing digital con enfoque en SEO, SEM y redes sociales. Creativa y orientada a resultados.",
        linkedin: "https://linkedin.com/in/isabelcastromarketing"
    },
    {
        name: "Gabriel Soto",
        title: "Analista de Sistemas",
        image: "https://via.placeholder.com/100/FAF0E6/000?Text=GS",
        bio: "Analista de sistemas con experiencia en la optimización de procesos y la implementación de soluciones tecnológicas.",
        linkedin: "https://linkedin.com/in/gabrielsotoanalyst"
    },
    {
        name: "Luisa Vargas",
        title: "Desarrolladora de iOS",
        image: "https://via.placeholder.com/100/E0FFFF/000?Text=LV",
        bio: "Desarrolladora de iOS apasionada por la creación de aplicaciones móviles intuitivas y de alto rendimiento. Swift y SwiftUI.",
        twitter: "https://twitter.com/luisavargasios",
        linkedin: "https://linkedin.com/in/luisavargasiodev"
    },
    {
        name: "Andrés Ríos",
        title: "Especialista en Ciberseguridad",
        image: "https://via.placeholder.com/100/B0E0E6/000?Text=AR",
        bio: "Especialista en ciberseguridad con experiencia en la protección de sistemas y la respuesta a incidentes.",
        linkedin: "https://linkedin.com/in/andresriosciberseguridad"
    },
    {
        name: "Daniel Castro",
        title: "Diseñador Gráfico",
        image: "https://via.placeholder.com/100/ADFF2F/000?Text=DC",
        bio: "Diseñador gráfico con un enfoque en la identidad visual, branding y diseño editorial. Adobe Illustrator y Photoshop.",
        linkedin: "https://linkedin.com/in/danielcastrodesign"
    },
    {
        name: "Valeria Guzmán",
        title: "Desarrolladora de Android",
        image: "https://via.placeholder.com/100/FFD700/000?Text=VG",
        bio: "Desarrolladora de Android con experiencia en Kotlin y Java para la creación de aplicaciones móviles robustas.",
        linkedin: "https://linkedin.com/in/valeriaguzmanandroid"
    }

];


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

// Asegúrate de que este listener NO exista si lo habías puesto antes aquí
// profilesContainer.addEventListener('click', (event) => { ... });

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
nextPageButton.addEventListener('click', goToNextPage);