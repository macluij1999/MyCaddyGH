//checkActiveRound.js
document.addEventListener('DOMContentLoaded', function() {
    const activeRoundCheckLocal = localStorage.getItem('activeRound');
    const activeRoundCheck = JSON.parse(activeRoundCheckLocal);
    console.log(activeRoundCheck.active);
    const activeRoundText = document.getElementById('activeRoundSection')

    if(activeRoundCheck.active === 'true'){
        document.getElementById('myDialogActiveRound').showModal();
        activeRoundText.innerHTML = `
        <h3>Do you want to continue this round?</h3>
        <p>${activeRoundCheck.key}</p>`;
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