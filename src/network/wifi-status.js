import {HttpClient} from 'lib/aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WifiChanged} from 'messages';

export class WifiStatus {
  static inject = [EventAggregator];

  constructor(ea) {
    this.ea = ea;
    this.refresh();
    ea.subscribe(WifiChanged, this.refresh);
  }

  refresh() {
    this.isVisible = false;
    let client = new HttpClient();
    client.get(window.ajaxHost + '/wifistatus')
    .then(data => {
      try {
        var status = JSON.parse(data.response);
      } catch(e) {
        console.log('Invalid json in wifi status ajax response', data.response);
        return;
      }
      this.apSsid  = status.apSsid;
      this.apIp    = status.apIp;
      this.staSsid = status.staSsid;
      this.staIp   = status.staIp;

      let host = window.location.hostname;
      this.connSsid = (host === 'xy.local' || host === this.apIp ?
                       this.apSsid : this.staSsid);
      this.isConnected =
        (this.staSsid.length > 0 && this.staIp !== '0.0.0.0' &&
         this.staSsid !== '0.0.0.0');
      this.isVisible = true;
    });
  }
}
