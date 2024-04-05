// First block of code
const video = document.getElementById('video');

// Load face detection, landmark detection, recognition, expression recognition, age, and gender estimation models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo);

// Function to start video streaming from webcam
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => console.error('Error accessing webcam:', err));
}

// Second block of code
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                                     .withFaceLandmarks()
                                     .withFaceExpressions()
                                     .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    // Draw face detections and landmarks
    faceapi.draw.drawDetections(canvas, resizedDetections);
    resizedDetections.forEach(detection => {
      const { landmarks } = detection;
      faceapi.draw.drawFaceLandmarks(canvas, landmarks);
    });

    // Draw age and gender labels for each detected face
    resizedDetections.forEach(detection => {
      const { age, gender, genderProbability } = detection;
      const textY = detection.detection.box.bottom + 20; // Adjust the vertical position of the text
      new faceapi.draw.DrawTextField(
        [
          `Age: ${faceapi.round(age, 0)} years`,
          `Gender: ${gender} (${faceapi.round(genderProbability * 100)}%)`
        ],
        { x: detection.detection.box.left, y: textY }
      ).draw(canvas);
    });

    // Draw expressions (happy or sad) for each detected face
    resizedDetections.forEach(detection => {
      const { expressions } = detection;
      const textY = detection.detection.box.top - 30; // Adjust the vertical position of the text
      const expressionText = expressions.happy > expressions.sad ? 'Happy' : 'Sad';
      new faceapi.draw.DrawTextField(
        [expressionText],
        { x: detection.detection.box.left, y: textY }
      ).draw(canvas);
    });

  }, 100);
});

