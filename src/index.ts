import Router from './interfaces/router';
import Route from './interfaces/route';

/**
 *
 *
 * @export
 * @class KMRouter
 * @implements {Router}
 */
export class KMRouter implements Router {
  routes: Array<Route>;
  matchedRoute: Route | undefined = undefined;
  params: {};

  /**
   * @description Creates an instance of Router.
   * @param {Array<Route>} routes
   * @memberof KMRouter
   */
  constructor(routes: Array<Route>) {
    this.routes = routes;
    this.params = {};
    this.routes.map((route: Route) => ({
      ...route,
      path: this._formatPath(route.path),
    }));
    this._bind();
  }

  /**
   * @description Initialise les écouteurs d'evenement
   * @memberof Router
   */
  private _bind() {
    window.addEventListener('load', () => this.onWindowLoad());
    window.addEventListener('popstate', () => this.handlePopState());
    document.body.addEventListener('click', (e) => this.handleRouterLink(e));
  }

  /**
   * @description Vérifie si la route est bien formatée
   * @param {string} path
   * @returns {string}
   * @memberof Router
   */
  private _formatPath(path: string): string {
    if (path.match(/^(\/\#|\#\/)/)) {
      throw `bad url \`${path}\``;
    }
    if (path === '') {
      return '/';
    }
    if (path.match(/^\//) === null && path.match(/^\*$/) === null) {
      return `/${path}`;
    }
    if (path.match(/^\*$/)) {
      return `\\*`;
    }
    return path;
  }

  /**
   * @description Récupère l'objet de la route courante puis rend la page courante. Permet également la redirection.
   * @memberof Router
   */
  private async _dispatch(
    url: string,
    isPushState: boolean = true,
    redirect: boolean = false
  ) {
    if (!url || url.trim() === '') {
      throw 'No url renseigned';
    }

    if (redirect && url.match(/^(http:\/\/|https:\/\/)/)) {
      window.location.replace(url);
      return;
    }

    this.matchedRoute = this._match(url);

    if (this.matchedRoute && this.matchedRoute.redirect !== undefined) {
      await this._dispatch(this.matchedRoute.redirect, false, true);
    } else if (this.matchedRoute) {
      if (isPushState) {
        history.pushState({ key: url }, '', url);
      } else if (!isPushState && url.match(/^\*$/) === null) {
        history.replaceState({ key: url }, '', url);
      }

      this.matchedRoute.action({
        redirect: async (uri: string) =>
          await this._dispatch.call(this, uri, false, true),
        params: this.params,
        path: window.location.pathname,
      });
    } else if (url.match(/^\*$/) === null) {
      await this._dispatch('*', false);
    } else {
      throw `404 not found ${window.location.pathname}`;
    }
  }

  /**
   * @description Vérifie si l'url existe parmi les routes
   * @param {string} url
   * @returns {(Route|undefined)}
   * @memberof KMRouter
   */
  private _match(url: string): Route | undefined {
    return this.routes.find(({ path }) => {
      const generatedURLRegExp = this._generateURLRegExp(path);
      const matches = url.match(generatedURLRegExp);

      if (url !== '/' && generatedURLRegExp.test('/')) {
        return false;
      }

      if (generatedURLRegExp.test(url) && matches && matches[0].includes(url)) {
        this.params = matches.groups || {};
        return true;
      }

      return false;
    });
  }

  /**
   * @description Génère la regexp de l'url
   * @param {string} path
   * @returns {RegExp}
   * @memberof Router
   */
  private _generateURLRegExp(path: string): RegExp {
    const reg = /\{([^\s\/\:]+)\:?(?:\((.*?)\))?\}/g;
    return new RegExp(
      `${path.replace(reg, (...args) =>
        args[2] ? `(?<${args[1]}>${args[2]})` : `(?<${args[1]}>\\w+)`
      )}/?`
    );
  }

  /**
   * @description Action au clique sur un lien ayant l'attribut 'data-router-link'
   * @param {MouseEvent} e
   * @memberof Router
   */
  private async _triggerRouterLink(e: MouseEvent) {
    const el = e.target as HTMLElement;

    if (
      el &&
      el.getAttribute('data-router-link') !== null &&
      el.getAttribute('href') !== null
    ) {
      const url = el.getAttribute('href')!;
      // this._leaveHook();
      await this._dispatch(url);
      // this._afterHook();
    }
  }

  private async onWindowLoad() {
    await this._dispatch(window.location.pathname);
  }

  private async handlePopState() {
    await this._dispatch(window.location.pathname);
  }

  private async handleRouterLink(e: MouseEvent) {
    e.preventDefault();
    await this._triggerRouterLink(e);
  }

  // _beforeHook() {
  //   return (
  //     this.matchedRoute &&
  //     this.matchedRoute.hasOwnProperty('before') &&
  //     this.matchedRoute.before()
  //   );
  // }

  // _leaveHook() {
  //   return (
  //     this.matchedRoute &&
  //     this.matchedRoute.hasOwnProperty('leave') &&
  //     this.matchedRoute.leave()
  //   );
  // }
}
