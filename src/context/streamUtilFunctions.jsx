export const setMediaConstraints = async (constrainst={}) => {
    try {
        
        let newConstraints = constrainst;

        const devices = await navigator.mediaDevices.enumerateDevices();

        const hasCamera = devices.some((device) => device.kind === "videoinput");
        const hasMicrophone = devices.some((device) => device.kind === "audioinput");

        if (!hasCamera) {
            newConstraints.video = false;
        }

        if (!hasMicrophone) {
            newConstraints.audio = false;
        }else{
            newConstraints.audio = { 'echoCancellation': true, deviceId: 'default',suppressLocalAudioPlayback: true, noiseSuppression: true, sampleRate: 44100 };
        }

        return newConstraints;


    } catch (err) {
        console.log(err);
    }

}