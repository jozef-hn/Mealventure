document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("loading-spinner");

    // Simulate page load time (optional)
    setTimeout(() => {
        loader.classList.add("spinner-hidden"); // Apply fade-out effect
        setTimeout(() => {
            loader.style.display = "none"; // Remove loader after fade-out
        }, 500);
    }, 1000); // Adjust delay if needed
});

// Select the correct elements from the DOM
const searchForm = document.getElementById("search-form"); // Form for search input
const searchInput = document.getElementById("search-input"); // Input field for search
const resultContainer = document.getElementById("results-container"); // Container for displaying results
const recipeCard = document.getElementById("recipe-card"); // Card for displaying recipe details

// Event listener for the search form submission
searchForm.addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload on form submission

    let query = searchInput.value.trim(); // Get the trimmed search input value
    if (query.length === 0) {
        resultContainer.innerHTML = ""; // Clear results if the input is empty
        return;
    }

    try {
        // Fetch the meal data from TheMealDB API based on the search query
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`); 
        let data = await response.json(); // Parse the JSON response

        if (data.meals) {
            recipeCard.style.display = "block"; // Show the recipe card
            let meal = data.meals[0]; // Get the first meal from the results
            
            // Create an instructions list from the meal's instructions
            const instructionsList = meal.strInstructions.split(".").filter(step => step.trim()).map(step => `<li>${step.trim()}.</li>`).join("");

            // Display the meal details in the result container
            resultContainer.innerHTML = `
                <div class="details">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    
                    <div class="meal-details">
                        <h2>${meal.strMeal}</h2>
                        <p><strong>Category:</strong> ${meal.strCategory}</p><br>
                        <p><strong>Area:</strong> ${meal.strArea}</p>
                        <div>
                            <!-- Like Button -->
                            <button class="like-button cta-button" data-recipe-id="${meal.idMeal}">
                                ${isLiked(meal.idMeal) ? `<i class="fa-solid fa-heart"></i>` : `<i class="fa-regular fa-heart"></i>`}
                            </button>

                            <!-- YouTube Button -->
                            ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" class="cta-button">Watch Video</a>` : ''}
                    
                        </div>
                    </div>
                </div>
                <p class="instructions"><strong>Instructions:</strong></p>
                <ol>${instructionsList}</ol>
            `;

            // Add event listener to the like button
            const likeButton = document.querySelector('.like-button');
            likeButton.addEventListener('click', () => toggleLike(meal)); // Toggle like on button click
        } else {
            recipeCard.style.display = "block"; // Show recipe card
            resultContainer.innerHTML = "<p>No results found!</p>"; // Show no results message
            setTimeout(() => { recipeCard.style.display = "none" }, 5000); // Hide card after 5 seconds
        }
    } catch (error) {
        console.log("Error fetching the results:", error); // Log any errors encountered during fetch
    }
});

// Fetch a random recipe from TheMealDB API
async function fetchRandomRecipe() {
    const url = `https://www.themealdb.com/api/json/v1/1/random.php`; // API endpoint for random recipe

    try {
        const response = await fetch(url); // Fetch random recipe
        if (!response.ok) {
            throw new Error('Failed to fetch recipe'); // Throw error if response is not okay
        }
        const data = await response.json(); // Parse JSON response
        return data.meals[0]; // Return the random meal
    } catch (error) {
        console.error('Error fetching recipe:', error); // Log any errors encountered during fetch
        return null; // Return null in case of error
    }
}

// Handle Like Toggle
function toggleLike(recipe) {
    let likedRecipes = JSON.parse(localStorage.getItem('likedRecipes')) || {}; // Get liked recipes from local storage
    const recipeId = recipe.idMeal; // Get the recipe ID

    // Toggle the like status
    if (likedRecipes[recipeId]) {
        delete likedRecipes[recipeId]; // Unlike if already liked
    } else {
        likedRecipes[recipeId] = recipe; // Like the recipe
    }

    localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes)); // Update liked recipes in local storage
    updateLikeButtons(); // Update all like buttons
}

// Check if Recipe is Liked
function isLiked(recipeId) {
    const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes')) || {}; // Get liked recipes from local storage
    return likedRecipes.hasOwnProperty(recipeId); // Check if recipe is liked
}

// Update All Like Buttons
function updateLikeButtons() {
    // Update the like button appearance for all buttons
    document.querySelectorAll('.like-button').forEach(button => {
        const recipeId = button.dataset.recipeId; // Get the recipe ID from button data attribute
        button.innerHTML = isLiked(recipeId) ? 
            `<i class="fa-solid fa-heart"></i>` : 
            `<i class="fa-regular fa-heart"></i>`; // Set heart icon based on like status
    });
}

let currentRecipe = null; // Store the current recipe globally

