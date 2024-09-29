// Get the dialog and buttons
const dialog = document.getElementById('myDialog');
const openDialogButton = document.getElementById('open-dialog');
const closeDialogButton = document.getElementById('close-dialog');

// Open the dialog when the button is clicked
openDialogButton.addEventListener('click', () => {
    dialog.showModal(); // Use showModal() to open the dialog
});

// Close the dialog when the close button is clicked
closeDialogButton.addEventListener('click', () => {
    dialog.close(); // Use close() to close the dialog
});
