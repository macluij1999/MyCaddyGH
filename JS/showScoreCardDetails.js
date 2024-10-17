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
        const holes = scoreCard.Holes; // Haal de holes object op

        const container = document.getElementById('scoreCardDetails'); // Haal de container div op

        // Bouw de hoofd scorecard titel HTML
        let scoreCardHTML = `
            <div class="scoreCard-TableHeader">
                <h2 class="scoreCardTitle">${scoreCard.Title} ${scoreCard.Round} ${scoreCard.Date}</h2>
            </div>
        `;

        // Haal de hole keys op en sorteer ze numeriek
        const sortedHoles = Object.keys(holes).sort((a, b) => {
            return parseInt(a.replace('hole ', '')) - parseInt(b.replace('hole ', ''));
        });

        // Itereer over elke gesorteerde hole en bouw de HTML voor elke hole en strokes
        sortedHoles.forEach(holeKey => {
            let strokes = holes[holeKey];
            let totalStrokes = Object.keys(strokes).length;

            // Bouw de hole sectie HTML
            let holeHTML = `
                <div class="scoreCardPlayedContent">
                    <div class="holeTitle">
                        <h2>${holeKey}</h2>
                        <div class="totalStrokes">Total strokes: ${totalStrokes}</div>
                    </div>
            `;

            // Itereer over elke stroke en voeg de stroke informatie toe aan de hole HTML
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

            // Sluit het hole's content div af
            holeHTML += `</div>`;

            // Voeg de hole HTML toe aan de totale scorecard HTML
            scoreCardHTML += holeHTML;
        });

        // Zet de innerHTML van de container naar de gegenereerde scorecard HTML
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
