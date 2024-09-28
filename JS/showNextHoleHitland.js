// Function to increment the hole number and update the image
function showNextHoleHitland() {
    const myImage = document.getElementById('myImage');
    const nextHoleButton = document.querySelector('.nextHoleButton');

    // Extract current hole number from the image source using regex
    let currentHole = parseInt(myImage.src.match(/hole(\d+)/)[1]); 
    
    if (currentHole < 9) {
        currentHole++; // Increment the hole number

        // Update the image source and alt text with the new hole number
        myImage.src = `Courses/Hitland-par3/hole${currentHole}.png`;
        myImage.alt = `Hitland par 3 hole ${currentHole}`;

        console.log(`Updated to hole ${currentHole}`);

        // Remove the previous event listener to avoid duplicates
        myImage.removeEventListener('click', window.findDistance);

        // Reapply the event listener for the updated image
        myImage.addEventListener('click', window.findDistance);

        // Reinitialize the findDistance function for the new hole
        if (typeof window.reinitializeFindDistance === 'function') {
            window.reinitializeFindDistance();
        } else {
            console.error("reinitializeFindDistance function is not defined");
        }

        // Check if it's the last hole (9th hole)
        if (currentHole === 9) {
            // Change button text to "End Game"
            nextHoleButton.textContent = 'End Game';

            // Update the link to go to Mybag.html
            nextHoleButton.setAttribute('href', 'Mybag.html');

            // Optionally, disable further hole updates
            nextHoleButton.removeEventListener('click', showNextHoleHitland);
        }
    }
}

// Event listener for the Next Hole button
document.addEventListener('DOMContentLoaded', function() {
    const nextHoleButton = document.querySelector('.nextHoleButton');

    nextHoleButton.addEventListener('click', function(event) {
        const isEndGame = nextHoleButton.textContent === 'End Game';

        if (!isEndGame) {
            event.preventDefault(); // Prevent default only if it's not the last hole
            showNextHoleHitland(); // Call the function to show the next hole
        }
        // If it's "End Game", allow the default behavior to follow the link
    });
});
