function updateImageSize(){
    const minScreenWidth= 680;

    const myImageSize = document.getElementById('myImage');
    
    if(window.innerWidth > minScreenWidth){
        if (myImageSize.naturalHeight > myImageSize.naturalWidth) {
            console.log(`height: ${myImageSize.naturalHeight} bigger than width: ${myImageSize.naturalWidth}`);
            myImageSize.style.width = "600px";
            myImageSize.style.height = "auto";
            console.log("set image to 600px width");
        }
        else {
            console.log(`height: ${myImageSize.naturalHeight} smaller than width: ${myImageSize.naturalWidth}`);
            myImageSize.style.width = "-webkit-fill-available";
            myImageSize.style.maxHeight = "100vh";
            console.log("set image to full width");
        }
    }
    else{
        console.log("User is using mobile");
    }
};