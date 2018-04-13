// Starting from base Joker Face Tracking sketch

var capture;
var tracker;
var w = 640;
var h = 480;

// Arrays for the position #'s of each part of a Face
var rEye = [23, 63, 24, 64, 25, 65, 26, 66];
var rEyebrow = [19, 20, 21, 22];
var rPupil = [27];
var lEye = [30, 68, 29, 67, 28, 70, 31, 69];
var lEyebrow = [15, 16, 17, 18];
var lPupil = [32];
var uLip = [44, 45, 46, 47, 48, 49, 50, 59, 60, 61];
var bLip = [44, 56, 57, 58, 50, 51, 52, 53, 54, 55];
var positions = []; // will store tracked face positions

var emojiSize = 32;

function setup() {
    capture = createCapture(VIDEO);
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();
    // colorMode(HSB);
    tracker = new clm.tracker();
    tracker.init(pModel);
    tracker.start(capture.elt);
}

function draw() {
    image(capture, 0, 0, w, h);

    positions = tracker.getCurrentPosition();

    if (positions.length > 0) {
        stroke(0);
        fill(255);
        drawFaceComponent(lEye);
        drawFaceComponent(rEye);

        fill(0, 255, 0);
        drawFaceComponent(rEyebrow);
        drawFaceComponent(lEyebrow);

        fill(255, 0, 0);
        drawFaceComponent(uLip);
        drawFaceComponent(bLip);

        drawEmojiEyes(rPupil);
        drawEmojiEyes(lPupil);
    }

}

function drawFaceComponent(componentPoints) {
    // Not for pupils
    beginShape();
    for (var i = 0; i < componentPoints.length; i++) {
        var index = componentPoints[i];
        vertex(positions[index][0], positions[index][1]);
    }
    endShape(CLOSE);
}

function drawEmojiEyes(componentPoints){
    // pupils only
    textSize(emojiSize);
    textAlign(CENTER, CENTER); // Draw from middle
    for (var i = 0; i < componentPoints.length; i++) {
        var index = componentPoints[i];
        text("🔥", positions[index][0], positions[index][1]);
    }
}
