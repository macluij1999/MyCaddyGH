// scoreCardAddStroke.js
let scoreCardSet = 0; // Keep track of the scorecard count
let formattedCustomDate; // Declare it outside the function to make it accessible
let currentNotification; // Variable to keep track of the current notification

const addStrokeButton = document.getElementById('addStrokeButton');
const addPuttButton = document.getElementById('addPuttButton'); // New button for putts

addStrokeButton.addEventListener('click', function () {
    // Always recheck the image alt to ensure it might have changed
    const playingCourse = document.getElementById('myImage').alt;
    const playingCourseWords = playingCourse.split(' ');
    const scoreCardTitle = playingCourseWords.slice(0, 1).join(' '); // Use slice(0, 2) for two words
    const scoreCardRound = playingCourseWords.slice(1, 3).join(' ');
    const currentHole = playingCourseWords.slice(3).join(' '); // Get the current hole from image alt (e.g., 'hole1')

    const activeRoundLocal = localStorage.getItem('activeRound');
    const activeRoundCheck = JSON.parse(activeRoundLocal);


    // Check if a scorecard has already been created
    if (activeRoundLocal === null || activeRoundCheck.active != 'true') {
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
        const scoreCardKey = `Scorecard ${scoreCardSet}: ${scoreCard.Title} ${scoreCard.Round} (${scoreCard.Date})`;
        localStorage.setItem(scoreCardKey, JSON.stringify(scoreCard));

        const activeRound = {
            active: 'true',
            key: scoreCardKey,
            holeAlt: document.getElementById('myImage').alt,
            holeSrc: document.getElementById('myImage').src,
            holeUrl: window.location.href,
            redirect: 'false'
        }
        
        localStorage.setItem('activeRound', JSON.stringify(activeRound));
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

    const activeRoundLocal = localStorage.getItem('activeRound');
    const activeRoundCheck = JSON.parse(activeRoundLocal);


    // Determine the current scorecard key
    const scoreCardKey = activeRoundCheck.key;

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
            if (strokesInHole === 1 || scoreCardSet < 1) {
                // For the first stroke, use distanceCoveredInMeters
                strokeDistance = distanceCoveredInMeters.toFixed(2);
                scoreCardSet = 3;
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

        // Show the notification with the added stroke and distance
        if(strokeType !== 'putt'){
            showNotification(`Added stroke (${strokeDistance} meters)`);
        }
        if(strokeType === 'putt'){
            showNotification(`Added putt`);
        }
    } else {
        console.error('Scorecard not found in localStorage.');
    }
    updateActiveRound();
}

function updateActiveRound(){
    let scoreCard = localStorage.getItem('activeRound');
    let scoreCardParse = JSON.parse(scoreCard);
    scoreCardParse.holeAlt = document.getElementById('myImage').alt;
    scoreCardParse.holeSrc = document.getElementById('myImage').src;
    scoreCardParse.holeUrl = window.location.href;
    scoreCardParse.redirect = "false";
    localStorage.setItem('activeRound', JSON.stringify(scoreCardParse));
}


// Function to show a notification
function showNotification(message) {
    // Remove the previous notification if it exists
    if (currentNotification) {
        currentNotification.remove();
    }

    // Create a notification div
    currentNotification = document.createElement('div');
    currentNotification.innerText = message;
    currentNotification.style.width = 'fit-content';
    currentNotification.style.position = 'fixed';
    currentNotification.style.top = '40px';
    currentNotification.style.left = '50%';
    currentNotification.style.transform = 'translateX(-50%)';
    currentNotification.style.backgroundColor = 'var(--notify-green)';
    currentNotification.style.color = 'var(--white)';
    currentNotification.style.padding = '10px 20px';
    currentNotification.style.borderRadius = '5px';
    currentNotification.style.fontSize = '14px';
    currentNotification.style.zIndex = '1000';
    
    // Append the notification to the body
    document.body.appendChild(currentNotification);

    // Remove the notification after 5 seconds
    setTimeout(() => {
        currentNotification.remove();
        currentNotification = null; // Reset the current notification variable
    }, 5000);
}