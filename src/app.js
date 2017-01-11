export class App {
  configureRouter(config, router){
    config.title = 'XY';
    config.map([
      { route: '',
        title: 'Platform',
        moduleId: 'platform/platform',
        name:'platform',
        nav: true },
      { route: 'apps',
        title: 'Apps',
        moduleId: 'apps/apps',
        name:'apps',
        nav: true },
      { route: 'network',
        title: 'Network',
        moduleId: 'network/network',
        name:'network',
        nav: true },
    ]);

    this.router = router;
  }
}
