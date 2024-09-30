function addNewClub() {
    // Haal de waarden op van de invoervelden
    const clubType = document.getElementById("clubTypeInput").value;
    const clubBrand = document.getElementById("clubBrandInput").value;
    const clubDistance = document.getElementById("clubDistanceInput").value;

    // Controleer of de velden zijn ingevuld
    if (clubType === "" || clubBrand === "" || clubDistance === "") {
        alert("Vul alle velden in.");
        return;
    }

    // Bereken het volgende nummer voor de club
    let clubNumber = 1;
    while (localStorage.getItem("club" + clubNumber) !== null) {
        clubNumber++;
    }

    // Maak een object van de clubgegevens
    const club = {
        type: clubType,
        brand: clubBrand,
        distance: clubDistance
    };

    // Sla het object op in localStorage met de key "clubX"
    localStorage.setItem("club" + clubNumber, JSON.stringify(club));

    // Maak de velden leeg na het opslaan
    document.getElementById("clubTypeInput").value = "";
    document.getElementById("clubBrandInput").value = "";
    document.getElementById("clubDistanceInput").value = "";

    closeDialog();

    window.location = "Mybag.html";
}
