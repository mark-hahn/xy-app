import {HttpClient} from 'lib/aurelia-http-client';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import {ValidationRules, ValidationController} from 'aurelia-validation';

@inject(NewInstance.of(ValidationController))
export class SsidForm {
  controller = null;

  constructor(controller) {
    this.controller = controller;
    this.rules = ValidationRules.ensure('apSsid')
                   .displayName('XY AP SSID')
                   .required()
                   .maxLength(32)
                   .rules;
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
      this.isVisible = true;
    });
  }

  submit() {
    this.controller.validate().then(result => {
      if (result.valid) {
        let client = new HttpClient();
        let jsonArr = [{apSsid: this.apSsid, apPwd: this.apPwd}]
        .concat(this.eeprom_ssids);
        console.log("eeprom_ssids save:", jsonArr);
        client.post(window.DEBUG_HOST + '/setssids', jsonArr);
      } else {
        // validation failed
      }
    });
  }
}
