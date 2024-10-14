document.addEventListener('DOMContentLoaded', function() {
    // Starting and end points (initially null)
    let startPoint = null;
    let middlePoint = null;
    let endPoint = null;
    let pointDistance = null;
    let realLifeDistance = 0; // To hold the real-life distance
    let step = 0; // To track state (0: start, 1: end, 2: calculate)
    const messageDiv = document.getElementById('Message');
    const suggestedClubDiv = document.getElementById('suggestedClub');

    let lastRedDot = null; // Variable to store the last created red dot

    // Object to map image alt attributes to real-life distances
    const distanceMap = {
        "Hitland eerste 9 hole 1": { distance: 300, distancePoint: 156, start: { x: 395, y: 513 }, middle: { x: 794 , y: 252}, end: { x: 1172, y: 533 } },
        "Hitland eerste 9 hole 2": { distance: 401, distancePoint: 100, start: { x: 349, y: 430 }, middle: { x: 1029 , y: 430}, end: { x: 1209, y: 382 } },
        "Hitland eerste 9 hole 3": { distance: 102, distancePoint: 155, start: { x: 43, y: 47 }, middle: { x: 0 , y: 100}, end: { x: 643, y: 98 } },
        "Hitland eerste 9 hole 4": { distance: 77, distancePoint: 156, start: { x: 290, y: 35 }, middle: { x: 0 , y: 100}, end: { x: 156, y: 426 } },
        "Hitland eerste 9 hole 5": { distance: 104, distancePoint: 156, start: { x: 696, y: 192 }, middle: { x: 0 , y: 100}, end: { x: 128, y: 130 } },
        "Hitland eerste 9 hole 6": { distance: 90, distancePoint: 156, start: { x: 52, y: 53 }, middle: { x: 0 , y: 100}, end: { x: 478, y: 157 } },
        "Hitland eerste 9 hole 7": { distance: 83, distancePoint: 156, start: { x: 578, y: 267 }, middle: { x: 0 , y: 100}, end: { x: 134, y: 132 } },
        "Hitland eerste 9 hole 8": { distance: 98, distancePoint: 156, start: { x: 125, y: 654 }, middle: { x: 0 , y: 100}, end: { x: 161, y: 122 } },
        "Hitland eerste 9 hole 9": { distance: 133, distancePoint: 156, start: { x: 83, y: 763 }, middle: { x: 0 , y: 100}, end: { x: 140, y: 131 } }
    };

    // Function to set the real-life distance and points based on the image's alt attribute
    function setRealLifeDistance() {
        const imageAlt = document.getElementById('myImage').alt;
        const holeData = distanceMap[imageAlt];

        if (holeData) {
            realLifeDistance = holeData.distance; // Set the real-life distance
            pointDistance = holeData.distancePoint; //Set the middle point distance
            startPoint = holeData.start; // Set the predefined start point
            middlePoint = holeData.middle; // Set the predefined middle point
            endPoint = holeData.end;     // Set the predefined end point
            console.log(`Hole: ${imageAlt}, Start: x=${startPoint.x}, y=${startPoint.y}, End: x=${endPoint.x}, y=${endPoint.y}`);
        } else {
            realLifeDistance = 0; // Default to 0 if not found
            pointDistance = 0;
            startPoint = null;
            middlePoint = null;
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

    function createRedDot(x, y) {
        if (lastRedDot) {
            lastRedDot.remove(); // Remove the previous dot
        }
    
        const dot = document.createElement('div');
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.backgroundColor = 'red';
        dot.style.borderRadius = '50%';
        dot.style.position = 'absolute';
        dot.style.left = `${x - 5}px`; // Centering the dot horizontally
        dot.style.top = `${y - 5}px`;  // Centering the dot vertically
        dot.style.pointerEvents = 'none'; // Prevent interference with clicks
    
        document.body.appendChild(dot);
        lastRedDot = dot; // Update the reference to the last dot
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

        if (endPoint && middlePoint) {
            // Calculate the distance between the clicked point and the predefined end point
            const pixelDistance = calculateDistance(clickedPoint, endPoint);
            const scaleFactor = pointDistance / calculateDistance(middlePoint, endPoint); // Based on the predefined points
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

            // Compensate for scrolling by using scrollX and scrollY
            const dotX = rect.left + (clickedPoint.x / naturalWidth) * rect.width + window.scrollX;
            const dotY = rect.top + (clickedPoint.y / naturalHeight) * rect.height + window.scrollY;
            createRedDot(dotX, dotY); // Place the red dot at the correct position

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
