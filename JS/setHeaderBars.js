function Setheaderbars(){
    document.getElementById("headerandfooter").innerHTML = `
    <div class="headerbar">
                <h1 class="Title">
                    My Caddy
                </h1>
            </div>
            <div class="bottombar">
                <div class="bottombarContent">
                    <div class="left_menu">
                        <a id="myBagMenu" href="Mybag.html">
                            <img src="icons/golfbag.svg" alt="golfbag"/>
                            <div>My bag</div>
                        </a>
                        <a href="play.html">
                            <img src="icons/play.svg" alt="play"/>
                            <div>Play</div>
                        </a>                        
                        <a href="myCards.html">
                            <img src="icons/cards.svg" alt="card"/>
                            <div>My cards</div>
                        </a>
                    </div>
                    <div class="right_menu">
                        <a>My profile</a>
                    </div>
                </div>                
            </div>
    `
}