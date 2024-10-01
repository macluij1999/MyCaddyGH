// Function to increment the hole number and update the image
function showNextHoleDelfland() {
    const myImage = document.getElementById('myImage');
    const nextHoleButton = document.querySelector('.nextHoleButton');

    // Extract current hole number from the image source using regex
    let currentHole = parseInt(myImage.src.match(/hole(\d+)/)[1]); 
    
    if (currentHole < 9) {
        currentHole++; // Increment the hole number

        // Update the image source and alt text with the new hole number
        myImage.src = `Courses/Delfland-par3/hole${currentHole}.png`;
        myImage.alt = `Delfland par 3 hole ${currentHole}`;

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
            nextHoleButton.removeEventListener('click', showNextHoleDelfland);
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
            showNextHoleDelfland(); // Call the function to show the next hole
            showHoleDelflandButtonUpdate();
        }
        // If it's "End Game", allow the default behavior to follow the link
    });
});

// Function to increment the hole number and update the image
function showPreviousHoleDelfland() {
    const myImage = document.getElementById('myImage');
    const previousHoleButton = document.querySelector('.previousHoleButton');

    // Extract current hole number from the image source using regex
    let currentHole = parseInt(myImage.src.match(/hole(\d+)/)[1]); 
    
    if (currentHole > 1) {
        currentHole = currentHole - 1; // decrement the hole number

        // Update the image source and alt text with the new hole number
        myImage.src = `Courses/Delfland-par3/hole${currentHole}.png`;
        myImage.alt = `Delfland par 3 hole ${currentHole}`;

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
        if (currentHole === 1) {
            // Change button text to "End Game"
            previousHoleButton.textContent = 'End Game';

            // Update the link to go to Mybag.html
            previousHoleButton.setAttribute('href', 'Mybag.html');

            // Optionally, disable further hole updates
            previousHoleButton.removeEventListener('click', showPreviousHoleDelfland);
        }
    }
}

function showHoleDelflandButtonUpdate() {
    const myImage = document.getElementById('myImage');
    let currentHole = parseInt(myImage.src.match(/hole(\d+)/)[1]);

    const nextHoleButton = document.querySelector('.nextHoleButton');
    const previousHoleButton = document.querySelector('.previousHoleButton');

    if (currentHole > 1  ){
        previousHoleButton.textContent = 'Previous hole';
        previousHoleButton.setAttribute('href', "#");
        previousHoleButton.removeEventListener('click' , showPreviousHoleDelfland)
    }
    if (currentHole < 9){
        nextHoleButton.textContent = 'Next hole';
        nextHoleButton.setAttribute('href', '#');
        nextHoleButton.removeEventListener('click', showNextHoleDelfland);
    }
}

// Event listener for the previous Hole button
document.addEventListener('DOMContentLoaded', function() {
    const previousHoleButton = document.querySelector('.previousHoleButton');

    previousHoleButton.addEventListener('click', function(event) {
        const isEndGame = previousHoleButton.textContent === 'End Game';

        if (!isEndGame) {
            event.preventDefault(); // Prevent default only if it's not the last hole
            showPreviousHoleDelfland(); // Call the function to show the previous hole
            showHoleDelflandButtonUpdate();
        }
        // If it's "End Game", allow the default behavior to follow the link
    });
});
