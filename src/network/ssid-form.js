
import {HttpClient} from 'lib/aurelia-http-client';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import {ValidationRules, ValidationController} from 'aurelia-validation';
import {EventAggregator} from 'aurelia-event-aggregator';
import {AddSsidToFormMsg} from 'messages'

@inject(NewInstance.of(ValidationController), EventAggregator)
export class SsidForm {
  controller = null;

  constructor(controller, ea) {
    ValidationRules
      .ensure('apSsid').displayName('XY AP SSID').required().maxLength(32)
      .ensure('apPwd').displayName('XY AP Password').required().maxLength(32).minLength(8).on(SsidForm);
    this.controller = controller;
    this.eeprom_ssids = [];
    this.refresh();

    ea.subscribe(AddSsidToFormMsg,
      msg => {
        console.log('got msg ssidName', msg.ssidName);
        for(let ssid of this.eeprom_ssids) {
          if(ssid.ssid === msg.ssidName) return;
          if(ssid.ssid.length === 0) {
            ssid.ssid     = msg.ssidName;
            ssid.password = "";
            ssid.staticIp = "";
            return;
          }
        }
      }
    )
  }

  refresh() {
    this.isVisible = false;
    this.heading = "Loading WiFi AP settings ...";

    let client = new HttpClient();
    client.get(window.ajaxHost + '/eepromssids')
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
        client.post(window.ajaxHost + '/setssids', jsonArr);
      }
    });
  }
}
