async function fetchPokemonData() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1000');
    let data = await response.json();
    let pokemonUrls = data.results.map(function(pokemon) {
        return pokemon.url;
    });

    let detailedPokemonData = await Promise.all(pokemonUrls.map(async function(url) {
        let response = await fetch(url);
        return response.json();
    }));

    pokemonData = detailedPokemonData.map(function(pokemon) {
        return {
            name: pokemon.name,
            image: pokemon.sprites['front_default'],
            types: pokemon.types.map(function(type) {
                return type.type.name;
            }),
            abilities: pokemon.abilities.map(function(ability) {
                return ability.ability.name;
            }),
            stats: pokemon.stats.map(function(stat) {
                return `${stat.stat.name}: ${stat.base_stat}`;
            }),
            baseExperience: pokemon.base_experience,
            weight: pokemon.weight,
            height: pokemon.height,
            id: pokemon.id
        };
    });
}



async function fetchPokemon() {
    let randomID = Math.floor(Math.random() * 800) + 1;
    let randomPokemon = await fetchSinglePokemon(randomID);
    displayPokemon([randomPokemon]);
}

async function fetchSinglePokemon(id) {
    let Baseurl = "https://pokeapi.co/api/v2/pokemon/";
    let url = Baseurl + id;
    let response = await fetch(url);
    let data = await response.json();

    let types = [];
    for (let i = 0; i < data.types.length; i++) {
        types[i] = data.types[i].type.name;
    }

    let abilities = [];
    for (let i = 0; i < data.abilities.length; i++) {
        abilities[i] = data.abilities[i].ability.name;
    }

    let stats = [];
    for (let i = 0; i < data.stats.length; i++) {
        stats[i] = data.stats[i].stat.name + ': ' + data.stats[i].base_stat;

    }

    return {
        name: data.name,
        image: data.sprites.front_default,
        types: types,
        abilities: abilities,
        stats: stats,
        baseExperience: data.base_experience,
        weight: data.weight,
        height: data.height,
        id: data.id
    };
}


function displayPokemon(pokemon) {
    let pokemonHTMLString = '';


    pokemon.forEach(function(poke) {
        let typesString = poke.types.join(', ');
        let abilitiesString = poke.abilities.join(', ');
        let statsString = poke.stats.join(', ');

        pokemonHTMLString += `
            <ul class="card pokemon-type type-${typesString}">
                <img class="card-image" src="${poke.image}"/>
                <h2 class="card-name">${poke.id}. ${poke.name}</h2>
                <p class="card-info">Base Experience: ${poke.baseExperience}</p>
                <p>Type: ${typesString}</p>
                <p>Weight: ${poke.weight}kg</p>
                <p>Height: ${poke.height}m </p>
                <p class="card-info">Abilities: ${abilitiesString}</p>
                <p class="card-info">Stats: ${statsString}</p>
            </ul>`;
    });

    document.querySelector('#pokemonGenerated').innerHTML = pokemonHTMLString;
}


function handleSearchInput() {
    let searchInput = document.getElementById('searchInput');
    let searchQuery = searchInput.value.toLowerCase();
    

    let filteredPokemon = pokemonData.filter(function(pokemon) {
        return pokemon.name.toLowerCase().includes(searchQuery);
    });
    

    displayPokemon(filteredPokemon);
}


document.getElementById('generatePokemon').onclick = fetchPokemon;
document.getElementById('searchInput').oninput = handleSearchInput;


fetchPokemonData();
