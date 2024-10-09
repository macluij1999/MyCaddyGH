function showScoreCards() {
    // Zoek de div waar we de scorecard informatie willen tonen
    const showScoreCardsDiv = document.getElementById("showScoreCard");

    // Maak een array om alle scorecard en hun keys op te slaan
    let scoreCardArray = [];

    // Loop door alle items in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); // Haal de sleutel van het item op

        // Controleer of de key begint met 'Scorecard' en of het JSON-parsebaar is
        if (key.startsWith("Scorecard")) {
            try {
                const scoreCard = JSON.parse(localStorage.getItem(key)); // Haal de scorecard op
                if (scoreCard) {
                    // Voeg de scorecard en zijn key toe aan de array
                    scoreCardArray.push({ scoreCardData: scoreCard, key: key });
                }
            } catch (e) {
                console.error(`Error parsing scorecard data for key: ${key}`, e);
            }
        }
    }

    if (scoreCardArray.length === 0) {
        showScoreCardsDiv.innerHTML = `<p>Play a round to see your scorecards</p>`;
        return;  // Stop de functie hier als er geen scorecards zijn
    }

    // Sorteren op het nummer in de key
    scoreCardArray.sort((a, b) => {
        const numA = parseInt(a.key.replace(/\D/g, ''), 10); // Verwijder niet-numerieke tekens en converteer naar een getal
        const numB = parseInt(b.key.replace(/\D/g, ''), 10);
        return numB - numA; // Sorteren in Aflopende volgorde
    });

    // Begin met een lege string om de scoreCards op te slaan
    let scoreCardsHTML = "";

    // Loop door de gesorteerde array en maak de HTML voor elke scoreCard
    scoreCardArray.forEach((scoreCardItem, index) => {
        const scoreCard = scoreCardItem.scoreCardData; // De scoreCard gegevens
        const scoreCardKey = scoreCardItem.key;   // De originele localStorage key (bijv. "scoreCard3")

        // Tel het aantal slagen over alle holes
        let totalStrokes = 0;

        // Loop door de holes en tel de slagen
        for (const hole in scoreCard.Holes) {
            const holeData = scoreCard.Holes[hole];
            for (const stroke in holeData) {
                totalStrokes += 1; // Tel elke slag op
            }
        }

        let scoreCardHTML = `
            <a href="scorecard.html?scoreCard=${scoreCardKey}"">
               <div class="scoreCardContent scoreCard${index + 1}">
                <div class="scoreCardContentLeft">
                        <h3 class="scoreCardCourse">${scoreCard.Title}</h3>
                        <h3 class="scoreCardRound">${scoreCard.Round}</h3>
                </div>
                <div class="scoreCardStrokesField">
                    <h3 id="scoreCardStrokes">${totalStrokes} strokes</h3>
                </div>
            </div>
        `;
        
        // Voeg de HTML van deze club toe aan de totale HTML
        scoreCardsHTML += scoreCardHTML;
    });

    // Voeg de gegenereerde HTML toe aan de div zonder de bestaande inhoud te overschrijven
    showScoreCardsDiv.innerHTML += scoreCardsHTML;
}
