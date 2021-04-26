# esp-util-logging

## Description

This logging tool is here to provide us with better debugging, especially when debugging in production environments. It provides component namespacing, different logging types, color codes, filters and other utils.

## Installation

No installation steps are required when using this tool. The logger is ready in the global scope for it to use anywhere in the app.

## Usage

By default, our logger will not log messages unless specified otherwise using `cortado.on()` or via the configuration stored in `localStorage` (more details below).

### Log types

There are many types of log:

- method
- handler
- hxr
- ws
- debug
- DEPRECATED lifecycle
- hook

To better decouple these, you can import the available types from the same package:

```js
import { LOG_TYPE } from "esp-util-cortado";

cortado.log({
  type: LOG_TYPE.DEBUG,
  label: "MyComponent",
  message: "This is a sample debug message",
});
/*
Output:
[MyComponent] This is a sample debug message
*/
```

To start logging messages to the console you use the logger object in the global scope:

```js
cortado.log();
/*
Output:
[Global] No message specified
*/

cortado.log("This is a sample message");
/*
Output:
[Global] This is a sample message
*/

cortado.log({ message: "This is another sample message" });
/*
Output:
[Global] This is another sample message
*/
```

If no namespace is specified, `Global` is infered.

To namespace your logs, you have to pass a string to the `label` property of the object you send. Passing an object to the logger provides the message with more information.

```js
import { LOG_TYPE } from "esp-util-cortado";

cortado.log({
  label: "MyComponent",
  message: "This is a sample message",
});
/*
Output:
[MyComponent] This is a sample message
*/
```

Since we are passing a specific `type` too, the log will be color coded.

### Types

We currently have these types in the logger:

<ul>
  <li style="color: #3671d1">method</li>
  <li style="color: #33b752">handler</li>
  <li style="color: #f2db0c">xhr</li>
  <li style="color: #29b9f2">ws</li>
  <li style="color: #afafaf">debug</li>
  <li style="color: #ffad3a">lifecycle</li>
</ul>

There's also available shorthands for all of these types, to reduce the typing needed to log a message:

```js
cortado.method({'This logs a method message'});
cortado.xhr({'This logs a xhr message'});
```

Follow the same syntax for the rest of the types. If `cortado.log()` uis used and no type is specified it'll default to `debug`.

## Utils

The logger has a few util functions available to toggle the messages it shows.

#### .on()

Turns logger silent mode off, causing it to start logging messages.

#### .off()

Turns the logger silent mode on.

#### DEPRECATED .persist()

Turns logger silent mode off and saves it to localStorage so it can continue to log after navigating in the browser

#### DEPRECATED .halt()

Turns logger silent mode on and stops it from persisting across pages.

## Timers

The logger has a timer utility you can turn on, restart, or delete for each namespace.

#### trace

When logging a message, if you specify `trace: true`. A new timer will automatically get started.

```js
cortado.debug({
  label: 'MyComponent',
  message: 'This is a sample message',
  trace: true});

  cortado.debug({
  label: 'MyComponent',
  message: 'This is a subsequent message',
  trace: true});

  /*
    Output:
    [MyComponent] This is a sample message - New timer started
    [MyComponent] This is a subsequent message - 39ms
  */
})
```

#### .addTimer(label)

Adds a new timer for the specified namespace.

#### .getTimer(label)

Prints the current time for the specified namespace:

```js
cortado.getTimer("MyComponent");
/*
 [MyComponent] Current timer: 152323ms 
*/
```

#### .removeTimer(label)

Removes the timer for a specified namespace. If a message from the same namespace gets logger with `trace: true`, a new timer will get started

## Filters

Logger enables you to filter logged messages by namespace or type. Filters are inclusive, once you've added one you will only see what you're filtering for. You can have multiple filters.

Filter arrays are public in case you need to do more complex manipulations.

#### .addNamespaceFilter(string)

Adds a filter for namespace:

```js
cortado.addNamespaceFilter("Component B");

cortado.debug({ label: "Component A", message: "sample message" });
cortado.debug({ label: "Component B", message: "sample message" });

/*
Output will only log Component B log:
[Component B] sample message
*/
```

#### .addTypeFilter(string)

Works similar to namespace filter:

```js
cortado.addTypeFilter("xhr");

cortado.debug("debug message");
cortado.method("method message");
cortado.xhr("xhr message");
cortado.ws("ws message");

/*
Output will only log Component B log:
[Global] xhr message
*/
```

You can also have multiple filter and mix them up with namespace filters.

#### .clearNamespaceFilters(), .clearTypeFilters(), .clearAllFilters()

Pretty obvious :)

## Production

The logger can accept a `private` property to prevent a message from displaying in production environments, even if `.showAll()` has been called.

```js
cortado.xhr({
  message: "This is a secret message",
  private: true,
});
```

This message wouldn't show in production under any circumstances.
