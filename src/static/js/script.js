import * as faceapi from 'face-api.js';

export async function startDetections(img) {
  let firstPersonDescriptor = null;

  // Load models
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ]);

  // Detect faces
  const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();


  console.log(detections)

  if (detections.length > 0) {
    // Check if the first person is detected
    if (!firstPersonDescriptor) {
      // Save the descriptor of the first person detected
      firstPersonDescriptor = detections[0].descriptor;
      console.log('First person descriptor saved:', firstPersonDescriptor);
    }

    // Compare with saved descriptor
    const faceMatcher = new faceapi.FaceMatcher([new faceapi.LabeledFaceDescriptors('firstPerson', [firstPersonDescriptor])], 0.6);
    return faceMatcher;
  }

  return null; // Return null if no faces are detected
}
