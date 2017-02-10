% Realtime Web
% Tyr Chen
% Feb 9th, 2017

## What is realtime web {.slide}

> The real-time web is a network web using technologies and practices that enable users to receive information as soon as it is published by its authors, rather than requiring that they or their software check a source periodically for updates.
>
> -- Wikipedia

## Examples {.slide}

* Trello
* Asana
* Slack

## Technical challenges {.slide}

* A proper network layer
* Presence check and broadcasting
* Performance and scalability

## Network layer {.slide}

* HTTP?
* TCP / UDP?
* HTTP websocket?
* HTTP/2?

## Websocket {.slide .shout}

## Intro {.slide}

* RFC 6455
* "upgrade" from a standard http request
* bi-directional
* full duplex
* long running
* efficient (just application messages)

## Handshake {.slide}

![](images/websocket.jpg)

## Frame {.slide}

![](images/ws-frame.jpg)

## Code (server) {.slide}

```javascript
const io = require('socket.io')()
const util = require('util')
io.on('connection', socket => {
	console.log(`client connected!`, util.inspect(socket))
	socket.on('disconnect', () => {
		console.log(`client disconnected!`, util.inspect(socket))
	})
	socket.on('message', message => {
		console.log('received message:', message)
		io.emit('message', message)
	})
})
io.listen(8210, {pingTimeout: 2000, pingInterval: 5000})

```

## Code (client) {.slide}

```javascript
const io = require('socket.io-client')
const socket = io('http://localhost:8210')

socket.on('connect', info => {
  console.log('connected to server', info)
  socket.emit('message', 'hi, this is Tyr')
})

socket.on('pong', data => {
  console.log('received server pong:', data)
})

socket.on('message', message => {
  console.log('received server echo-reply:', message)
})

```

## Capturing websocket packets {.slide}

```bash
$ sudo tcpdump -w /tmp/ws port 8210 -i lo0
```

Then use wireshark to analyze

![](images/wireshark.jpg)

## Demo {.slide}

Note that socket.io has its own frame definition so that you can't see its details. Try using [websocket](https://github.com/websockets/ws) if you'd explore more internals.

## Presence check and broadcasting {.slide .shout}

## The problem {.slide}

* Alice connected, we'd notify Bob and Charlie
* Bob disconnected, we'd notify Alice and Bob
* Charlie should be able to iterate the connected members (Alice and himself)
* Other than public lobby, clients can be grouped in private rooms

## The use cases {.slide}

* Communication
* Game
* Twitch-like service
* service orchestration

## The solution {.slide}

* collect status on socket connect / disconnect
* collect status on explicit join / leave
* broadcast the status to all clients
* each client hold their own "online table"

## PubSub {.slide}

![](images/phoenix_pubsub.jpg)

## Performance and scalability {.slide .shout}

## An elixir / phoenix demo {.slide}

![](images/phoenix_presence.jpg)

## Realtime web technologies list {.slide}

* elixir / phoenix (highly scalable and efficient)
* golang / go-socket.io
* socket.io (heavy lifting on weboscket)
* vert.x (very nice event bus)
* python / tornado (lack of presence check, broadcasting, etc.)
* meteor.js (easy to use, scalability is an issue!)


## Resources {.slide}

* [guts of phoenix channels](http://www.zohaib.me/guts-of-phoenix-channels/)
* [socket.io chat app](http://socket.io/get-started/chat/)
* [realtime bidding](http://vertx.io/blog/real-time-bidding-with-websockets-and-vert-x/)
* [slack clone in phoenix](https://github.com/tony612/exchat)
* [the road to 2 million web sockets](http://www.phoenixframework.org/blog/the-road-to-2-million-websocket-connections)
