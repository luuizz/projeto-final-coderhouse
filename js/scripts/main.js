// Scripts do slide principal

const slide_hero = new Swiper('.slide-hero', {
    effect: 'fade',
    pagination: {
      el: '.slide-hero .main-area .area-explore .swiper-pagination',
    },
});


const btnCloseModal = document.querySelector('.js-close-modal-details-pokemon');
btnCloseModal.addEventListener('click', closeDetailsPokemon);
const btnDropdownSelect = document.querySelector('.js-open-select-custom');
const countPokemons = document.getElementById('js-count-pokemons');

btnDropdownSelect.addEventListener('click', () => {
    btnDropdownSelect.parentElement.classList.toggle('active');
});

const areaPokemons = document.getElementById('js-list-pokemons');

function primeiraLetraMaiuscula(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createCardPokemon(code, type, nome, imagePoke) {
    let card = document.createElement('button');
    card.classList = `card-pokemon js-open-details-pokemon ${type}`;
    card.setAttribute('code-pokemon', code);
    areaPokemons.appendChild(card);

    let image = document.createElement('div');
    image.classList = 'image';
    card.appendChild(image);

    let imageSrc = document.createElement('img');
    imageSrc.className = 'thumb-img';
    imageSrc.setAttribute('src', imagePoke);
    image.appendChild(imageSrc);

    let infoCardPokemon = document.createElement('div');
    infoCardPokemon.classList = 'info';
    card.appendChild(infoCardPokemon);

    let infoTextPokemon = document.createElement('div');
    infoTextPokemon.classList = 'txt';
    infoCardPokemon.appendChild(infoTextPokemon);

    let codePokemon = document.createElement('span');
    codePokemon.textContent = (code < 10) ? `#00${code}` : (code < 100) ? `#0${code}` : `#0${code}`;
    infoTextPokemon.appendChild(codePokemon);

    let namePokemon = document.createElement('h3');
    namePokemon.textContent = primeiraLetraMaiuscula(nome);
    infoTextPokemon.appendChild(namePokemon);

    let areaIcon = document.createElement('div');
    areaIcon.classList = 'icon';
    infoCardPokemon.appendChild(areaIcon);

    let imgType = document.createElement('img');
    imgType.setAttribute('src', `assets/icon-types/${type}.svg`);
    areaIcon.appendChild(imgType);
}

function listingPokemons(urlApi) {
    axios({
        method: 'GET',
        url: urlApi,
    })
    .then((response) => {
        const countPokemons = document.getElementById('js-count-pokemons');
        const { results, next, count } = response.data;

        countPokemons.innerText = count;

        results.forEach(pokemon => {
            let urlApiDetails = pokemon.url;

            axios({
                method: 'GET',
                url: `${urlApiDetails}`
            })
            .then(response => {
                const { name, id, sprites, types } = response.data;

                const infoCard = {
                    nome: name,
                    code: id,
                    image: sprites.other.dream_world.front_default,
                    type: types[0].type.name
                }
                createCardPokemon(infoCard.code, infoCard.type, infoCard.nome, infoCard.image);

                const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');
                cardPokemon.forEach(card => {
                    card.addEventListener('click', openDetailsPokemon);
                })
            })
        })
    })
}

listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');

function openDetailsPokemon() {
    document.documentElement.classList.add('open-modal');

    let codePokemon = this.getAttribute('code-pokemon');
    let imagePokemon = this.querySelector('.thumb-img');
    let iconTypePokemon = this.querySelector('.info .icon img');
    let namePokemon = this.querySelector('.info h3').textContent;
    let codeStringPokemon = this.querySelector('.info span').textContent;



    const imgPokemonModal = document.getElementById('js-image-pokemon-modal');
    const modalDetails = document.getElementById('js-modal-details');
    imgPokemonModal.setAttribute('src', imagePokemon.getAttribute('src'));
    let iconTypePokemonModal = document.getElementById('js-image-type-modal');
    const namePokemonModal = document.getElementById('js-name-pokemon-modal');
    const codePokemonModal = document.getElementById('js-code-pokemon-modal');
    const heightPokemonModal = document.getElementById('js-height-pokemon');
    const WeightPokemonModal = document.getElementById('js-weight-pokemon');
    const mainAbilitiesPokemonModal = document.getElementById("js-main-abilities");

    

    modalDetails.setAttribute('type-pokemon-modal', this.classList[2]);
    iconTypePokemonModal.setAttribute('src', iconTypePokemon.getAttribute('src'));
    

    namePokemonModal.textContent = namePokemon;
    codePokemonModal.textContent = codeStringPokemon;

    axios({
        method: 'GET',
        url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`,
    }).then((response) => {
        let data = response.data;

        console.log(data);

        let infoPokemon = {
            mainAbilities: primeiraLetraMaiuscula(data.abilities[0].ability.name),
            types: data.types,
            weight: data.weight,
            height: data.height,
            abilities: data.abilities,
            stats: data.stats,
            urlType: data.types[0].type.url,
        };

        function listingTypesPokemon() {
            const areaTypesModal = document.getElementById('js-types-pokemon');

            areaTypesModal.innerHTML = "";


            let arrayTypes = infoPokemon.types;

            // console.log(areaTypesModal);

            arrayTypes.forEach((itemType) => {
                let itemList = document.createElement("li");
                areaTypesModal.appendChild(itemList);
        
                let spanList = document.createElement("span");
                spanList.classList = `tag-type ${itemType.type.name}`;
                spanList.textContent = primeiraLetraMaiuscula(itemType.type.name);
                itemList.appendChild(spanList);
            });
        }

        function listingWeakness() {
            const areaWeak = document.getElementById('js-area-weak');

            areaWeak.innerHTML = "";

            axios({
                method: 'GET',
                url: `${infoPokemon.urlType}`
            })
            .then(response => {
                let weaknessess = response.data.damage_relations.double_damage_from;

                weaknessess.forEach((itemType) => {
                    let itemListWeak = document.createElement("li");
                    areaWeak.appendChild(itemListWeak);
            
                    let spanList = document.createElement("span");
                    spanList.classList = `tag-type ${itemType.name}`;
                    spanList.textContent = primeiraLetraMaiuscula(itemType.name);
                    itemListWeak.appendChild(spanList);
            });
        })
    }

        heightPokemonModal.textContent = `${infoPokemon.height / 10}m`;
        WeightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`;
        mainAbilitiesPokemonModal.textContent = infoPokemon.mainAbilities;


        const statsHp = document.getElementById('js-stats-hp');
        const statsAttack = document.getElementById('js-stats-attack');
        const statsDefense = document.getElementById('js-stats-defense');
        const statsSpAttack = document.getElementById('js-stats-sp-attack');
        const statsSpDefense = document.getElementById('js-stats-sp-defense');
        const statsSpeed = document.getElementById('js-stats-speed');

        statsHp.style.width = `${infoPokemon.stats[0].base_stat > 100 ? 100 : infoPokemon.stats[0].base_stat}%`;
        statsAttack.style.width = `${infoPokemon.stats[1].base_stat > 100 ? 100 : infoPokemon.stats[1].base_stat}%`;
        statsDefense.style.width = `${infoPokemon.stats[2].base_stat > 100 ? 100 : infoPokemon.stats[2]}%`;
        statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat > 100 ? 100 : infoPokemon.stats[3].base_stat }%`;
        statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat > 100 ? 100: infoPokemon.stats[4].base_stat}%`;
        statsSpeed.style.width = `${infoPokemon.stats[5].base_stat > 100 ? 100: infoPokemon.stats[5].base_stat}%`;

        console.log(infoPokemon);

        listingTypesPokemon();
        listingWeakness();
    })
}

