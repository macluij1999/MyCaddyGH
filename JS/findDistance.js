document.addEventListener('DOMContentLoaded', function() {
    let startPoint = null; 
    let endPoint = null;   
    let realLifeDistance = 0; 
    const messageDiv = document.getElementById('Message');
    const suggestedClubDiv = document.getElementById('suggestedClub');
    
    let previousClickpoint = null; 
    let lastRedDot = null; // Variable to store the last created red dot

    const distanceMap = {
        "Delfland par 3 hole 1": { distance: 90, start: { x: 343, y: 931 }, end: { x: 213, y: 119 } },
        "Delfland par 3 hole 2": { distance: 136, start: { x: 36, y: 291 }, end: { x: 1172, y: 224 } },
        "Delfland par 3 hole 3": { distance: 70, start: { x: 18, y: 26 }, end: { x: 196, y: 133 } },
        "Delfland par 3 hole 4": { distance: 105, start: { x: 268, y: 875 }, end: { x: 351, y: 158 } },
        "Delfland par 3 hole 5": { distance: 91, start: { x: 643, y: 20 }, end: { x: 166, y: 273 } },
        "Delfland par 3 hole 6": { distance: 138, start: { x: 833, y: 28 }, end: { x: 154, y: 357 } },
        "Delfland par 3 hole 7": { distance: 115, start: { x: 471, y: 49 }, end: { x: 161, y: 637 } },
        "Delfland par 3 hole 8": { distance: 108, start: { x: 425, y: 32 }, end: { x: 152, y: 594 } },
        "Delfland par 3 hole 9": { distance: 82, start: { x: 77, y: 453 }, end: { x: 296, y: 117 } }
    };

    function setRealLifeDistance() {
        const imageAlt = document.getElementById('myImage').alt;
        const holeData = distanceMap[imageAlt];
        const myImage = document.getElementById('myImage');

        if (holeData) {
            realLifeDistance = holeData.distance; 
            startPoint = holeData.start; 
            endPoint = holeData.end;     
        } else {
            realLifeDistance = 0; 
            startPoint = null;
            endPoint = null;
        }

        suggestClub(realLifeDistance);
    }

    setRealLifeDistance(); 

    function calculateDistance(pointA, pointB) {
        return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
    }

    function suggestClub(distance) {
        let closestUnderClub = null;
        let closestOverClub = null;
        let exactClub = null;
        let smallestUnderDifference = Infinity;
        let smallestOverDifference = Infinity;

        for (let i = 1; localStorage.getItem("club" + i) !== null; i++) {
            const club = JSON.parse(localStorage.getItem("club" + i));
            const clubDistance = parseFloat(club.distance);

            if (clubDistance === distance) {
                exactClub = club.type + ' (' + club.distance + ')';
            }

            if (clubDistance < distance) {
                const underDifference = distance - clubDistance;
                if (underDifference < smallestUnderDifference) {
                    smallestUnderDifference = underDifference;
                    closestUnderClub = club.type + ' (' + club.distance + ')';
                }
            }

            if (clubDistance > distance) {
                const overDifference = clubDistance - distance;
                if (overDifference < smallestOverDifference) {
                    smallestOverDifference = overDifference;
                    closestOverClub = club.type + ' (' + club.distance + ')';
                }
            }
        }

        let suggestionMessage = '';

        if (exactClub) {
            let closestClub = null;

            if (closestUnderClub && closestOverClub) {
                const underDistance = Math.abs(distance - parseFloat(closestUnderClub.match(/\((\d+)\)/)[1]));
                const overDistance = Math.abs(distance - parseFloat(closestOverClub.match(/\((\d+)\)/)[1]));

                closestClub = (underDistance <= overDistance) ? closestUnderClub : closestOverClub;
            } else if (closestUnderClub) {
                closestClub = closestUnderClub;
            } else if (closestOverClub) {
                closestClub = closestOverClub;
            }

            suggestionMessage += `<text class="distanceHeaders">Suggest club: </text>${exactClub}`;
            if (closestClub) {
                suggestionMessage += ` or ${closestClub}`;
            }
        } else {
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
            lastRedDot.remove();
        }

        const dot = document.createElement('div');
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.backgroundColor = 'red';
        dot.style.borderRadius = '50%';
        dot.style.position = 'absolute';
        dot.style.left = `${x - 5}px`; 
        dot.style.top = `${y - 5}px`;
        dot.style.zIndex = 5;  
        dot.style.pointerEvents = 'none'; 

        document.body.appendChild(dot);

        lastRedDot = dot;
    }

    function findDistance(event) {
        const image = document.getElementById('myImage');
        const rect = image.getBoundingClientRect();
        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;

        const clickedPoint = {
            x: (event.clientX - rect.left) * (naturalWidth / rect.width), 
            y: (event.clientY - rect.top) * (naturalHeight / rect.height)
        };

        if (endPoint && startPoint) {
            const pixelDistance = calculateDistance(clickedPoint, endPoint);
            const scaleFactor = realLifeDistance / calculateDistance(startPoint, endPoint); 
            const distanceInMeters = pixelDistance * scaleFactor;

            const pixelDistanceCovered = calculateDistance(clickedPoint, startPoint);
            const distanceInMetersCovered = pixelDistanceCovered * scaleFactor;

            messageDiv.innerHTML = '<text class="distanceHeaders">Total distance: </text>' + realLifeDistance + ' meters <br>' + 
                                    '<text class="distanceHeaders">Distance left: </text>' + distanceInMeters.toFixed(2) + ' meters<br>' + 
                                    '<text class="distanceHeaders">Distance covered: </text>' + distanceInMetersCovered.toFixed(2) + ' meters';

            suggestClub(distanceInMeters);

            window.distanceInMetersCovered = distanceInMetersCovered;
            if (previousClickpoint) {
                const pixelDistanceBetweenShots = calculateDistance(previousClickpoint, clickedPoint);
                const distanceBetweenShots = pixelDistanceBetweenShots * scaleFactor;
                window.distanceBetweenShots = distanceBetweenShots.toFixed(2);
            }

            previousClickpoint = clickedPoint;

            // Compensate for scrolling by using scrollX and scrollY
            const dotX = rect.left + (clickedPoint.x / naturalWidth) * rect.width + window.scrollX;
            const dotY = rect.top + (clickedPoint.y / naturalHeight) * rect.height + window.scrollY;
            createRedDot(dotX, dotY);
        } else {
            messageDiv.textContent = 'Start and end points are not set properly.';
        }
    }

    const myImage = document.getElementById('myImage');
    myImage.addEventListener('click', findDistance);

    window.reinitializeFindDistance = function() {
        setRealLifeDistance();
        messageDiv.innerHTML = '<text class="distanceHeaders">Total distance: </text>' + realLifeDistance + ' meters <br>' + 
                                '<text class="distanceHeaders">Distance left: </text>' + realLifeDistance + ' meters <br>' +
                                '<text class="distanceHeaders">Distance covered: </text>Click where your ball landed'; 
        suggestClub(realLifeDistance);
    };

    window.onload = function() {
        setRealLifeDistance(); 
        messageDiv.innerHTML = '<text class="distanceHeaders">Total distance: </text>' + realLifeDistance + ' meters <br>' + 
                                '<text class="distanceHeaders">Distance left: </text>' + realLifeDistance + ' meters <br>' +
                                '<text class="distanceHeaders">Distance covered: </text>Click where your ball landed'; 
    };
});
