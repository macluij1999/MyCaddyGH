document.addEventListener('DOMContentLoaded', function() {
    let startPoint = null; // Start point coordinates
    let endPoint = null;   // End point coordinates
    let realLifeDistance = 0; // To hold the real-life distance for the hole
    const messageDiv = document.getElementById('Message');
    const suggestedClubDiv = document.getElementById('suggestedClub');

    // Updated distance map with real-life distance, start point, and end point for each hole
    const distanceMap = {
        "Hitland par 3 hole 1": { distance: 103, start: { x: 155, y: 20 }, end: { x: 103.27, y: 471.42 } },
        "Hitland par 3 hole 2": { distance: 62, start: { x: 57, y: 110 }, end: { x: 368, y: 131 } },
        "Hitland par 3 hole 3": { distance: 102, start: { x: 160, y: 30 }, end: { x: 220, y: 240 } },
        // Add more holes as needed
        "Hitland par 3 hole 4": { distance: 77, start: { x: 130, y: 60 }, end: { x: 190, y: 230 } },
        "Hitland par 3 hole 5": { distance: 104, start: { x: 165, y: 10 }, end: { x: 210, y: 240 } },
        "Hitland par 3 hole 6": { distance: 90, start: { x: 120, y: 50 }, end: { x: 200, y: 230 } },
        "Hitland par 3 hole 7": { distance: 83, start: { x: 150, y: 20 }, end: { x: 205, y: 215 } },
        "Hitland par 3 hole 8": { distance: 98, start: { x: 155, y: 30 }, end: { x: 200, y: 220 } },
        "Hitland par 3 hole 9": { distance: 133, start: { x: 170, y: 25 }, end: { x: 225, y: 255 } }
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
    }

    setRealLifeDistance(); // Initialize real-life distance and points for the first image

    function calculateDistance(pointA, pointB) {
        return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
    }

    function suggestClub(distance) {
        let closestClub = null;
        let closestDistance = Infinity;

        for (let i = 1; localStorage.getItem("club" + i) !== null; i++) {
            const club = JSON.parse(localStorage.getItem("club" + i));
            const clubDistance = parseFloat(club.distance);

            // Ensure the suggested club distance is not less than the calculated distance
            if (clubDistance >= distance && (clubDistance - distance < closestDistance)) {
                closestDistance = clubDistance - distance;
                closestClub = club.type + ' (' + club.distance + ')';
            }
        }

        if (closestClub) {
            suggestedClubDiv.textContent = 'Suggested club: ' + closestClub;
        } else {
            suggestedClubDiv.textContent = 'No clubs available.';
        }
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

            // Log the clicked point and display the real-life distance
            console.log(`Clicked point x: ${clickedPoint.x.toFixed(2)} / y: ${clickedPoint.y.toFixed(2)}`);
            messageDiv.textContent = 'Real-life distance to end point: ' + distanceInMeters.toFixed(2) + ' meters';
            
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
        messageDiv.textContent = 'Click on the image to find the distance to the predefined end point.'; // Reset message
    };
});