function closeDetailsPokemon() {
    document.documentElement.classList.remove('open-modal')
}



// Listar todos os tipos de pokemon

const areaTypes = document.getElementById('js-type-area');
const areaTypesMobile = document.querySelector('.dropdown-select');



axios({
    method: 'GET',
    url: 'https://pokeapi.co/api/v2/type'
})
.then(response => {
    const { results} = response.data;

    results.forEach((type, index) => {

        if(index < 18) {

        let itemType = document.createElement('li');
        areaTypes.appendChild(itemType);

        let buttonType = document.createElement('button');
        buttonType.classList = `typer-filter ${type.name}`;
        buttonType.setAttribute('code-type', index + 1);
        itemType.appendChild(buttonType);

        let iconType = document.createElement('div');
        iconType.classList = 'icon';
        buttonType.appendChild(iconType);

        let srcType = document.createElement('img');
        srcType.setAttribute('src', `assets/icon-types/${type.name}.svg`);
        iconType.appendChild(srcType);

        let nameType = document.createElement('span');
        nameType.textContent = primeiraLetraMaiuscula(type.name);
        buttonType.appendChild(nameType);

        // Drpdown Mobile

        let itemTypeMobile = document.createElement('li');
        areaTypesMobile.appendChild(itemTypeMobile);

        let buttonTypeSelect = document.createElement('button');
        buttonTypeSelect.classList = `typer-filter ${type.name}`;
        buttonTypeSelect.setAttribute('code-type', index + 1);
        itemTypeMobile.appendChild(buttonTypeSelect);

        let iconTypeSelect = document.createElement('div');
        iconTypeSelect.classList = 'icon';
        buttonTypeSelect.appendChild(iconTypeSelect);

        let srcTypeSelect = document.createElement('img');
        srcTypeSelect.setAttribute('src', `assets/icon-types/${type.name}.svg`);
        iconTypeSelect.appendChild(srcTypeSelect);

        let nameTypeMobile = document.createElement('span');
        nameTypeMobile.textContent = primeiraLetraMaiuscula(type.name);
        buttonTypeSelect.appendChild(nameTypeMobile);

        const allTypes = document.querySelectorAll('.typer-filter');

        allTypes.forEach(btn => {
            btn.addEventListener('click', filterByTypes);
        })
    }
    })
})

