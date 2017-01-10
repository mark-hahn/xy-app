import {HttpClient} from 'aurelia-http-client';

let DEBUG_HOST = 'http://192.168.1.235';

export class SsidList {
  constructor() {
    this.heading = "Scanning for SSIDs ...";
    this.ssids = [];
    this.isVisible = false;

    let client = new HttpClient();
    let host = (Location.port == 9000 ? DEBUG_HOST  : '');
    client.get(host + '/ssids')
      .then(data => {
        let ssids = JSON.parse(data.response);
        for(let ssid of ssids)
          ssid.encryptionType =
            (ssid.encryptionType == 'NONE') ? "" : "yes";
        ssids.sort((a,b) => a.rssi < b.rssi);
        this.ssids = ssids;
        this.isVisible = true;
        this.heading = "SSIDs found";
      });
  }

  add(ssid) {
    console.log("Add:",ssid);
  }
}
