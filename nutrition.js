// Event listener for 'more-info' links
document.querySelectorAll('.more-info').forEach(card => {
    card.addEventListener('click', () => {
        window.open(card.href, '_blank'); // Open link in new tab
    });
});

// Nutrition Quiz Logic
const questions = [
    {
        question: "Which nutrient is the main source of energy?",
        answers: ["Proteins", "Fats", "Carbohydrates", "Vitamins"],
        correct: 2
    },
    {
        question: "How many grams of protein are recommended per kilogram of body weight for adults?",
        answers: ["0.8g", "1.2g", "1.6g", "2.0g"],
        correct: 0
    },
    {
        question: "Which vitamin is primarily obtained from sunlight?",
        answers: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
        correct: 3
    },
    {
        question: "What is the primary function of dietary fiber?",
        answers: ["Build muscle", "Aid digestion", "Provide energy", "Store vitamins"],
        correct: 1 // Index of the correct answer (0-based)
    },
    {
        question: "Which mineral is essential for bone health?",
        answers: ["Iron", "Calcium", "Magnesium", "Zinc"],
        correct: 1
    },
    {
        question: "What type of fat is considered the healthiest?",
        answers: ["Saturated fat", "Trans fat", "Monounsaturated fat", "Polyunsaturated fat"],
        correct: 2
    },
    {
        question: "Which vitamin is important for vision?",
        answers: ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin E"],
        correct: 0
    },
    {
        question: "What is the recommended daily intake of fruits and vegetables for adults?",
        answers: ["1-2 servings", "3-5 servings", "5-7 servings", "7-10 servings"],
        correct: 2
    },
    {
        question: "Which food is a good source of omega-3 fatty acids?",
        answers: ["Chicken", "Salmon", "Lentils", "Rice"],
        correct: 1
    },
    {
        question: "What is the primary function of carbohydrates in the body?",
        answers: ["Build muscles", "Provide energy", "Support immune function", "Regulate body temperature"],
        correct: 1
    }

];

let currentQuestionIndex = 0;
let score = 0;

document.getElementById('start-quiz').addEventListener('click', startQuiz);

// Function to start the quiz
function startQuiz() {
    document.getElementById('start-quiz').classList.add('hidden');
    document.getElementById('progress-container').classList.remove('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    currentQuestionIndex = 0;
    score = 0;
    updateProgressBar();
    showQuestion();
}

// Function to show the current question
function showQuestion() {
    const questionData = questions[currentQuestionIndex];
    document.getElementById('question').textContent = questionData.question;

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = ''; // Clear previous answers

    questionData.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('answer-button');
        button.addEventListener('click', () => selectAnswer(index));
        answersContainer.appendChild(button);
    });
}

// Function to handle answer selection
function selectAnswer(selectedIndex) {
    const questionData = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === questionData.correct;
    const answerButtons = document.querySelectorAll('.answer-button');

    // Highlight selected answer and correct answer
    answerButtons[selectedIndex].style.backgroundColor = isCorrect ? 'lightgreen' : 'lightcoral';
    answerButtons[questionData.correct].style.backgroundColor = 'lightgreen';

    // Update score if the answer is correct
    if (isCorrect) {
        score++;
    }

    // Move to the next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            updateProgressBar();
            showQuestion();
        } else {
            showResult();
        }
    }, 1000); // 1-second delay
}

// Function to update the progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

// Function to show the quiz result
function showResult() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('progress-container').classList.add('hidden');
    const quizResult = document.getElementById('quiz-result');
    quizResult.classList.remove('hidden');

    // Display the score
    quizResult.textContent = `You scored ${score} out of ${questions.length}.`;

    // Display a motivational quote or message
    const quotes = [
        "Great job! Keep learning about nutrition!",
        "Well done! Every step counts towards a healthier you!",
        "Fantastic! Your knowledge will help you make better choices!",
        "Awesome! Remember, knowledge is power!",
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quizResult.textContent += ` ${randomQuote}`;
}
document.getElementById('food-log-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const mealName = document.getElementById('meal-name').value.trim();
    const calories = parseInt(document.getElementById('calories-input').value) || 0;
    const proteins = parseInt(document.getElementById('proteins-input').value) || 0;
    const fats = parseInt(document.getElementById('fats-input').value) || 0;
    const carbs = parseInt(document.getElementById('carbs-input').value) || 0;

    // Check if mealName is not empty and not already in the list
    if (mealName === "") {
        alert("Please enter a meal name.");
        return; 
    }
    const existingMeals = Array.from(document.querySelectorAll('#meal-list li')).map(li => li.textContent.split(':')[0]);
    if (existingMeals.includes(mealName)) {
        alert("This meal has already been added.");
        return;
    }

    // Create and append the meal item
    const mealItem = document.createElement('li');
    mealItem.textContent = `${mealName}: ${calories} cal, ${proteins}g Protein, ${fats}g Fat, ${carbs}g Carbs`;
    document.getElementById('meal-list').appendChild(mealItem);

    // Update nutritional summary
    updateNutritionalSummary(calories, proteins, fats, carbs);
    
    // Clear input fields
    document.getElementById('food-log-form').reset();
});
 // Function to update nutritional summary
 let totalCalories = 0;
let totalProteins = 0;
let totalFats = 0;
let totalCarbs = 0;

function updateNutritionalSummary(calories, proteins, fats, carbs) {
    totalCalories += calories;
    totalProteins += proteins;
    totalFats += fats;
    totalCarbs += carbs;

    document.getElementById('total-calories').textContent = totalCalories;
    document.getElementById('total-proteins').textContent = totalProteins;
    document.getElementById('total-fats').textContent = totalFats;
    document.getElementById('total-carbs').textContent = totalCarbs;
}