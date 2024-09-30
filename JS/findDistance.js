document.addEventListener('DOMContentLoaded', function() {
    let startPoint = null; // Start point coordinates
    let endPoint = null;   // End point coordinates
    let realLifeDistance = 0; // To hold the real-life distance for the hole
    const messageDiv = document.getElementById('Message');
    const suggestedClubDiv = document.getElementById('suggestedClub');

    // Object to map image alt attributes to real-life distances
    const distanceMap = {
        "Delfland par 3 hole 1": { distance: 90, start: { x: 212, y: 551 }, end: { x: 172, y: 60 } },
        "Delfland par 3 hole 2": { distance: 136, start: { x: 27, y: 185 }, end: { x: 231, y: 40 } },
        "Delfland par 3 hole 3": { distance: 70, start: { x: 18, y: 26 }, end: { x: 196, y: 133 } },
        "Delfland par 3 hole 4": { distance: 105, start: { x: 268, y: 875 }, end: { x: 351, y: 158 } },
        "Delfland par 3 hole 5": { distance: 91, start: { x: 643, y: 20 }, end: { x: 166, y: 273 } },
        "Delfland par 3 hole 6": { distance: 138, start: { x: 833, y: 28 }, end: { x: 154, y: 357 } },
        "Delfland par 3 hole 7": { distance: 115, start: { x: 471, y: 49 }, end: { x: 161, y: 637 } },
        "Delfland par 3 hole 8": { distance: 108, start: { x: 425, y: 32 }, end: { x: 152, y: 594 } },
        "Delfland par 3 hole 9": { distance: 82, start: { x: 77, y: 453 }, end: { x: 296, y: 117 } }
    };

    // Function to set the real-life distance and points based on the image's alt attribute
    function setRealLifeDistance() {
        const imageAlt = document.getElementById('myImage').alt;
        const holeData = distanceMap[imageAlt];

        if (holeData) {
            realLifeDistance = holeData.distance; // Set the real-life distance
            startPoint = holeData.start; // Set the predefined start point
            endPoint = holeData.end;     // Set the predefined end point
            console.log(`Hole: ${imageAlt}, Start: x=${startPoint.x}, y=${startPoint.y}, End: x=${endPoint.x}, y=${endPoint.y}`);
        } else {
            realLifeDistance = 0; // Default to 0 if not found
            startPoint = null;
            endPoint = null;
            console.error('Hole data not found for', imageAlt);
        }

        // Suggest clubs based on the initial real-life distance
        suggestClub(realLifeDistance);
    }

    setRealLifeDistance(); // Initialize real-life distance and points for the first image

    function calculateDistance(pointA, pointB) {
        return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
    }

    function suggestClub(distance) {
        let closestUnderClub = null;
        let closestOverClub = null;
        let exactClub = null; // To hold a club that matches the exact distance
        let smallestUnderDifference = Infinity;
        let smallestOverDifference = Infinity;

        for (let i = 1; localStorage.getItem("club" + i) !== null; i++) {
            const club = JSON.parse(localStorage.getItem("club" + i));
            const clubDistance = parseFloat(club.distance);

            // Check for exact match
            if (clubDistance === distance) {
                exactClub = club.type + ' (' + club.distance + ')';
            }

            // Check for closest under the distance
            if (clubDistance < distance) {
                const underDifference = distance - clubDistance;
                if (underDifference < smallestUnderDifference) {
                    smallestUnderDifference = underDifference;
                    closestUnderClub = club.type + ' (' + club.distance + ')';
                }
            }

            // Check for closest over the distance
            if (clubDistance > distance) {
                const overDifference = clubDistance - distance;
                if (overDifference < smallestOverDifference) {
                    smallestOverDifference = overDifference;
                    closestOverClub = club.type + ' (' + club.distance + ')';
                }
            }
        }

        // Build suggestion message based on availability of clubs
        let suggestionMessage = '';

        if (exactClub) {
            // If there is an exact match, check which club (above or below) is closer
            let closestClub = null;

            // Determine which club is closer to the exact match
            if (closestUnderClub && closestOverClub) {
                const underDistance = Math.abs(distance - parseFloat(closestUnderClub.match(/\((\d+)\)/)[1]));
                const overDistance = Math.abs(distance - parseFloat(closestOverClub.match(/\((\d+)\)/)[1]));

                closestClub = (underDistance <= overDistance) ? closestUnderClub : closestOverClub;
            } else if (closestUnderClub) {
                closestClub = closestUnderClub;
            } else if (closestOverClub) {
                closestClub = closestOverClub;
            }

            // Construct the suggestion message
            suggestionMessage += `<text class="distanceHeaders">Suggest club: </text>${exactClub}`;
            if (closestClub) {
                suggestionMessage += ` or ${closestClub}`;
            }
        } else {
            // If there is no exact match, show the closest under and closest over
            if (closestUnderClub && closestOverClub) {
                suggestionMessage += `<text class="distanceHeaders">Suggest clubs: </text>${closestUnderClub} or ${closestOverClub}`;
            } else if (closestUnderClub) {
                suggestionMessage += `<text class="distanceHeaders">Suggest club: </text>${closestUnderClub}`;
            } else if (closestOverClub) {
                suggestionMessage += `<text class="distanceHeaders">Suggest club: </text>${closestOverClub}`;
            } else {
                suggestionMessage = 'No clubs available.';
            }
        }

        suggestedClubDiv.innerHTML = suggestionMessage;
    }

    function findDistance(event) {
        // Get the image element
        const image = document.getElementById('myImage');
        
        // Get the bounding box (position and size relative to the viewport)
        const rect = image.getBoundingClientRect();
        
        // Get the natural (intrinsic) size of the image (not its displayed size)
        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;
        
        // Get the clicked point coordinates relative to the image's natural size
        const clickedPoint = {
            x: (event.clientX - rect.left) * (naturalWidth / rect.width), // Normalize x to the natural image width
            y: (event.clientY - rect.top) * (naturalHeight / rect.height) // Normalize y to the natural image height
        };

        if (endPoint && startPoint) {
            // Calculate the distance between the clicked point and the predefined end point
            const pixelDistance = calculateDistance(clickedPoint, endPoint);
            const scaleFactor = realLifeDistance / calculateDistance(startPoint, endPoint); // Based on the predefined points
            const distanceInMeters = pixelDistance * scaleFactor;

            const pixelDistanceCovered = calculateDistance(clickedPoint, startPoint);
            const distanceInMetersCovered = pixelDistanceCovered * scaleFactor;

            // Log the clicked point and display the real-life distance
            console.log(`Clicked point x: ${clickedPoint.x.toFixed(2)} / y: ${clickedPoint.y.toFixed(2)}`);
            messageDiv.innerHTML = '<text class="distanceHeaders">Total distance: </text>' + realLifeDistance + ' meters <br>' + 
                                    '<text class="distanceHeaders">Distance left: </text>' + distanceInMeters.toFixed(2) + ' meters<br>' + 
                                    '<text class="distanceHeaders">Distance covered: </text>' + distanceInMetersCovered.toFixed(2) + ' meters';

            // Suggest the club based on the calculated distance
            suggestClub(distanceInMeters);
        } else {
            messageDiv.textContent = 'Start and end points are not set properly.';
        }
    }

    // Attach the click event listener to the image
    document.getElementById('myImage').addEventListener('click', findDistance);

    // Expose findDistance globally to be accessible in other scripts
    window.findDistance = findDistance;

    // Function to re-initialize the real-life distance and step for each new hole
    window.reinitializeFindDistance = function() {
        setRealLifeDistance(); // Update real-life distance and points for the new hole
        messageDiv.innerHTML = '<text class="distanceHeaders">Total distance: </text>' + realLifeDistance + ' meters <br>' + // Reset message
                                '<text class="distanceHeaders">Distance left: </text>' + realLifeDistance + ' meters <br>' +
                                '<text class="distanceHeaders">Distance covered: </text>Click where your ball landed'; 
        suggestClub(realLifeDistance);
    };

    window.onload = function() {
        setRealLifeDistance(); // Update real-life distance and points for the new hole
        messageDiv.innerHTML = '<text class="distanceHeaders">Total distance: </text>' + realLifeDistance + ' meters <br>' + // Reset message
                                '<text class="distanceHeaders">Distance left: </text>' + realLifeDistance + ' meters <br>' +
                                '<text class="distanceHeaders">Distance covered: </text>Click where your ball landed'; 
    };
});
