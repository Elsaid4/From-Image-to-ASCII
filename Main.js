var widthCanvas;
var heightCanvas;

let img;

let capture;

let pixelSize = 1;

let avgPixelColors = [];

let charSet = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];
let stringSet = " `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@";
// let darknessValues = [0, 0.0751, 0.0829, 0.0848, 0.1227, 0.1403, 0.1559, 0.185, 0.2183, 0.2417, 0.2571, 0.2852, 0.2902, 0.2919, 0.3099, 0.3192, 0.3232, 0.3294, 0.3384, 0.3609, 0.3619, 0.3667, 0.3737, 0.3747, 0.3838, 0.3921, 0.396, 0.3984, 0.3993, 0.4075, 0.4091, 0.4101, 0.42, 0.423, 0.4247, 0.4274, 0.4293, 0.4328, 0.4382, 0.4385, 0.442, 0.4473, 0.4477, 0.4503, 0.4562, 0.458, 0.461, 0.4638, 0.4667, 0.4686, 0.4693, 0.4703, 0.4833, 0.4881, 0.4944, 0.4953, 0.4992, 0.5509, 0.5567, 0.5569, 0.5591, 0.5602, 0.5602, 0.565, 0.5776, 0.5777, 0.5818, 0.587, 0.5972, 0.5999, 0.6043, 0.6049, 0.6093, 0.6099, 0.6465, 0.6561, 0.6595, 0.6631, 0.6714, 0.6759, 0.6809, 0.6816, 0.6925, 0.7039, 0.7086, 0.7235, 0.7302, 0.7332, 0.7602, 0.7834, 0.8037, 0.9999];
let darknessValues = [0.9999, 0.8037, 0.7834, 0.7602, 0.7332, 0.7302, 0.7235, 0.7086, 0.7039, 0.6925, 0.6816, 0.6809, 0.6759, 0.6714, 0.6631, 0.6595, 0.6561, 0.6465, 0.6099, 0.6093, 0.6049, 0.6043, 0.5999, 0.5972, 0.587, 0.5818, 0.5777, 0.5776, 0.565, 0.5602, 0.5602, 0.5591, 0.5569, 0.5567, 0.5509, 0.4992, 0.4953, 0.4944, 0.4881, 0.4833, 0.4703, 0.4693, 0.4686, 0.4667, 0.4638, 0.461, 0.458, 0.4562, 0.4503, 0.4477, 0.4473, 0.442, 0.4385, 0.4382, 0.4328, 0.4293, 0.4274, 0.4247, 0.423, 0.42, 0.4101, 0.4091, 0.4075, 0.3993, 0.3984, 0.396, 0.3921, 0.3838, 0.3747, 0.3737, 0.3667, 0.3619, 0.3609, 0.3384, 0.3294, 0.3232, 0.3192, 0.3099, 0.2919, 0.2902, 0.2852, 0.2571, 0.2417, 0.2183, 0.185, 0.1559, 0.1403, 0.1227, 0.0848, 0.0829, 0.0751, 0];

ASCII = true;
var selectMode;


let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let faces = [];


function preload(){
    img = loadImage('images/shrek.png');
    faceMesh = ml5.faceMesh(options);
}

function setup(){
    widthCanvas = 500;
    heightCanvas = 500;
    
    createCanvas(widthCanvas, heightCanvas);
    img.resize(widthCanvas, heightCanvas);

    selectMode = createSelect();
    selectMode.position(10, 10);
    selectMode.option('Mesh');
    selectMode.option('WebcamEllipses');
    selectMode.option('ASCII');
    selectMode.option('Color');
    selectMode.option('Webcam');
    selectMode.changed(() => {
        loop();
    }
    );


    capture = createCapture(VIDEO);
    capture.size(widthCanvas, heightCanvas);
    // capture.hide();

    faceMesh.detectStart(capture, gotFaces);

}
// Callback function for when faceMesh outputs data
function gotFaces(results) {
    // Save the output to the faces variable
    faces = results;
  }
  

function draw(){
    background(0);
    noStroke();
    fill("lime");
    
    
    capture.loadPixels();

    switch(selectMode.value()){
        case 'ASCII':
            for(let x = 0; x < img.width; x+=9) {
                for(let y = 0; y < img.height; y+=9) {
                    const [r, g, b] = img.get(x, y);
                    let avg = (r + g + b) / 3;
                    let charIndex = Math.floor(map(avg, 0, 255, charSet.length - 1, 0));
                    if (avg > 0) 
                        text(charSet[charIndex], x, y);
                }
            }
            noLoop();
            break;
        case 'Color':
            for(let x = 0; x < img.width; x++) {
                for(let y = 0; y < img.height; y++) {
                    const [r, g, b] = img.get(x, y);
                    fill(r, g, b);
                    rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize); 
                    // ellipse(x * pixelSize, y * pixelSize, pixelSize, pixelSize); 
                }
            }
            noLoop();
            break;
        case 'Webcam':
            for (let y = 0; y < capture.height; y += 10) {
                for (let x = 0; x < capture.width; x += 10) {
                    const i = (y * capture.width + x) * 4;
                    let r = capture.pixels[i];
                    let g = capture.pixels[i + 1];
                    let b = capture.pixels[i + 2];
                    let luminosity = 0.299 * r + 0.587 * g + 0.114 * b;
                    let darkness = 1 - (luminosity / 255); 
                  
                    let stringIndex;
          
                    for (let j = 0; j < darknessValues.length; j++) {
                        if (darkness >= darknessValues[j]) {
                            stringIndex = j;
                            break;
                        }
                    }
                    text(stringSet[stringIndex], x, y);
                }
            }
            break;
        case 'WebcamEllipses':
            const stepSize = round(constrain(mouseX / 8, 5, 32));
            for (let y = 0; y < capture.height; y += stepSize) {
                for (let x = 0; x < capture.width; x += stepSize) {
                    const i = (y * capture.width + x) * 4;
                    const r = capture.pixels[i];
                    const g = capture.pixels[i + 1];
                    const b = capture.pixels[i + 2];
                    
                    // const luminosity = 0.299 * r + 0.587 * g + 0.114 * b;
                    const luminosity = (r + g + b)/3;
                    const darkness = luminosity / 255;
                    const radius = darkness < .3 ? 0 : stepSize * darkness;
                    ellipse(x, y, radius, radius);
                }
            }
            break;
        case 'Mesh':
            image(capture, 0, 0, width, height);
            // Draw all the tracked face points
            for (let i = 0; i < faces.length; i++) {
                let face = faces[i];
                for (let j = 0; j < face.keypoints.length; j++) {
                    let keypoint = face.keypoints[j];
                    // const index = (j * capture.width + i) * 4;
                    // const r = capture.pixels[index];
                    // const g = capture.pixels[index + 1];
                    // const b = capture.pixels[index + 2];

                    // let avg = (r + g + b) / 3;
                    // let charIndex = Math.floor(map(avg, 0, 255, charSet.length - 1, 0));
                    // if (avg > 0) 
                    //     text(charSet[charIndex], keypoint.x, keypoint.y);

                    
                    fill(0, 255, 0);
                    noStroke();
                    circle(keypoint.x, keypoint.y, 2);
                }
            }
    
        break;
    }
}