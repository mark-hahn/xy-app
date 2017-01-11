import {HttpClient} from 'aurelia-http-client';

export class SsidList {
  constructor() {
    this.ssids = [];
    this.refresh();
  }

  refresh() {
    this.isVisible = false;

    let client = new HttpClient();
    let host = (location.port === '9000' ? window.DEBUG_HOST  : '');
    client.get(host + '/ssids')
      .then(data => {
        try {
          var ssids = JSON.parse(data.response);
        } catch(e) {
          console.log('Invalid json in ssids ajax response', data.response);
          return;
        }
        for(let ssid of ssids)
          ssid.encryptionType = (ssid.encryptionType == 'NONE') ? "yes" : "";
        ssids.sort((a,b) => b.rssi - a.rssi);
        this.ssids = ssids;
        this.isVisible = true;
      });
  }

  add(ssid) {
    console.log("Add:",ssid);
  }
}
