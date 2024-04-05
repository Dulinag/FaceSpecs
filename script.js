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


// Function to calculate smile score


// Function to start video streaming from webcam
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => console.error('Error accessing webcam:', err));
}
function calculateSmileScore(landmarks) {
  const mouth = landmarks.getMouth();
  const mouthWidth = Math.abs(mouth[6].x - mouth[0].x); // Distance between mouth corners
  const faceWidth = landmarks.getJawOutline().shift().x - landmarks.getJawOutline().pop().x; // Width of the face

  const minSmileWidth = 0.3 * faceWidth; // Minimum threshold for a smile (30% of face width)
  const maxSmileWidth = 0.6 * faceWidth; // Maximum threshold for a wide smile (60% of face width)

  let smileScore;
  if (mouthWidth >= maxSmileWidth) {
    smileScore = 1; // Maximum smile score for wide smile
  } else if (mouthWidth >= minSmileWidth) {
    smileScore = (mouthWidth - minSmileWidth) / (maxSmileWidth - minSmileWidth); // Linearly interpolate between thresholds
  } else {
    smileScore = 0; // No smile or minimal smile
  }

  // Ensure that the smile score falls within the range of 0 and 1
  return Math.min(Math.max(smileScore, 0), 1);
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
    resizedDetections.forEach(async detection => {
      const { landmarks } = detection;
      faceapi.draw.drawFaceLandmarks(canvas, landmarks);

      

    });

    resizedDetections.forEach(detection => {
      const { landmarks, box } = detection; // Destructure 'landmarks' and 'box' from the 'detection' object
      
      // Check if 'box' is defined
      if (box) {
        // Calculate smile score
        const smileScore = calculateSmileScore(landmarks);
        
        const textX = box.x + (box.width / 2); // Middle of the detected face
        const textY = box.y - 50; // Above the detected face, adjusted further up
        console.log(`Smile Score: ${smileScore.toFixed(2)}`); // Debugging: Log the smile score to see if it's calculated correctly
        new faceapi.draw.DrawTextField(
          [`Smile Score: ${smileScore.toFixed(2)}`], // Show smile score with 2 decimal places
          { x: textX, y: textY }
        ).draw(canvas);
      } else {
        console.error('Box is undefined.'); // Log an error message if 'box' is undefined
      }
    });
    

    // Draw age and gender labels for each detected face
    resizedDetections.forEach(detection => {
      const { age, gender, genderProbability } = detection;
      const textY = detection.detection.box.bottom + 40; // Adjust the vertical position of the text further down
      new faceapi.draw.DrawTextField(
        [
          `Age: ${faceapi.round(age, 0)} years`,
          `Gender: ${gender} (${faceapi.round(genderProbability * 100)}%)`
        ],
        { x: detection.detection.box.left, y: textY }
      ).draw(canvas);
    });
    
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    // Draw expressions (happy or sad) for each detected face
    resizedDetections.forEach(detection => {
      const { expressions } = detection;
      const textY = detection.detection.box.top - 30; // Adjust the vertical position of the text
      const textX = detection.detection.box.right; // Position the text to the right side
      const expressionText = expressions.happy > expressions.sad ? 'Happy' : 'Sad';

      new faceapi.draw.DrawTextField(
        
        [expressionText],
        { x: textX, y: textY }
      ).draw(canvas);
    });
  }, 100);
});
