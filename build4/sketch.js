var capture;
var tracker;
var classifier;
var emotionData;
var w = 640;
var h = 480;

// Arrays for the position #'s of each part of a Face
var rightEye = [23, 63, 24, 64, 25, 65, 26, 66];
var rightEyebrow = [19, 20, 21, 22];
var rightPupil = [27];
var leftEye = [30, 68, 29, 67, 28, 70, 31, 69];
var leftEyebrow = [15, 16, 17, 18];
var leftPupil = [32];
var upperLip = [44, 45, 46, 47, 48, 49, 50, 59, 60, 61];
var lowerLip = [44, 56, 57, 58, 50, 51, 52, 53, 54, 55];
var noseOutline = [33, 40, 39, 38, 43, 37, 42, 36, 35, 34];
var noseAllPoints = [33, 41, 62, 40, 39, 38, 43, 37, 42, 36, 35, 34];
var faceOutline = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 22, 21, 20, 19];
var positions = []; // will store tracked face positions
var parameters = []; // will store tracked face parameters

var emojiSize = 32;
var emotionEmojis = {"angry":"😠", "disgusted":"🤮", "fear":"😨", "surprised":"😮", "sad":"🙁", "happy":"😀"};

function setup() {

    /****** Video Capture *****/
    capture = createCapture(VIDEO);
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();

    /****** Emotion Detection *****/
    // set eigenvector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows
    pModel.shapeModel.nonRegularizedVectors.push(9);
    pModel.shapeModel.nonRegularizedVectors.push(11);

    tracker = new clm.tracker({useWebGL : true});
    tracker.init(pModel);
    tracker.start(capture.elt);

    classifier = new emotionClassifier();
    classifier.init(emotionModel);
    emotionData = classifier.getBlank();
}

function draw() {
    image(capture, 0, 0, w, h);

    positions = tracker.getCurrentPosition();
    parameters = tracker.getCurrentParameters();

    var emotionRecognition = classifier.meanPredict(parameters);

    if (positions.length > 0) {
        // drawFaceComponentShape(faceOutline);
        drawFaceComponentEmoji(faceOutline, "👊");

        drawFaceComponentEmoji(leftEye, "👁");
        drawFaceComponentEmoji(rightEye, "👁");

        drawFaceComponentEmoji(noseAllPoints, "👃");

        drawFaceComponentEmoji(rightEyebrow, "🧤");
        drawFaceComponentEmoji(leftEyebrow, "🌸");

        drawFaceComponentEmoji(upperLip, "👄");
        drawFaceComponentEmoji(lowerLip, "💋");

        drawFaceComponentEmoji(rightPupil, "🔥");
        drawFaceComponentEmoji(leftPupil, "🔥");
    }

    if (emotionRecognition) {
        // console.log(emotionRecognition);
        // console.log(emotionRecognition[0]);
        // console.log(emotionRecognition[0].emotion);
        // console.log(emotionRecognition[0].value);
        // for (var i = 0; i < emotionRecognition.length; i++) {
        //     console.log(emotionEmojis[emotionRecognition[i].emotion], emotionRecognition[i].emotion, emotionRecognition[i].value);
        // }

        for (var i = 0; i < emotionRecognition.length; i++) {
            let yOffset = 50;
            let textSizeValue = emotionRecognition[i].value * 100;
            fill('#0f0');
            textAlign(LEFT, TOP);
            textSize(textSizeValue);
            text(emotionEmojis[emotionRecognition[i].emotion], 10, yOffset * i  + 10);
            text(emotionEmojis[emotionRecognition[i].emotion] + " " + emotionRecognition[i].emotion, 10, yOffset * i + 10 );
        }

    }


}

function drawFaceComponentShape(componentPoints, fillValue = '#0f0', strokeValue = "#000") {
    // Not for pupils - Needs more than one vertex
    fillColor = color(fillValue);
    strokeColor = color(strokeValue);
    fill(fillColor);
    stroke(strokeColor);
    beginShape();
    for (var i = 0; i < componentPoints.length; i++) {
        var index = componentPoints[i];
        vertex(positions[index][0], positions[index][1]);
    }
    endShape(CLOSE);
}

function drawFaceComponentEmoji(componentPoints, emojiString = "😀"){
    // pupils only
    textSize(emojiSize);
    textAlign(CENTER, CENTER); // Draw from middle of each point
    for (var i = 0; i < componentPoints.length; i++) {
        var index = componentPoints[i];
        text(emojiString, positions[index][0], positions[index][1]);
    }
}
