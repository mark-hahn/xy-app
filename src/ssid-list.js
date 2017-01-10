import {HttpClient} from 'aurelia-http-client';

let DEBUG_HOST = 'http://192.168.1.235';

export class SsidList {
  constructor() {
    this.heading = "Scanning for SSIDs.";
    this.ssids = [];
    this.isVisible = false;

    let client = new HttpClient();
    let host = (location.port === '9000' ? DEBUG_HOST  : '');
    client.get(host + '/ssids')
      .then(data => {
        try {
          var ssids = JSON.parse(data.response);
        } catch(e) {
          console.log('Invalid json in ssids ajax response', data.response);
          return;
        }
        for(let ssid of ssids)
          ssid.encryptionType = (ssid.encryptionType == 'NONE') ? "" : "yes";
        ssids.sort((a,b) => b.rssi - a.rssi);
        this.ssids = ssids;
        this.isVisible = true;
        this.heading = "SSIDs found ...";
      });
  }

  add(ssid) {
    console.log("Add:",ssid);
  }
}
