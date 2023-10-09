const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', {desynchronized: true});

// Deal with resizing
function resizeCanvas() {
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.putImageData(imgData, 0, 0);
}
resizeCanvas()
window.addEventListener("resize",resizeCanvas);

// ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

const fillDirections = {
    left: "left",
    topLeft: "topLeft",
    bottomLeft: "bottomLeft",

    right: "right",
    topRight: "topRight",
    bottomRight: "bottomRight",

    top: "top",
    bottom: "bottom",
    middle: "middle",

    vertical: "vertical",
    horizontal: "horizontal",
}

function displayPressure(keyData, drift) {
    
    // Key state colour
    if (keyData.keyState) {
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--active");
    } else {
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--inactive");
    }

    var keySize = keyData.width * parseInt(getComputedStyle(document.body).getPropertyValue('--key-size'));

    // console.log(keyData.fillDir);
    const fillDir = keyData.fillDir;
    switch (true) {
        case fillDir == fillDirections.left || fillDir == fillDirections.topLeft || fillDir == fillDirections.bottomLeft:
            ctx.fillRect(keyData.x+4, keyData.y+4, keySize * keyData.progress, drift);
            break;
        case fillDir == fillDirections.right || fillDir == fillDirections.topRight || fillDir == fillDirections.bottomRight:
            ctx.fillRect(keyData.x+4 - (keySize*keyData.progress)+keySize, keyData.y+4, keySize * keyData.progress, drift);
            break;
        case fillDir == fillDirections.horizontal:
            ctx.fillRect(keyData.x+4 - (keySize*0.5*keyData.progress)+keySize*0.5, keyData.y+4, keySize * keyData.progress, drift);
            break;
        default:
            ctx.fillRect(keyData.x+4 - (keySize*0.5*keyData.progress)+keySize*0.5, keyData.y+4, keySize * keyData.progress, drift);
            break;
    }
}


// Main update loop
var previousTime = 0;
var drift

function main(currentTime) {

    var delta = currentTime - previousTime
    previousTime = currentTime
    
    drift = Math.max(1, Math.ceil(0.1*delta));

    for (const i in keys) {
        displayPressure(keys[i], drift);
    }

    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.putImageData(imgData, 0, -drift);

    ctx.fillRect(0, canvas.height-drift, Math.max(10,Math.floor(Math.sin(currentTime*0.003) * 50)+10), drift);


    window.requestAnimationFrame(main);
}

// Make sure global variables are available //todo could merge the rendering aspect into keyboard.js to simplify
window.addEventListener("load",function () {window.requestAnimationFrame(main)});