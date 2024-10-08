//call game api to get the data      
let currentPage = 1;
let itemsPerPage = 20; 
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
        setupPagination(result); // Setup pagination buttons
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
function displayImages(data ,page = 1) {
    const card = document.getElementById('card-create');
    card.innerHTML = '';
        count =0;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        paginatedData.forEach(game => {
            console.log(game);
            if(count <20){
                const body = createCard(game.title, game.short_description ,game.thumbnail, game.id);
                card.appendChild(body);
                count++;
            }
    });
 
} 
function setupPagination(data) {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = ''; // Clear previous pagination buttons
    
    const maxPagesToShow = 5; // Max pages to show at a time
    const firstPage = 1;
    const lastPage = totalPages;

    // Create "Prev" button
    const prevButton = document.createElement('li');
    prevButton.classList.add('page-item');
    prevButton.innerHTML = `<a class="page-link" href="#">Prev</a>`;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayImages(data, currentPage);
            setupPagination(data);
        }
    });
    pagination.appendChild(prevButton);

    // Show first page always
    createPageButton(firstPage, data, pagination);

    // Handle pagination truncation (like showing "...")
    if (currentPage > maxPagesToShow) {
        const dots = document.createElement('li');
        dots.classList.add('page-item');
        dots.innerHTML = `<a class="page-link">...</a>`;
        pagination.appendChild(dots);
    }

    // Show range of pages around the current page
    const startPage = Math.max(2, currentPage - 2);  // Show up to 2 pages before the current
    const endPage = Math.min(totalPages - 1, currentPage + 2);  // Show up to 2 pages after the current

    for (let i = startPage; i <= endPage; i++) {
        createPageButton(i, data, pagination);
    }

    // Handle pagination truncation before the last page
    if (currentPage < totalPages - maxPagesToShow + 1) {
        const dots = document.createElement('li');
        dots.classList.add('page-item');
        dots.innerHTML = `<a class="page-link">...</a>`;
        pagination.appendChild(dots);
    }

    // Always show last page
    if (totalPages > 1) {
        createPageButton(lastPage, data, pagination);
    }

    // Create "Next" button
    const nextButton = document.createElement('li');
    nextButton.classList.add('page-item');
    nextButton.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayImages(data, currentPage);
            setupPagination(data);
        }
    });
    pagination.appendChild(nextButton);
}

function createPageButton(page, data, pagination) {
    const pageItem = document.createElement('li');
    pageItem.classList.add('page-item');
    
    // Add 'active' class if this is the current page
    if (page === currentPage) {
        pageItem.classList.add('active');
    }
    
    pageItem.innerHTML = `<a class="page-link" href="#">${page}</a>`;
    pageItem.addEventListener('click', () => {
        currentPage = page;
        displayImages(data, currentPage);
        setupPagination(data);
    });
    
    pagination.appendChild(pageItem);
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
displayImages(filteredGames, currentPage);
setupPagination(filteredGames); // Update pagination after filtering
}


function createCard(title, description, imageurl, id) {
    const col = document.createElement('div');
    col.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3');

    const cardLink = document.createElement('a');
    cardLink.href = `/detail/${id}`; // Dynamic URL for each card
    cardLink.classList.add('card-link', 'card');
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
    cardLink.appendChild(card);
    col.appendChild(cardLink);  
    return col;
}

