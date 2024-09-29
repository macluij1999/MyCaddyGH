document.addEventListener('DOMContentLoaded', function() {
    // Starting and end points (initially null)
    let startPoint = null;
    let endPoint = null;
    let realLifeDistance = 0; // To hold the real-life distance
    let step = 0; // To track state (0: start, 1: end, 2: calculate)
    const messageDiv = document.getElementById('Message');
    const suggestedClubDiv = document.getElementById('suggestedClub');

    // Object to map image alt attributes to real-life distances
    const distanceMap = {
        "Hitland eerste 9 hole 1": 156,
        "Hitland eerste 9 hole 2": 246,
        "Hitland eerste 9 hole 3": 158,
        "Hitland eerste 9 hole 4": 148,
        "Hitland eerste 9 hole 5": 111,
        "Hitland eerste 9 hole 6": 147,
        "Hitland eerste 9 hole 7": 148,
        "Hitland eerste 9 hole 8": 260,
        "Hitland eerste 9 hole 9": 27
    };

    // Function to set the real-life distance based on the image's alt attribute
    function setRealLifeDistance() {
        const imageAlt = document.getElementById('myImage').alt;
        realLifeDistance = distanceMap[imageAlt] || 0; // Default to 0 if not found
    }

    setRealLifeDistance(); // Initialize real-life distance for the first image

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
        const rect = document.getElementById('myImage').getBoundingClientRect();
        const clickedPoint = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        if (step === 0) {
            startPoint = clickedPoint;
            messageDiv.textContent = 'Set end point.';
            step = 1;
        } else if (step === 1) {
            endPoint = clickedPoint;
            const pixelDistance = calculateDistance(startPoint, endPoint);
            const scaleFactor = realLifeDistance / calculateDistance(startPoint, endPoint);
            const distanceInMeters = pixelDistance * scaleFactor;

            messageDiv.textContent = 'Real-life distance to end point: ' + distanceInMeters.toFixed(2) + ' meters';
            suggestClub(distanceInMeters);
            step = 2;
        } else if (step === 2) {
            const pixelDistance = calculateDistance(clickedPoint, endPoint);
            const scaleFactor = realLifeDistance / calculateDistance(startPoint, endPoint);
            const distanceInMeters = pixelDistance * scaleFactor;

            messageDiv.textContent = 'Real-life distance to end point: ' + distanceInMeters.toFixed(2) + ' meters';
            suggestClub(distanceInMeters);
        }
    }

    // Attach the click event listener to the image
    document.getElementById('myImage').addEventListener('click', findDistance);

    // Expose findDistance globally to be accessible in other scripts
    window.findDistance = findDistance;

    // Function to re-initialize the real-life distance and step for each new hole
    window.reinitializeFindDistance = function() {
        setRealLifeDistance(); // Update real-life distance
        step = 0; // Reset step for a new hole
        messageDiv.textContent = 'Select the middle point as shown on the map, if not available click start point..'; // Reset message
    };
});
