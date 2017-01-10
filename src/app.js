export class App {
  configureRouter(config, router){
    config.title = 'XY';
    config.map([
      { route: '',             moduleId: 'no-selection',   title: 'Select'},
      { route: 'apps',         moduleId: 'apps',        name:'apps' }
      { route: 'network',      moduleId: 'network',        name:'network' }
    ]);

    this.router = router;
  }
}
