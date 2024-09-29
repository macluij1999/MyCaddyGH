function deleteClub(){
    const clubKey = getQueryParameter('club');
    const clubData = localStorage.getItem(clubKey);
    
    if (clubData) {
        localStorage.removeItem(clubKey);
        window.location.href = 'Mybag.html';
    }
    else {
        console.error("No club data found for the specified club.");
    }
}