// editClubDialog.js

let currentClubId = ''; // To keep track of the club being edited or deleted

// Function to open the edit dialog and fill it with values from localStorage
function openEditClubDialog(clubId) {
    currentClubId = clubId; // Store the clubId globally to access during delete

    // Fetch the data from localStorage using the clubId
    const clubData = localStorage.getItem(clubId);

    if (clubData) {
        try {
            const club = JSON.parse(clubData);

            // Fill the input fields with the club data
            document.getElementById('clubTypeEdit').value = club.type || '';
            document.getElementById('clubBrandEdit').value = club.brand || '';
            document.getElementById('clubDistanceEdit').value = club.distance || '';
        } catch (error) {
            console.error('Error parsing club data from localStorage', error);
        }
    } else {
        console.warn('No data found in localStorage for:', clubId);
    }

    // Show the edit dialog in the middle of the screen
    document.getElementById('myDialogEditClub').showModal();
}

// Function to close the edit dialog
function closeEditClubDialog() {
    document.getElementById('myDialogEditClub').close();
}

// Function to open the delete confirmation dialog
function openDeleteClubDialog() {
    document.getElementById('myDialogDeleteClub').showModal();
}

// Function to close the delete confirmation dialog
function closeDeleteClubDialog() {
    document.getElementById('myDialogDeleteClub').close();
}

// Function to delete the club from localStorage
function deleteClub() {
    if (currentClubId) {
        // Remove the club from localStorage
        localStorage.removeItem(currentClubId);
        console.log(`Club with id ${currentClubId} deleted from localStorage`);

        // Close both dialogs
        //closeDeleteClubDialog();
        //closeEditClubDialog();
        window.location.href = 'Mybag.html';
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to divs that trigger the edit dialog
    document.querySelectorAll('div[id^="open-dialog-club"]').forEach(div => {
        div.addEventListener('click', function() {
            const clubId = this.id.replace('open-dialog-', ''); // Extract club# from the div id
            openEditClubDialog(clubId); // Open the edit dialog with corresponding club# data
        });
    });

    // Add event listener to close the edit dialog
    const closeEditDialogImg = document.getElementById('close-dialog-editclub');
    if (closeEditDialogImg) {
        closeEditDialogImg.addEventListener('click', closeEditClubDialog);
    }

    // Add event listener for the delete button in the edit dialog to open the delete confirmation dialog
    const deleteButton = document.getElementById('delete-club-btn'); // Assuming this is the delete button in your edit dialog
    if (deleteButton) {
        deleteButton.addEventListener('click', openDeleteClubDialog);
    }

    // Add event listener to close the delete confirmation dialog
    const closeDeleteButton = document.getElementById('close-dialog-delete-club');
    if (closeDeleteButton) {
        closeDeleteButton.addEventListener('click', closeDeleteClubDialog);
    }
});



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

function closeDeleteClubDialog() {
    deleteClubDialog.close();
}
