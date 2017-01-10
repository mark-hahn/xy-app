export class App {
  configureRouter(config, router){
    config.title = 'XY';
    config.map([
      { route: '',
        title: 'Platform',
        moduleId: 'platform',
        name:'platform',
        nav: true },
      { route: 'apps',
        title: 'Apps',
        moduleId: 'apps',
        name:'apps',
        nav: true },
      { route: 'network',
        title: 'Network',
        moduleId: 'network',
        name:'network',
        nav: true },
    ]);

    this.router = router;
  }
}
