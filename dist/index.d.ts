import Router from './interfaces/router';
import Route from './interfaces/route';
/**
 *
 *
 * @export
 * @class KMRouter
 * @implements {Router}
 */
export declare class KMRouter implements Router {
    routes: Array<Route>;
    matchedRoute: Route | undefined;
    params: {};
    /**
     * @description Creates an instance of Router.
     * @param {Array<Route>} routes
     * @memberof KMRouter
     */
    constructor(routes: Array<Route>);
    /**
     * @description Initialise les écouteurs d'evenement
     * @memberof Router
     */
    private _bind;
    /**
     * @description Vérifie si la route est bien formatée
     * @param {string} path
     * @returns {string}
     * @memberof Router
     */
    private _formatPath;
    /**
     * @description Récupère l'objet de la route courante puis rend la page courante. Permet également la redirection.
     * @memberof Router
     */
    private _dispatch;
    /**
     * @description Vérifie si l'url existe parmi les routes
     * @param {string} url
     * @returns {(Route|undefined)}
     * @memberof KMRouter
     */
    private _match;
    /**
     * @description Génère la regexp de l'url
     * @param {string} path
     * @returns {RegExp}
     * @memberof Router
     */
    private _generateURLRegExp;
    /**
     * @description Action au clique sur un lien ayant l'attribut 'data-router-link'
     * @param {MouseEvent} e
     * @memberof Router
     */
    private _triggerRouterLink;
    private onWindowLoad;
    private handlePopState;
    private handleRouterLink;
}
//# sourceMappingURL=index.d.ts.map