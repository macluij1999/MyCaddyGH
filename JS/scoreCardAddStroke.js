// scoreCardAddStroke.js
let scoreCardSet = 0; // Keep track of the scorecard count
let formattedCustomDate; // Declare it outside the function to make it accessible

const addStrokeButton = document.getElementById('addStrokeButton');
const addPuttButton = document.getElementById('addPuttButton'); // New button for putts

addStrokeButton.addEventListener('click', function () {
    // Always recheck the image alt to ensure it might have changed
    const playingCourse = document.getElementById('myImage').alt;
    const playingCourseWords = playingCourse.split(' ');
    const scoreCardTitle = playingCourseWords.slice(0, 1).join(' '); // Use slice(0, 2) for two words
    const scoreCardRound = playingCourseWords.slice(1, 3).join(' ');
    const currentHole = playingCourseWords.slice(3).join(' '); // Get the current hole from image alt (e.g., 'hole1')

    // Check if a scorecard has already been created
    if (scoreCardSet < 1) {
        console.log('Creating a new scorecard');
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');

        // Format date without seconds
        formattedCustomDate = `${day}-${month}-${year} ${hours}:${minutes}`; // Set formattedCustomDate here

        // Create the initial scorecard object
        const scoreCard = {
            Title: scoreCardTitle,
            Round: scoreCardRound,
            Date: formattedCustomDate,
            Holes: {} // Empty object to store holes
        };

        // Determine the next scorecard number based on existing scorecards in localStorage
        scoreCardSet = getScoreCardCount() + 1; // Get the count and increment by 1

        // Store the scorecard in localStorage with the new key format
        const scoreCardKey = `Scorecard ${scoreCardSet}: ${scoreCard.Title} ${scoreCard.Round} ${scoreCard.Date}`;
        localStorage.setItem(scoreCardKey, JSON.stringify(scoreCard));
    } else {
        console.log('Scorecard already created');
    }

    // Add the stroke to the current hole based on the image alt
    addStrokeToHole(currentHole, 'stroke'); // Specify type as 'stroke'
    
});

// Event listener for the addPuttButton
addPuttButton.addEventListener('click', function () {
    // Always recheck the image alt to ensure it might have changed
    const playingCourse = document.getElementById('myImage').alt;
    const playingCourseWords = playingCourse.split(' ');
    const currentHole = playingCourseWords.slice(3).join(' '); // Get the current hole from image alt (e.g., 'hole1')

    // Add the putt stroke to the current hole
    addStrokeToHole(currentHole, 'putt'); // Specify type as 'putt'
});

// Function to count existing scorecards in localStorage
function getScoreCardCount() {
    let count = 0;
    for (let key in localStorage) {
        if (key.startsWith('Scorecard')) {
            count++;
        }
    }
    return count;
}

// Function to add a stroke to a specific hole in the scorecard
function addStrokeToHole(holeName, strokeType) {
    const playingCourse = document.getElementById('myImage').alt;
    const playingCourseWords = playingCourse.split(' ');
    const scoreCardTitle = playingCourseWords.slice(0, 1).join(' ');
    const scoreCardRound = playingCourseWords.slice(1, 3).join(' ');

    // Determine the current scorecard key
    const scoreCardKey = `Scorecard ${scoreCardSet}: ${scoreCardTitle} ${scoreCardRound} ${formattedCustomDate}`;

    // Retrieve the scorecard from localStorage
    let scoreCard = localStorage.getItem(scoreCardKey);

    // External variables from other JS file
    const distanceCoveredInMeters = parseFloat(window.distanceInMetersCovered); // Get this from other JS file
    const currentDistanceInMeters = parseFloat(window.distanceInMeters); // Get current distance in meters from the other JS file

    // Parse the scorecard if it exists
    if (scoreCard) {
        scoreCard = JSON.parse(scoreCard);

        // Check if the hole already exists in the scorecard; if not, create it
        if (!scoreCard.Holes[holeName]) {
            console.log('Creating a new hole:', holeName);
            scoreCard.Holes[holeName] = {}; // Create new hole object
        } else {
            console.log('Hole already exists:', holeName);
        }

        // Calculate the stroke number (incremental)
        const strokesInHole = Object.keys(scoreCard.Holes[holeName]).length + 1;

        // Set distance for the current stroke
        let strokeDistance;

        if (strokeType === 'putt') {
            // For putts, set the distance to null or empty
            strokeDistance = null; // or use: strokeDistance = ''; if you prefer an empty string
        } else {
            // For strokes
            if (strokesInHole === 1) {
                // For the first stroke, use distanceCoveredInMeters
                strokeDistance = distanceCoveredInMeters.toFixed(2);
            } else {
                // For subsequent strokes, calculate distanceBetweenShots (assuming you have this value)
                strokeDistance = distanceBetweenShots; // Ensure this value is defined somewhere
            }
        }

        // Add or update the stroke in the specific hole
        scoreCard.Holes[holeName][`stroke ${strokesInHole}`] = {
            type: strokeType, // Set type based on the strokeType parameter
            distance: strokeDistance
        };

        // Save the updated scorecard back to localStorage
        localStorage.setItem(scoreCardKey, JSON.stringify(scoreCard));

        console.log('Updated Scorecard:', scoreCard);
    } else {
        console.error('Scorecard not found in localStorage.');
    }
}
