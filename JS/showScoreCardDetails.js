// showScoreCardDetails.js

// Function to get URL parameters
function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to display scorecard data in the HTML using innerHTML
function displayScoreCardData() {
    const scoreCardKey = getQueryParameter('scoreCard');
    const scoreCardData = localStorage.getItem(scoreCardKey);

    if (scoreCardData) {
        const scoreCard = JSON.parse(scoreCardData);
        const holes = scoreCard.Holes; // Get the holes object
        const container = document.getElementById('scoreCardDetails'); // Get the container div

        // Build the main scorecard title HTML
        let scoreCardHTML = `
            <div class="scoreCard-TableHeader">
                <h2 class="scoreCardTitle">${scoreCard.Title} ${scoreCard.Round} ${scoreCard.Date}</h2>
            </div>
        `;

        // Iterate over each hole in the scorecard and build the HTML for each hole and strokes
        for (let hole in holes) {
            if (holes.hasOwnProperty(hole)) {
                let strokes = holes[hole];
                let totalStrokes = Object.keys(strokes).length;

                // Build the hole section HTML
                let holeHTML = `
                    <div class="scoreCardPlayedContent">
                        <div class="holeTitle">
                            <h2>${hole}</h2>
                            <div class="totalStrokes">Total strokes: ${totalStrokes}</div>
                        </div>
                `;

                // Iterate over each stroke and add stroke information to the hole HTML
                for (let stroke in strokes) {
                    if (strokes.hasOwnProperty(stroke)) {
                        let strokeData = strokes[stroke];
                        let distance = strokeData.distance ? `${strokeData.distance} meters` : 'putt';

                        holeHTML += `
                            <div class="strokeInfo">
                                <h3 class="strokeCount">${stroke}</h3>
                                <p class="strokeDistance">${distance}</p>
                            </div>
                        `;
                    }
                }

                // Close the hole's content div
                holeHTML += `</div>`;
                
                // Append the hole HTML to the overall scorecard HTML
                scoreCardHTML += holeHTML;
            }
        }

        // Set the innerHTML of the container to the generated scorecard HTML
        container.innerHTML = scoreCardHTML;
    } else {
        console.error('No scorecard data found in localStorage for the given key');
    }
}

function deleteScoreCard() {
    const scoreCardKey = getQueryParameter('scoreCard');
    const scoreCardData = localStorage.getItem(scoreCardKey);

    localStorage.removeItem(scoreCardKey);
    
    const resetActiveRound = {
        value: 'false',
        key: 'no active round'
    }
    localStorage.setItem('activeRound', JSON.stringify(resetActiveRound));

    window.location.href='myCards.html';

}

// Function to open the delete confirmation dialog
function openDeleteScoreCardDialog() {
    document.getElementById('myDialogDeleteScoreCard').showModal();
}

// Function to close the delete confirmation dialog
function closeDeleteScoreCardDialog() {
    document.getElementById('myDialogDeleteScoreCard').close();
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {


    // Add event listener to close the delete confirmation dialog
    const closeDeleteButton = document.getElementById('close-dialog-delete-scoreCard');
    if (closeDeleteButton) {
        closeDeleteButton.addEventListener('click', closeDeleteScoreCardDialog);
    }
});

// Call the function to display the scorecard when the page loads
window.onload = displayScoreCardData;
