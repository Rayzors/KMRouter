# KMRouter

## Quick start

### Server configuration

Before using this router, the server must be configured. The server must redirect all the requests to `ìndex.html`

#### Apache

You can do it in a `.htaccess` file at the root of your folder

```apache
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [L]
```

#### Nginx

```nginx
location / {
  try_files $uri /index.html;
}
```

### Set the view container

A `div` must be added in the `<body>` of your `index.html` to receive the view sent by the router.

```HTML
<div id="app"></div>
```

### Package Installation

#### NPM

`npm i kmrouter`

```JS
import { KMRouter } from 'kmrouter';
```

### Routes creation

Routes are an array of object where each object is a route. A route must have 2 keys :

- path : `String`. The path of your route.
- controller : `Function`. The controller of your route.
- redirect (optional) : `String`. The route where you want to be redirected.

```JS
let routes = [
  {
    path: '/';
    controller: function(){
      return 'Hello world';
    }
    // redirect: '/hello'
  }
]
```

### Router initialization

The Router class takes some arguments:

- The container of you app where views will be rendered: `String` or `Node`.
- List of your routes : `Object[]`.

```JS
let router = new KMRouter("#app", routes)
```

## Additional

### Route params

Params can be set set to your route by sepecifing a key placed between `{}`. The url params can be used in controller by the `params` propriety of the `request`argument of the controller.

```JS
let routes = [
  {
    path: '/{name}';
    controller: function(request){
      return `Hello ${request.params.name}`;
    }
  }
]
```

### Route params format

Params format can be specified by using regular expression.

> ⚠️ Regular expression need to be escaped

```JS
let routes = [
  {
    path: '/{name:(\\w+)}';
    controller: function(request){
      return `Hello ${request.params.name}`;
    }
  }
]
```

### 404 not found

To set a 404 page, a `*` path exist. This path allow you to have a default redirection or view when url does not match with one of your routes.

```JS
let routes = [
  {
    path: '*';
    controller: function(){
      return `<h1>404 not found</h1>`
    }
  }
]
```

### Router link

A specific data attribute `data-router-link` must be added to your links to render without refreshing the page. The `href` attribute must be the route where you want to go.

```HTML
<a href="/path/to" data-router-link>label</a>
```

### Redirection

Your can set redirection by two ways : directly in you route configuration or in your controller.

#### In route configuration

```JS
let routes = [
  {
    path: '/';
    redirect: '/path/to'
    controller: function(){
      return 'Hello world';
    }
  }
]
```

#### Or in a controller

```JS
let routes = [
  {
    path: '/';
    controller: function(request){
      return request.redirect('/path/to')
    }
  }
]
```
