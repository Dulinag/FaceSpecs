
<img width="1000" alt="Screenshot 2024-05-07 at 8 52 21 AM" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/78b069cb-f614-42d5-b9fc-bcaa947a150f"> 
<br>
<br>

<!-- HTML -->
<p align="center">
  <a href="https://face-specs.vercel.app/">
    <img width="215" alt="Screenshot 2024-05-07 at 11 22 00 PM" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/0e3800bc-eea7-4866-bdde-81ff49df3af2">
  </a>
</p>


---

## Introduction

FaceSpecs is an innovative software application aimed at providing real-time analysis of facial attributes including age, gender, expressions, and smile score. FaceSpecs offers a user-friendly interface for capturing and analyzing facial data from live video streams.

---

## Objective

The primary objective of FaceSpecs is to develop a robust system capable of accurately detecting and analyzing key facial attributes in real time. By utilizing state-of-the-art machine learning models and computer vision techniques, FaceSpecs aims to provide users with valuable insights into the demographics and emotional expressions of individuals captured within the video feed.

---

## Methodology

FaceSpecs will employ the following methodology to achieve its objectives:

1. **Model Integration**: The application will integrate pre-trained machine-learning models for face detection, landmark detection, expression recognition, age estimation, and gender classification. These models will be loaded into the application using libraries such as faceapi.js.

2. **Real-time Video Processing**: FaceSpecs will utilize the getUserMedia API to access the user's webcam and stream live video data. The application will continuously process the video feed, detecting faces and extracting relevant facial features.

3. **Data Analysis**: Detected faces will undergo comprehensive analysis, including age estimation, gender classification, and smile score calculation. The application will utilize the loaded models to perform these tasks, providing accurate and real-time results.

4. **Visualization**: The results of the analysis will be visually presented to the user in the form of overlaid text labels on the video feed. These labels will display the estimated age, gender, and smile score for each detected face, enhancing the user experience and facilitating interpretation.

---

## Models Used

- **Face Detection**: tinyFaceDetector
    - Built based on the YOLO model (paper referenced below) with depthwise separable convolutional layers to shrink model sizes
      - YOLO model is built on the idea that the model only views the image once to detect multiple objects via bounding boxes
      - YOLO is created on Darknet(open-sourced ANN library)
    - Based on faceapi.js, this detection model works better with faceLandmark68Net and best for mobile and web deployment
- **Landmark Detection**: faceLandmark68Net
    - CNN trained similarly to Dlib's 68 Points Facial Landmark
<div align="center">
<img width="256" alt="Screenshot 2024-05-07 at 8 50 52 AM" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/566b72eb-235e-4bcb-aebb-69ca9a27518a">
</div>

- **Expression Recognition**: faceExpressionNet
    - Model struggles slightly with the user wearing Glasses
    - Built using Depthwise separable convolution
        - Spatial Convolution + Pointwise Convolution
    - The expressions available are listed below:
        - Angry
        - Happy
        - Sad
        - Neutral
        - Surprised
- **Age Estimation + Gender Classification**: ageGenderNet
    - Built Similarly to Xception
      - Inception Modules (parallel convolution branches with varying filter values)
      - Bottleneck Layers (1 X 1 convolutions to reduce computational complexity and number of parameters)
- **Facial Recognition**: faceRecognitionNet
    - Based on a ResNet 34 Architecture
      - ResNet refers to the use of Residual Units and Skip Connections
      - 34 refers to the number of Convolutional Layers within the model
    - Has the ability to recognize any inputted face - without being trained on the face

#### Note: All models are built using separable convolutional layers which enable model sizes to shrink considerably compared to typical 2D convolutional layers.
---

## Implementation

The implementation of FaceSpecs will be carried out in JavaScript, utilizing the faceapi.js library for face detection and recognition tasks. The application will be designed to run efficiently within modern web browsers, ensuring compatibility and accessibility across various devices.

### Vercel 

We chose to use Vercel as our deployment platform because it was extremely easy to connect with Github while also being compatible with the use of the facial analysis models trained in faceapi.js. 

### getUserMedia API
Used to obtain live video stream to do all facial analysis
```javascript
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => console.error('Error accessing webcam:', err));
}
```

#### Localized Uploading:

All photos uploaded for recognition is solely locally stored and removed upon refreshing the website for both privacy and storage reasons.
```javascript
let form = document.getElementById("inputForm");
form.addEventListener("submit", onSubmit)
```
---

### Meet the Team
<!-- HTML -->
<table>
  <tr>
    <td>
      <img width="215" height="215" alt="Dulina headshot" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/00881876-4016-4c3c-9452-9d75da899843">
      <p>Dulina Gunasekara </p>
    </td>
    <td>
      <img width="215" height="215" alt="Anthony headshot" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/ba82d1c8-a987-4d3f-b646-206dc04eacc1">
      <p>Anthony Poon</p>
    </td>
  </tr>
  <tr>
    <td>
      <img width="215" height="215" alt="Nicklaus headshot" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/8717545e-3741-476a-b08f-f79a1288daee">
      <p>Nicklaus Yao</p>
    </td>
    <td>
        <img width="215" height="215" alt="Mahathir headshot" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/8717545e-3741-476a-b08f-f79a1288daee">
      <p>Mahathir Rojan</p>
    </td>
  </tr>
</table>

<br>
<br>
Here is a photograph of the team alongside the professor using FaceSpecs:

<table>
  <tr>
    <td>
      <img width="215" height="215" alt="Dulina Facespecs" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/a064f9f2-0a3d-4b74-82fa-4ebe56b9042e">
      <p>Dulina Gunasekara</p>
    </td>
    <td>
      <img width="215" height="215" alt="Anthony Facespecs" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/ba82d1c8-a987-4d3f-b646-206dc04eacc1">
      <p>Anthony Poon</p>
    </td>
    <td>
      <img width="215" height="215" alt="Professor Facespecs" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/8717545e-3741-476a-b08f-f79a1288daee">
      <p>Professor Stamos</p>
    </td>
    <td>
      <img width="215" height="215" alt="Nicklaus Facespecs" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/e8fa5954-0293-429c-80a1-3797b49547d3">
      <p>Nicklaus Yao</p>
    </td>
    <td>
    <img width="215" height="215" alt="Mahathir FaceSpecs" src="https://github.com/Dulinag/FaceSpecs/assets/92593778/8717545e-3741-476a-b08f-f79a1288daee">
      <p>Mahathir Rojan</p>
    </td>
  </tr>
</table>

---

### Conclusion

FaceSpecs represents a cutting-edge solution for real-time facial attribute analysis, offering users the ability to gain valuable insights from live video streams. By leveraging advanced machine learning techniques, the application aims to provide accurate and intuitive detection of age, gender, and smile score, catering to a wide range of potential applications including retail analytics, audience engagement analysis, and interactive experiences.

With its user-friendly interface and robust performance, FaceSpecs is poised to revolutionize the way facial attributes are analyzed and interpreted in real-world scenarios.

---

### Resources Used

[Media and Capture Streams API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)<br>
[faceapi.js](https://github.com/justadudewhohacks/face-api.js/blob/master/README.md)<br>
[YOLO9000 Research Paper](https://arxiv.org/pdf/1612.08242)<br>
[Vercel](https://vercel.com/) <br>

