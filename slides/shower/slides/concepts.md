% Concepts in software
% Tyr Chen
% Nov 9th, 2017

## Topics to cover {.slide}

* variable
* name
* value (information)
* container
* function
* interface
* ~~algebra~~
* ~~ADT~~
* software system

## what is variable? {.slide .shout}

## Definition {.slide}

> In computer programming, a __variable__ or __scalar__ is a __storage location__ paired with an associated symbolic __name__ (an identifier), which contains some known or unknown quantity of __information__ referred to as a value. The variable name is the usual way to reference the stored value; this separation of name and content allows the name to be used independently of the exact information it represents.

## Takeaways {.slide}

* a variable represent the information
* a variable is stored in a place in a storage location
  - registers
  - memory
* we don't need to remember the storage location, we give it a name (location transparent!)
* the name is an indirection between the location and its content (information)
* Name is very, very important



## An example code {.slide}

```javascript
function formatter(params) {
  const result = joi.validate(params, formatterSchema, { allowUnknown: true });
  if (result.error) throw result.error;

  const value = result.value;
  value.tag = helper.app.getAppTag();
  value.flag = value.flag || new Flag();
  if (value.method === 'get' || value.method === 'head') {
    value.flag.set('etag', value.flag.has('etag') !== false);
  }
  value.description = mustache.render(value.description, helper.doc)
  registeredFormatters.push(value);
}
```

## let's change the names to "n" {.slide}

```javascript
function n(n) {
  const n = n.n(n, n, { n: n });
  if (n.n) throw n.n;
  const n = n.n;
  n.n = n.n.n();
  n.n = n.n || new n();
  if (n.n === 'get' || n.n === 'head') {
    n.n.n('etag', n.n.n('etag') !== n);
  }
  n.n = n.n(n.n, n.n);
  n.n(n);
}
```

## So 80% of chances, we're dealing with names! {.slide .shout}

## What if we give bad names? {.slide}

```javascript
Y=function(a,b,c){
  a=B(a)||[];
  var d=b.callback,
      e=b.config,
      g=b.timeout,
      l=b.ontimeout,
      k=b.onerror,
      q=void 0;
  ...
}
```

## real life is not that bad, but... {.slide}

```javascript
try {
  const availDates = getAvailabilityDates(video.policy, { country, platform });
  if (availDates.boolVal) {
    video.availabilityStarts = availDates.availabilityStarts;
    video.availabilityEnds = availDates.availabilityEnds;
  }
} catch (error) {
  // Non-fatal. Log error and continue
  log.error(...);
}
```

## Let's dive into ``getAvailabilityDates`` {.slide}

```javascript
function getAvailabilityDates(policy, parserInput) {
  parserInput.app = parserInput.app || 'tubitv';
  parserInput.date = parserInput.date || (new Date()).setHours(0, 0, 0, 0);
  try {
    if (policy)
      return availabilityParser.parse(policy, parserInput, { minDate: MIN_DATE, maxDate: MAX_DATE });
  } catch (error) {
    throw new ParserError(error.message);
  }
  return { boolVal: true, availabilityStarts: null, availabilityEnds: null }; // default
}
```

## First revision: simplify the names {.slide}

```javascript
function getAvailabilityDates(policy, data) {
  data.app = data.app || 'tubitv';
  data.date = data.date || (new Date()).setHours(0, 0, 0, 0);
  try {
    if (policy)
      return DateParser.parse(policy, data, { minDate: MIN_DATE, maxDate: MAX_DATE });
  } catch (error) {
    throw new ParserError(error.message);
  }
  return { boolVal: true, start: null, end: null }; // default
}
```

## Second revision: abstraction {.slide}

```javascript
function getDates(policy, data, type='availability') {
  data.app = data.app || 'tubitv';
  data.date = data.date || (new Date()).setHours(0, 0, 0, 0);
  const default = { start: null, end: null };
  if (!policy) return default;
  try {
    return DateParser.parse(policy, data, type);
  } catch (error) {
    return default;
  }
}
```

