import Route, {isRoute} from './interfaces/route';
import Hooks from './interfaces/hooks';

/**
 * KMRouter
 *
 * @export
 * @class KMRouter
 */
export class KMRouter {
  private routes: Array<Route>;
  private matchedRoute: Route | undefined = undefined;
  private params: {};

  hooks: Hooks = {};

  /**
   * @description Creates an instance of Router.
   * @param {Array<Route>} routes
   * @memberof KMRouter
   */
  constructor(routes: Array<Route>) {
    this._checkRoutesType(routes);
    this.routes = routes;
    this.params = {};
    this.routes.map((route: Route) => ({
      ...route,
      path: this._formatPath(route.path),
    }));
    this._bind();
  }

  /**
   * @description Initialize event listeners
   * @memberof KMRouter
   */
  private _bind() {
    window.addEventListener('load', () => this.onWindowLoad());
    window.addEventListener('popstate', () => this.handlePopState());
    document.body.addEventListener(
      'click',
      async (e) => await this._triggerRouterLink(e)
    );
  }

  /**
   * @description Check if the path has the right format
   * @private
   * @param {string} path
   * @returns {string}
   * @memberof KMRouter
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
      return `*`;
    }
    return path;
  }

    /**
   * @description Check if routes is an Array of Route
   * @param {Array} routes
   * @returns {Array}
   * @memberof Router
   */
  _checkRoutesType(routes: Array<Route>) {
    if (!Array.isArray(routes)) {
      throw 'The second argument must be an array of object';
    }

    const AreAllObjectRoutes = routes.every(route => isRoute(route))
    if(!AreAllObjectRoutes) {
      throw 'Routes must have a key path (string) and  a key action (function)';
    }
  }

  /**
   * @description Get the current route and execute the associated methods
   * @private
   * @param {string} url
   * @param {boolean} [onWindowLoad=true]
   * @param {boolean} [isPushState=true]
   * @param {boolean} [redirect=false]
   * @returns
   * @memberof KMRouter
   */
  private async _dispatch(
    url: string,
    onWindowLoad: boolean = true,
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

    if (this.matchedRoute?.redirect) {
      await this._dispatch(this.matchedRoute.redirect, false, true);
    } else if (this.matchedRoute) {
      if (onWindowLoad && isPushState) {
        history.pushState({ key: url }, '', url);
      } else if (!isPushState && url.match(/^\*$/) === null) {
        history.replaceState({ key: url }, '', url);
      }

      const request = {
        redirect: async (uri: string) =>
          await this._dispatch.call(this, uri, false, true),
        params: this.params,
        path: window.location.pathname,
      };

      onWindowLoad && (await this.hooks.leave?.(request));
      onWindowLoad && (await this.matchedRoute.leave?.(request));
      await this.hooks.before?.(request);
      await this.matchedRoute.before?.(request);

      this.matchedRoute.action(request);
    } else if (url.match(/^\*$/) === null) {
      await this._dispatch('*', false);
    } else {
      throw `404 not found ${window.location.pathname}`;
    }
  }

  /**
   * @description Check if the requested URL exist in the route array
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

      if (generatedURLRegExp.test(url) && matches?.[0]?.includes(url)) {
        this.params = matches.groups || {};
        return true;
      }

      return false;
    });
  }

  /**
   * @description Generate the URL Regex
   * @private
   * @param {string} path
   * @returns {RegExp}
   * @memberof KMRouter
   */
  private _generateURLRegExp(path: string): RegExp {
    const reg = /\{([^\s/\:]+)\:?(?:\((.*?)\))?\}/g;

    const routeRegExp = `${path.replace(reg, (...args) =>
      args[2] ? `(?<${args[1]}>${args[2]})` : `(?<${args[1]}>\\w+)`
    )}/?`.replace(/[*]/g, '\\$&');

    return new RegExp(routeRegExp);
  }

  /**
   * @description Trigger navigation on click on link with the 'data-router-link' attribute
   * @private
   * @param {MouseEvent} e
   * @memberof KMRouter
   */
  private async _triggerRouterLink(e: MouseEvent) {
    const el = e.target as HTMLElement;

    if (
      el?.closest('[data-router-link]')?.getAttribute?.('href') ||
      el?.closest('[data-router-link]')?.getAttribute?.('to')
    ) {
      e.preventDefault();
      const url =
        el?.closest('[data-router-link]')?.getAttribute?.('href') ||
        el?.closest('[data-router-link]')?.getAttribute?.('to') ||
        '*';
      await this._dispatch(url);
    }
  }

  /**
   * @description get the right route on window load event
   * @private
   * @memberof KMRouter
   */
  private async onWindowLoad() {
    await this._dispatch(window.location.pathname, false);
  }

  /**
   * @description get the right route on popstate event
   * @private
   * @memberof KMRouter
   */
  private async handlePopState() {
    await this._dispatch(window.location.pathname);
  }
}