// Function to display full instructions
function displayInstructions() {
    const instructionsElement = document.getElementById('recipe-instructions');
    const hideBtn = document.getElementById("hide-inst");
    const showBtn = document.getElementById("inst-btn");

    if (!currentRecipe || !currentRecipe.strInstructions) {
        instructionsElement.innerHTML = "<p>No instructions available.</p>";
        return;
    }

    // Convert full instructions into a list format
    const fullInstructions = currentRecipe.strInstructions.split(".")
        .filter(step => step.trim())
        .map(step => `<li>${step.trim()}.</li>`)
        .join("");

    // Replace with the full instructions
    instructionsElement.innerHTML = `<ol>${fullInstructions}</ol>`;

    // Show "See Less" button, hide "See More" button
    hideBtn.style.display = "inline-block";
    showBtn.style.display = "none";
}

// Function to hide full instructions and show a preview
function hideInstructions() {
    const instructionsElement = document.getElementById('recipe-instructions');
    const hideBtn = document.getElementById("hide-inst");
    const showBtn = document.getElementById("inst-btn");

    if (!currentRecipe || !currentRecipe.strInstructions) return;

    // Show a truncated version of the instructions (first 2 steps only)
    const shortInstructions = currentRecipe.strInstructions.split(".")
        .filter(step => step.trim())
        .slice(0, 2)
        .map(step => `<li>${step.trim()}.</li>`)
        .join("");

    instructionsElement.innerHTML = `<ol>${shortInstructions}</ol>`;

    // Show "See More" button, hide "See Less" button
    hideBtn.style.display = "none";
    showBtn.style.display = "inline-block";
}

// Function to display the recipe
function displayRecipe(recipe) {
    const recipeDetails = document.getElementById('recipe-details');

    if (!recipe) {
        recipeDetails.innerHTML = `<p>Failed to load recipe. Please try again later.</p>`;
        return;
    }

    currentRecipe = recipe; // Store the recipe globally

    // Destructure recipe details
    const { strMeal: title, strMealThumb: image, strCategory: category, strArea: area, strInstructions: instructions, strYoutube: youtube, idMeal } = recipe;

    // Create a preview of the instructions (first 2 steps)
    const shortInstructions = instructions.split(".").filter(step => step.trim()).slice(0, 2).map(step => `<li>${step.trim()}.</li>`).join("");

    // Display the daily recipe details
    recipeDetails.innerHTML = `
    <div class="daily-recipe-card">
        <img src="${image}" alt="${title}">
        <div class="daily-recipe-details">
            <h3>${title}</h3>
            <p>Category: ${category}</p>
            <p>Area: ${area}</p>
        </div>
        <ol id="recipe-instructions">${shortInstructions}</ol>
        <a type="button" id="inst-btn" style="cursor: pointer;">See More</a>
        <a type="button" id="hide-inst" style="display: none; cursor: pointer;">See Less</a>
        ${youtube ? `<a href="${youtube}" target="_blank" class="cta-button">Watch Video</a>` : ''}
        <button class="like-button cta-button" data-recipe-id="${idMeal}">
            ${isLiked(idMeal) ? `<i class="fa-solid fa-heart"></i>` : `<i class="fa-regular fa-heart"></i>`}
        </button>
    </div>
    `;

    recipeDetails.style.display = "block";

    // Add event listener AFTER the button is rendered
    const likeButton = document.querySelector('.like-button');
    likeButton.addEventListener('click', () => toggleLike(recipe)); // Toggle like on button click

    // Add event listeners AFTER the buttons are rendered
    document.getElementById("inst-btn").addEventListener("click", displayInstructions);
    document.getElementById("hide-inst").addEventListener("click", hideInstructions);
}

// Check if the stored recipe is still valid
function isRecipeValid(savedRecipe) {
    if (!savedRecipe || !savedRecipe.timestamp) return false; // Return false if no saved recipe or timestamp is missing

    const now = new Date().getTime(); // Get current time
    const twentyFourHours = 24 * 60 * 60 * 1000; // Calculate milliseconds in 24 hours
    return now - savedRecipe.timestamp < twentyFourHours; // Check if recipe is within 24 hours old
}

// Load the daily recipe on page load
document.addEventListener('DOMContentLoaded', async () => {
    const savedRecipe = JSON.parse(localStorage.getItem('dailyRecipe')); // Get saved daily recipe from local storage

    if (isRecipeValid(savedRecipe)) {
        displayRecipe(savedRecipe.recipe); // Display the saved recipe if valid
    } else {
        const recipe = await fetchRandomRecipe(); // Fetch a random recipe if saved recipe is invalid
        if (recipe) {
            // Save the fetched recipe to local storage with a timestamp
            localStorage.setItem('dailyRecipe', JSON.stringify({
                recipe: recipe,
                timestamp: new Date().getTime()
            }));
            displayRecipe(recipe); // Display the fetched recipe
        } else {
            displayRecipe(null); // Display error message if no recipe fetched
        }
    }

    updateLikeButtons(); // Update like buttons
});

