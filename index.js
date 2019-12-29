let router = new KMRouter([
  {
    path: '/',
    action: function() {
      document.body.innerHTML =
        'Page 1 <a href="/page2" data-router-link>Page 2</a>';
    },
  },
  {
    path: '/page2',
    action: function() {
      document.body.innerHTML = `Page 2 <a href="/page3" data-router-link>Page 3</a>`;
    },
  },
  {
    path: '/page3',
    action: function() {
      document.body.innerHTML = `Page 3 <a href="/" data-router-link>Page 1</a>`;
    },
  },
  {
    path: '/{name}',
    action: function(request) {
      document.body.innerHTML = `Page 1 : ${request.params.name} <a href="/page2" data-router-link>Page 2</a>`;
    },
  },
  {
    path: '*',
    action: function() {
      document.body.innerHTML = `Not Found`;
    },
  },
]);
