/* jshint ignore:start */

/* jshint ignore:end */

define('emberjs-async-button/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'emberjs-async-button/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('emberjs-async-button/components/async-button', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: 'a',
    attributeBindings: ['href'],
    href: '#',
    classNames: ['async-button', 'btn'],
    classNameBindings: ['inProgress'],

    timeout: 60000,
    timeoutAction: null,
    timeouter: null,

    inProgress: false,
    stopProgress: function stopProgress() {
      if (!this.get('isDestroyed')) {
        var timeouter = this.get('timeouter');
        if (timeouter) {
          Ember['default'].run.cancel(timeouter);
          this.set('timeouter', null);
        }
        this.set('inProgress', false);
      }
    },
    timeoutFn: function timeoutFn() {
      if (!this.get('isDestroyed')) {
        var timeoutAction = this.get('timeoutAction');
        if (timeoutAction) {
          var params = ['timeoutAction'];
          params.addObjects(this.get('params'));
          this.sendAction.apply(this, params);
        }
        this.stopProgress();
      }
    },

    action: null,
    param1: undefined,
    param2: undefined,
    param3: undefined,
    param4: undefined,
    param5: undefined,
    params: (function () {
      var params = [];
      for (var i = 1; i <= 5; i++) {
        var param = this.get('param' + i);
        if (param !== undefined) {
          params.push(param);
        }
      }
      return params;
    }).property('param1', 'param2', 'param3', 'param4', 'param5'),

    eventManager: Ember['default'].Object.create({
      click: function click(ev, view) {
        ev.preventDefault();
        var context = view;
        while (context.get('classNames').indexOf('async-button') < 0) {
          context = context.get('parentView');
        }

        context.click.call(context);
      }
    }),

    click: function click() {
      var action = this.get('action');
      if (action) {
        var inProgress = this.get('inProgress');
        if (!inProgress) {
          this.toggleProperty('inProgress');
          var resolve = Ember['default'].run.bind(this, this.stopProgress);
          var timeoutFn = Ember['default'].run.bind(this, this.timeoutFn);

          this.set('timeouter', Ember['default'].run.later(this, timeoutFn, this.get('timeout')));

          var params = ['action'];
          params.addObjects(this.get('params'));
          params.addObject(resolve);
          this.sendAction.apply(this, params);
        }
      }
    },

    willDestroy: function willDestroy() {
      this.stopProgress();
      return this._super();
    }
  });

});
define('emberjs-async-button/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('emberjs-async-button/controllers/async-button-playground', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    actionsArray: (function () {
      return [];
    }).property(),

    param2: 'PARAM BOUND',
    param3: 'PARAM IN ACTION3',

    actions: {
      clearArray: function clearArray(array, resolve) {
        array.clear();
        resolve();
      },

      action1: function action1(param1, param2, resolve) {
        var actions = this.get('actionsArray');
        actions.addObject({
          text: 'action1 triggered, param1 value: %@, param2 value: %@'.fmt(param1, param2)
        });
        Ember['default'].run.later(function () {
          actions.addObject({
            text: 'action1 finished'
          });
          resolve();
        }, 1000);
      },

      action2: function action2(resolve) {
        var actions = this.get('actionsArray');
        actions.addObject({
          text: 'action2 triggered and finished'
        });
        resolve();
      },

      action3: function action3(param1 /*, resolve*/) {
        var actions = this.get('actionsArray');
        actions.addObject({
          text: 'action3 triggered, param1 value: %@'.fmt(param1)
        });
      },
      action3Timeout: function action3Timeout(param1) {
        var actions = this.get('actionsArray');
        actions.addObject({
          text: 'action3 timeout, param1 value: %@'.fmt(param1)
        });
      }
    }
  });

});
define('emberjs-async-button/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('emberjs-async-button/initializers/app-version', ['exports', 'emberjs-async-button/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('emberjs-async-button/initializers/export-application-global', ['exports', 'ember', 'emberjs-async-button/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('emberjs-async-button/router', ['exports', 'ember', 'emberjs-async-button/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {});

  exports['default'] = Router;

});
define('emberjs-async-button/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        dom.setAttribute(el1,"id","title");
        var el2 = dom.createTextNode("Async Button");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,2,2,contextualElement);
        var morph1 = dom.createMorphAt(fragment,4,4,contextualElement);
        inline(env, morph0, context, "render", ["async-button-playground"], {});
        content(env, morph1, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('emberjs-async-button/templates/async-button-playground', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Clear");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          block(env, morph0, context, "async-button", [], {"action": "clearArray", "param1": get(env, context, "actionsArray"), "class": "btn-danger"}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "action.text");
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Test with 1 second waiting");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Test with no waiting");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Test with timeout");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-12");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      Actions \n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    \n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-12");
        var el3 = dom.createTextNode("\n    Async button should wait 1 second to finish the action1 to be able to be clicked again, param1 should be 'PARAM1' and param2 should be a bound value in controller \"PARAM BOUND\"\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-10 col-xs-offset-1");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-12");
        var el3 = dom.createTextNode("\n    Async button should no wait to finish the action2, no params\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-10 col-xs-offset-1");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-12");
        var el3 = dom.createTextNode("\n    Async button should no wait the timeout to cancel the action3\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","col-xs-10 col-xs-offset-1");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        var morph1 = dom.createMorphAt(element0,3,3);
        var morph2 = dom.createMorphAt(dom.childAt(fragment, [2, 3]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(fragment, [4, 3]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(fragment, [6, 3]),1,1);
        block(env, morph0, context, "if", [get(env, context, "actionsArray.length")], {}, child0, null);
        block(env, morph1, context, "each", [get(env, context, "actionsArray")], {"keyword": "action"}, child1, null);
        block(env, morph2, context, "async-button", [], {"action": "action1", "class": "btn-default", "param1": "PARAM1", "param2": get(env, context, "param2")}, child2, null);
        block(env, morph3, context, "async-button", [], {"action": "action2", "class": "btn-primary"}, child3, null);
        block(env, morph4, context, "async-button", [], {"action": "action3", "param1": get(env, context, "param3"), "timeout": 5000, "timeoutAction": "action3Timeout", "class": "btn-danger"}, child4, null);
        return fragment;
      }
    };
  }()));

});
define('emberjs-async-button/templates/components/async-button', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","icon-spinner animated");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","async-button-container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","async-button-text");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
        var morph1 = dom.createMorphAt(element0,3,3);
        content(env, morph0, context, "yield");
        block(env, morph1, context, "if", [get(env, context, "inProgress")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('emberjs-async-button/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('emberjs-async-button/tests/components/async-button.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/async-button.js should pass jshint', function() { 
    ok(true, 'components/async-button.js should pass jshint.'); 
  });

});
define('emberjs-async-button/tests/controllers/async-button-playground.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/async-button-playground.js should pass jshint', function() { 
    ok(true, 'controllers/async-button-playground.js should pass jshint.'); 
  });

});
define('emberjs-async-button/tests/helpers/resolver', ['exports', 'ember/resolver', 'emberjs-async-button/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('emberjs-async-button/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('emberjs-async-button/tests/helpers/start-app', ['exports', 'ember', 'emberjs-async-button/app', 'emberjs-async-button/router', 'emberjs-async-button/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('emberjs-async-button/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('emberjs-async-button/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('emberjs-async-button/tests/test-helper', ['emberjs-async-button/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('emberjs-async-button/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('emberjs-async-button/tests/unit/components/async-button-test', ['ember-qunit', 'ember'], function (ember_qunit, Ember) {

  'use strict';

  ember_qunit.moduleForComponent('async-button', 'Unit | Component | async button', {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Creates the component instance
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // Renders the component to the page
    this.render();
    assert.equal(component._state, 'inDOM');
  });

  ember_qunit.test('if action is set, is called', function (assert) {
    // given
    assert.expect(3);
    var component = this.subject({
      timeout: 1000,
      action: 'testAction',
      template: Ember['default'].Handlebars.compile('Test button'),
      sendAction: function sendAction(action, resolve) {
        assert.ok(component.get('inProgress'), 'inProgress should be true');
        resolve();
      }
    });

    var $component = this.append();

    assert.equal($component.text().trim(), 'Test button', 'text should be "Test Button"');
    Ember['default'].run(component, component.click);
    assert.ok(!component.get('inProgress'), 'inProgress should be false');
  });

  ember_qunit.test('if action is not set, is not called', function (assert) {
    // given
    assert.expect(1);
    var component = this.subject({
      timeout: 1000,
      template: Ember['default'].Handlebars.compile('Test button'),
      sendAction: function sendAction(action, resolve) {
        assert.equal(action, 'action');
      }
    });

    Ember['default'].run(component, component.click);
    assert.ok(!component.get('inProgress'), 'inProgress should be false');
  });

  ember_qunit.test('5 params set', function (assert) {
    // given
    assert.expect(8);
    var component = this.subject({
      timeout: 1000,
      action: 'testAction',
      param1: 'PARAM1',
      param2: 'PARAM2',
      param3: 'PARAM3',
      param4: 'PARAM4',
      param5: 'PARAM5',
      template: Ember['default'].Handlebars.compile('Test button'),
      sendAction: function sendAction(action, param1, param2, param3, param4, param5, resolve) {
        assert.equal(arguments.length, 7);
        assert.equal(action, 'action');
        assert.equal(param1, 'PARAM1');
        assert.equal(param2, 'PARAM2');
        assert.equal(param3, 'PARAM3');
        assert.equal(param4, 'PARAM4');
        assert.equal(param5, 'PARAM5');
        assert.equal(typeof resolve, 'function');
        resolve();
      }
    });

    Ember['default'].run(component, component.click);
  });

  ember_qunit.test('4 params set', function (assert) {
    // given
    assert.expect(7);
    var component = this.subject({
      timeout: 1000,
      action: 'testAction',
      param1: 'PARAM1',
      param2: 'PARAM2',
      param3: 'PARAM3',
      param4: 'PARAM4',
      template: Ember['default'].Handlebars.compile('Test button'),
      sendAction: function sendAction(action, param1, param2, param3, param4, resolve) {
        assert.equal(arguments.length, 6);
        assert.equal(action, 'action');
        assert.equal(param1, 'PARAM1');
        assert.equal(param2, 'PARAM2');
        assert.equal(param3, 'PARAM3');
        assert.equal(param4, 'PARAM4');
        assert.equal(typeof resolve, 'function');
        resolve();
      }
    });

    Ember['default'].run(component, component.click);
  });

  ember_qunit.test('3 params set, if param2 is not set, doesn\'t matter', function (assert) {
    // given
    assert.expect(6);
    var component = this.subject({
      timeout: 1000,
      action: 'testAction',
      param1: 'PARAM1',
      param3: 'PARAM3',
      param4: 'PARAM4',
      template: Ember['default'].Handlebars.compile('Test button'),
      sendAction: function sendAction(action, param1, param2, param3, resolve) {
        assert.equal(arguments.length, 5);
        assert.equal(action, 'action');
        assert.equal(param1, 'PARAM1');
        assert.equal(param2, 'PARAM3');
        assert.equal(param3, 'PARAM4');
        assert.equal(typeof resolve, 'function');
        resolve();
      }
    });

    Ember['default'].run(component, component.click);
  });

  ember_qunit.test('if resolve is not call, timeoutAction is called', function (assert) {
    // given
    assert.expect(2);
    var promise = new Ember['default'].RSVP.Promise(Ember['default'].run.bind(this, function (resolve, reject) {
      var component = this.subject({
        timeout: 200,
        action: 'testAction',
        timeoutAction: 'testTimeout',
        template: Ember['default'].Handlebars.compile('Test button'),
        sendAction: function sendAction(action) {
          assert.equal(action, 'action', 'action is called');
        },
        timeoutFn: function timeoutFn(action) {
          assert.ok(true, 'timeoutAction is called');
          resolve();
        }
      });

      Ember['default'].run(component, component.click);
    }));
    return promise;
  });

});
define('emberjs-async-button/tests/unit/components/async-button-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/async-button-test.js should pass jshint', function() { 
    ok(true, 'unit/components/async-button-test.js should pass jshint.'); 
  });

});
define('emberjs-async-button/tests/unit/controllers/async-button-playground-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:async-button-playground', {});

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('emberjs-async-button/tests/unit/controllers/async-button-playground-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/async-button-playground-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/async-button-playground-test.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('emberjs-async-button/config/environment', ['ember'], function(Ember) {
  var prefix = 'emberjs-async-button';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("emberjs-async-button/tests/test-helper");
} else {
  require("emberjs-async-button/app")["default"].create({"name":"emberjs-async-button","version":"v1.0.0"});
}

/* jshint ignore:end */
//# sourceMappingURL=emberjs-async-button.map