//call game api to get the data       
async function mydata(){
    const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ddc77ba17dmsh9757b4165dd8a04p179b34jsndb3e9fbbea77',
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        perpage= 12;
       
        displayImages(result);
        yearFilterOptions(result);
        categoryFilterOptions(result);
        console.log(result);    
        document.getElementById('release-year').addEventListener('change', function() {
            applyFilters(result); 
        });
        document.getElementById('platform').addEventListener('change', function() {
            applyFilters(result); 
        });
        document.getElementById('sort-by').addEventListener('change', function() {
            applyFilters(result); 
        });
       
        document.getElementById('category_filter').addEventListener('change', function() {
            applyFilters(result); 
        });
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', function() {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredGames = result.filter(game => game.title.toLowerCase().includes(searchTerm));
            displayImages(filteredGames);
        });
    } catch (error) {
        console.error(error);
    }
}
mydata();

function displayImages(data) {
    const card = document.getElementById('card-create');
    card.innerHTML = '';
        count =0;
        data.forEach(game => {
            if(count <20){
                const body = createCard(game.title, game.short_description ,game.thumbnail, game.id);
                card.appendChild(body);
                count++;
            }
    });
 
} 

//create a gilter function in option value


function  categoryFilterOptions(data){
    const filter = document.getElementById('category_filter');
    const genreMap = {};  
    filter.innerHTML = ''; 
    data.forEach(game => {
        if (!genreMap[game.genre]) {
        const option = document.createElement('option');
        option.value = game.genre;
        option.text = game.genre;
        filter.appendChild(option);
        genreMap[game.genre] = true;
        }
    });
}

function yearFilterOptions(data){
    const yeardata =document.getElementById('release-year');
    const genreYear = {}; 
    yeardata.innerHTML='';
 
    data.forEach(game => {
        release_date =game.release_date;
        let mydate = new Date(release_date);
        let year_dsata = mydate.getFullYear(); 

        if (!genreYear[year_dsata] && !isNaN(year_dsata)) {
            const option = document.createElement('option');
            option.value = year_dsata;
            option.text = year_dsata;
            yeardata.appendChild(option);
            genreYear[year_dsata] = true;
        }
    });
}

function applyFilters(data) {
    const selectedYear = document.getElementById('release-year').value;
    const selectedCategory = document.getElementById('category_filter').value;
    const selectedPlatform = document.getElementById('platform').value;
    const selectedsortFilter = document.getElementById('sort-by').value;
    
    let filteredGames = data;
    if (selectedYear) {
        filteredGames = filteredGames.filter(game => {
            let releaseDate = new Date(game.release_date);  
            let releaseYear = releaseDate.getFullYear();
            return releaseYear == selectedYear;
        });
    }
    if (selectedCategory) {
        filteredGames = filteredGames.filter(game =>
            game.genre === selectedCategory); 
    }

    if (selectedPlatform === "pc") {
        filteredGames = filteredGames.filter(game => {
       
            let gameplatformpc = game.platform; 
            return gameplatformpc === "PC (Windows)"; 
        });
    }
    
    if (selectedPlatform === "browser") {
        filteredGames = filteredGames.filter(game => {
            let gameplatformpc = game.platform;  
            return gameplatformpc === "Web Browser"; 
        });
    }
    // Display the games that match both filters

    if (selectedsortFilter === "oldest") {
        console.log("this is new calue");
    // Sort games by their title alphabetically
    filteredGames = filteredGames.sort((a, b) => {
        let titleA = a.release_date; 
        let titleB = b.release_date;
        console.log(titleA);
        if (titleB < titleA) return -1;  
        if (titleB> titleA) return 1;  
        return 0;  
    });
}
if (selectedsortFilter === "newest") {

    // Sort games by their release date (newest first)
    filteredGames = filteredGames.sort((a, b) => {
        let dateA = new Date(a.release_date); 
        let dateB = new Date(b.release_date);
        console.log(`Comparing: ${dateA} and ${dateB}`);
        return dateB - dateA;  
    });
}

if (selectedsortFilter === "z-a") {
    // Sort games by their title alphabetically
    filteredGames = filteredGames.sort((a, b) => {
        let dateA = new Date(a.release_date); 
        let dateB = new Date(b.release_date);
        console.log(`Comparing: ${dateB} and ${dateA}`);
        return dateB - dateA;  
    });
}
if (selectedsortFilter === "a-z") {
    filteredGames = filteredGames.sort((a, b) => {
        let titleA = a.title.toLowerCase();
        let titleB = b.title.toLowerCase();
        if (titleB < titleA) return -1; 
        if (titleB > titleA) return 1;   
        return 0; 
    });
}
    displayImages(filteredGames);
}


function createCard(title, description, imageurl, id) {
    const col = document.createElement('div');
    col.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3');

    const anchor = document.createElement('a');
    anchor.href = `file:///C:/Users/FWS-22-4/drupal%20project/projects/Freegamesfront/Freegames/pages/detail.html?id=${id}&title=${encodeURIComponent(title)}&image=${encodeURIComponent(imageurl)}&description=${encodeURIComponent(description)}`;
        anchor.classList.add('card');  
    anchor.style.textDecoration = 'none';  

    const card = document.createElement('div');
    card.classList.add('card-body');

    const img = document.createElement('img');
    img.src = imageurl;
    img.classList.add('gallery-image', 'card-img-top');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = title;

    const cardDesc = document.createElement('p');
    cardDesc.classList.add('card-text');
    cardDesc.textContent = description;

    card.appendChild(img);
    card.appendChild(cardTitle);
    card.appendChild(cardDesc);
    anchor.appendChild(card);  
    col.appendChild(anchor);  

    return col;
}
