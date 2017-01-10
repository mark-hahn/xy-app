export class App {
  configureRouter(config, router){
    config.title = 'XY';
    config.map([
      { route: '',        moduleId: 'home',    title: 'home'},
      { route: 'apps',    moduleId: 'apps',    name:'apps', nav: true },
      { route: 'network', moduleId: 'network', name:'network', nav: true },
    ]);

    this.router = router;
  }
}
