const video = document.getElementById('video');
let firstPersonDescriptor = null;

// Load models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('../models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
  faceapi.nets.faceExpressionNet.loadFromUri('../models')
]).then(startVideo);

// Start video stream
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error(err));
}

// Handle video playback
video.addEventListener('play', async () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  // Detect faces at intervals
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length > 0) {
      // Check if the first person is detected
      if (!firstPersonDescriptor) {
        // Save the descriptor of the first person detected
        firstPersonDescriptor = detections[0].descriptor;
        console.log('First person descriptor saved:', firstPersonDescriptor);
      }

      // Compare with saved descriptor
      const faceMatcher = new faceapi.FaceMatcher([new faceapi.LabeledFaceDescriptors('firstPerson', [firstPersonDescriptor])], 0.6);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      // Match faces
      const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
      results.forEach(result => {
        console.log(result.toString()); // Log recognition results
      });
    }
  }, 1000);
});
