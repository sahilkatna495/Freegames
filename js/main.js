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
            if(count <20){
                const body = createCard(game.title, game.short_description ,game.thumbnail, game.id);
                card.appendChild(body);
                count++;
            }
    });
 
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
    const catArray = []; 
    filter.innerHTML = '';
    const allOption = document.createElement('option');
    allOption.value = ''; // Set value to empty string to represent 'All'
    allOption.text = 'All cat';
    filter.appendChild(allOption);

    data.forEach(game => {
        if (!genreMap[game.genre]) {
        // const option = document.createElement('option');
        // option.value = game.genre;
        // option.text = game.genre;
        // filter.appendChild(option);
        genreMap[game.genre] = true;
         catArray.push(game.genre);
         console.log(catArray);
        }
    });
    catArray.sort((a, b) => {
        return a.localeCompare(b);  // Correct sorting for strings
    });
    catArray.forEach((genre) => {
        const option = document.createElement('option');
        option.value = genre;  // Use 'genre' from the array
        option.text = genre;
        filter.appendChild(option);
    });
}

// function yearFilterOptions(data){
//     const yeardata =document.getElementById('release-year');
//     const genreYear = {}; 
//     yeardata.innerHTML='';
 
//     data.forEach(game => {
//         release_date =game.release_date;
//         let mydate = new Date(release_date);
//         let year_dsata = mydate.getFullYear(); 

//         if (!genreYear[year_dsata] && !isNaN(year_dsata)) {
//             const option = document.createElement('option');
//             option.value = year_dsata;
//             option.text = year_dsata;
//             yeardata.appendChild(option);
//             genreYear[year_dsata] = true;
//         }
//     });
// }
function yearFilterOptions(data) {
    const yeardata = document.getElementById('release-year');
    const genreYear = {}; 
    yeardata.innerHTML = '';
    const yearsArray = []; 
    // Add the default 'All' option
    const allOption = document.createElement('option');
    allOption.value = ''; // Set value to empty string to represent 'All'
    allOption.text = 'All';
    yeardata.appendChild(allOption);

    // Create the rest of the year options
    data.forEach(game => {
        release_date = game.release_date;
        let mydate = new Date(release_date);
        let year_dsata = mydate.getFullYear();

        if (!genreYear[year_dsata] && !isNaN(year_dsata)) {
            // const option = document.createElement('option');
            // option.value = year_dsata;
            // option.text = year_dsata;
            // yeardata.appendChild(option);
            // genreYear[year_dsata] = true;
            genreYear[year_dsata] = true; 
            yearsArray.push(year_dsata);
        }
    });
    yearsArray.sort((a, b) => b - a);

    // Append sorted years to the dropdown
    yearsArray.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yeardata.appendChild(option);
    });
}

// Function to update URL parameters based on current filters
function updateURLParams() {
    const urlParams = new URLSearchParams();
    
    // Get the values from the filter inputs
    const year = document.getElementById('release-year').value;
    const category = document.getElementById('category_filter').value;
    const platform = document.getElementById('platform').value;
    const sortBy = document.getElementById('sort-by').value;
    
    // Set the URL parameters if the values are not empty
    if (year) urlParams.set('year', year);
    if (category) urlParams.set('category', category);
    if (platform) urlParams.set('platform', platform);
    if (sortBy) urlParams.set('sort', sortBy);
    
    // Set the current page parameter
    urlParams.set('page', currentPage);
    
    // Update the URL without reloading the page
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState(null, '', newUrl);
}

// Function to apply filters and fetch data
function applyFilters() {
    updateURLParams(); // Update the URL parameters
    mydata(); // Fetch and display data based on the current filters
}

// Function to fetch data based on URL parameters


// Event listener for page load
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentPage = parseInt(urlParams.get('page')) || 1;

    // Set filter values based on URL parameters
    document.getElementById('release-year').value = urlParams.get('year') || '';
    document.getElementById('category_filter').value = urlParams.get('category') || '';
    document.getElementById('platform').value = urlParams.get('platform') || '';
    document.getElementById('sort-by').value = urlParams.get('sort') || '';

    mydata(); // Fetch and display data based on URL parameters
});

// Add event listeners to filter elements for changes
document.getElementById('release-year').addEventListener('change', applyFilters);
document.getElementById('category_filter').addEventListener('change', applyFilters);
document.getElementById('platform').addEventListener('change', applyFilters);
document.getElementById('sort-by').addEventListener('change', applyFilters);

// Example of handling page number change (assuming you have buttons or links for pagination)
document.querySelectorAll('.pagination-button').forEach(button => {
    button.addEventListener('click', (e) => {
        currentPage = parseInt(e.target.dataset.page);
        applyFilters(); // Update filters and fetch data based on the new page
    });
});




// Update the setupPagination function to keep pagination in sync with the URL
function setupPagination(data) {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = ''; // Clear previous pagination buttons

    const maxPagesToShow = 5;
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
            updateURLParams(); // Update URL with pagination change
        }
    });
    pagination.appendChild(prevButton);

    createPageButton(firstPage, data, pagination);

    if (currentPage > maxPagesToShow) {
        const dots = document.createElement('li');
        dots.classList.add('page-item');
        dots.innerHTML = `<a class="page-link">...</a>`;
        pagination.appendChild(dots);
    }

    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        createPageButton(i, data, pagination);
    }

    if (currentPage < totalPages - maxPagesToShow + 1) {
        const dots = document.createElement('li');
        dots.classList.add('page-item');
        dots.innerHTML = `<a class="page-link">...</a>`;
        pagination.appendChild(dots);
    }

    if (totalPages > 1) {
        createPageButton(lastPage, data, pagination);
    }

    const nextButton = document.createElement('li');
    nextButton.classList.add('page-item');
    nextButton.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayImages(data, currentPage);
            setupPagination(data);
            updateURLParams(); // Update URL with pagination change
        }
    });
    pagination.appendChild(nextButton);
}

// Read filters and pagination from URL on page load
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentPage = parseInt(urlParams.get('page')) || 1;

    document.getElementById('release-year').value = urlParams.get('year') || '';
    document.getElementById('category_filter').value = urlParams.get('category') || '';
    document.getElementById('platform').value = urlParams.get('platform') || '';
    document.getElementById('sort-by').value = urlParams.get('sort') || '';

    mydata(); // Fetch and display data
});


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
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentPage = parseInt(urlParams.get('page')) || 1;

    document.getElementById('release-year').value = urlParams.get('year') || '';
    document.getElementById('category_filter').value = urlParams.get('category') || '';
    document.getElementById('platform').value = urlParams.get('platform') || '';
    document.getElementById('sort-by').value = urlParams.get('sort') || '';

    mydata(); // Fetch and display data
});

