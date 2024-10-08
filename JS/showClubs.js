function showClubs() {
    // Zoek de div waar we de club informatie willen tonen
    const showClubsDiv = document.getElementById("showClubs");

    // Maak een array om alle clubs en hun keys op te slaan
    let clubsArray = [];

    // Loop door alle items in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); // Haal de sleutel van het item op

        // Controleer of de key begint met 'club' en of het JSON-parsebaar is
        if (key.startsWith("club")) {
            try {
                const club = JSON.parse(localStorage.getItem(key)); // Haal de club op
                if (club) {
                    // Voeg de club en zijn key toe aan de array
                    clubsArray.push({ clubData: club, key: key });
                }
            } catch (e) {
                console.error(`Error parsing club data for key: ${key}`, e);
            }
        }
    }

    if (clubsArray.length === 0) {
        showClubsDiv.innerHTML = `<p>Add clubs to your bag</p>`;
        return;  // Stop de functie hier als er geen clubs zijn
    }

    // Sorteer de clubs op basis van clubDistance (van groot naar klein)
    clubsArray.sort((a, b) => b.clubData.distance - a.clubData.distance);

    // Begin met een lege string om de clubs op te slaan
    let clubsHTML = "";

    // Loop door de gesorteerde array en maak de HTML voor elke club
    clubsArray.forEach((clubItem, index) => {
        const club = clubItem.clubData; // De club gegevens
        const clubKey = clubItem.key;   // De originele localStorage key (bijv. "club3")

        let clubHTML = 
           // <a href="editClub.html?club=${clubKey}" class="clubContent club${index + 1}">
               `
               <div id="open-dialog-${clubKey}" class="clubContent club${index + 1}">
                <div class="clubContentLeft">
                    <img src="icons/golfclub.svg" alt="golfclub"/>
                    <div class="clubInfo">
                        <h3 class="clubType">${club.type}</h3>
                        <p class="clubBrand">${club.brand}</p>
                    </div>
                </div>
                <div class="clubDistanceField">
                    <div id="clubDistance">${club.distance} meters</div>
                    <div class="editClubButton">
                        <img class="editClubButtonIcon" src="icons/Go-To.svg" alt="edit club icon"/>
                    </div>
                </div>
            </div>
        `;
        
        // Voeg de HTML van deze club toe aan de totale HTML
        clubsHTML += clubHTML;
    });

    // Voeg de gegenereerde HTML toe aan de div zonder de bestaande inhoud te overschrijven
    showClubsDiv.innerHTML += clubsHTML;
}
