import React from 'react';
import Webcam from 'react-webcam';

function HomeApp() {
    const webcamRef = React.useRef(null);
    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            console.log(imageSrc)
        },
        [webcamRef]
    );

    return (
        <div>

            <Webcam
                audio={false}
                height={720}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={1280}
            />
            <button onClick={capture}>Capture photo</button>

        </div >
    );
}

export default HomeApp;
