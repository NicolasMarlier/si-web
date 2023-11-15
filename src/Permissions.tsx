const requestPermissionGeoLocation = () =>
        navigator.permissions.query({ name: "geolocation" })
    
const requestPermissionDeviceOrientation = async() => {
    interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
        requestPermission?: () => Promise<'granted' | 'denied'>;
    }
    const requestPermission = (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission;
    const iOS = typeof requestPermission === 'function';
    let orientationState = ""
    if (iOS) {
        orientationState = await requestPermission()
    }
}

export default {
    requestPermissionGeoLocation,
    requestPermissionDeviceOrientation
}