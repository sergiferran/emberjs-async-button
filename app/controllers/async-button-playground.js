import Ember from 'ember';

export default Ember.Controller.extend({
  actionsArray: function() {
    return [];
  }.property(),


  param2: "PARAM BOUND",
  param3: 'PARAM IN ACTION3',

  actions: {
    clearArray: function(array, resolve) {
      array.clear();
      resolve();
    },

    action1: function(param1, param2, resolve) {
      var actions = this.get('actionsArray');
      actions.addObject({
        text: 'action1 triggered, param1 value: %@, param2 value: %@'.fmt(param1, param2)
      });
      Ember.run.later(function() {
        actions.addObject({
          text: 'action1 finished'
        });
        resolve();
      }, 1000);
    },

    action2: function(resolve) {
      var actions = this.get('actionsArray');
      actions.addObject({
        text: 'action2 triggered and finished'
      });
      resolve();
    },

    action3: function(param1 /*, resolve*/) {
      var actions = this.get('actionsArray');
      actions.addObject({
        text: 'action3 triggered, param1 value: %@'.fmt(param1)
      });
    },
    action3Timeout: function(param1) {
      var actions = this.get('actionsArray');
      actions.addObject({
        text: 'action3 timeout, param1 value: %@'.fmt(param1)
      });
    }
  }
});
