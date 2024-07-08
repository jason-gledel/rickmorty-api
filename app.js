// Définition des URLs des API
const apiUrl = 'https://rickandmortyapi.com/api/character';
const episodesApiUrl = 'https://rickandmortyapi.com/api/episode';
const locationsApiUrl = 'https://rickandmortyapi.com/api/location';

// Sélection des éléments du DOM
const characterList = document.getElementById('characterList');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const noResultMessage = document.getElementById('noResultMessage');
const clearIcon = document.getElementById('clearIcon');
const mainCharactersContainer = document.getElementById('mainCharacters');
const charactersBtn = document.getElementById('charactersBtn');
const episodesBtn = document.getElementById('episodesBtn');
const locationsBtn = document.getElementById('locationsBtn');
const charactersBtnMobile = document.getElementById('charactersBtnMobile');
const episodesBtnMobile = document.getElementById('episodesBtnMobile');
const locationsBtnMobile = document.getElementById('locationsBtnMobile');

// Variables de stockage des données
let allCharacters = [];
let allEpisodes = [];
let allLocations = [];

// Personnages principaux
const mainCharacters = ['Rick Sanchez', 'Morty Smith', 'Summer Smith', 'Beth Smith', 'Jerry Smith'];

// Filtres pour la recherche
let filters = {
    searchQuery: '',
    mainCharacters: []
};

// Fonction pour récupérer tous les personnages depuis l'API
async function fetchAllCharacters() {
    let url = apiUrl;
    while (url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            allCharacters = allCharacters.concat(data.results);
            url = data.info.next; // URL de la page suivante
        } catch (error) {
            console.error('Erreur lors de la récupération des personnages :', error);
            url = null; // Arrêter la boucle en cas d'erreur
        }
    }
    displayCharacters(allCharacters);
    populateMainCharactersFilter();
}

// Fonction pour récupérer tous les épisodes depuis l'API
async function fetchAllEpisodes() {
    let url = episodesApiUrl;
    while (url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            allEpisodes = allEpisodes.concat(data.results);
            url = data.info.next;
        } catch (error) {
            console.error('Erreur lors de la récupération des épisodes :', error);
            url = null;
        }
    }
    displayEpisodes(allEpisodes);
}

// Fonction pour récupérer tous les lieux depuis l'API
async function fetchAllLocations() {
    let url = locationsApiUrl;
    while (url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            allLocations = allLocations.concat(data.results);
            url = data.info.next;
        } catch (error) {
            console.error('Erreur lors de la récupération des lieux :', error);
            url = null;
        }
    }
    displayLocations(allLocations);
}

// Fonction pour afficher les personnages
async function displayCharacters(characters) {
    // Réinitialiser la liste des personnages
    resetCharacterList();

    // Afficher les personnages
    characters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('character-card');
        const episodeUrl = character.episode[0];

        // Récupérer les détails du premier épisode
        fetchEpisodeName(episodeUrl).then(episodeName => {
            characterCard.innerHTML = `
                <div class="contentCharac">
                    <img src="${character.image}" alt="${character.name}">
                    <h3>${character.name}</h3>
                    <div class="flexCharac">
                        <div class="statusClass">
                            <p class="subtitleText">Status</p>
                            <p class="textCard">${character.status}</p>
                        </div>
                        <div class="statusClass">
                            <p class="subtitleText">Species</p>           
                            <p class="textCard">${character.species}</p>
                        </div>
                        <div class="statusClass">
                            <p class="subtitleText">Last Known Location</p>
                            <p class="textCard">${character.location.name}</p>
                        </div>
                        <div class="statusClass">
                            <p class="subtitleText">First Seen In</p>
                            <p class="textCard">${episodeName}</p>
                        </div>
                    </div>
                </div>
            `;
            characterList.appendChild(characterCard);
        });
    });
}

// Fonction pour afficher les épisodes
async function displayEpisodes(episodes) {
    // Réinitialiser la liste des personnages
    resetCharacterList();

    // Afficher les épisodes
    episodes.forEach(episode => {
        const episodeCard = document.createElement('div');
        episodeCard.classList.add('episode-card');

        episodeCard.innerHTML = `
            <div class="contentEpisode">
                <h3>${episode.name}</h3>
                <p><strong>Episode:</strong> ${episode.episode}</p>
                <p><strong>Air Date:</strong> ${episode.air_date}</p>
            </div>
        `;
        characterList.appendChild(episodeCard);
    });
}

// Fonction pour afficher les lieux
async function displayLocations(locations) {
    // Réinitialiser la liste des personnages
    resetCharacterList();

    // Afficher les lieux
    locations.forEach(location => {
        const locationCard = document.createElement('div');
        locationCard.classList.add('location-card');

        locationCard.innerHTML = `
            <div class="contentLocation">
                <h3>${location.name}</h3>
                <p><strong>Type:</strong> ${location.type}</p>
                <p><strong>Dimension:</strong> ${location.dimension}</p>
            </div>
        `;
        characterList.appendChild(locationCard);
    });
}

