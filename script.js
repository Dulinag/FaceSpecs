// First block of code
const video = document.getElementById('video');

// Load face detection, landmark detection, recognition, expression recognition, age, and gender estimation models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
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

function calculateSmileScore(detection) {
  const { expressions } = detection;
  // Calculate smile score based on the "happy" expression probability
  const smileScore = expressions.happy * 10;
  return smileScore;
}


// Second block of code
video.addEventListener('play', async () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  const LabeledFaceDescriptors = await loadLabeledImages();
  const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.6);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                                     .withFaceLandmarks()
                                     .withFaceExpressions()
                                     .withAgeAndGender()
                                     .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    // Draw face detections and landmarks
    faceapi.draw.drawDetections(canvas, resizedDetections);
    resizedDetections.forEach(async detection => {
      const { landmarks } = detection;
      faceapi.draw.drawFaceLandmarks(canvas, landmarks);

      const smileScore = calculateSmileScore(detection);
      const textX = detection.detection.box.left;
      const textY = detection.detection.box.top - 45; // Adjust the vertical position of the text to be above the face
      new faceapi.draw.DrawTextField(
        [`Smile Score: ${smileScore.toFixed(2)}`], // Display smile score on canvas
        { x: textX, y: textY }
      ).draw(canvas);

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
      const textY = detection.detection.box.top - 45; // Adjust the vertical position of the text
      const textX = detection.detection.box.right; // Position the text to the right side
      const expressionText = expressions.happy > expressions.sad ? 'Happy' : 'Sad';

      new faceapi.draw.DrawTextField(
        
        [expressionText],
        { x: textX, y: textY }
      ).draw(canvas);
    });

    // Draw expressions (happy or sad) for each detected face
    resizedDetections.forEach((detection, i) => {
      const box = detection.detection.box;
      new faceapi.draw.DrawBox(box, { label: results[i].toString() }).draw(canvas);
    });

  }, 100);

});

// This is a really bad way of loading the labeled images
function loadLabeledImages() {
  const labels = ['Anthony'];
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`http://127.0.0.1:5500//labeled_images/${label}/${i}.jpg`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  )
}