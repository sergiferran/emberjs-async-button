# Emberjs-async-button

With this component you'll be able to avoid multiple clicks in one button or link, until the action is finished or timeout is triggered

## Sample Code

`{{#async-button action="action1" timeout=5000 class="btn-default" param1="PARAM1" param2=parambound}}Call action1{{/async-button}}`

This code will call an action in the controller called `action1` with the next signature:

`action1: function(param1, param2, resolve)` where:

* `param1` value will be "PARAM1"
* `param2` value will be the bound value in the controller property `parambound`
* `resolve` is a callback function to indicate the action is finished. It is useful when you are doing async function such as `store.save` or similiar.

60 seconds is the default timeout but you can overrite with `timeout` property, and you can set an action for timeout with the property `timeoutAction`

### Currently I'm using bootstrap to styles, but is not need it if you want, you can apply the style you want

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).