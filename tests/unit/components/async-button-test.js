import { moduleForComponent, test} from 'ember-qunit';
import Ember from 'ember';


moduleForComponent('async-button', 'Unit | Component | async button', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test("if action is set, is called", function(assert) {
  // given
  assert.expect(3);
  var component = this.subject({
    timeout: 1000,
    action: 'testAction',
    template: Ember.Handlebars.compile(
      'Test button'
    ),
    sendAction: function(action, resolve) {
      assert.ok(component.get('inProgress'), 'inProgress should be true');
      resolve();
    }
  });

  var $component = this.append();

  assert.equal($component.text().trim(), 'Test button', 'text should be "Test Button"');
  Ember.run(component,component.click);
  assert.ok(!component.get('inProgress'), 'inProgress should be false');
});

test("if action is not set, is not called", function(assert) {
  // given
  assert.expect(1);
  var component = this.subject({
    timeout: 1000,
    template: Ember.Handlebars.compile(
      'Test button'
    ),
    sendAction: function(action, resolve) {
      assert.equal(action, 'action');
    }
  });

  Ember.run(component,component.click);
  assert.ok(!component.get('inProgress'), 'inProgress should be false');
});


test("5 params set", function(assert) {
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
    template: Ember.Handlebars.compile(
      'Test button'
    ),
    sendAction: function(action, param1, param2, param3, param4, param5, resolve) {
      assert.equal(arguments.length, 7);
      assert.equal(action, 'action');
      assert.equal(param1, 'PARAM1');
      assert.equal(param2, 'PARAM2');
      assert.equal(param3, 'PARAM3');
      assert.equal(param4, 'PARAM4');
      assert.equal(param5, 'PARAM5');
      assert.equal(typeof(resolve), 'function');
      resolve();
    }
  });

  Ember.run(component,component.click);
});

test("4 params set", function(assert) {
  // given
  assert.expect(7);
  var component = this.subject({
    timeout: 1000,
    action: 'testAction',
    param1: 'PARAM1',
    param2: 'PARAM2',
    param3: 'PARAM3',
    param4: 'PARAM4',
    template: Ember.Handlebars.compile(
      'Test button'
    ),
    sendAction: function(action, param1, param2, param3, param4, resolve) {
      assert.equal(arguments.length, 6);
      assert.equal(action, 'action');
      assert.equal(param1, 'PARAM1');
      assert.equal(param2, 'PARAM2');
      assert.equal(param3, 'PARAM3');
      assert.equal(param4, 'PARAM4');
      assert.equal(typeof(resolve), 'function');
      resolve();
    }
  });

  Ember.run(component,component.click);
});

test("3 params set, if param2 is not set, doesn't matter", function(assert) {
  // given
  assert.expect(6);
  var component = this.subject({
    timeout: 1000,
    action: 'testAction',
    param1: 'PARAM1',
    param3: 'PARAM3',
    param4: 'PARAM4',
    template: Ember.Handlebars.compile(
      'Test button'
    ),
    sendAction: function(action, param1, param2, param3, resolve) {
      assert.equal(arguments.length, 5);
      assert.equal(action, 'action');
      assert.equal(param1, 'PARAM1');
      assert.equal(param2, 'PARAM3');
      assert.equal(param3, 'PARAM4');
      assert.equal(typeof(resolve), 'function');
      resolve();
    }
  });

  Ember.run(component, component.click);
});

test("if resolve is not call, timeoutAction is called", function(assert) {
  // given
  assert.expect(2);
  var promise = new Ember.RSVP.Promise(Ember.run.bind(this, function(resolve, reject){
    var component = this.subject({
      timeout: 200,
      action: 'testAction',
      timeoutAction: 'testTimeout',
      template: Ember.Handlebars.compile(
        'Test button'
      ),
      sendAction: function(action) {
        assert.equal(action, 'action', 'action is called');
      },
      timeoutFn: function(action) {
        assert.ok(true, 'timeoutAction is called');
        resolve();
      }
    });
    
    Ember.run(component,component.click);
  }));
  return promise;
});