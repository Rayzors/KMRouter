let router = new KMRouter([
  {
    path: '/',
    action: function (request) {
      document.body.innerHTML =
        'Page 1 <button>Kevin</button> <a href="/page2" data-router-link>Page 2</a>';
      document
        .querySelector('button')
        .addEventListener('click', () => alert('click'));
    },
  },
  {
    path: '/page2',
    action: function () {
      document.body.innerHTML = `
      Page 2
      <a href="/page3" data-router-link>Page 3</a>`;
    },
  },
  {
    path: '/page3',
    action: function () {
      document.body.innerHTML = `
      Page 3
      <a href="/page3/kevin" data-router-link>Page 1</a>`;
    },
    before: function (request, next) {
      console.log('before', request);
      next();
    },
    leave: function (request, next) {
      console.log('leave', request);
      next();
    },
  },
  {
    path: '/page3/{name}',
    action: function (request) {
      document.body.innerHTML = `
      Page 3 with params name : ${request.params.name}
      <a href="/" data-router-link>Page 1</a>`;
    },
    before: function (request, next) {
      console.log('before', request);
      next();
    },
    leave: function (request, next) {
      console.log('leave', request);
      next();
    },
  },
  {
    path: '*',
    action: function () {
      document.body.innerHTML = `Not Found`;
    },
  },
]);
