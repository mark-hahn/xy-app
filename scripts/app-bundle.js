define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'XY';
      config.map([{ route: '',
        title: 'Platform',
        moduleId: 'platform/platform',
        name: 'platform',
        nav: true }, { route: 'apps',
        title: 'Apps',
        moduleId: 'apps/apps',
        name: 'apps',
        nav: true }, { route: 'network',
        title: 'Network',
        moduleId: 'network/network',
        name: 'network',
        nav: true }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  window.DEBUG_HOST = 'http://192.168.1.243';

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-validation');
    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('ssid-form',['exports', 'lib/aurelia-http-client'], function (exports, _aureliaHttpClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SsidForm = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var SsidForm = exports.SsidForm = function () {
    function SsidForm() {
      _classCallCheck(this, SsidForm);

      this.eeprom_ssids = [];
      this.refresh();
    }

    SsidForm.prototype.refresh = function refresh() {
      var _this = this;

      this.isVisible = false;
      this.heading = "Loading WiFi AP settings ...";

      var client = new _aureliaHttpClient.HttpClient();
      var host = location.port === '9000' ? window.DEBUG_HOST : '';
      client.get(host + '/eepromssids').then(function (data) {
        try {
          var ssids = JSON.parse(data.response);
        } catch (e) {
          console.log('Invalid json in eepromssids ajax response', data.response);
          return;
        }
        _this.apSsid = ssids[0].apSsid;
        _this.apPwd = ssids[0].apPwd;
        for (var i = 1; i < ssids.length; i++) {
          var ssid = ssids[i];
          ssid.staticIp = ssid.staticIp == '0.0.0.0' ? "" : ssid.staticIp;
        }
        _this.eeprom_ssids = ssids.slice(1);
        _this.isVisible = true;
      });
    };

    SsidForm.prototype.submit = function submit() {
      var client = new _aureliaHttpClient.HttpClient();
      var jsonArr = [{ apSsid: this.apSsid, apPwd: this.apPwd }].concat(this.eeprom_ssids);
      console.log("eeprom_ssids save:", jsonArr);
      client.post(window.DEBUG_HOST + '/setssids', jsonArr);
    };

    return SsidForm;
  }();
});
define('apps/apps',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Apps = exports.Apps = function Apps() {
    _classCallCheck(this, Apps);
  };
});
define('lib/aurelia-http-client',['exports', 'aurelia-path', 'aurelia-pal'], function (exports, _aureliaPath, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpClient = exports.RequestBuilder = exports.HttpRequestMessage = exports.JSONPRequestMessage = exports.RequestMessageProcessor = exports.mimeTypes = exports.HttpResponseMessage = exports.RequestMessage = exports.Headers = undefined;
  exports.timeoutTransformer = timeoutTransformer;
  exports.callbackParameterNameTransformer = callbackParameterNameTransformer;
  exports.credentialsTransformer = credentialsTransformer;
  exports.progressTransformer = progressTransformer;
  exports.responseTypeTransformer = responseTypeTransformer;
  exports.headerTransformer = headerTransformer;
  exports.contentTransformer = contentTransformer;
  exports.createJSONPRequestMessageProcessor = createJSONPRequestMessageProcessor;
  exports.createHttpRequestMessageProcessor = createHttpRequestMessageProcessor;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Headers = exports.Headers = function () {
    function Headers() {
      var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Headers);

      this.headers = {};

      for (var _key in headers) {
        this.headers[_key.toLowerCase()] = { key: _key, value: headers[_key] };
      }
    }

    Headers.prototype.add = function add(key, value) {
      this.headers[key.toLowerCase()] = { key: key, value: value };
    };

    Headers.prototype.get = function get(key) {
      var header = this.headers[key.toLowerCase()];
      return header ? header.value : undefined;
    };

    Headers.prototype.clear = function clear() {
      this.headers = {};
    };

    Headers.prototype.has = function has(header) {
      return this.headers.hasOwnProperty(header.toLowerCase());
    };

    Headers.prototype.configureXHR = function configureXHR(xhr) {
      for (var name in this.headers) {
        if (this.headers.hasOwnProperty(name)) {
          xhr.setRequestHeader(this.headers[name].key, this.headers[name].value);
        }
      }
    };

    Headers.parse = function parse(headerStr) {
      var headers = new Headers();
      if (!headerStr) {
        return headers;
      }

      var headerPairs = headerStr.split('\r\n');
      for (var i = 0; i < headerPairs.length; i++) {
        var headerPair = headerPairs[i];

        var index = headerPair.indexOf(': ');
        if (index > 0) {
          var _key2 = headerPair.substring(0, index);
          var val = headerPair.substring(index + 2);
          headers.add(_key2, val);
        }
      }

      return headers;
    };

    return Headers;
  }();

  var RequestMessage = exports.RequestMessage = function () {
    function RequestMessage(method, url, content, headers) {
      _classCallCheck(this, RequestMessage);

      this.method = method;
      this.url = url;
      this.content = content;
      this.headers = headers || new Headers();
      this.baseUrl = '';
    }

    RequestMessage.prototype.buildFullUrl = function buildFullUrl() {
      var absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
      var url = absoluteUrl.test(this.url) ? this.url : (0, _aureliaPath.join)(this.baseUrl, this.url);

      if (this.params) {
        var qs = (0, _aureliaPath.buildQueryString)(this.params);
        url = qs ? url + (this.url.indexOf('?') < 0 ? '?' : '&') + qs : url;
      }

      return url;
    };

    return RequestMessage;
  }();

  var HttpResponseMessage = exports.HttpResponseMessage = function () {
    function HttpResponseMessage(requestMessage, xhr, responseType, reviver) {
      _classCallCheck(this, HttpResponseMessage);

      this.requestMessage = requestMessage;
      this.statusCode = xhr.status;
      this.response = xhr.response || xhr.responseText;
      this.isSuccess = xhr.status >= 200 && xhr.status < 400;
      this.statusText = xhr.statusText;
      this.reviver = reviver;
      this.mimeType = null;

      if (xhr.getAllResponseHeaders) {
        try {
          this.headers = Headers.parse(xhr.getAllResponseHeaders());
        } catch (err) {
          if (xhr.requestHeaders) this.headers = new Headers(xhr.requestHeaders);
        }
      } else {
        this.headers = new Headers();
      }

      var contentType = void 0;

      if (this.headers && this.headers.headers) {
        contentType = this.headers.get('Content-Type');
      }

      if (contentType) {
        this.mimeType = responseType = contentType.split(';')[0].trim();
        if (mimeTypes.hasOwnProperty(this.mimeType)) responseType = mimeTypes[this.mimeType];
      }

      this.responseType = responseType;
    }

    _createClass(HttpResponseMessage, [{
      key: 'content',
      get: function get() {
        try {
          if (this._content !== undefined) {
            return this._content;
          }

          if (this.response === undefined || this.response === null || this.response === '') {
            this._content = this.response;
            return this._content;
          }

          if (this.responseType === 'json') {
            this._content = JSON.parse(this.response, this.reviver);
            return this._content;
          }

          if (this.reviver) {
            this._content = this.reviver(this.response);
            return this._content;
          }

          this._content = this.response;
          return this._content;
        } catch (e) {
          if (this.isSuccess) {
            throw e;
          }

          this._content = null;
          return this._content;
        }
      }
    }]);

    return HttpResponseMessage;
  }();

  var mimeTypes = exports.mimeTypes = {
    'text/html': 'html',
    'text/javascript': 'js',
    'application/javascript': 'js',
    'text/json': 'json',
    'application/json': 'json',
    'application/rss+xml': 'rss',
    'application/atom+xml': 'atom',
    'application/xhtml+xml': 'xhtml',
    'text/markdown': 'md',
    'text/xml': 'xml',
    'text/mathml': 'mml',
    'application/xml': 'xml',
    'text/yml': 'yml',
    'text/csv': 'csv',
    'text/css': 'css',
    'text/less': 'less',
    'text/stylus': 'styl',
    'text/scss': 'scss',
    'text/sass': 'sass',
    'text/plain': 'txt'
  };

  function applyXhrTransformers(xhrTransformers, client, processor, message, xhr) {
    var i = void 0;
    var ii = void 0;

    for (i = 0, ii = xhrTransformers.length; i < ii; ++i) {
      xhrTransformers[i](client, processor, message, xhr);
    }
  }

  var RequestMessageProcessor = exports.RequestMessageProcessor = function () {
    function RequestMessageProcessor(xhrType, xhrTransformers) {
      _classCallCheck(this, RequestMessageProcessor);

      this.XHRType = xhrType;
      this.xhrTransformers = xhrTransformers;
      this.isAborted = false;
    }

    RequestMessageProcessor.prototype.abort = function abort() {
      if (this.xhr && this.xhr.readyState !== _aureliaPal.PLATFORM.XMLHttpRequest.UNSENT) {
        this.xhr.abort();
      }

      this.isAborted = true;
    };

    RequestMessageProcessor.prototype.process = function process(client, requestMessage) {
      var _this = this;

      var promise = new Promise(function (resolve, reject) {
        var xhr = _this.xhr = new _this.XHRType();

        xhr.onload = function (e) {
          var response = new HttpResponseMessage(requestMessage, xhr, requestMessage.responseType, requestMessage.reviver);
          if (response.isSuccess) {
            resolve(response);
          } else {
            reject(response);
          }
        };

        xhr.ontimeout = function (e) {
          reject(new HttpResponseMessage(requestMessage, {
            response: e,
            status: xhr.status,
            statusText: xhr.statusText
          }, 'timeout'));
        };

        xhr.onerror = function (e) {
          reject(new HttpResponseMessage(requestMessage, {
            response: e,
            status: xhr.status,
            statusText: xhr.statusText
          }, 'error'));
        };

        xhr.onabort = function (e) {
          reject(new HttpResponseMessage(requestMessage, {
            response: e,
            status: xhr.status,
            statusText: xhr.statusText
          }, 'abort'));
        };
      });

      return Promise.resolve(requestMessage).then(function (message) {
        var processRequest = function processRequest() {
          if (_this.isAborted) {
            _this.xhr.abort();
          } else {
            _this.xhr.open(message.method, message.buildFullUrl(), true, message.user, message.password);
            applyXhrTransformers(_this.xhrTransformers, client, _this, message, _this.xhr);
            if (typeof message.content === 'undefined') {
              _this.xhr.send();
            } else {
              _this.xhr.send(message.content);
            }
          }

          return promise;
        };

        var chain = [[processRequest, undefined]];

        var interceptors = message.interceptors || [];
        interceptors.forEach(function (interceptor) {
          if (interceptor.request || interceptor.requestError) {
            chain.unshift([interceptor.request ? interceptor.request.bind(interceptor) : undefined, interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined]);
          }

          if (interceptor.response || interceptor.responseError) {
            chain.push([interceptor.response ? interceptor.response.bind(interceptor) : undefined, interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined]);
          }
        });

        var interceptorsPromise = Promise.resolve(message);

        while (chain.length) {
          var _interceptorsPromise;

          interceptorsPromise = (_interceptorsPromise = interceptorsPromise).then.apply(_interceptorsPromise, chain.shift());
        }

        return interceptorsPromise;
      });
    };

    return RequestMessageProcessor;
  }();

  function timeoutTransformer(client, processor, message, xhr) {
    if (message.timeout !== undefined) {
      xhr.timeout = message.timeout;
    }
  }

  function callbackParameterNameTransformer(client, processor, message, xhr) {
    if (message.callbackParameterName !== undefined) {
      xhr.callbackParameterName = message.callbackParameterName;
    }
  }

  function credentialsTransformer(client, processor, message, xhr) {
    if (message.withCredentials !== undefined) {
      xhr.withCredentials = message.withCredentials;
    }
  }

  function progressTransformer(client, processor, message, xhr) {
    if (message.progressCallback) {
      xhr.upload.onprogress = message.progressCallback;
    }
  }

  function responseTypeTransformer(client, processor, message, xhr) {
    var responseType = message.responseType;

    if (responseType === 'json') {
      responseType = 'text';
    }

    xhr.responseType = responseType;
  }

  function headerTransformer(client, processor, message, xhr) {
    message.headers.configureXHR(xhr);
  }

  function contentTransformer(client, processor, message, xhr) {
    if (message.skipContentProcessing) {
      return;
    }

    if (_aureliaPal.PLATFORM.global.FormData && message.content instanceof FormData) {
      return;
    }

    if (_aureliaPal.PLATFORM.global.Blob && message.content instanceof Blob) {
      return;
    }

    if (_aureliaPal.PLATFORM.global.ArrayBufferView && message.content instanceof ArrayBufferView) {
      return;
    }

    if (message.content instanceof Document) {
      return;
    }

    if (typeof message.content === 'string') {
      return;
    }

    if (message.content === null || message.content === undefined) {
      return;
    }

    message.content = JSON.stringify(message.content, message.replacer);

    if (!message.headers.has('Content-Type')) {
      message.headers.add('Content-Type', 'application/json');
    }
  }

  var JSONPRequestMessage = exports.JSONPRequestMessage = function (_RequestMessage) {
    _inherits(JSONPRequestMessage, _RequestMessage);

    function JSONPRequestMessage(url, callbackParameterName) {
      _classCallCheck(this, JSONPRequestMessage);

      var _this2 = _possibleConstructorReturn(this, _RequestMessage.call(this, 'JSONP', url));

      _this2.responseType = 'jsonp';
      _this2.callbackParameterName = callbackParameterName;
      return _this2;
    }

    return JSONPRequestMessage;
  }(RequestMessage);

  var JSONPXHR = function () {
    function JSONPXHR() {
      _classCallCheck(this, JSONPXHR);
    }

    JSONPXHR.prototype.open = function open(method, url) {
      this.method = method;
      this.url = url;
      this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    };

    JSONPXHR.prototype.send = function send() {
      var _this3 = this;

      var url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + encodeURIComponent(this.callbackParameterName) + '=' + this.callbackName;
      var script = _aureliaPal.DOM.createElement('script');

      script.src = url;
      script.onerror = function (e) {
        cleanUp();

        _this3.status = 0;
        _this3.onerror(new Error('error'));
      };

      var cleanUp = function cleanUp() {
        delete _aureliaPal.PLATFORM.global[_this3.callbackName];
        _aureliaPal.DOM.removeNode(script);
      };

      _aureliaPal.PLATFORM.global[this.callbackName] = function (data) {
        cleanUp();

        if (_this3.status === undefined) {
          _this3.status = 200;
          _this3.statusText = 'OK';
          _this3.response = data;
          _this3.onload(_this3);
        }
      };

      _aureliaPal.DOM.appendNode(script);

      if (this.timeout !== undefined) {
        setTimeout(function () {
          if (_this3.status === undefined) {
            _this3.status = 0;
            _this3.ontimeout(new Error('timeout'));
          }
        }, this.timeout);
      }
    };

    JSONPXHR.prototype.abort = function abort() {
      if (this.status === undefined) {
        this.status = 0;
        this.onabort(new Error('abort'));
      }
    };

    JSONPXHR.prototype.setRequestHeader = function setRequestHeader() {};

    return JSONPXHR;
  }();

  function createJSONPRequestMessageProcessor() {
    return new RequestMessageProcessor(JSONPXHR, [timeoutTransformer, callbackParameterNameTransformer]);
  }

  var HttpRequestMessage = exports.HttpRequestMessage = function (_RequestMessage2) {
    _inherits(HttpRequestMessage, _RequestMessage2);

    function HttpRequestMessage(method, url, content, headers) {
      _classCallCheck(this, HttpRequestMessage);

      var _this4 = _possibleConstructorReturn(this, _RequestMessage2.call(this, method, url, content, headers));

      _this4.responseType = 'json';return _this4;
    }

    return HttpRequestMessage;
  }(RequestMessage);

  function createHttpRequestMessageProcessor() {
    return new RequestMessageProcessor(_aureliaPal.PLATFORM.XMLHttpRequest, [timeoutTransformer, credentialsTransformer, progressTransformer, responseTypeTransformer, contentTransformer, headerTransformer]);
  }

  var RequestBuilder = exports.RequestBuilder = function () {
    function RequestBuilder(client) {
      _classCallCheck(this, RequestBuilder);

      this.client = client;
      this.transformers = client.requestTransformers.slice(0);
      this.useJsonp = false;
    }

    RequestBuilder.prototype.asDelete = function asDelete() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'DELETE';
      });
    };

    RequestBuilder.prototype.asGet = function asGet() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'GET';
      });
    };

    RequestBuilder.prototype.asHead = function asHead() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'HEAD';
      });
    };

    RequestBuilder.prototype.asOptions = function asOptions() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'OPTIONS';
      });
    };

    RequestBuilder.prototype.asPatch = function asPatch() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'PATCH';
      });
    };

    RequestBuilder.prototype.asPost = function asPost() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'POST';
      });
    };

    RequestBuilder.prototype.asPut = function asPut() {
      return this._addTransformer(function (client, processor, message) {
        message.method = 'PUT';
      });
    };

    RequestBuilder.prototype.asJsonp = function asJsonp(callbackParameterName) {
      this.useJsonp = true;
      return this._addTransformer(function (client, processor, message) {
        message.callbackParameterName = callbackParameterName;
      });
    };

    RequestBuilder.prototype.withUrl = function withUrl(url) {
      return this._addTransformer(function (client, processor, message) {
        message.url = url;
      });
    };

    RequestBuilder.prototype.withContent = function withContent(content) {
      return this._addTransformer(function (client, processor, message) {
        message.content = content;
      });
    };

    RequestBuilder.prototype.withBaseUrl = function withBaseUrl(baseUrl) {
      return this._addTransformer(function (client, processor, message) {
        message.baseUrl = baseUrl;
      });
    };

    RequestBuilder.prototype.withParams = function withParams(params) {
      return this._addTransformer(function (client, processor, message) {
        message.params = params;
      });
    };

    RequestBuilder.prototype.withResponseType = function withResponseType(responseType) {
      return this._addTransformer(function (client, processor, message) {
        message.responseType = responseType;
      });
    };

    RequestBuilder.prototype.withTimeout = function withTimeout(timeout) {
      return this._addTransformer(function (client, processor, message) {
        message.timeout = timeout;
      });
    };

    RequestBuilder.prototype.withHeader = function withHeader(key, value) {
      return this._addTransformer(function (client, processor, message) {
        message.headers.add(key, value);
      });
    };

    RequestBuilder.prototype.withCredentials = function withCredentials(value) {
      return this._addTransformer(function (client, processor, message) {
        message.withCredentials = value;
      });
    };

    RequestBuilder.prototype.withLogin = function withLogin(user, password) {
      return this._addTransformer(function (client, processor, message) {
        message.user = user;message.password = password;
      });
    };

    RequestBuilder.prototype.withReviver = function withReviver(reviver) {
      return this._addTransformer(function (client, processor, message) {
        message.reviver = reviver;
      });
    };

    RequestBuilder.prototype.withReplacer = function withReplacer(replacer) {
      return this._addTransformer(function (client, processor, message) {
        message.replacer = replacer;
      });
    };

    RequestBuilder.prototype.withProgressCallback = function withProgressCallback(progressCallback) {
      return this._addTransformer(function (client, processor, message) {
        message.progressCallback = progressCallback;
      });
    };

    RequestBuilder.prototype.withCallbackParameterName = function withCallbackParameterName(callbackParameterName) {
      return this._addTransformer(function (client, processor, message) {
        message.callbackParameterName = callbackParameterName;
      });
    };

    RequestBuilder.prototype.withInterceptor = function withInterceptor(interceptor) {
      return this._addTransformer(function (client, processor, message) {
        message.interceptors = message.interceptors || [];
        message.interceptors.unshift(interceptor);
      });
    };

    RequestBuilder.prototype.skipContentProcessing = function skipContentProcessing() {
      return this._addTransformer(function (client, processor, message) {
        message.skipContentProcessing = true;
      });
    };

    RequestBuilder.prototype._addTransformer = function _addTransformer(fn) {
      this.transformers.push(fn);
      return this;
    };

    RequestBuilder.addHelper = function addHelper(name, fn) {
      RequestBuilder.prototype[name] = function () {
        return this._addTransformer(fn.apply(this, arguments));
      };
    };

    RequestBuilder.prototype.send = function send() {
      var message = this.useJsonp ? new JSONPRequestMessage() : new HttpRequestMessage();
      return this.client.send(message, this.transformers);
    };

    return RequestBuilder;
  }();

  function trackRequestStart(client, processor) {
    client.pendingRequests.push(processor);
    client.isRequesting = true;
  }

  function trackRequestEnd(client, processor) {
    var index = client.pendingRequests.indexOf(processor);

    client.pendingRequests.splice(index, 1);
    client.isRequesting = client.pendingRequests.length > 0;

    if (!client.isRequesting) {
      (function () {
        var evt = _aureliaPal.DOM.createCustomEvent('aurelia-http-client-requests-drained', { bubbles: true, cancelable: true });
        setTimeout(function () {
          return _aureliaPal.DOM.dispatchEvent(evt);
        }, 1);
      })();
    }
  }

  var HttpClient = exports.HttpClient = function () {
    function HttpClient() {
      _classCallCheck(this, HttpClient);

      this.isRequesting = false;

      this.requestTransformers = [];
      this.requestProcessorFactories = new Map();
      this.requestProcessorFactories.set(HttpRequestMessage, createHttpRequestMessageProcessor);
      this.requestProcessorFactories.set(JSONPRequestMessage, createJSONPRequestMessageProcessor);
      this.pendingRequests = [];
    }

    HttpClient.prototype.configure = function configure(fn) {
      var builder = new RequestBuilder(this);
      fn(builder);
      this.requestTransformers = builder.transformers;
      return this;
    };

    HttpClient.prototype.createRequest = function createRequest(url) {
      var builder = new RequestBuilder(this);

      if (url) {
        builder.withUrl(url);
      }

      return builder;
    };

    HttpClient.prototype.send = function send(requestMessage, transformers) {
      var _this5 = this;

      var createProcessor = this.requestProcessorFactories.get(requestMessage.constructor);
      var processor = void 0;
      var promise = void 0;
      var i = void 0;
      var ii = void 0;

      if (!createProcessor) {
        throw new Error('No request message processor factory for ' + requestMessage.constructor + '.');
      }

      processor = createProcessor();
      trackRequestStart(this, processor);

      transformers = transformers || this.requestTransformers;

      promise = Promise.resolve(requestMessage).then(function (message) {
        for (i = 0, ii = transformers.length; i < ii; ++i) {
          transformers[i](_this5, processor, message);
        }

        return processor.process(_this5, message).then(function (response) {
          trackRequestEnd(_this5, processor);
          return response;
        }).catch(function (response) {
          trackRequestEnd(_this5, processor);
          throw response;
        });
      });

      promise.abort = promise.cancel = function () {
        processor.abort();
      };

      return promise;
    };

    HttpClient.prototype.delete = function _delete(url) {
      return this.createRequest(url).asDelete().send();
    };

    HttpClient.prototype.get = function get(url) {
      return this.createRequest(url).asGet().send();
    };

    HttpClient.prototype.head = function head(url) {
      return this.createRequest(url).asHead().send();
    };

    HttpClient.prototype.jsonp = function jsonp(url) {
      var callbackParameterName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jsoncallback';

      return this.createRequest(url).asJsonp(callbackParameterName).send();
    };

    HttpClient.prototype.options = function options(url) {
      return this.createRequest(url).asOptions().send();
    };

    HttpClient.prototype.put = function put(url, content) {
      return this.createRequest(url).asPut().withContent(content).send();
    };

    HttpClient.prototype.patch = function patch(url, content) {
      return this.createRequest(url).asPatch().withContent(content).send();
    };

    HttpClient.prototype.post = function post(url, content) {
      return this.createRequest(url).asPost().withContent(content).send();
    };

    return HttpClient;
  }();
});
define('lib/route-highlight',['exports', 'aurelia-framework', 'aurelia-router', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaRouter, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RouteHighlight = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor;

  var RouteHighlight = exports.RouteHighlight = (_dec = (0, _aureliaFramework.inject)(Element, _aureliaRouter.Router, _aureliaEventAggregator.EventAggregator), _dec2 = (0, _aureliaFramework.customAttribute)('route-highlight'), _dec(_class = _dec2(_class = (_class2 = function () {
    function RouteHighlight(element, router, eventAggregator) {
      var _this = this;

      _classCallCheck(this, RouteHighlight);

      _initDefineProp(this, 'routes', _descriptor, this);

      this.element = element;
      this.router = router;
      this.ea = eventAggregator;

      this.subscription = this.ea.subscribe('router:navigation:complete', function () {
        return _this.refresh();
      });
    }

    RouteHighlight.prototype.routesChanged = function routesChanged() {
      this.refresh();
    };

    RouteHighlight.prototype.refresh = function refresh() {
      var instruction = this.router.currentInstruction;
      var isActive = false;

      if (instruction) {
        var activeRoute = instruction.config.name;

        if (Array.isArray(this.routes)) {
          isActive = this.routes.includes(activeRoute);
        } else {
          isActive = this.routes === activeRoute;
        }
      }

      if (isActive) {
        this.highlight();
      } else {
        this.unhighlight();
      }
    };

    RouteHighlight.prototype.highlight = function highlight() {
      this.element.classList.add('active');
    };

    RouteHighlight.prototype.unhighlight = function unhighlight() {
      this.element.classList.remove('active');
    };

    RouteHighlight.prototype.detached = function detached() {
      if (this.subscription) {
        this.subscription();
      }
    };

    return RouteHighlight;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'routes', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('network/network',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Network = exports.Network = function Network() {
    _classCallCheck(this, Network);
  };
});
define('network/ssid-form',['exports', 'lib/aurelia-http-client', 'aurelia-dependency-injection', 'aurelia-validation'], function (exports, _aureliaHttpClient, _aureliaDependencyInjection, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SsidForm = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var SsidForm = exports.SsidForm = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaDependencyInjection.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function () {
    function SsidForm(controller) {
      _classCallCheck(this, SsidForm);

      this.controller = null;

      _aureliaValidation.ValidationRules.ensure('apSsid').displayName('XY AP SSID').required().maxLength(32).ensure('apPwd').displayName('XY AP Password').required().maxLength(32).minLength(8).on(SsidForm);
      this.controller = controller;
      this.eeprom_ssids = [];
      this.refresh();
    }

    SsidForm.prototype.refresh = function refresh() {
      var _this = this;

      this.isVisible = false;
      this.heading = "Loading WiFi AP settings ...";

      var client = new _aureliaHttpClient.HttpClient();
      var host = location.port === '9000' ? window.DEBUG_HOST : '';
      client.get(host + '/eepromssids').then(function (data) {
        try {
          var ssids = JSON.parse(data.response);
        } catch (e) {
          console.log('Invalid json in eepromssids ajax response', data.response);
          return;
        }
        _this.apSsid = ssids[0].apSsid;
        _this.apPwd = ssids[0].apPwd;
        for (var i = 1; i < ssids.length; i++) {
          var ssid = ssids[i];
          ssid.staticIp = ssid.staticIp == '0.0.0.0' ? "" : ssid.staticIp;
        }
        _this.eeprom_ssids = ssids.slice(1);
        _this.isVisible = true;
      });
    };

    SsidForm.prototype.submit = function submit() {
      var _this2 = this;

      this.controller.validate().then(function (result) {
        if (result.valid) {
          var client = new _aureliaHttpClient.HttpClient();
          var jsonArr = [{ apSsid: _this2.apSsid, apPwd: _this2.apPwd }].concat(_this2.eeprom_ssids);
          console.log("eeprom_ssids save:", jsonArr);
          client.post(window.DEBUG_HOST + '/setssids', jsonArr);
        }
      });
    };

    return SsidForm;
  }()) || _class);
});
define('network/ssid-list',['exports', 'lib/aurelia-http-client'], function (exports, _aureliaHttpClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SsidList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var SsidList = exports.SsidList = function () {
    function SsidList() {
      _classCallCheck(this, SsidList);

      this.ssids = [];
      this.refresh();
    }

    SsidList.prototype.refresh = function refresh() {
      var _this = this;

      this.isVisible = false;

      var client = new _aureliaHttpClient.HttpClient();
      var host = location.port === '9000' ? window.DEBUG_HOST : '';
      client.get(host + '/ssids').then(function (data) {
        try {
          var ssids = JSON.parse(data.response);
        } catch (e) {
          console.log('Invalid json in ssids ajax response', data.response);
          return;
        }
        for (var _iterator = ssids, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var ssid = _ref;

          ssid.encryptionType = ssid.encryptionType == 'NONE' ? "yes" : "";
        }ssids.sort(function (a, b) {
          return b.rssi - a.rssi;
        });
        _this.ssids = ssids;
        _this.isVisible = true;
      });
    };

    SsidList.prototype.add = function add(ssid) {
      console.log("Add:", ssid);
    };

    return SsidList;
  }();
});
define('platform/platform',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Platform = exports.Platform = function Platform() {
    _classCallCheck(this, Platform);
  };
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('aurelia-validation/property-info',["require", "exports", "aurelia-binding"], function (require, exports, aurelia_binding_1) {
    "use strict";
    function getObject(expression, objectExpression, source) {
        var value = objectExpression.evaluate(source, null);
        if (value === null || value === undefined || value instanceof Object) {
            return value;
        }
        /* tslint:disable */
        throw new Error("The '" + objectExpression + "' part of '" + expression + "' evaluates to " + value + " instead of an object, null or undefined.");
        /* tslint:enable */
    }
    /**
     * Retrieves the object and property name for the specified expression.
     * @param expression The expression
     * @param source The scope
     */
    function getPropertyInfo(expression, source) {
        var originalExpression = expression;
        while (expression instanceof aurelia_binding_1.BindingBehavior || expression instanceof aurelia_binding_1.ValueConverter) {
            expression = expression.expression;
        }
        var object;
        var propertyName;
        if (expression instanceof aurelia_binding_1.AccessScope) {
            object = source.bindingContext;
            propertyName = expression.name;
        }
        else if (expression instanceof aurelia_binding_1.AccessMember) {
            object = getObject(originalExpression, expression.object, source);
            propertyName = expression.name;
        }
        else if (expression instanceof aurelia_binding_1.AccessKeyed) {
            object = getObject(originalExpression, expression.object, source);
            propertyName = expression.key.evaluate(source);
        }
        else {
            throw new Error("Expression '" + originalExpression + "' is not compatible with the validate binding-behavior.");
        }
        if (object === null || object === undefined) {
            return null;
        }
        return { object: object, propertyName: propertyName };
    }
    exports.getPropertyInfo = getPropertyInfo;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/validate-binding-behavior',["require", "exports", "aurelia-task-queue", "./validate-trigger", "./validate-binding-behavior-base"], function (require, exports, aurelia_task_queue_1, validate_trigger_1, validate_binding_behavior_base_1) {
    "use strict";
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the validate trigger specified by the associated controller's
     * validateTrigger property occurs.
     */
    var ValidateBindingBehavior = (function (_super) {
        __extends(ValidateBindingBehavior, _super);
        function ValidateBindingBehavior() {
            return _super.apply(this, arguments) || this;
        }
        ValidateBindingBehavior.prototype.getValidateTrigger = function (controller) {
            return controller.validateTrigger;
        };
        return ValidateBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    ValidateBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    exports.ValidateBindingBehavior = ValidateBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property will be validated
     * manually, by calling controller.validate(). No automatic validation
     * triggered by data-entry or blur will occur.
     */
    var ValidateManuallyBindingBehavior = (function (_super) {
        __extends(ValidateManuallyBindingBehavior, _super);
        function ValidateManuallyBindingBehavior() {
            return _super.apply(this, arguments) || this;
        }
        ValidateManuallyBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.manual;
        };
        return ValidateManuallyBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    ValidateManuallyBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    exports.ValidateManuallyBindingBehavior = ValidateManuallyBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element blurs.
     */
    var ValidateOnBlurBindingBehavior = (function (_super) {
        __extends(ValidateOnBlurBindingBehavior, _super);
        function ValidateOnBlurBindingBehavior() {
            return _super.apply(this, arguments) || this;
        }
        ValidateOnBlurBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.blur;
        };
        return ValidateOnBlurBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    ValidateOnBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    exports.ValidateOnBlurBindingBehavior = ValidateOnBlurBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element is changed by the user, causing a change
     * to the model.
     */
    var ValidateOnChangeBindingBehavior = (function (_super) {
        __extends(ValidateOnChangeBindingBehavior, _super);
        function ValidateOnChangeBindingBehavior() {
            return _super.apply(this, arguments) || this;
        }
        ValidateOnChangeBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.change;
        };
        return ValidateOnChangeBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    ValidateOnChangeBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    exports.ValidateOnChangeBindingBehavior = ValidateOnChangeBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element blurs or is changed by the user, causing
     * a change to the model.
     */
    var ValidateOnChangeOrBlurBindingBehavior = (function (_super) {
        __extends(ValidateOnChangeOrBlurBindingBehavior, _super);
        function ValidateOnChangeOrBlurBindingBehavior() {
            return _super.apply(this, arguments) || this;
        }
        ValidateOnChangeOrBlurBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.changeOrBlur;
        };
        return ValidateOnChangeOrBlurBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    ValidateOnChangeOrBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    exports.ValidateOnChangeOrBlurBindingBehavior = ValidateOnChangeOrBlurBindingBehavior;
});

define('aurelia-validation/validate-trigger',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Validation triggers.
     */
    exports.validateTrigger = {
        /**
         * Manual validation.  Use the controller's `validate()` and  `reset()` methods
         * to validate all bindings.
         */
        manual: 0,
        /**
         * Validate the binding when the binding's target element fires a DOM "blur" event.
         */
        blur: 1,
        /**
         * Validate the binding when it updates the model due to a change in the view.
         */
        change: 2,
        /**
         * Validate the binding when the binding's target element fires a DOM "blur" event and
         * when it updates the model due to a change in the view.
         */
        changeOrBlur: 3
    };
});

define('aurelia-validation/validate-binding-behavior-base',["require", "exports", "aurelia-dependency-injection", "aurelia-pal", "./validation-controller", "./validate-trigger"], function (require, exports, aurelia_dependency_injection_1, aurelia_pal_1, validation_controller_1, validate_trigger_1) {
    "use strict";
    /**
     * Binding behavior. Indicates the bound property should be validated.
     */
    var ValidateBindingBehaviorBase = (function () {
        function ValidateBindingBehaviorBase(taskQueue) {
            this.taskQueue = taskQueue;
        }
        /**
         * Gets the DOM element associated with the data-binding. Most of the time it's
         * the binding.target but sometimes binding.target is an aurelia custom element,
         * or custom attribute which is a javascript "class" instance, so we need to use
         * the controller's container to retrieve the actual DOM element.
         */
        ValidateBindingBehaviorBase.prototype.getTarget = function (binding, view) {
            var target = binding.target;
            // DOM element
            if (target instanceof Element) {
                return target;
            }
            // custom element or custom attribute
            for (var i = 0, ii = view.controllers.length; i < ii; i++) {
                var controller = view.controllers[i];
                if (controller.viewModel === target) {
                    var element = controller.container.get(aurelia_pal_1.DOM.Element);
                    if (element) {
                        return element;
                    }
                    throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
                }
            }
            throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
        };
        ValidateBindingBehaviorBase.prototype.bind = function (binding, source, rulesOrController, rules) {
            var _this = this;
            // identify the target element.
            var target = this.getTarget(binding, source);
            // locate the controller.
            var controller;
            if (rulesOrController instanceof validation_controller_1.ValidationController) {
                controller = rulesOrController;
            }
            else {
                controller = source.container.get(aurelia_dependency_injection_1.Optional.of(validation_controller_1.ValidationController));
                rules = rulesOrController;
            }
            if (controller === null) {
                throw new Error("A ValidationController has not been registered.");
            }
            controller.registerBinding(binding, target, rules);
            binding.validationController = controller;
            var trigger = this.getValidateTrigger(controller);
            /* tslint:disable:no-bitwise */
            if (trigger & validate_trigger_1.validateTrigger.change) {
                /* tslint:enable:no-bitwise */
                binding.standardUpdateSource = binding.updateSource;
                /* tslint:disable:only-arrow-functions */
                binding.updateSource = function (value) {
                    /* tslint:enable:only-arrow-functions */
                    this.standardUpdateSource(value);
                    this.validationController.validateBinding(this);
                };
            }
            /* tslint:disable:no-bitwise */
            if (trigger & validate_trigger_1.validateTrigger.blur) {
                /* tslint:enable:no-bitwise */
                binding.validateBlurHandler = function () {
                    _this.taskQueue.queueMicroTask(function () { return controller.validateBinding(binding); });
                };
                binding.validateTarget = target;
                target.addEventListener('blur', binding.validateBlurHandler);
            }
            if (trigger !== validate_trigger_1.validateTrigger.manual) {
                binding.standardUpdateTarget = binding.updateTarget;
                /* tslint:disable:only-arrow-functions */
                binding.updateTarget = function (value) {
                    /* tslint:enable:only-arrow-functions */
                    this.standardUpdateTarget(value);
                    this.validationController.resetBinding(this);
                };
            }
        };
        ValidateBindingBehaviorBase.prototype.unbind = function (binding) {
            // reset the binding to it's original state.
            if (binding.standardUpdateSource) {
                binding.updateSource = binding.standardUpdateSource;
                binding.standardUpdateSource = null;
            }
            if (binding.standardUpdateTarget) {
                binding.updateTarget = binding.standardUpdateTarget;
                binding.standardUpdateTarget = null;
            }
            if (binding.validateBlurHandler) {
                binding.validateTarget.removeEventListener('blur', binding.validateBlurHandler);
                binding.validateBlurHandler = null;
                binding.validateTarget = null;
            }
            binding.validationController.unregisterBinding(binding);
            binding.validationController = null;
        };
        return ValidateBindingBehaviorBase;
    }());
    exports.ValidateBindingBehaviorBase = ValidateBindingBehaviorBase;
});

define('aurelia-validation/validation-controller',["require", "exports", "./validator", "./validate-trigger", "./property-info", "./validate-result"], function (require, exports, validator_1, validate_trigger_1, property_info_1, validate_result_1) {
    "use strict";
    /**
     * Orchestrates validation.
     * Manages a set of bindings, renderers and objects.
     * Exposes the current list of validation results for binding purposes.
     */
    var ValidationController = (function () {
        function ValidationController(validator) {
            this.validator = validator;
            // Registered bindings (via the validate binding behavior)
            this.bindings = new Map();
            // Renderers that have been added to the controller instance.
            this.renderers = [];
            /**
             * Validation results that have been rendered by the controller.
             */
            this.results = [];
            /**
             * Validation errors that have been rendered by the controller.
             */
            this.errors = [];
            /**
             *  Whether the controller is currently validating.
             */
            this.validating = false;
            // Elements related to validation results that have been rendered.
            this.elements = new Map();
            // Objects that have been added to the controller instance (entity-style validation).
            this.objects = new Map();
            /**
             * The trigger that will invoke automatic validation of a property used in a binding.
             */
            this.validateTrigger = validate_trigger_1.validateTrigger.blur;
            // Promise that resolves when validation has completed.
            this.finishValidating = Promise.resolve();
        }
        /**
         * Adds an object to the set of objects that should be validated when validate is called.
         * @param object The object.
         * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
         */
        ValidationController.prototype.addObject = function (object, rules) {
            this.objects.set(object, rules);
        };
        /**
         * Removes an object from the set of objects that should be validated when validate is called.
         * @param object The object.
         */
        ValidationController.prototype.removeObject = function (object) {
            this.objects.delete(object);
            this.processResultDelta('reset', this.results.filter(function (result) { return result.object === object; }), []);
        };
        /**
         * Adds and renders an error.
         */
        ValidationController.prototype.addError = function (message, object, propertyName) {
            if (propertyName === void 0) { propertyName = null; }
            var result = new validate_result_1.ValidateResult({}, object, propertyName, false, message);
            this.processResultDelta('validate', [], [result]);
            return result;
        };
        /**
         * Removes and unrenders an error.
         */
        ValidationController.prototype.removeError = function (result) {
            if (this.results.indexOf(result) !== -1) {
                this.processResultDelta('reset', [result], []);
            }
        };
        /**
         * Adds a renderer.
         * @param renderer The renderer.
         */
        ValidationController.prototype.addRenderer = function (renderer) {
            var _this = this;
            this.renderers.push(renderer);
            renderer.render({
                kind: 'validate',
                render: this.results.map(function (result) { return ({ result: result, elements: _this.elements.get(result) }); }),
                unrender: []
            });
        };
        /**
         * Removes a renderer.
         * @param renderer The renderer.
         */
        ValidationController.prototype.removeRenderer = function (renderer) {
            var _this = this;
            this.renderers.splice(this.renderers.indexOf(renderer), 1);
            renderer.render({
                kind: 'reset',
                render: [],
                unrender: this.results.map(function (result) { return ({ result: result, elements: _this.elements.get(result) }); })
            });
        };
        /**
         * Registers a binding with the controller.
         * @param binding The binding instance.
         * @param target The DOM element.
         * @param rules (optional) rules associated with the binding. Validator implementation specific.
         */
        ValidationController.prototype.registerBinding = function (binding, target, rules) {
            this.bindings.set(binding, { target: target, rules: rules, propertyInfo: null });
        };
        /**
         * Unregisters a binding with the controller.
         * @param binding The binding instance.
         */
        ValidationController.prototype.unregisterBinding = function (binding) {
            this.resetBinding(binding);
            this.bindings.delete(binding);
        };
        /**
         * Interprets the instruction and returns a predicate that will identify
         * relevant results in the list of rendered validation results.
         */
        ValidationController.prototype.getInstructionPredicate = function (instruction) {
            var _this = this;
            if (instruction) {
                var object_1 = instruction.object, propertyName_1 = instruction.propertyName, rules_1 = instruction.rules;
                var predicate_1;
                if (instruction.propertyName) {
                    predicate_1 = function (x) { return x.object === object_1 && x.propertyName === propertyName_1; };
                }
                else {
                    predicate_1 = function (x) { return x.object === object_1; };
                }
                if (rules_1) {
                    return function (x) { return predicate_1(x) && _this.validator.ruleExists(rules_1, x.rule); };
                }
                return predicate_1;
            }
            else {
                return function () { return true; };
            }
        };
        /**
         * Validates and renders results.
         * @param instruction Optional. Instructions on what to validate. If undefined, all
         * objects and bindings will be validated.
         */
        ValidationController.prototype.validate = function (instruction) {
            var _this = this;
            // Get a function that will process the validation instruction.
            var execute;
            if (instruction) {
                var object_2 = instruction.object, propertyName_2 = instruction.propertyName, rules_2 = instruction.rules;
                // if rules were not specified, check the object map.
                rules_2 = rules_2 || this.objects.get(object_2);
                // property specified?
                if (instruction.propertyName === undefined) {
                    // validate the specified object.
                    execute = function () { return _this.validator.validateObject(object_2, rules_2); };
                }
                else {
                    // validate the specified property.
                    execute = function () { return _this.validator.validateProperty(object_2, propertyName_2, rules_2); };
                }
            }
            else {
                // validate all objects and bindings.
                execute = function () {
                    var promises = [];
                    for (var _i = 0, _a = Array.from(_this.objects); _i < _a.length; _i++) {
                        var _b = _a[_i], object = _b[0], rules = _b[1];
                        promises.push(_this.validator.validateObject(object, rules));
                    }
                    for (var _c = 0, _d = Array.from(_this.bindings); _c < _d.length; _c++) {
                        var _e = _d[_c], binding = _e[0], rules = _e[1].rules;
                        var propertyInfo = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source);
                        if (!propertyInfo || _this.objects.has(propertyInfo.object)) {
                            continue;
                        }
                        promises.push(_this.validator.validateProperty(propertyInfo.object, propertyInfo.propertyName, rules));
                    }
                    return Promise.all(promises).then(function (resultSets) { return resultSets.reduce(function (a, b) { return a.concat(b); }, []); });
                };
            }
            // Wait for any existing validation to finish, execute the instruction, render the results.
            this.validating = true;
            var returnPromise = this.finishValidating
                .then(execute)
                .then(function (newResults) {
                var predicate = _this.getInstructionPredicate(instruction);
                var oldResults = _this.results.filter(predicate);
                _this.processResultDelta('validate', oldResults, newResults);
                if (returnPromise === _this.finishValidating) {
                    _this.validating = false;
                }
                var result = {
                    instruction: instruction,
                    valid: newResults.find(function (x) { return !x.valid; }) === undefined,
                    results: newResults
                };
                return result;
            })
                .catch(function (exception) {
                // recover, to enable subsequent calls to validate()
                _this.validating = false;
                _this.finishValidating = Promise.resolve();
                return Promise.reject(exception);
            });
            this.finishValidating = returnPromise;
            return returnPromise;
        };
        /**
         * Resets any rendered validation results (unrenders).
         * @param instruction Optional. Instructions on what to reset. If unspecified all rendered results
         * will be unrendered.
         */
        ValidationController.prototype.reset = function (instruction) {
            var predicate = this.getInstructionPredicate(instruction);
            var oldResults = this.results.filter(predicate);
            this.processResultDelta('reset', oldResults, []);
        };
        /**
         * Gets the elements associated with an object and propertyName (if any).
         */
        ValidationController.prototype.getAssociatedElements = function (_a) {
            var object = _a.object, propertyName = _a.propertyName;
            var elements = [];
            for (var _i = 0, _b = Array.from(this.bindings); _i < _b.length; _i++) {
                var _c = _b[_i], binding = _c[0], target = _c[1].target;
                var propertyInfo = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source);
                if (propertyInfo && propertyInfo.object === object && propertyInfo.propertyName === propertyName) {
                    elements.push(target);
                }
            }
            return elements;
        };
        ValidationController.prototype.processResultDelta = function (kind, oldResults, newResults) {
            // prepare the instruction.
            var instruction = {
                kind: kind,
                render: [],
                unrender: []
            };
            // create a shallow copy of newResults so we can mutate it without causing side-effects.
            newResults = newResults.slice(0);
            var _loop_1 = function (oldResult) {
                // get the elements associated with the old result.
                var elements = this_1.elements.get(oldResult);
                // remove the old result from the element map.
                this_1.elements.delete(oldResult);
                // create the unrender instruction.
                instruction.unrender.push({ result: oldResult, elements: elements });
                // determine if there's a corresponding new result for the old result we are unrendering.
                var newResultIndex = newResults.findIndex(function (x) { return x.rule === oldResult.rule && x.object === oldResult.object && x.propertyName === oldResult.propertyName; });
                if (newResultIndex === -1) {
                    // no corresponding new result... simple remove.
                    this_1.results.splice(this_1.results.indexOf(oldResult), 1);
                    if (!oldResult.valid) {
                        this_1.errors.splice(this_1.errors.indexOf(oldResult), 1);
                    }
                }
                else {
                    // there is a corresponding new result...        
                    var newResult = newResults.splice(newResultIndex, 1)[0];
                    // get the elements that are associated with the new result.
                    var elements_1 = this_1.getAssociatedElements(newResult);
                    this_1.elements.set(newResult, elements_1);
                    // create a render instruction for the new result.
                    instruction.render.push({ result: newResult, elements: elements_1 });
                    // do an in-place replacement of the old result with the new result.
                    // this ensures any repeats bound to this.results will not thrash.
                    this_1.results.splice(this_1.results.indexOf(oldResult), 1, newResult);
                    if (!oldResult.valid && newResult.valid) {
                        this_1.errors.splice(this_1.errors.indexOf(oldResult), 1);
                    }
                    else if (!oldResult.valid && !newResult.valid) {
                        this_1.errors.splice(this_1.errors.indexOf(oldResult), 1, newResult);
                    }
                    else if (!newResult.valid) {
                        this_1.errors.push(newResult);
                    }
                }
            };
            var this_1 = this;
            // create unrender instructions from the old results.
            for (var _i = 0, oldResults_1 = oldResults; _i < oldResults_1.length; _i++) {
                var oldResult = oldResults_1[_i];
                _loop_1(oldResult);
            }
            // create render instructions from the remaining new results.
            for (var _a = 0, newResults_1 = newResults; _a < newResults_1.length; _a++) {
                var result = newResults_1[_a];
                var elements = this.getAssociatedElements(result);
                instruction.render.push({ result: result, elements: elements });
                this.elements.set(result, elements);
                this.results.push(result);
                if (!result.valid) {
                    this.errors.push(result);
                }
            }
            // render.
            for (var _b = 0, _c = this.renderers; _b < _c.length; _b++) {
                var renderer = _c[_b];
                renderer.render(instruction);
            }
        };
        /**
         * Validates the property associated with a binding.
         */
        ValidationController.prototype.validateBinding = function (binding) {
            if (!binding.isBound) {
                return;
            }
            var propertyInfo = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source);
            var rules = undefined;
            var registeredBinding = this.bindings.get(binding);
            if (registeredBinding) {
                rules = registeredBinding.rules;
                registeredBinding.propertyInfo = propertyInfo;
            }
            if (!propertyInfo) {
                return;
            }
            var object = propertyInfo.object, propertyName = propertyInfo.propertyName;
            this.validate({ object: object, propertyName: propertyName, rules: rules });
        };
        /**
         * Resets the results for a property associated with a binding.
         */
        ValidationController.prototype.resetBinding = function (binding) {
            var registeredBinding = this.bindings.get(binding);
            var propertyInfo = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source);
            if (!propertyInfo && registeredBinding) {
                propertyInfo = registeredBinding.propertyInfo;
            }
            if (registeredBinding) {
                registeredBinding.propertyInfo = null;
            }
            if (!propertyInfo) {
                return;
            }
            var object = propertyInfo.object, propertyName = propertyInfo.propertyName;
            this.reset({ object: object, propertyName: propertyName });
        };
        return ValidationController;
    }());
    ValidationController.inject = [validator_1.Validator];
    exports.ValidationController = ValidationController;
});

define('aurelia-validation/validator',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Validates objects and properties.
     */
    var Validator = (function () {
        function Validator() {
        }
        return Validator;
    }());
    exports.Validator = Validator;
});

define('aurelia-validation/validate-result',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * The result of validating an individual validation rule.
     */
    var ValidateResult = (function () {
        /**
         * @param rule The rule associated with the result. Validator implementation specific.
         * @param object The object that was validated.
         * @param propertyName The name of the property that was validated.
         * @param error The error, if the result is a validation error.
         */
        function ValidateResult(rule, object, propertyName, valid, message) {
            if (message === void 0) { message = null; }
            this.rule = rule;
            this.object = object;
            this.propertyName = propertyName;
            this.valid = valid;
            this.message = message;
            this.id = ValidateResult.nextId++;
        }
        ValidateResult.prototype.toString = function () {
            return this.valid ? 'Valid.' : this.message;
        };
        return ValidateResult;
    }());
    ValidateResult.nextId = 0;
    exports.ValidateResult = ValidateResult;
});

define('aurelia-validation/validation-controller-factory',["require", "exports", "./validation-controller", "./validator"], function (require, exports, validation_controller_1, validator_1) {
    "use strict";
    /**
     * Creates ValidationController instances.
     */
    var ValidationControllerFactory = (function () {
        function ValidationControllerFactory(container) {
            this.container = container;
        }
        ValidationControllerFactory.get = function (container) {
            return new ValidationControllerFactory(container);
        };
        /**
         * Creates a new controller instance.
         */
        ValidationControllerFactory.prototype.create = function (validator) {
            if (!validator) {
                validator = this.container.get(validator_1.Validator);
            }
            return new validation_controller_1.ValidationController(validator);
        };
        /**
         * Creates a new controller and registers it in the current element's container so that it's
         * available to the validate binding behavior and renderers.
         */
        ValidationControllerFactory.prototype.createForCurrentScope = function (validator) {
            var controller = this.create(validator);
            this.container.registerInstance(validation_controller_1.ValidationController, controller);
            return controller;
        };
        return ValidationControllerFactory;
    }());
    exports.ValidationControllerFactory = ValidationControllerFactory;
    ValidationControllerFactory['protocol:aurelia:resolver'] = true;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-validation/validation-errors-custom-attribute',["require", "exports", "aurelia-binding", "aurelia-dependency-injection", "aurelia-templating", "./validation-controller"], function (require, exports, aurelia_binding_1, aurelia_dependency_injection_1, aurelia_templating_1, validation_controller_1) {
    "use strict";
    var ValidationErrorsCustomAttribute = (function () {
        function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
            this.boundaryElement = boundaryElement;
            this.controllerAccessor = controllerAccessor;
            this.errors = [];
        }
        ValidationErrorsCustomAttribute.prototype.sort = function () {
            this.errors.sort(function (a, b) {
                if (a.targets[0] === b.targets[0]) {
                    return 0;
                }
                /* tslint:disable:no-bitwise */
                return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
                /* tslint:enable:no-bitwise */
            });
        };
        ValidationErrorsCustomAttribute.prototype.interestingElements = function (elements) {
            var _this = this;
            return elements.filter(function (e) { return _this.boundaryElement.contains(e); });
        };
        ValidationErrorsCustomAttribute.prototype.render = function (instruction) {
            var _loop_1 = function (result) {
                var index = this_1.errors.findIndex(function (x) { return x.error === result; });
                if (index !== -1) {
                    this_1.errors.splice(index, 1);
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
                var result = _a[_i].result;
                _loop_1(result);
            }
            for (var _b = 0, _c = instruction.render; _b < _c.length; _b++) {
                var _d = _c[_b], result = _d.result, elements = _d.elements;
                if (result.valid) {
                    continue;
                }
                var targets = this.interestingElements(elements);
                if (targets.length) {
                    this.errors.push({ error: result, targets: targets });
                }
            }
            this.sort();
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.bind = function () {
            this.controllerAccessor().addRenderer(this);
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.unbind = function () {
            this.controllerAccessor().removeRenderer(this);
        };
        return ValidationErrorsCustomAttribute;
    }());
    ValidationErrorsCustomAttribute.inject = [Element, aurelia_dependency_injection_1.Lazy.of(validation_controller_1.ValidationController)];
    ValidationErrorsCustomAttribute = __decorate([
        aurelia_templating_1.customAttribute('validation-errors', aurelia_binding_1.bindingMode.twoWay)
    ], ValidationErrorsCustomAttribute);
    exports.ValidationErrorsCustomAttribute = ValidationErrorsCustomAttribute;
});

define('aurelia-validation/validation-renderer-custom-attribute',["require", "exports", "./validation-controller"], function (require, exports, validation_controller_1) {
    "use strict";
    var ValidationRendererCustomAttribute = (function () {
        function ValidationRendererCustomAttribute() {
        }
        ValidationRendererCustomAttribute.prototype.created = function (view) {
            this.container = view.container;
        };
        ValidationRendererCustomAttribute.prototype.bind = function () {
            this.controller = this.container.get(validation_controller_1.ValidationController);
            this.renderer = this.container.get(this.value);
            this.controller.addRenderer(this.renderer);
        };
        ValidationRendererCustomAttribute.prototype.unbind = function () {
            this.controller.removeRenderer(this.renderer);
            this.controller = null;
            this.renderer = null;
        };
        return ValidationRendererCustomAttribute;
    }());
    exports.ValidationRendererCustomAttribute = ValidationRendererCustomAttribute;
});

define('aurelia-validation/implementation/rules',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Sets, unsets and retrieves rules on an object or constructor function.
     */
    var Rules = (function () {
        function Rules() {
        }
        /**
         * Applies the rules to a target.
         */
        Rules.set = function (target, rules) {
            if (target instanceof Function) {
                target = target.prototype;
            }
            Object.defineProperty(target, Rules.key, { enumerable: false, configurable: false, writable: true, value: rules });
        };
        /**
         * Removes rules from a target.
         */
        Rules.unset = function (target) {
            if (target instanceof Function) {
                target = target.prototype;
            }
            target[Rules.key] = null;
        };
        /**
         * Retrieves the target's rules.
         */
        Rules.get = function (target) {
            return target[Rules.key] || null;
        };
        return Rules;
    }());
    /**
     * The name of the property that stores the rules.
     */
    Rules.key = '__rules__';
    exports.Rules = Rules;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/implementation/standard-validator',["require", "exports", "aurelia-templating", "../validator", "../validate-result", "./rules", "./validation-messages"], function (require, exports, aurelia_templating_1, validator_1, validate_result_1, rules_1, validation_messages_1) {
    "use strict";
    /**
     * Validates.
     * Responsible for validating objects and properties.
     */
    var StandardValidator = (function (_super) {
        __extends(StandardValidator, _super);
        function StandardValidator(messageProvider, resources) {
            var _this = _super.call(this) || this;
            _this.messageProvider = messageProvider;
            _this.lookupFunctions = resources.lookupFunctions;
            _this.getDisplayName = messageProvider.getDisplayName.bind(messageProvider);
            return _this;
        }
        /**
         * Validates the specified property.
         * @param object The object to validate.
         * @param propertyName The name of the property to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        StandardValidator.prototype.validateProperty = function (object, propertyName, rules) {
            return this.validate(object, propertyName, rules || null);
        };
        /**
         * Validates all rules for specified object and it's properties.
         * @param object The object to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        StandardValidator.prototype.validateObject = function (object, rules) {
            return this.validate(object, null, rules || null);
        };
        /**
         * Determines whether a rule exists in a set of rules.
         * @param rules The rules to search.
         * @parem rule The rule to find.
         */
        StandardValidator.prototype.ruleExists = function (rules, rule) {
            var i = rules.length;
            while (i--) {
                if (rules[i].indexOf(rule) !== -1) {
                    return true;
                }
            }
            return false;
        };
        StandardValidator.prototype.getMessage = function (rule, object, value) {
            var expression = rule.message || this.messageProvider.getMessage(rule.messageKey);
            var _a = rule.property, propertyName = _a.name, displayName = _a.displayName;
            if (propertyName !== null) {
                displayName = this.messageProvider.getDisplayName(propertyName, displayName);
            }
            var overrideContext = {
                $displayName: displayName,
                $propertyName: propertyName,
                $value: value,
                $object: object,
                $config: rule.config,
                $getDisplayName: this.getDisplayName
            };
            return expression.evaluate({ bindingContext: object, overrideContext: overrideContext }, this.lookupFunctions);
        };
        StandardValidator.prototype.validateRuleSequence = function (object, propertyName, ruleSequence, sequence, results) {
            var _this = this;
            // are we validating all properties or a single property?
            var validateAllProperties = propertyName === null || propertyName === undefined;
            var rules = ruleSequence[sequence];
            var allValid = true;
            // validate each rule.
            var promises = [];
            var _loop_1 = function (i) {
                var rule = rules[i];
                // is the rule related to the property we're validating.
                if (!validateAllProperties && rule.property.name !== propertyName) {
                    return "continue";
                }
                // is this a conditional rule? is the condition met?
                if (rule.when && !rule.when(object)) {
                    return "continue";
                }
                // validate.
                var value = rule.property.name === null ? object : object[rule.property.name];
                var promiseOrBoolean = rule.condition(value, object);
                if (!(promiseOrBoolean instanceof Promise)) {
                    promiseOrBoolean = Promise.resolve(promiseOrBoolean);
                }
                promises.push(promiseOrBoolean.then(function (valid) {
                    var message = valid ? null : _this.getMessage(rule, object, value);
                    results.push(new validate_result_1.ValidateResult(rule, object, rule.property.name, valid, message));
                    allValid = allValid && valid;
                    return valid;
                }));
            };
            for (var i = 0; i < rules.length; i++) {
                _loop_1(i);
            }
            return Promise.all(promises)
                .then(function () {
                sequence++;
                if (allValid && sequence < ruleSequence.length) {
                    return _this.validateRuleSequence(object, propertyName, ruleSequence, sequence, results);
                }
                return results;
            });
        };
        StandardValidator.prototype.validate = function (object, propertyName, rules) {
            // rules specified?
            if (!rules) {
                // no. attempt to locate the rules.
                rules = rules_1.Rules.get(object);
            }
            // any rules?
            if (!rules) {
                return Promise.resolve([]);
            }
            return this.validateRuleSequence(object, propertyName, rules, 0, []);
        };
        return StandardValidator;
    }(validator_1.Validator));
    StandardValidator.inject = [validation_messages_1.ValidationMessageProvider, aurelia_templating_1.ViewResources];
    exports.StandardValidator = StandardValidator;
});

define('aurelia-validation/implementation/validation-messages',["require", "exports", "./validation-parser"], function (require, exports, validation_parser_1) {
    "use strict";
    /**
     * Dictionary of validation messages. [messageKey]: messageExpression
     */
    exports.validationMessages = {
        /**
         * The default validation message. Used with rules that have no standard message.
         */
        default: "${$displayName} is invalid.",
        required: "${$displayName} is required.",
        matches: "${$displayName} is not correctly formatted.",
        email: "${$displayName} is not a valid email.",
        minLength: "${$displayName} must be at least ${$config.length} character${$config.length === 1 ? '' : 's'}.",
        maxLength: "${$displayName} cannot be longer than ${$config.length} character${$config.length === 1 ? '' : 's'}.",
        minItems: "${$displayName} must contain at least ${$config.count} item${$config.count === 1 ? '' : 's'}.",
        maxItems: "${$displayName} cannot contain more than ${$config.count} item${$config.count === 1 ? '' : 's'}.",
        equals: "${$displayName} must be ${$config.expectedValue}.",
    };
    /**
     * Retrieves validation messages and property display names.
     */
    var ValidationMessageProvider = (function () {
        function ValidationMessageProvider(parser) {
            this.parser = parser;
        }
        /**
         * Returns a message binding expression that corresponds to the key.
         * @param key The message key.
         */
        ValidationMessageProvider.prototype.getMessage = function (key) {
            var message;
            if (key in exports.validationMessages) {
                message = exports.validationMessages[key];
            }
            else {
                message = exports.validationMessages['default'];
            }
            return this.parser.parseMessage(message);
        };
        /**
         * Formulates a property display name using the property name and the configured
         * displayName (if provided).
         * Override this with your own custom logic.
         * @param propertyName The property name.
         */
        ValidationMessageProvider.prototype.getDisplayName = function (propertyName, displayName) {
            if (displayName !== null && displayName !== undefined) {
                return displayName;
            }
            // split on upper-case letters.
            var words = propertyName.split(/(?=[A-Z])/).join(' ');
            // capitalize first letter.
            return words.charAt(0).toUpperCase() + words.slice(1);
        };
        return ValidationMessageProvider;
    }());
    ValidationMessageProvider.inject = [validation_parser_1.ValidationParser];
    exports.ValidationMessageProvider = ValidationMessageProvider;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/implementation/validation-parser',["require", "exports", "aurelia-binding", "aurelia-templating", "./util", "aurelia-logging"], function (require, exports, aurelia_binding_1, aurelia_templating_1, util_1, LogManager) {
    "use strict";
    var ValidationParser = (function () {
        function ValidationParser(parser, bindinqLanguage) {
            this.parser = parser;
            this.bindinqLanguage = bindinqLanguage;
            this.emptyStringExpression = new aurelia_binding_1.LiteralString('');
            this.nullExpression = new aurelia_binding_1.LiteralPrimitive(null);
            this.undefinedExpression = new aurelia_binding_1.LiteralPrimitive(undefined);
            this.cache = {};
        }
        ValidationParser.prototype.parseMessage = function (message) {
            if (this.cache[message] !== undefined) {
                return this.cache[message];
            }
            var parts = this.bindinqLanguage.parseInterpolation(null, message);
            if (parts === null) {
                return new aurelia_binding_1.LiteralString(message);
            }
            var expression = new aurelia_binding_1.LiteralString(parts[0]);
            for (var i = 1; i < parts.length; i += 2) {
                expression = new aurelia_binding_1.Binary('+', expression, new aurelia_binding_1.Binary('+', this.coalesce(parts[i]), new aurelia_binding_1.LiteralString(parts[i + 1])));
            }
            MessageExpressionValidator.validate(expression, message);
            this.cache[message] = expression;
            return expression;
        };
        ValidationParser.prototype.parseProperty = function (property) {
            if (util_1.isString(property)) {
                return { name: property, displayName: null };
            }
            var accessor = this.getAccessorExpression(property.toString());
            if (accessor instanceof aurelia_binding_1.AccessScope
                || accessor instanceof aurelia_binding_1.AccessMember && accessor.object instanceof aurelia_binding_1.AccessScope) {
                return {
                    name: accessor.name,
                    displayName: null
                };
            }
            throw new Error("Invalid subject: \"" + accessor + "\"");
        };
        ValidationParser.prototype.coalesce = function (part) {
            // part === null || part === undefined ? '' : part
            return new aurelia_binding_1.Conditional(new aurelia_binding_1.Binary('||', new aurelia_binding_1.Binary('===', part, this.nullExpression), new aurelia_binding_1.Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new aurelia_binding_1.CallMember(part, 'toString', []));
        };
        ValidationParser.prototype.getAccessorExpression = function (fn) {
            var classic = /^function\s*\([$_\w\d]+\)\s*\{\s*(?:"use strict";)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
            var arrow = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
            var match = classic.exec(fn) || arrow.exec(fn);
            if (match === null) {
                throw new Error("Unable to parse accessor function:\n" + fn);
            }
            return this.parser.parse(match[1]);
        };
        return ValidationParser;
    }());
    ValidationParser.inject = [aurelia_binding_1.Parser, aurelia_templating_1.BindingLanguage];
    exports.ValidationParser = ValidationParser;
    var MessageExpressionValidator = (function (_super) {
        __extends(MessageExpressionValidator, _super);
        function MessageExpressionValidator(originalMessage) {
            var _this = _super.call(this, []) || this;
            _this.originalMessage = originalMessage;
            return _this;
        }
        MessageExpressionValidator.validate = function (expression, originalMessage) {
            var visitor = new MessageExpressionValidator(originalMessage);
            expression.accept(visitor);
        };
        MessageExpressionValidator.prototype.visitAccessScope = function (access) {
            if (access.ancestor !== 0) {
                throw new Error('$parent is not permitted in validation message expressions.');
            }
            if (['displayName', 'propertyName', 'value', 'object', 'config', 'getDisplayName'].indexOf(access.name) !== -1) {
                LogManager.getLogger('aurelia-validation')
                    .warn("Did you mean to use \"$" + access.name + "\" instead of \"" + access.name + "\" in this validation message template: \"" + this.originalMessage + "\"?");
            }
        };
        return MessageExpressionValidator;
    }(aurelia_binding_1.Unparser));
    exports.MessageExpressionValidator = MessageExpressionValidator;
});

define('aurelia-validation/implementation/util',["require", "exports"], function (require, exports) {
    "use strict";
    function isString(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    }
    exports.isString = isString;
});

define('aurelia-validation/implementation/validation-rules',["require", "exports", "./util", "./rules", "./validation-messages"], function (require, exports, util_1, rules_1, validation_messages_1) {
    "use strict";
    /**
     * Part of the fluent rule API. Enables customizing property rules.
     */
    var FluentRuleCustomizer = (function () {
        function FluentRuleCustomizer(property, condition, config, fluentEnsure, fluentRules, parser) {
            if (config === void 0) { config = {}; }
            this.fluentEnsure = fluentEnsure;
            this.fluentRules = fluentRules;
            this.parser = parser;
            this.rule = {
                property: property,
                condition: condition,
                config: config,
                when: null,
                messageKey: 'default',
                message: null,
                sequence: fluentRules.sequence
            };
            this.fluentEnsure._addRule(this.rule);
        }
        /**
         * Validate subsequent rules after previously declared rules have
         * been validated successfully. Use to postpone validation of costly
         * rules until less expensive rules pass validation.
         */
        FluentRuleCustomizer.prototype.then = function () {
            this.fluentRules.sequence++;
            return this;
        };
        /**
         * Specifies the key to use when looking up the rule's validation message.
         */
        FluentRuleCustomizer.prototype.withMessageKey = function (key) {
            this.rule.messageKey = key;
            this.rule.message = null;
            return this;
        };
        /**
         * Specifies rule's validation message.
         */
        FluentRuleCustomizer.prototype.withMessage = function (message) {
            this.rule.messageKey = 'custom';
            this.rule.message = this.parser.parseMessage(message);
            return this;
        };
        /**
         * Specifies a condition that must be met before attempting to validate the rule.
         * @param condition A function that accepts the object as a parameter and returns true
         * or false whether the rule should be evaluated.
         */
        FluentRuleCustomizer.prototype.when = function (condition) {
            this.rule.when = condition;
            return this;
        };
        /**
         * Tags the rule instance, enabling the rule to be found easily
         * using ValidationRules.taggedRules(rules, tag)
         */
        FluentRuleCustomizer.prototype.tag = function (tag) {
            this.rule.tag = tag;
            return this;
        };
        ///// FluentEnsure APIs /////
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        FluentRuleCustomizer.prototype.ensure = function (subject) {
            return this.fluentEnsure.ensure(subject);
        };
        /**
         * Targets an object with validation rules.
         */
        FluentRuleCustomizer.prototype.ensureObject = function () {
            return this.fluentEnsure.ensureObject();
        };
        Object.defineProperty(FluentRuleCustomizer.prototype, "rules", {
            /**
             * Rules that have been defined using the fluent API.
             */
            get: function () {
                return this.fluentEnsure.rules;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        FluentRuleCustomizer.prototype.on = function (target) {
            return this.fluentEnsure.on(target);
        };
        ///////// FluentRules APIs /////////
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        FluentRuleCustomizer.prototype.satisfies = function (condition, config) {
            return this.fluentRules.satisfies(condition, config);
        };
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        FluentRuleCustomizer.prototype.satisfiesRule = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.fluentRules).satisfiesRule.apply(_a, [name].concat(args));
            var _a;
        };
        /**
         * Applies the "required" rule to the property.
         * The value cannot be null, undefined or whitespace.
         */
        FluentRuleCustomizer.prototype.required = function () {
            return this.fluentRules.required();
        };
        /**
         * Applies the "matches" rule to the property.
         * Value must match the specified regular expression.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.matches = function (regex) {
            return this.fluentRules.matches(regex);
        };
        /**
         * Applies the "email" rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.email = function () {
            return this.fluentRules.email();
        };
        /**
         * Applies the "minLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.minLength = function (length) {
            return this.fluentRules.minLength(length);
        };
        /**
         * Applies the "maxLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.maxLength = function (length) {
            return this.fluentRules.maxLength(length);
        };
        /**
         * Applies the "minItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRuleCustomizer.prototype.minItems = function (count) {
            return this.fluentRules.minItems(count);
        };
        /**
         * Applies the "maxItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRuleCustomizer.prototype.maxItems = function (count) {
            return this.fluentRules.maxItems(count);
        };
        /**
         * Applies the "equals" validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.equals = function (expectedValue) {
            return this.fluentRules.equals(expectedValue);
        };
        return FluentRuleCustomizer;
    }());
    exports.FluentRuleCustomizer = FluentRuleCustomizer;
    /**
     * Part of the fluent rule API. Enables applying rules to properties and objects.
     */
    var FluentRules = (function () {
        function FluentRules(fluentEnsure, parser, property) {
            this.fluentEnsure = fluentEnsure;
            this.parser = parser;
            this.property = property;
            /**
             * Current rule sequence number. Used to postpone evaluation of rules until rules
             * with lower sequence number have successfully validated. The "then" fluent API method
             * manages this property, there's usually no need to set it directly.
             */
            this.sequence = 0;
        }
        /**
         * Sets the display name of the ensured property.
         */
        FluentRules.prototype.displayName = function (name) {
            this.property.displayName = name;
            return this;
        };
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        FluentRules.prototype.satisfies = function (condition, config) {
            return new FluentRuleCustomizer(this.property, condition, config, this.fluentEnsure, this, this.parser);
        };
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        FluentRules.prototype.satisfiesRule = function (name) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var rule = FluentRules.customRules[name];
            if (!rule) {
                // standard rule?
                rule = this[name];
                if (rule instanceof Function) {
                    return rule.call.apply(rule, [this].concat(args));
                }
                throw new Error("Rule with name \"" + name + "\" does not exist.");
            }
            var config = rule.argsToConfig ? rule.argsToConfig.apply(rule, args) : undefined;
            return this.satisfies(function (value, obj) {
                return (_a = rule.condition).call.apply(_a, [_this, value, obj].concat(args));
                var _a;
            }, config)
                .withMessageKey(name);
        };
        /**
         * Applies the "required" rule to the property.
         * The value cannot be null, undefined or whitespace.
         */
        FluentRules.prototype.required = function () {
            return this.satisfies(function (value) {
                return value !== null
                    && value !== undefined
                    && !(util_1.isString(value) && !/\S/.test(value));
            }).withMessageKey('required');
        };
        /**
         * Applies the "matches" rule to the property.
         * Value must match the specified regular expression.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.matches = function (regex) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || regex.test(value); })
                .withMessageKey('matches');
        };
        /**
         * Applies the "email" rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.email = function () {
            // regex from https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
            /* tslint:disable:max-line-length */
            return this.matches(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
                .withMessageKey('email');
        };
        /**
         * Applies the "minLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.minLength = function (length) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length >= length; }, { length: length })
                .withMessageKey('minLength');
        };
        /**
         * Applies the "maxLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.maxLength = function (length) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length <= length; }, { length: length })
                .withMessageKey('maxLength');
        };
        /**
         * Applies the "minItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.minItems = function (count) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length >= count; }, { count: count })
                .withMessageKey('minItems');
        };
        /**
         * Applies the "maxItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.maxItems = function (count) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length <= count; }, { count: count })
                .withMessageKey('maxItems');
        };
        /**
         * Applies the "equals" validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.equals = function (expectedValue) {
            return this.satisfies(function (value) { return value === null || value === undefined || value === '' || value === expectedValue; }, { expectedValue: expectedValue })
                .withMessageKey('equals');
        };
        return FluentRules;
    }());
    FluentRules.customRules = {};
    exports.FluentRules = FluentRules;
    /**
     * Part of the fluent rule API. Enables targeting properties and objects with rules.
     */
    var FluentEnsure = (function () {
        function FluentEnsure(parser) {
            this.parser = parser;
            /**
             * Rules that have been defined using the fluent API.
             */
            this.rules = [];
        }
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor
         * function.
         */
        FluentEnsure.prototype.ensure = function (property) {
            this.assertInitialized();
            return new FluentRules(this, this.parser, this.parser.parseProperty(property));
        };
        /**
         * Targets an object with validation rules.
         */
        FluentEnsure.prototype.ensureObject = function () {
            this.assertInitialized();
            return new FluentRules(this, this.parser, { name: null, displayName: null });
        };
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        FluentEnsure.prototype.on = function (target) {
            rules_1.Rules.set(target, this.rules);
            return this;
        };
        /**
         * Adds a rule definition to the sequenced ruleset.
         */
        FluentEnsure.prototype._addRule = function (rule) {
            while (this.rules.length < rule.sequence + 1) {
                this.rules.push([]);
            }
            this.rules[rule.sequence].push(rule);
        };
        FluentEnsure.prototype.assertInitialized = function () {
            if (this.parser) {
                return;
            }
            throw new Error("Did you forget to add \".plugin('aurelia-validation)\" to your main.js?");
        };
        return FluentEnsure;
    }());
    exports.FluentEnsure = FluentEnsure;
    /**
     * Fluent rule definition API.
     */
    var ValidationRules = (function () {
        function ValidationRules() {
        }
        ValidationRules.initialize = function (parser) {
            ValidationRules.parser = parser;
        };
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        ValidationRules.ensure = function (property) {
            return new FluentEnsure(ValidationRules.parser).ensure(property);
        };
        /**
         * Targets an object with validation rules.
         */
        ValidationRules.ensureObject = function () {
            return new FluentEnsure(ValidationRules.parser).ensureObject();
        };
        /**
         * Defines a custom rule.
         * @param name The name of the custom rule. Also serves as the message key.
         * @param condition The rule function.
         * @param message The message expression
         * @param argsToConfig A function that maps the rule's arguments to a "config"
         * object that can be used when evaluating the message expression.
         */
        ValidationRules.customRule = function (name, condition, message, argsToConfig) {
            validation_messages_1.validationMessages[name] = message;
            FluentRules.customRules[name] = { condition: condition, argsToConfig: argsToConfig };
        };
        /**
         * Returns rules with the matching tag.
         * @param rules The rules to search.
         * @param tag The tag to search for.
         */
        ValidationRules.taggedRules = function (rules, tag) {
            return rules.map(function (x) { return x.filter(function (r) { return r.tag === tag; }); });
        };
        /**
         * Removes the rules from a class or object.
         * @param target A class or object.
         */
        ValidationRules.off = function (target) {
            rules_1.Rules.unset(target);
        };
        return ValidationRules;
    }());
    exports.ValidationRules = ValidationRules;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./styles.css\"></require>\n  <require from=\"platform/platform\"></require>\n  <require from=\"apps/apps\"></require>\n  <require from=\"network/network\"></require>\n  <require from=\"lib/route-highlight\"></require>\n\n  <img height=40 src=\"images/eridien-logo.jpg\">\n  <div class=\"xy-hdr\">\n    XY ${router.currentInstruction.config.title}\n  </div>\n\n  <nav class=\"navbar\" role=\"navigation\">\n    <a class=\"nav-btn\" route-href=\"route: platform\"\n      route-highlight=\"routes: platform\">Platform</a>\n    <a class=\"nav-btn\" route-href=\"route: apps\"\n      route-highlight=\"routes: apps\">Apps</a>\n    <a class=\"nav-btn\" route-href=\"route: network\"\n       route-highlight=\"routes: network\">Network</a>\n  </nav>\n\n  <router-view> </router-view>\n\n</template>\n"; });
define('text!ssid-form.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"margin:50px 0 15px 0; border:1px solid black; padding:5px\">\n\n    <h4 show.bind=\"!isVisible\"; style=\"margin-top:0px\">Loading WiFi settings ...</h4>\n\n    <form action=\"#\" show.bind=\"isVisible\">\n      <h4>XY AP settings</h4>\n      <table class=\"ssid-table\">\n        <tr>\n          <th>SSID</th>\n          <th>Password</th>\n        </tr>\n        <tr>\n          <td><input value.bind=\"apSsid\">\n          <td><input type=\"password\" value.bind=\"apPwd\">\n        </tr>\n      </table>\n      <h4>Other AP settings</h4>\n      <table class=\"ssid-table\">\n        <tr>\n          <th>SSID</th>\n          <th>Password</th>\n          <th>Static IP (optional)</th>\n        </tr>\n        <tr repeat.for=\"ssid of eeprom_ssids\">\n          <td><input value.bind=\"ssid.ssid\">\n          <td><input type=\"password\" value.bind=\"ssid.password\">\n          <td><input value.bind=\"ssid.staticIp\">\n        </tr>\n      </table>\n      <button click.trigger=\"refresh()\">Reset</button>\n      <button click.trigger=\"submit()\">Save</button>\n    </form>\n  </div>\n</template>\n"; });
define('text!styles.css', ['module'], function(module) { module.exports = "html {\n  box-sizing: border-box;\n}\n*,\n*:before,\n*:after {\n  box-sizing: inherit;\n}\na {\n  text-decoration: none;\n  color: black;\n}\nbody {\n  padding: 10px 20px;\n}\n.navbar {\n  border: 1px solid black;\n  padding: 4px;\n}\n.xy-hdr {\n  float: right;\n  font-size: 20px;\n  font-weight: bold;\n  margin-top: 15px;\n}\n.nav-btn {\n  padding: 2px;\n  border: 1px solid gray;\n  font-weight: bold;\n  border-radius: 5px;\n  background-color: #eee;\n  margin: 5px;\n}\n.nav-btn.active {\n  color: gray;\n}\n.router-view {\n  width: 100%;\n  margin-top: 15px;\n}\n.ssid-table {\n  margin-top: 5px;\n}\n.ssid-table th {\n  text-align: left;\n}\n.ssid-table td {\n  padding: 3px 5px;\n}\n.ssid-table td button {\n  margin-right: 15px;\n}\n"; });
define('text!apps/apps.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"router-view\">\n    APPS\n  <div>\n</template>\n"; });
define('text!network/network.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./ssid-form\"></require>\n  <require from=\"./ssid-list\"></require>\n\n  <div class=\"router-view\">\n    <ssid-form></ssid-form>\n    <ssid-list></ssid-list>\n  <div>\n</template>\n"; });
define('text!network/ssid-form.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"margin:50px 0 15px 0; border:1px solid black; padding:5px\">\n\n    <h4 show.bind=\"!isVisible\"; style=\"margin-top:0px\">Loading WiFi settings ...</h4>\n\n    <form action=\"#\" show.bind=\"isVisible\">\n      <h4>XY AP settings</h4>\n      <table class=\"ssid-table\">\n        <tr>\n          <th>SSID</th>\n          <th>Password</th>\n        </tr>\n        <tr>\n          <td><input value.bind=\"apSsid & validate\">\n          <td><input type=\"password\" value.bind=\"apPwd & validate\">\n        </tr>\n      </table>\n      <h4>Other AP settings</h4>\n      <table class=\"ssid-table\">\n        <tr>\n          <th>SSID</th>\n          <th>Password</th>\n          <th>Static IP (optional)</th>\n        </tr>\n        <tr repeat.for=\"ssid of eeprom_ssids\">\n          <td><input value.bind=\"ssid.ssid\">\n          <td><input type=\"password\" value.bind=\"ssid.password\">\n          <td><input value.bind=\"ssid.staticIp\">\n        </tr>\n      </table>\n      <button click.trigger=\"submit()\">Save</button>\n      <button click.trigger=\"refresh()\" style=\"margin-left:20px\">Reset</button>\n      <ul if.bind=\"controller.errors\">\n        <li style=\"color:red\" repeat.for=\"error of controller.errors\">\n          ${error.message}\n        </li>\n      </ul>\n    </form>\n  </div>\n</template>\n"; });
define('text!network/ssid-list.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"margin:50px 0 15px 0; border:1px solid black;\n              padding:5px; min-height:50px\">\n\n  <div style=\"font-weight:bold; float:left; margin-top:0px\"\n       show.bind=\"!isVisible\">Scanning for SSIDs ...</div>\n  <div style=\"font-weight:bold; float:left; margin:15px 0;\"\n       show.bind=\"isVisible\">Add SSID to list above.\n  </div>\n  <button  show.bind=\"isVisible\" style=\"margin:15px 20px\"\n           click.trigger=\"refresh()\" type=\"submit\">Refresh</button>\n\n  <table class=\"ssid-table\" show.bind=\"isVisible\">\n    <tr>\n      <th></th>\n      <th>SSID</th>\n      <th>Strength</th>\n      <th style=\"padding-right:10px; text-align:right\">Open</th>\n    </tr>\n    <tr repeat.for=\"ssid of ssids\">\n      <td><button click.delegate=\"add(ssid)\">Add</button></td>\n      <td>${ssid.ssid}</td>\n      <td style=\"text-align:right\">${ssid.rssi}</td>\n      <td style=\"text-align:right\">${ssid.encryptionType}</td>\n    </tr>\n  </table>\n</template>\n"; });
define('text!platform/platform.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"router-view\">\n    PLATFORM\n  <div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map