
function driverDistance(){
    const driverDistanceInput = document.getElementById("driveDistanceInput");
    var Driverdistance = driverDistanceInput.value;
    localStorage.setItem("DriverDistance", JSON.parse(Driverdistance));
    document.getElementById("driverDistance").innerHTML = Driverdistance;
    console.log(Driverdistance);
    console.log(driverDistanceInput);
    console.log(localStorage.getItem("DriverDistance"))
}

function driverDistanceOnLoad(){
    //var x = localStorage.getItem("DriverDistance");
    //var x = parseFloat(x) + 1;
    //localStorage.setItem("DriverDistance", JSON.parse(x));
    if(localStorage.getItem('DriverDistance') > 0){
        document.getElementById("clubDistance").innerHTML += localStorage.getItem('DriverDistance');
    }
    else{
        document.getElementById("driverDistance").innerHTML = "Set your value";
    }
}