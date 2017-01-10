
import {HttpClient} from 'aurelia-http-client';


export class SsidList {
  constructor() {
    this.heading = "Scanning for SSIDs ...";
    this.ssids = [];
    this.isVisible = false;

    let client = new HttpClient();
    client.get('http://192.168.1.235/ssids')
      .then(data => {
        let ssids = JSON.parse(data.response);
        for(let ssid of ssids)
          ssid.encryptionType =
            (ssid.encryptionType == 'NONE') ? "NO" : "yes";
        ssids.sort((a,b) => a.rssi < b.rssi);
        this.ssids = ssids;
        this.isVisible = true;
        this.heading = "SSIDs found";
      });
  }

  add(ssid) {
    console.log("Add:",ssid);
  }

  // add(name) {
  //   let index = this.ssids.indexOf(name);
  //   if (index !== -1) {
  //     this.todos.splice(index, 1);
  //   }
  // }
}
