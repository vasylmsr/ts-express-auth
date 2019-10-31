import Router from '../common/abstracts/router';

export default class AppController extends Router {
  constructor() {
    super('/');
    this.initializeRoutes();
  }

  initializeRoutes() {

    this.router.get('', (req, res, next) => {
      try {
        res.send({ message: 'I am alive' });
      } catch (err) {
        next(err);
      }
    });
  }
}