// Function to create a recipe card
function createRecipeCard(recipe) {
    const card = document.createElement('div'); // Create a card element
    card.className = 'featured-card'; // Assign class for styling

    const image = document.createElement('img'); // Create an image element
    image.src = recipe.strMealThumb; // Set image source to meal thumbnail
    image.alt = recipe.strMeal; // Set alt text for image

    const title = document.createElement('h3'); // Create a title element
    title.textContent = recipe.strMeal; // Set title text to meal name

    // Create button to see more details
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.classList = 'cta-button'; // Assign class for styling
    seeMoreBtn.textContent = 'See More'; // Set button text
    seeMoreBtn.addEventListener('click', () => showDetailedCard(recipe)); // Show detailed card on click

    // Create like button for the recipe
    const likeBtn = document.createElement('button');
    likeBtn.classList = 'like-button cta-button'; // Assign class for styling
    likeBtn.dataset.recipeId = recipe.idMeal; // Set data attribute for recipe ID
    likeBtn.innerHTML = isLiked(recipe.idMeal) ? `<i class="fa-solid fa-heart"></i>` : `<i class="fa-regular fa-heart"></i>`; // Set heart icon based on like status
    likeBtn.addEventListener('click', () => toggleLike(recipe)); // Toggle like on button click

    // Append all elements to the card
    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(seeMoreBtn);
    card.appendChild(likeBtn);

    return card; // Return the created card
}

// Function to fetch unique recipes
async function getUniqueRecipes(numRecipes) {
    const uniqueRecipes = new Map(); // Use Map to ensure uniqueness by meal name

    while (uniqueRecipes.size < numRecipes) { // Loop until we have the desired number of unique recipes
        try {
            const recipe = await fetchRandomRecipe(); // Fetch a random recipe
            if (!uniqueRecipes.has(recipe.strMeal)) { // Check if the meal name is already in the map
                uniqueRecipes.set(recipe.strMeal, recipe); // Add to map if unique
            }
        } catch (error) {
            console.error('Error fetching recipe:', error); // Log any errors encountered during fetch
        }
    }

    return Array.from(uniqueRecipes.values()); // Return the unique recipes as an array
}

// Display multiple random recipes
async function displayFeaturedRecipes(numRecipes) {
    const featuredSection = document.getElementById('featured'); // Get the featured section container
    featuredSection.innerHTML = ''; // Clear existing content

    const recipes = await getUniqueRecipes(numRecipes); // Fetch unique recipes
    recipes.forEach(recipe => {
        const card = createRecipeCard(recipe); // Create a recipe card for each recipe
        featuredSection.appendChild(card); // Append card to featured section
    });

    updateLikeButtons(); // Update like buttons
}
// Function to show the detailed card
function showDetailedCard(recipe) {
    const overlay = document.createElement('div'); // Create an overlay for the detailed card
    overlay.className = 'overlay'; // Assign class for styling

    const detailedCard = document.createElement('div'); // Create a detailed card element
    detailedCard.className = 'detailed-card'; // Assign class for styling

    const image = document.createElement('img'); // Create an image element for the detailed card
    image.src = recipe.strMealThumb; // Set image source to meal thumbnail
    image.alt = recipe.strMeal; // Set alt text for image

    const details = document.createElement('div'); // Create a details container
    details.className = 'details'; // Assign class for styling

    const title = document.createElement('h2'); // Create a title element
    title.textContent = recipe.strMeal; // Set title text to meal name

    // Create a scrollable container for the instructions
    const instructionsContainer = document.createElement('div');
    instructionsContainer.className = 'instructions-container'; // Apply our new scrollable class
    instructionsContainer.innerHTML = `<p>${recipe.strInstructions.replace(/\n/g, "<br>")}</p>`;

    // Create button to see the recipe video
    const youtubeButton = document.createElement('button');
    youtubeButton.className = 'cta-button'; // Assign class for styling
    youtubeButton.textContent = 'See Video'; // Set button text
    youtubeButton.addEventListener('click', () => {
        if (recipe.strYoutube) {
            window.open(recipe.strYoutube, '_blank'); // Open YouTube link in new tab if available
        } else {
            alert('No video available for this recipe.'); // Alert if no video is available
        }
    });

    // Create close button for the detailed card
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn'; // Assign class for styling
    closeBtn.textContent = 'X'; // Set button text
    closeBtn.addEventListener('click', () => {
        overlay.classList.add('fade-out'); // Add fade-out effect to overlay
        setTimeout(() => overlay.remove(), 300); // Remove overlay after animation
    });

    // Append all elements to the details container
    details.appendChild(closeBtn);
    details.appendChild(title);
    details.appendChild(instructionsContainer);
    details.appendChild(youtubeButton);

    // Append image and details to the detailed card
    detailedCard.appendChild(image);
    detailedCard.appendChild(details);

    overlay.appendChild(detailedCard); // Append detailed card to overlay
    document.body.appendChild(overlay); // Append overlay to the document body
}

// Display multiple random featured recipes on page load
displayFeaturedRecipes(10);
