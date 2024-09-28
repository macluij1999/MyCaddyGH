function showClubs() {
    // Zoek de div waar we de club informatie willen tonen
    const showClubsDiv = document.getElementById("showClubs");

    // Maak een array om alle clubs op te slaan
    let clubsArray = [];

    // Loop door alle clubs in localStorage
    let clubNumber = 1;
    while (localStorage.getItem("club" + clubNumber) !== null) {
        // Haal de club op uit localStorage
        const club = JSON.parse(localStorage.getItem("club" + clubNumber));

        // Voeg de club toe aan de array
        clubsArray.push(club);

        // Ga naar de volgende club
        clubNumber++;
    }

    if (clubsArray.length === 0) {
        showClubsDiv.innerHTML = `<p>Add clubs to your bag</p>`;
        return;  // Stop de functie hier
    }

    // Sorteer de clubs op basis van clubDistance (van groot naar klein)
    clubsArray.sort((a, b) => b.distance - a.distance);

    // Begin met een lege string om de clubs op te slaan
    let clubsHTML = "";

    // Loop door de gesorteerde array en maak de HTML voor elke club
    clubsArray.forEach((club) => {
        let clubHTML = `
            <a href="#" class="clubContent">
                <div class="clubContentLeft">
                    <img src="icons/golfclub.svg" alt="golfclub"/>
                    <div class="clubInfo">
                        <h3 class="clubType">${club.type}</h3>
                        <p class="clubBrand">${club.brand}</p>
                    </div>
                </div>
                <div class="clubDistanceField">
                    <div id="clubDistance">${club.distance}</div>
                </div>
            </a>
        `;
        
        // Voeg de HTML van deze club toe aan de totale HTML
        clubsHTML += clubHTML;
    });

    // Voeg de gegenereerde HTML toe aan de div zonder de bestaande inhoud te overschrijven
    showClubsDiv.innerHTML += clubsHTML;
}
