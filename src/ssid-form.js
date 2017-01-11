import {HttpClient} from 'aurelia-http-client';

export class SsidForm {
  constructor() {
    this.eeprom_ssids = [];
    this.refresh();
  }

  refresh() {
    this.isVisible = false;
    this.heading = "Loading WiFi AP settings ...";

    let client = new HttpClient();
    let host = (location.port === '9000' ? window.DEBUG_HOST  : '');
    client.get(host + '/eepromssids')
    .then(data => {
      try {
        var ssids = JSON.parse(data.response);
      } catch(e) {
        console.log('Invalid json in eepromssids ajax response',
                     data.response);
        return;
      }
      this.apSsid = ssids[0].apSsid;
      this.apPwd  = ssids[0].apPwd;
      for(let i=1; i < ssids.length; i++) {
        let ssid = ssids[i];
        ssid.staticIp = (ssid.staticIp == '0.0.0.0') ? "" : ssid.staticIp;
      }
      this.eeprom_ssids = ssids.slice(1);
      console.log("eeprom_ssids refresh:", this.eeprom_ssids[0]);
      this.isVisible = true;
    });
  }

  submit() {
    console.log("eeprom_ssids save:", this.eeprom_ssids[0]);
  }
}