// Function to get URL parameters
function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to populate club data
function displayClubData() {
    const clubKey = getQueryParameter('club');
    const clubData = localStorage.getItem(clubKey);

    if (clubData) {
        const club = JSON.parse(clubData);
        const clubDiv = document.querySelector('.editClub');

        clubDiv.innerHTML = `
            <div><h3>Club Type:</h3><input value="${club.type}"></div>
            <div><h3>Club Brand:</h3><input value="${club.brand}"></div>
            <div><h3>Club Distance:</h3><input value="${club.distance}"></div>`
        ;
    } else {
        console.error("No club data found for the specified club.");
    }
}

// Function to edit club data
function editClub() {
    const clubKey = getQueryParameter('club');
    const clubData = localStorage.getItem(clubKey);

    if (clubData) {
        const club = JSON.parse(clubData);
        const clubDiv = document.querySelector('.editClub');
        const typeInput = clubDiv.querySelector('input[value="' + club.type + '"]');
        const brandInput = clubDiv.querySelector('input[value="' + club.brand + '"]');
        const distanceInput = clubDiv.querySelector('input[value="' + club.distance + '"]');

        // Update the club object with new values
        club.type = typeInput.value;
        club.brand = brandInput.value;
        club.distance = distanceInput.value;

        // Save the updated club data back to localStorage
        localStorage.setItem(clubKey, JSON.stringify(club));

        // Optionally, show a success message
        window.location.href = 'Mybag.html';
    } else {
        console.error("No club data found for the specified club.");
    }
}

// Call displayClubData when the window loads
window.onload = displayClubData;