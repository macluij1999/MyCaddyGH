//NOT USED ANYMORE, DELETE SOON
function deleteClub(){
    const clubKey = localStorage.getItem(clubId)
    const clubData = localStorage.getItem(clubKey);
    
    if (clubData) {
        localStorage.removeItem(clubKey);
        window.location.href = 'Mybag.html';
    }
    else {
        console.error("No club data found for the specified club.");
    }
}


// Get the dialog and buttons
const deleteClubDialog = document.getElementById('myDialogDeleteClub');
const openDeleteClubDialogButton = document.getElementById('open-dialog-delete-club');
const closeDeleteClubDialogButton = document.getElementById('close-dialog-delete-club');

// Open the dialog when the button is clicked
openDeleteClubDialogButton.addEventListener('click', () => {
    deleteClubDialog.showModal(); // Use showModal() to open the dialog
});

// Close the dialog when the close button is clicked
closeDeleteClubDialogButton.addEventListener('click', () => {
    deleteClubDialog.close();
    clearFields(); // Use close() to close the dialog
});

function closeDialog() {
    deleteClubDialog.close();
}