## The caller's life is much easier now {.slide}

```javascript
const { start: start, end: end } = getDates(policy, { country, platform });
video.availabilityStarts = start;
video.availabilityEnds = end;
```

v.s. (previous)

```javascript
try {
  const availDates = getAvailabilityDates(video.policy, { country, platform });
  if (availDates.boolVal) {
    video.availabilityStarts = availDates.availabilityStarts;
    video.availabilityEnds = availDates.availabilityEnds;
  }
} catch (error) {
  // Non-fatal. Log error and continue
  log.error(...);
}
```

## It's not that easy to give names {.slide}

* needs deliberate practicing (so many stuff we have to name properly)

<iframe width="800" height="450" src="https://www.youtube.com/embed/ZqBrfhIJfxw?start=187" frameborder="0" allowfullscreen></iframe>

## What are good names? {.slide}

* Simple & meaningful
* No combination words (e.g. ``getUserNotFinishedViewHistory``)
  - probably the function is too long to make such name simpler
  - probably the function is not abstracted well
  - probably the namespace is not properly used
* express your intention, not state the fact
* REMEMBER: __name is the way you communicate with others.__

## Example of express intention {.slide}

```javascript
// bad - your name is stating what you're doing
if (getPermissionsByUser(user).contains(getPermissionObject('can view', board)) {
  // see user's permission contains 'can view' permission for the given board
  // ...
}
```

v.s.

