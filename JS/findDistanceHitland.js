//Old File - delete later

document.addEventListener('DOMContentLoaded', function() {
    let startPoint = null; // Start point coordinates
    let endPoint = null;   // End point coordinates
    let realLifeDistance = 0; // To hold the real-life distance for the hole
    const messageDiv = document.getElementById('Message');
    const suggestedClubDiv = document.getElementById('suggestedClub');

    // Declare previousClickpoint globally
    let previousClickpoint = null; // To hold the previous clicked point
    let lastRedDot = null; // Variable to store the last created red dot

    // Updated distance map with real-life distance, start point, and end point for each hole
    const distanceMap = {
        "Hitland par 3 hole 1": { distance: 103, start: { x: 155, y: 20 }, end: { x: 103.27, y: 471.42 } },
        "Hitland par 3 hole 2": { distance: 62, start: { x: 57, y: 110 }, end: { x: 368, y: 131 } },
        "Hitland par 3 hole 3": { distance: 102, start: { x: 43, y: 47 }, end: { x: 643, y: 98 } },
        "Hitland par 3 hole 4": { distance: 77, start: { x: 290, y: 35 }, end: { x: 156, y: 426 } },
        "Hitland par 3 hole 5": { distance: 104, start: { x: 696, y: 192 }, end: { x: 128, y: 130 } },
        "Hitland par 3 hole 6": { distance: 90, start: { x: 52, y: 53 }, end: { x: 478, y: 157 } },
        "Hitland par 3 hole 7": { distance: 83, start: { x: 578, y: 267 }, end: { x: 134, y: 132 } },
        "Hitland par 3 hole 8": { distance: 98, start: { x: 125, y: 654 }, end: { x: 161, y: 122 } },
        "Hitland par 3 hole 9": { distance: 133, start: { x: 83, y: 763 }, end: { x: 140, y: 131 } }
    };

        // Function to set the real-life distance and points based on the image's alt attribute
        function setRealLifeDistance() {
            const imageAlt = document.getElementById('myImage').alt;
            const holeData = distanceMap[imageAlt];
            const myImage = document.getElementById('myImage');
    
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
            dot.setAttribute("id", "redDot");
        
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
    
                window.distanceInMetersCovered = distanceInMetersCovered; //Set the distanceInMeters as global const so it can be used in scoreCardAddstroke.jss
                // Only calculate the distance if previousClickpoint is set
                if (previousClickpoint) {
                    const pixelDistanceBetweenShots = calculateDistance(previousClickpoint, clickedPoint);
                    const distanceBetweenShots = pixelDistanceBetweenShots * scaleFactor;
                    window.distanceBetweenShots = distanceBetweenShots.toFixed(2);
                    console.log(`Distance between shots: ${distanceBetweenShots.toFixed(2)} meters`);
                }
    
                // Update previousClickpoint for the next click
                previousClickpoint = clickedPoint; // Update previousClickpoint to the current clicked point

                // Compensate for scrolling by using scrollX and scrollY
                const dotX = rect.left + (clickedPoint.x / naturalWidth) * rect.width + window.scrollX;
                const dotY = rect.top + (clickedPoint.y / naturalHeight) * rect.height + window.scrollY;
                createRedDot(dotX, dotY); // Place the red dot at the correct position

            } else {
                messageDiv.textContent = 'Start and end points are not set properly.';
            }
        }
    
        // Attach click event listener to the image
        const myImage = document.getElementById('myImage');
        myImage.addEventListener('click', findDistance);

        window.reinitializeFindDistance = function() {
            setRealLifeDistance(); // Update real-life distance and points for the new hole
            messageDiv.innerHTML = '<text class="distanceHeaders">Total distance: </text>' + realLifeDistance + ' meters <br>' + // Reset message
                                    '<text class="distanceHeaders">Distance left: </text>' + realLifeDistance + ' meters <br>' +
                                    '<text class="distanceHeaders">Distance covered: </text>Click where your ball landed'; 
            suggestClub(realLifeDistance);
            const redDot = document.getElementById('redDot');
            //if statement to make sure that when no red dot is set, there is no error and everything still works fine
            if(redDot != null){
                redDot.style.display = 'none';
            }
        };
    
        window.onload = function() {
            setRealLifeDistance(); // Update real-life distance and points for the new hole
            messageDiv.innerHTML = '<text class="distanceHeaders">Total distance: </text>' + realLifeDistance + ' meters <br>' + // Reset message
                                    '<text class="distanceHeaders">Distance left: </text>' + realLifeDistance + ' meters <br>' +
                                    '<text class="distanceHeaders">Distance covered: </text>Click where your ball landed'; 
        };
    });
    