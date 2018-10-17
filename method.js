let id = 0;

module.exports = class HttpMethodResolver {
  constructor(method, router) {
    this.method = method;
    this.router = router;
    this.id = id++;
    this.middleware = [];
  }
  
  Middleware(name, ...args) {
    this.middleware.push({ name, args });
    return this;
  }
};