// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dom.js":[function(require,module,exports) {
window.dom = {
  create: function create(string) {
    /*container 容器 template可以容纳任何标签*/
    var container = document.createElement("template");
    /*string.trim()表示把字符串前面的空格消除掉 */

    container.innerHTML = string.trim();
    /*返回容器内的第一个孩子 */

    return container.content.firstChild;
  },
  after: function after(node, node2) {
    /*找到节点的父亲把节点2放到节点1的下一个节点的前面，也就是节点2放到节点1的后面 */
    node.parentNode.insertBefore(node2, node.nextSibling);
  },
  before: function before(node, node2) {
    /*同上,把节点2放到节点1的前面 */
    node.parentNode.insertBefore(node2, node);
  },
  append: function append(parent, node) {
    /*父节点后添加子节点 */
    parent.appendChild(node);
  },
  wrap: function wrap(node, parent) {
    /*创造父节点 */

    /*这里犯过错,这里调用的是新增各个接口,我们只是把node和parent赋值过去,内部还是把parent放到node的前面*/
    dom.before(node, parent); // console.log(parent);

    dom.append(parent, node);
  },
  remove: function remove(node) {
    /*找到节点的父亲然后删除他的子节点 */
    node.parentNode.removeChild(node); //这里return的作用是返回被移除对象,然后通过let div=dom.remove(div),获取到被删除的元素

    return node;
  },
  empty: function empty(node) {
    /*移除这个节点下的所有子节点 */

    /*高级语法(解构赋值)类比：const childNodes = node.childNodes; 获取节点所有的子节点 */
    // const {childNodes} = node;
    var array = [];
    var x = node.firstChild;

    while (x) {
      array.push(dom.remove(node.firstChild)); //这里重新赋值时因为第一个子节点已经移除，这里已经是后面的子节点了

      x = node.firstChild;
    } // for(let i = 0;i<childNodes.length;i++){
    //     //这里不能用childNodes,它会实时更新,所以长度会实时变化
    //     dom.remove(childNodes[i]);
    //     //删除掉所有节点,想把删除的节点放到数组中保留
    //     array.push(childNodes[i]);
    // }
    // //返回数组,通过数组在把删除掉的子节点拿到


    return array;
  },
  attr: function attr(node, name, value) {
    //根据参数个数写不同的方法叫重载
    if (arguments.length === 3) {
      //如果长度等于3，那么就修改值
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      //如果长度=2,就获取值
      return node.getAttribute(name);
    }
  },
  //arguments获取函数传递值的个数
  text: function text(node, string) {
    //修改文本内容  根据不同的情况选用不同的方法就叫做：适配
    if (arguments.length === 2) {
      //2个修改文本
      if ('innerText' in node) {
        //看innerText方法在node里面吗
        node.innerHTML = string;
      } else {
        node.textContent = string;
      }
    } else if (arguments.length === 1) {
      //1个读取文本
      if ('innerText' in node) {
        return node.innerText;
      } else {
        return node.textContent;
      }
    }
  },
  html: function html(node, string) {
    //重载
    if (arguments === 2) {
      node.innerHTML = string;
    } else if (arguments === 1) {
      return node.innerHTML;
    }
  },
  style: function style(node, name, value) {
    if (arguments.length === 3) {
      //dom.style(div,'color','red')  修改单个值
      node.style[name] = value;
    } else if (arguments === 2) {
      //dom.style(div,'color')  读取值
      return node.style[name];
    } else if (name instanceof Object) {
      //如果name值属于对象
      //div.style(div,{color:'red'})
      var object = name;

      for (var key in object) {
        //如果key(color)值在name{color:'red'}里
        node.style[key] = object[key]; //节点的样式style的key值就替换成object里的key值  修改多个值 键值对  
      }
    }
  },
  class: {
    add: function add(node, className) {
      node.classList.add(className);
    },
    remove: function remove(node, className) {
      node.classList.remove(className);
    },
    has: function has(node, className) {
      //判断这个类值是否在这个类里
      return node.classList.contains(className);
    }
  },
  on: function on(node, eventName, fn) {
    //附着节点监听
    node.addEventListener(eventName, fn);
  },
  off: function off(node, eventName, fn) {
    //移除节点监听
    node, removeEventListener(eventName, fn);
  },
  //查
  find: function find(selector, scope) {
    //查找某个元素在特定的id里吗？，如果不在就去document文本里找
    var x = (scope || document).querySelectorAll(selector);
  },
  parent: function parent(node) {
    return node.parentNode;
  },
  children: function children(node) {
    return node.children;
  },
  siblings: function siblings(node) {
    //把node的子节点转换成数组然后遍历除自己外的所有子节点
    //filter函数表示过滤器，元素过滤掉自己
    return Array.from(node.parentNode.children).filter(function (n) {
      return n != node;
    });
  },
  next: function next(node) {
    var x = node.nextSibling; //nextSibling表示node后面的数

    while (x.nodeType === 3) {
      //DOM里nodeType的3表示文本，如果是文本（空格回车）就下一个子元素
      x = x.nextSibling;
    }

    return x;
  },
  previous: function previous(node) {
    var x = node.previousSibling; //表示node节点的上一个数

    while (x && x.nodeType === 3) {
      //如果x存在，且不是空格回车等
      x = x.previousSibling;
    }

    return x;
  },
  each: function each(nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]); //null传的是this
    }
  },
  index: function index(node) {
    var list = dom.children(node.parentNode);
    var i;

    for (i = 0; i < list.length; i++) {
      if (list[i] === node) {
        break;
      }
    }

    return i;
  }
};
},{}],"C:/Users/86178/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53937" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/86178/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","dom.js"], null)
//# sourceMappingURL=/dom.1d0b6d56.js.map