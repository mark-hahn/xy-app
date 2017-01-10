
import {HttpClient} from 'aurelia-http-client';


export class ssid_list {
  constructor() {
    this.heading = "SSIDs";
    this.ssids = [];

    let client = new HttpClient();
    client.get('ssids').then(data => { console.log(data[0].name) });
  }

  // add(name) {
  //   this.ssids.push(name);
  // }

  // add(name) {
  //   let index = this.ssids.indexOf(name);
  //   if (index !== -1) {
  //     this.todos.splice(index, 1);
  //   }
  // }
}
