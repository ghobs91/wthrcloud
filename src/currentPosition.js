import { LocationServicesError } from './errors.js';
export async function currentPosition() {
  return new Promise((success, reject) => {
    navigator.geolocation.getCurrentPosition(
      success,
      (err) => {
        const e = new LocationServicesError(`could not get location: ${err}`);
        console.error(e);
        reject(e);
      },
      {
        enableHighAccuracy: false,
      },
    );
  });
}