// Fonction pour réinitialiser la liste des personnages
function resetCharacterList() {
    characterList.innerHTML = ''; // Vider complètement la liste des personnages
    characterList.style.display = 'flex'; // Assurer que la liste des personnages est visible
    noResultMessage.style.display = 'none'; // Masquer le message d'aucun résultat si visible
}

// Fonction pour récupérer le nom de l'épisode depuis son URL
async function fetchEpisodeName(url) {
    try {
        const response = await fetch(url);
        const episodeData = await response.json();
        return episodeData.name;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'épisode :', error);
        return 'Inconnu';
    }
}

// Fonction pour peupler le filtre des personnages principaux
function populateMainCharactersFilter() {
    mainCharactersContainer.innerHTML = '';
    mainCharacters.forEach(character => {
        const characterOption = document.createElement('div');
        characterOption.innerHTML = `
            <label>
                <input type="checkbox" value="${character}" class="main-character-checkbox"> ${character}
            </label>
        `;
        mainCharactersContainer.appendChild(characterOption);
    });

    document.querySelectorAll('.main-character-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                filters.mainCharacters.push(this.value);
            } else {
                filters.mainCharacters = filters.mainCharacters.filter(item => item !== this.value);
            }
            filterAndDisplayCharacters();
        });
    });
}

// Fonction pour filtrer et afficher les personnages en fonction des filtres sélectionnés
function filterAndDisplayCharacters() {
    let filteredCharacters = allCharacters;

    if (filters.searchQuery) {
        filteredCharacters = filteredCharacters.filter(character =>
            character.name.toLowerCase().includes(filters.searchQuery)
        );
    }

    if (filters.mainCharacters.length > 0) {
        filteredCharacters = filteredCharacters.filter(character =>
            filters.mainCharacters.includes(character.name)
        );
    }

    if (filteredCharacters.length === 0) {
        noResultMessage.style.display = 'flex';
    } else {
        noResultMessage.style.display = 'none';
        displayCharacters(filteredCharacters);
    }
}

// Écouteur d'événement pour le formulaire de recherche
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page par défaut
    filters.searchQuery = searchInput.value.toLowerCase();
    resetCharacterList(); // Réinitialiser la liste des personnages
    filterAndDisplayCharacters();
});

// Écouteur d'événement pour l'icône de suppression
clearIcon.addEventListener('click', () => {
    searchInput.value = '';
    clearIcon.style.display = 'none';
    filters.searchQuery = '';
    resetCharacterList(); // Réinitialiser la liste des personnages
    filterAndDisplayCharacters();
});

// Afficher uniquement les personnages au chargement initial de la page
document.addEventListener('DOMContentLoaded', function () {
    fetchAllCharacters(); // Appeler la fonction pour récupérer tous les personnages au chargement de la page
});

// Écouteur d'événement pour le bouton "Personnages"
charactersBtn.addEventListener('click', () => {
    resetCharacterList(); // Réinitialiser la liste des personnages
    displayCharacters(allCharacters);
});

// Écouteur d'événement pour le bouton "Épisodes"
episodesBtn.addEventListener('click', () => {
    resetCharacterList(); // Réinitialiser la liste des personnages
    fetchAllEpisodes(); // Récupérer tous les épisodes si ce n'est pas encore fait
});

// Écouteur d'événement pour le bouton "Lieux"
locationsBtn.addEventListener('click', () => {
    resetCharacterList(); // Réinitialiser la liste des personnages
    fetchAllLocations(); // Récupérer tous les lieux si ce n'est pas encore fait
});
// Écouteur d'événement pour le bouton "Personnages"
charactersBtnMobile.addEventListener('click', () => {
    resetCharacterList(); // Réinitialiser la liste des personnages
    displayCharacters(allCharacters);
});

// Écouteur d'événement pour le bouton "Épisodes"
episodesBtnMobile.addEventListener('click', () => {
    resetCharacterList(); // Réinitialiser la liste des personnages
    fetchAllEpisodes(); // Récupérer tous les épisodes si ce n'est pas encore fait
});

// Écouteur d'événement pour le bouton "Lieux"
locationsBtnMobile.addEventListener('click', () => {
    resetCharacterList(); // Réinitialiser la liste des personnages
    fetchAllLocations(); // Récupérer tous les lieux si ce n'est pas encore fait
});






const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const body = document.querySelector("body");


hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    body.classList.toggle("noscroll");
}




const navLink = document.querySelectorAll(".nav-link");

navLink.forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    body.classList.remove("noscroll");
    hamburger.classList.remove("activeHam");
}

// Écouteur d'événement pour les boutons du menu
document.querySelectorAll('.nav-menu .nav-item button').forEach(button => {
    button.addEventListener('click', () => {
        // Fermer le menu burger et réinitialiser les icônes
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('noscroll');
    });
});