// Função Load more

const btnLoadMore = document.getElementById('js-btn-load-more')

let countPagination = 10;

function showMorePokemon() {
    listingPokemons(`https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`);

    countPagination = countPagination + 9;
}

btnLoadMore.addEventListener('click', showMorePokemon);

// Função ppara filtrar os pokemons por tipo

function filterByTypes() {
    let idPokemon = this.getAttribute('code-type');

    const areaPokemons = document.getElementById('js-list-pokemons');
    const btnLoadMore = document.getElementById('js-btn-load-more');
    const allTypes = document.querySelectorAll('.typer-filter');
    const countPokemonsType = document.getElementById('js-count-pokemons')

    areaPokemons.innerHTML = "";
    btnLoadMore.style.display = "none";

    const sectionPokemons = document.querySelector('.s-all-info-pokemons');
    const topSection = sectionPokemons.offsetTop;

    window.scrollTo({
        top: topSection + 288,
        behavior: 'smooth'
    })

    allTypes.forEach(type => {
        type.classList.remove('active');
    })

    this.classList.add('active');

    if(idPokemon) {
        axios({
            method: 'GET',
            url: `https://pokeapi.co/api/v2/type/${idPokemon}`
        })
        .then(response => {
    
            const { pokemon } = response.data;
            countPokemonsType.textContent = pokemon.length;
    
            pokemon.forEach(pok => {
    
                const { url } = pok.pokemon;
                
                axios({
                    method: 'GET',
                    url: `${url}`
                })
                .then(response => {
                    const { name, id, sprites, types } = response.data;
    
                    const infoCard = {
                        nome: name,
                        code: id,
                        image: sprites.other.dream_world.front_default,
                        type: types[0].type.name
                    }
                    if(infoCard.image) {
                        createCardPokemon(infoCard.code, infoCard.type, infoCard.nome, infoCard.image);
                    }
                    
    
                    const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');
                    cardPokemon.forEach(card => {
                        card.addEventListener('click', openDetailsPokemon);
                    })
                })
            })
        })
    } else {
        areaPokemons.innerHTML = "";
        listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');
        btnLoadMore.style.display = "block";
    }


}

// Função para buscar pokemon

const btnSearch = document.getElementById('js-btn-search');
const inputSearch = document.getElementById('js-input-search');

btnSearch.disabled = true;
btnSearch.addEventListener('click', searchPokemon);

inputSearch.addEventListener('keyup', (event) => {
    0 < inputSearch.value.length ? btnSearch.disabled = false : btnSearch.disabled = true,
    "Enter" === event.code && searchPokemon()
});

function searchPokemon() {
    let valueInput = inputSearch.value.toLowerCase();
    const typeFilter = document.querySelectorAll('.typer-filter');

    typeFilter.forEach(type => {
        type.classList.remove('active');
    })

    axios({
        method: 'GET',
        url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`
    })
    .then(response => {

        areaPokemons.innerHTML = "";
        btnLoadMore.style.display = "none";
        countPokemons.textContent = 1;

        const { name, id, sprites, types } = response.data;
    
        const infoCard = {
            nome: name,
            code: id,
            image: sprites.other.dream_world.front_default,
            type: types[0].type.name
        }
        if(infoCard.image) {
            createCardPokemon(infoCard.code, infoCard.type, infoCard.nome, infoCard.image);
        }
        

        const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');
        cardPokemon.forEach(card => {
            card.addEventListener('click', openDetailsPokemon);
        })

    })
    .catch((error) => {
        if(error.response) {
            areaPokemons.innerHTML = "";
            btnLoadMore.style.display = "none";
            countPokemons.textContent = 0;
            exibirMensagemDeErro();
        }
    })
}

function exibirMensagemDeErro() {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que não foram encontrados dados sobre o Pokémon pesquisado...',
        confirmButtonText: 'Tente novamente'
    });
}

const btnSweetAlert = document.getElementById('swal2-html-container');

console.log(btnSweetAlert);