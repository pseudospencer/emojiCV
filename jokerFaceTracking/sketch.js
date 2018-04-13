var capture;
var tracker;
var w = 640;
var h = 480;

var positions;
var rEye = [23, 63, 24, 64, 25, 65, 26, 66];
var rEyebrow = [19, 20, 21, 22];
var rPupil = [27];
var lEye = [30, 68, 29, 67, 28, 70, 31, 69];
var lEyebrow = [15, 16, 17, 18];
var lPupil = [32];
var uLip = [44, 45, 46, 47, 48, 49, 50, 59, 60, 61];
var bLip = [44, 56, 57, 58, 50, 51, 52, 53, 54, 55];

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
    // Stores all the tracked positions of the face
    positions = tracker.getCurrentPosition();
    /*
    noFill();
    stroke(255);
    // drawing tracked face points with a white line
    beginShape();
    for (var i = 0; i < positions.length; i++) {
        vertex(positions[i][0], positions[i][1]);
    }
    endShape(CLOSE);
    */

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

    }


    // Draw points and labels for tracked face positions
    // noStroke();
    // for (var i = 0; i < positions.length; i++) {
    //     // Go through HSB color range over the positions points
    //     fill(map(i, 0, positions.length, 0, 360), 50, 100);
    //     ellipse(positions[i][0], positions[i][1], 4, 4);
    //     text(i, positions[i][0], positions[i][1]);
    // }

    /*

    // Track Mouth
    if (positions.length > 0) {
        var mouthLeft = createVector(positions[44][0], positions[44][1]);
        var mouthRight = createVector(positions[44][0], positions[44][1]);
        var smile = mouthLeft.dist(mouthRight); // "width of smile"

        // uncomment the line below to show an estimate of amount "smiling"
        // rect(20, 20, smile * 3, 20);

        // Clown nose
        // noStroke();
        // fill(0, 255, 255);
        // ellipse(positions[62][0], positions[62][1], 50, 50);
    }

    */
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
