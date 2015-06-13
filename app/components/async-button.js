import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  attributeBindings: ['href'],
  href: '#',
  classNames: ['async-button', 'btn'],
  classNameBindings: ['inProgress'],

  timeout: 60000,
  timeoutAction: null,
  timeouter: null,

  inProgress: false,
  stopProgress: function() {
    if (!this.get('isDestroyed')) {
      var timeouter = this.get('timeouter');
      if (timeouter) {
        Ember.run.cancel(timeouter);
        this.set('timeouter', null);
      }
      this.set('inProgress', false);
    }
  },
  timeoutFn: function() {
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
  params: function() {
    var params = [];
    for (var i = 1; i <= 5; i++) {
      var param = this.get('param' + i);
      if (param !== undefined) {
        params.push(param);
      }
    }
    return params;
  }.property('param1', 'param2', 'param3', 'param4', 'param5'),

  eventManager: Ember.Object.create({
    click: function(ev, view) {
      ev.preventDefault();
      var context = view;
      while (context.get('classNames').indexOf('async-button') < 0) {
        context = context.get('parentView');
      }

      context.click.call(context);
    }
  }),

  click: function(){
      var action = this.get('action');
      if (action) {
        var inProgress = this.get('inProgress');
        if (!inProgress) {
          this.toggleProperty('inProgress');
          var resolve = Ember.run.bind(this, this.stopProgress);
          var timeoutFn = Ember.run.bind(this, this.timeoutFn);

          this.set('timeouter', Ember.run.later(this, timeoutFn, this.get('timeout')));

          var params = ['action'];
          params.addObjects(this.get('params'));
          params.addObject(resolve);
          this.sendAction.apply(this, params);
        }
      }
  },

  willDestroy: function() {
    this.stopProgress();
    return this._super();
  }
});
