# KMRouter

## Quick start

### Server configuration

Before using this router, the server must be configured. The server must redirect all the requests to `index.html`

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

### Package Installation

#### NPM

`npm i @rayzors/router`

```JS
import { KMRouter } from '@rayzors/router';
```

#### YARN

`yarn add @rayzors/router`

```JS
import { KMRouter } from '@rayzors/router';
```

### Routes definition

Routes are an array of object where each object is a route. A route have several keys :

- path : `String`. The path of your route.
- action : `Function`. The main route action.
- before (optional) : `Function`. Function executed before the action.
- leave (optional) : `Function`. Function executed on leaving route.
- redirect (optional) : `String`. The route where you want to be redirected.

```JS
const routes = [
  {
    path: '/',
    action: function(request) {
      document.body.innerHTML = 'Home';
    },
    leave: function(request, next) {
      console.log('leave route');
      next();
    },
    before: function(request, next) {
      console.log('before route');
      next();
    },
    // redirect: '/hello'
  }
]
```

### Router initialization

The Router class takes as argument the routes list

```JS
const router = new KMRouter(routes)
```

## Additional

### Route params

Params can be set to your route by sepecifing a key placed between `{}`. The url params can be used in the action by the `params` propriety of the `request` argument.

```JS
const routes = [
  {
    path: '/{name}',
    action: function(request) {
      document.body.innerHTML = `Hello ${request.params.name}`;
    }
  }
]
```

### Route params format

Params format can be specified by using regular expression.

> ⚠️ Regular expression need to be escaped

```JS
const routes = [
  {
    path: '/{name:(\\w+)}',
    action: function(request) {
      document.body.innerHTML = `Hello ${request.params.name}`;
    }
  }
]
```

### Hooks

2 hooks are available :

- before : executed before the action function. Can be use as a middleware.
- leave : executed on route leaving.

#### Global hooks

```JS
const router = new KMRouter(routes)

router.hooks.before = function(request, next) {
  // your code
  next()
};

router.hooks.leave = function(request, next) {
  // your code
  next()
};
```

#### Route hooks

```JS
const routes = [
  {
    path: '/',
    action: function(request) {
      document.body.innerHTML = `<h1>404 not found</h1>`
    },
    before: function(request, next) {
      // your code
      next()
    },
    leave: function(request, next) {
      // your code
      next()
    }
  }
];

const router = new KMRouter(routes);
```

### 404 not found

To set a 404 page, a `*` path exist. This path allow you to have a default redirection when url does not match with one of your routes.

```JS
const routes = [
  {
    path: '*',
    action: function() {
      document.body.innerHTML = `<h1>404 not found</h1>`
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

Your can set redirection directly in your route configuration or in your controller.

#### In route configuration

```JS
const routes = [
  {
    path: '/',
    redirect: '/path/to',
    action: function(){
      document.body.innerHTML = 'Hello world';
    }
  }
]
```

#### Or in an action method

```JS
const routes = [
  {
    path: '/',
    action: function(request){
      request.redirect('/path/to')
    }
  }
]
```
