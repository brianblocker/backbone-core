backbone-core
=============

## What is it?

I've been working with Backbone.js for several months and have fallen in love with it. Perhaps you have as well, or maybe you've become frustrated with it. I've found plenty of resources online for dealing with very simple web applications. I've even found a few relatively decent articles about handling nested views, nested models, and nested collections. I have yet to find anything that handles recursive nesting to a level that meets my satisfaction.

This core file adds some functionality that has made my life much, much easier. Allow me to share it with you.

## Organizing the App: window.App

First thing's first. The App object is how I organize the entire App. All models, views, collections, routers, mixins, etc are organized in this object:

```javascript
  var App = { Collections : {}, Models : {}, Views : {}, Routers : {}, Mixins : {}, router : false, data : {}, view : false, __CONST__ : {} }
```

By wrapping all of our code in a self-executing function (we could call this a closure), we can avoid some challenges with name collisions and variable scope and other nonsense that cause problems. This isn't the place to address those, let's just identify what I'm talking about so we can move forward.

Some of you may not really understand scope. Let's talk about what scope is. Take this example, script.js. If you already understand scope, skip this.

```javascript
// This variable will exist pretty much forever. It may be changed. But it can definitely be changed by anything that has access to it. (Think: scope)
var joe = 'mama';

function dissMama() {
  return 'Joe has a fat ' + joe;
}

dissMama(); // Joe has a fat mama
dissMama(); // Joe has a fat mama

// This is not going to do anything since a new variable named joe has been created, but it's scope is only for the changeJoe() function
function changeJoe() {
  var joe = 'daddy';
}

changeJoe(); // returns nothing, doesn't do anything to the joe variable that was already declared either
changeJoe(); // you guessed it, still doesn't do anything
dissMama(); // Joe has a fat mama

// This is going to change the value of joe since it refers to the ALREADY CREATED, global variable joe.
function reallyChangeJoe() {
  joe = 'daddy';
}

dissMama(); // Joe has a fat mama
reallyChangeJoe(); // doesn't return anything, but it does change the value of joe
dissMama(); // Joe has a fat daddy

```

Ok, that is scope, in a nutshell. What is a self-executing function though? If you already know, skip this part. Let's look at this example, script2.js

```javascript
(function() {
  var joe = 'mama';
})()

// WHAT JUST HAPPENED?
// ok basically, what we just did is the same thing as this:
function someFunction() {
  var joe = 'mama';
}

someFunction();

// OH SNAP.

```

Easy to understand, right? Good. If you don't understand this, you're going to need to spend some time in google, searching for the answers to your questions. We've got to move on.