```javascript
// good - you express your intention
if (user.canView(board)) {
  // ...
}
````

## what is information? {.slide .shout}

## Definition {.slide}

> Information is the answer to a question of some kind. It is thus related to data and knowledge, as data represents __values__ attributed to parameters, and knowledge signifies understanding of real things or abstract concepts.


## What is value? {.slide}

* 1, 2, 3.1415926, true, :victor
* "Hello world"
* {:card_inserted, prompt_password}, [1, 3, 5]
* %{balance: 10, transactions: [{"2017/1/1", :withdraw, 200}]}
* how about more complicated, real world stuff?

## for example, http request? {.slide}

```elixir
%Plug.Conn{
  body_params: %{}, cookies: %Plug.Conn.Unfetched{aspect: :cookies}, halted: false,
  host: "localhost", method: "GET", owner: #PID<0.498.0>, params: %{},
  path_info: ["api", "v1", "version"], path_params: %{},
  peer: {{127, 0, 0, 1}, 53613}, port: 8000,
  query_params: %{}, query_string: "", remote_ip: {127, 0, 0, 1},
  req_cookies: %Plug.Conn.Unfetched{aspect: :cookies},
  req_headers: [
    {"cache-control", "no-cache"}, {"user-agent", "PostmanRuntime/6.4.1"}, {"connection", "keep-alive"},
    {"host", "localhost:8000"}, {"accept", "*/*"}, {"accept-encoding", "gzip, deflate"}],
  request_path: "/api/v1/version"
  ...
}
```

## The beauty of values {.slide}

* easy to share (serialize / deserialize is damn straight-forward)
  - can you easily share an object across the wire?
* easy to reproduce/fabricate
  - can you easily create a fancy object with a certain state?
* easy to reason about (equality, comparability, etc.)
  - can you easily compare two objects?
* semantically transparent
  - given an object, can you easily tell what is inside?
* generic! (language independent^almost^)
  - how many times we build new classes just for a dedicated use case?
* immutable!

## Mutability is a tradeoff in the past {.slide}

* In early days memory / disk is very limited (CPU also, but not a dominant reason)
* Now we have gigabytes of memory but that tradeoff remains
* Cons of mutability
  - not traceable (you rely on debugger for the intermediate state)
  - code is harder to read
  - bad for concurrency support
* Mutability is not everywhere now - string is immutable universally
  - how about collections, maps, etc.?

## Is immutable data structure efficient? {.slide}

<center>
See my previous slides: [Data structure](./data_structure.html)

![](images/iamt1.jpg){height=400px}
</center>

## Why it matters to keep things generic? {.slide}

* we gain flexibility to move stuff
  - from one service to another
  - from one lang to another
* keep things simple
  - think about how many classes you define in java?
  - how many extra code you deal with equality, comparison and representation?
  - more code means harder to read, and more bugs, more maintenance burden

## Containerize {.slide}

* What is list, tuple, map?
  - standard containers!
  - we can ``map`` over a container to manipulate its values and return a new container
  - we can build it from values easily
* what is an object?
  - proprietary container!
  - we cannot build it from values easily
* We need more generic containers!
  - e.g. ``Just``, ``Nothing``, ``Either``, ``Maybe``, ... (another topic)

## Let us go back to information {.slide}

* information is about fact
* it changes over time
* trade off: should we keep the recent version of information or keep the whole history?

## keep recent version of information {.slide}

* we do it everywhere^almost^, in immutable way or mutable way
* pros:
  - efficient
* cons:
  - losing valuable^maybe^ Information

## keep the whole history {.slide}

* a trend in software (big data)
  - git, blockchain, influxdb, etc.
* pros:
  - the history helps us making decisions
- cons:
  - extra memory / disk

## What is the meaning for us {.slide}

<center>[Bret Victor - Inventing on Principle (11:45 - 14:20)](https://vimeo.com/36579366)</center>

<iframe src="https://player.vimeo.com/video/36579366" width="800" height="450" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>


## what is function? {.slide .shout}

## Definition {.slide}

> In engineering, a function is interpreted as a specific __process__, __action__ or __task__ that a system is able __to perform__. - the engineering part
>
> In mathematics, a function is a __relation__ between a set of inputs and a set of permissible outputs with the property that __each input is related to exactly one output__. - the math part

## Pure function {.slide}

> The function always evaluates the same result value given the same argument value(s). The function result value cannot depend on any hidden information or state that may change while program execution proceeds or between different executions of the program, nor can it depend on any external input from __I/O__ devices (usually—see below).
> Evaluation of the result does not cause any semantically observable side effect or output, such as mutation of mutable objects or output to __I/O__ devices.

## Impure function {.slide}

* functions using non-local variable
* functions returning data from I/O (e.g. current time, data in db, ``random()``)
* functions which has a side effect (mostly, call any impure function, read/write to I/O)

## Example - book a session in aws re:invent {.slide}

* initial: handle_req -> reserve -> handle_res
* handle_req: deserialize, normalize, validate
* reserve: check_avail, update_avail
* handle_res: normalize, serialize

## what is interface? {.slide .shout}

## Definition {.slide}

> In computing, an interface is a __shared boundary__ across which two or more separate components of a computer system __exchange information__.

## Shared boundary {.slide}

* once upon a time, software is just written by one (Alan Turing)
  - no actually req for interface
* Then you want to organize your code (function, aka subroutine appeared)
  - EABI was defined to address the problems of one function call another
* Then you need to call someone else's code (library appeared)
  - linker would links your code with the rest of world
* Then software needs to talk to others
  - IPC / networking protocols were defined (socket were invented)
* Then software needs to convey high level messages to each other
  - serialization / deserialization methods were defined. e.g. json, msgpack, protobuf, thrift

## Interface embraces simplicity {.slide}

* Historically used interfaces:
  - cobra^dead^, dcom^dead^, soap^almost_dead^, ...
* interface should convey values and be caller friendly
* if you get your names right, mostly your interface is not bad
* See more in my previous slides: [boundary](./boundary.html)

## high level boundary {.slide}


|      Type      |    Format / Interface    |                Impact             |
|----------------|--------------------------|-----------------------------------|
| Solution       | a group of applications  | business / tech vision            |
| Application    | a group of directories   | High level arch / orchestration   |
| Component      | directories              | high level design                 |
| Module         | file                     | low level design                  |
| Function       | a code fragment          | interface design / think twice    |

__A good boundary is that the interface speaks for itself.__

## what is a software system? {.slide .shout}

## {.slide}

![information system](images/info_system.jpg)
