import { Application } from "./declarations";

// set all device status to offline on boot,
// they set it on mqtt connect
export default async function (app: Application) {
  await app.service('devices').patch(null, {
    online: false
  });

}
