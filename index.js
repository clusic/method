const Route = require('koa-router');
const GlobalRouteTree = [];
let id = 0;

exports.getAllRoutes = function() {
  return GlobalRouteTree;
}

function ControllerService(ctx) {
  this.ctx = ctx;
  this.app = this.ctx.app;
  this.Service = this.ctx.Service;
  this.Logger = this.app.Logger;
}

ControllerService.prototype.__routes__ = {};

exports.ControllerService = ControllerService;

exports.Controller = function(prefix) {
  const router = {};
  GlobalRouteTree.push(router);
  router.__prefix__ = prefix || '/';
  return (target, property, descriptor) => {
    router.__routes__ = target.prototype.__routes__;
    router.__class__ = target;
  }
}

exports.Middleware = function(name, ...args) {
  return (target, property, descriptor) => {
    if (!target.__routes__[property]) target.__routes__[property] = MakeRouterData();
    target.__routes__[property].middlewares.push({ name: name, args });
  }
};

['Get', 'Post', 'Put', 'Delete', 'Patch', 'Head', 'Options'].forEach(method => {
  exports[method] = function(uri) {
    return (target, property, descriptor) => {
      if (!target.__routes__[property]) target.__routes__[property] = MakeRouterData();
      target.__routes__[property].uri = uri;
      target.__routes__[property].method = method.toLowerCase();
    }
  }
});

exports.ContextService = class ContextService {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = this.ctx.app;
    this.Service = this.ctx.Service;
    this.Logger = this.app.Logger;
  }
}

function MakeRouterData() {
  return {
    uri: null,
    middlewares: [],
    id: id++,
    method: null,
    extra: {}
  }
}