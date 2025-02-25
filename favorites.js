// Function to Display Liked Recipes
function displayLikedRecipes() {
    const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes')) || {}; // Get liked recipes from local storage
    const favoritesContainer = document.getElementById('favorites-page-container'); // Container of the favorites
    favoritesContainer.innerHTML = ''; // Clearing previous content

    // Check if there are liked recipes
    const recipeIds = Object.keys(likedRecipes); // Get the recipe IDs from the object
    if (recipeIds.length === 0) {
        favoritesContainer.innerHTML = '<p>No saved recipes! GO and DIVE thhrough some!</p>'; // Show message if no favorites
        return;
    } else {
        // Loop through each liked recipe ID and create a card for it
        recipeIds.forEach(id => {
            const recipe = likedRecipes[id]; // Get the recipe object using its ID
            const recipeCard = createRecipeCard(recipe); // Create recipe card
            favoritesContainer.appendChild(recipeCard); // Append card to the container
        });
    }
}

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
    seeMoreBtn.classList.add('cta-button'); // Assign class for styling
    seeMoreBtn.textContent = 'See More'; // Set button text
    seeMoreBtn.addEventListener('click', () => showDetailedCard(recipe)); // Show detailed card on click

    // Create like button for the recipe
    const likeBtn = document.createElement('button');
    likeBtn.classList.add('like-button', 'cta-button'); // Assign classes for styling
    likeBtn.dataset.recipeId = recipe.idMeal; // Set data attribute for recipe ID
    likeBtn.innerHTML = isLiked(recipe.idMeal) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'; // Set heart icon based on like status
    likeBtn.addEventListener('click', () => toggleLike(recipe)); // Toggle like on button click

    // Append all elements to the card
    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(seeMoreBtn);
    card.appendChild(likeBtn);

    return card; // Return the created card
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

    const instructions = document.createElement('p'); // Create a paragraph for instructions
    instructions.textContent = recipe.strInstructions.substring(0, 200) + '...'; // Show a portion of instructions

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
    details.appendChild(title);
    details.appendChild(instructions);
    details.appendChild(youtubeButton);
    details.appendChild(closeBtn);

    // Append image and details to the detailed card
    detailedCard.appendChild(image);
    detailedCard.appendChild(details);

    overlay.appendChild(detailedCard); // Append detailed card to overlay
    document.body.appendChild(overlay); // Append overlay to the document body
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

// Load the liked recipes on page load
document.addEventListener('DOMContentLoaded', displayLikedRecipes);

document.addEventListener("DOMContentLoaded", function () {
    // Get references to HTML elements
    const recipeSelect = document.getElementById("cook-it-with-me-recipe-select"); // Dropdown for selecting a recipe
    const stepText = document.getElementById("cook-it-with-me-step-text"); // Text area for displaying the current step
    const progressBar = document.getElementById("cook-it-with-me-progress-bar"); // Progress bar for tracking completion
    const startButton = document.getElementById("cook-it-with-me-start-button"); // Button to start cooking
    const nextButton = document.getElementById("cook-it-with-me-next-button"); // Button to go to the next step
    const finishMessage = document.getElementById("cook-it-with-me-finish-message"); // Message shown when the recipe is done
    const randomRecipeButton = document.getElementById("cook-it-with-me-random-button"); // Button to pick a random recipe

    let selectedRecipeSteps = []; // Array to hold the steps of the selected recipe
    let currentStep = 0; // Index to track the current step

    // Load saved recipes into the dropdown
    function loadSavedRecipes() {
        // Retrieve liked recipes from local storage or initialize as an empty object
        const likedRecipes = JSON.parse(localStorage.getItem("likedRecipes")) || {};
        
        // Clear existing options in the dropdown and add default option
        recipeSelect.innerHTML = '<option value="">Select a Recipe</option>';
        
        // Iterate over the liked recipes object and add options to the dropdown
        Object.values(likedRecipes).forEach(recipe => {
            const option = document.createElement("option"); // Create a new option element
            option.value = recipe.idMeal; // Set the value to the recipe ID
            option.textContent = recipe.strMeal; // Set the displayed text to the recipe name
            recipeSelect.appendChild(option); // Add the option to the dropdown
        });
    }

    // Handle recipe selection from the dropdown
    recipeSelect.addEventListener("change", function () {
        // Retrieve liked recipes from local storage
        const likedRecipes = JSON.parse(localStorage.getItem("likedRecipes")) || {};
        const selectedRecipe = likedRecipes[recipeSelect.value]; // Find the selected recipe by its ID

        // Check if the selected recipe exists and has instructions
        if (selectedRecipe && selectedRecipe.strInstructions) {
            // Split instructions into an array of steps
            selectedRecipeSteps = selectedRecipe.strInstructions.split(". ").filter(step => step.trim() !== "");
            stepText.textContent = "Click 'Start Cooking' to begin!"; // Prompt user to start cooking
            startButton.disabled = false; // Enable the start button
        } else {
            selectedRecipeSteps = []; // Reset steps if no valid recipe is selected
            stepText.textContent = "No instructions available for this recipe."; // Notify user of the absence of instructions
            startButton.disabled = true; // Disable the start button
        }
    });

    // Pick a random recipe from favorites
    randomRecipeButton.addEventListener("click", function () {
        // Retrieve liked recipes from local storage
        const likedRecipes = JSON.parse(localStorage.getItem("likedRecipes")) || {};
        const recipeKeys = Object.keys(likedRecipes); // Get an array of recipe IDs
        
        // Check if there are any favorite recipes
        if (recipeKeys.length > 0) {
            // Select a random key from the array of recipe IDs
            const randomKey = recipeKeys[Math.floor(Math.random() * recipeKeys.length)];
            const selectedRecipe = likedRecipes[randomKey]; // Get the random recipe using the selected key

            // Load the selected random recipe steps
            selectedRecipeSteps = selectedRecipe.strInstructions.split(". ").filter(step => step.trim() !== "");
            stepText.textContent = `Random Recipe: ${selectedRecipe.strMeal}. Click 'Start Cooking' to begin!`; // Notify user of the selected random recipe
            startButton.disabled = false; // Enable the start button
        } else {
            stepText.textContent = "No favorite recipes found."; // Notify user if no recipes are available
            startButton.disabled = true; // Disable the start button
        }
    });

    // Start Cooking - Initialize Steps
    startButton.addEventListener("click", function () {
        if (selectedRecipeSteps.length === 0) return; // Exit if there are no steps

        currentStep = 0; // Reset the current step to the first step
        stepText.textContent = selectedRecipeSteps[currentStep]; // Display the first step
        progressBar.style.width = "0%"; // Reset progress bar to 0%
        startButton.style.display = "none"; // Hide the start button
        nextButton.style.display = "inline-block"; // Show the next step button
        finishMessage.style.display = "none"; // Hide finish message
    });

    // Next Step Functionality
    nextButton.addEventListener("click", function () {
        currentStep++; // Move to the next step

        // Check if there are more steps to display
        if (currentStep < selectedRecipeSteps.length) {
            stepText.textContent = selectedRecipeSteps[currentStep]; // Update the step text
            progressBar.style.width = ((currentStep / (selectedRecipeSteps.length - 1)) * 100) + "%"; // Update progress bar
        } else {
            // End of Recipe
            stepText.textContent = "You're done!"; // Notify user that they've finished
            nextButton.style.display = "none"; // Hide the next button
            finishMessage.style.display = "block"; // Show the finish message
            progressBar.style.width = "100%"; // Fill the progress bar to 100%
        }
    });

    // Load recipes on page load
    loadSavedRecipes(); // Call the function to populate the dropdown
});
