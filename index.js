require('reflect-metadata');
if (!global.CLUSIC_ROUTER_COMPONENTS) global.CLUSIC_ROUTER_COMPONENTS = [];

exports.Methods = ['Get', 'Post', 'Put', 'Delete', 'Patch', 'Head', 'Options'];

exports.ApplicationComponent = function ApplicationComponent(ctx) {
  this.ctx = ctx;
  this.app = this.ctx.app;
  this.Service = this.ctx.Service;
  this.Logger = this.app.Logger;
};

exports.ContextComponent = class ContextComponent {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = this.ctx.app;
    this.Service = this.ctx.Service;
    this.Logger = this.app.Logger;
  }
}

exports.RenderMiddlewareArguments = function RenderMiddlewareArguments(object, middleware) {
  let middle = middleware.Expression.split('.').reduce((target, property) => {
    if (target[property]) return target[property];
    throw new Error(`Can not find property ${property} on ${JSON.stringify(target)}`);
  }, object);
  if (middleware.Arguments.length) middle = middle(...middleware[n].Arguments);
  return middle;
}

exports.Controller = function Controller(prefix) {
  if (typeof prefix === 'function') return setControllerPrefix(prefix, null);
  return target => setControllerPrefix(target, prefix);
}

function setControllerPrefix(target, prefix) {
  if (global.CLUSIC_ROUTER_COMPONENTS.indexOf(target) === -1) {
    global.CLUSIC_ROUTER_COMPONENTS.push(target);
  }
  return Reflect.defineMetadata('Controller', prefix, target);
}

exports.Use = function Use(name, ...args) {
  return (target, propertyKey, descriptor) => {
    if (!propertyKey && !descriptor) {
      let Middlewares = Reflect.getMetadata('Use', target);
      if (!Middlewares) Middlewares = [];
      Middlewares.push({
        Expression: name,
        Arguments: args
      });
      return Reflect.defineMetadata('Use', Middlewares, target);
    }
  }
}

exports.Order = function Order(order) {
  return (target, propertyKey, descriptor) => {
    if (!propertyKey && !descriptor) {
      return Reflect.defineMetadata('Order', order, target);
    }
  }
}

exports.Extra = function Extra(callback) {
  return (target, propertyKey, descriptor) => {
    let Properies = Reflect.getMetadata('ExtraProperies', descriptor.value);
    if (!Properies) Properies = [];
    Properies.push(callback);
    return Reflect.defineMetadata('ExtraProperies', Properies, descriptor.value);
  }
}

exports.Middleware = function Middleware(name, ...args) {
  return (target, propertyKey, descriptor) => {
    if (!propertyKey && !descriptor) return exports.Use(name, ...args)(target);
    let Middlewares = Reflect.getMetadata('Middleware', descriptor.value);
    if (!Middlewares) Middlewares = [];
    Middlewares.push({
      Expression: name,
      Arguments: args
    });
    return Reflect.defineMetadata('Middleware', Middlewares, descriptor.value);
  }
}

exports.Methods.forEach(method => {
  exports[method] = function(path) {
    return (target, propertyKey, descriptor) => {
      return Reflect.defineMetadata(method, { path, property: propertyKey }, descriptor.value);
    }
  }
});