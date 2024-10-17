//checkActiveRound.js
document.addEventListener('DOMContentLoaded', function() {
    const activeRoundCheckLocal = localStorage.getItem('activeRound');
    const activeRoundCheck = JSON.parse(activeRoundCheckLocal);
    console.log(activeRoundCheck.active);
    const activeRoundText = document.getElementById('activeRoundSection')

    if(activeRoundCheck.active === 'true'){
        if (activeRoundCheck.redirect === 'false'){
            document.getElementById('myDialogActiveRound').showModal();
            activeRoundText.innerHTML = `
            <h3>Do you want to continue this round?</h3>
            <p>${activeRoundCheck.key}</p>`;
        }
        else{
            console.log('redirected to this page');
            continueActiveRound();

        }
    }
    else{
        console.log('no active round');
    }

    const continueActiveRoundButton = document.getElementById('continueActiveRoundButton');
    if (continueActiveRoundButton) {
        continueActiveRoundButton.addEventListener('click', continueActiveRound);
    }

    const stopActiveRoundButton = document.getElementById('stopActiveRoundButton');
    if (stopActiveRoundButton){
        stopActiveRoundButton.addEventListener('click', stopActiveRound);
    }
});

// Function to close the edit dialog
function closeActiveRoundDialog() {
    document.getElementById('myDialogActiveRound').close();
}

function continueActiveRound(){
    //add here the logic for updating image
    const myImage = document.getElementById('myImage');
    let activeRound = localStorage.getItem('activeRound')
    let activeRoundParse = JSON.parse(activeRound);

    //make sure the page is on the correct course
    if (window.location.href != activeRoundParse.holeUrl){
        activeRoundParse.redirect = "true";
        localStorage.setItem('activeRound', JSON.stringify(activeRoundParse));
        window.location.href = activeRoundParse.holeUrl;
    }
    
    //Update the image and image alt to the last played hole
    myImage.src = activeRoundParse.holeSrc;
    myImage.alt = activeRoundParse.holeAlt;
    
    updateImageSize();

    closeActiveRoundDialog();
}

function stopActiveRound(){
    const stopActiveRound = {
        active: 'false',
        key: 'no active round'
    }

    localStorage.setItem('activeRound', JSON.stringify(stopActiveRound));
    closeActiveRoundDialog();
}