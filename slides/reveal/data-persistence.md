% Tools to store data
% Tyr Chen
% Jan 14th, 2015

----

# Why?

# Where?

* Memory
* File
* Database
* Queue

# Memory

* Native datastructure
    - list: ``[1, 2, 3, 4]``
    - map: ``{a: 1, b: 2}``
* advanced datastructure
    - bloom filter (membership check)
    - FIFO queue (task system)
    - rb tree (scheduler)
    - graph (friend relationship)
* Fast and isolated(unless you share)
* always limited (can only fit for hot data)

----

![](assets/images/latency.png)

----

### bloom filter

![](assets/images/bloomfilter.png)


# File

* Text file
    - configuration
    - AOF logs
* Binary file
* very easy to use, durable
* might not be good for distributed systems which nodes come and go

# Database

* relational
* NoSQL (key-value, document)
* read (or write) optimized storage for large data
* limited by CAP theorem

----

![](assets/images/cap.png)

# Relational DB

* SQlite
* MySQL, PostalgreSQL

# Key-value DB

* levelDB / RocksDB / berkeleyDB / etc.
* DynamoDB / Riak
* CouchDB / PouchDB

# levelDB

fast key-value storage library written at Google that provides an ordered mapping from string keys to string values

* Benefit
    - Embedded to application
    - Just need library support
    - Provide durability
* Drawback
    - single threaded access (db level lock)
    - can not act as db server

----

```javascript
var levelup = require('levelup')

// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./mydb')

// 2) put a key & value
db.put('name', 'LevelUP', function (err) {
  if (err) return console.log('Ooops!', err) // some kind of I/O error

  // 3) fetch by key
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found

    // ta da!
    console.log('name=' + value)
  })
})
```

# DynamoDB

Fully managed, distributed key-value database provided by amazon, based on [Dynamo paper](http://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf).

* Benefit
    - (almost) constant read/write speed at whatever amount of data
    - highly scalable, highly available
* Drawback
    - really hard to use (at first time)
    - hard to pick up a right hash key / range key
    - the more index you create, the more you pay
    - the more capacity you provision, the more you pay

----

### Consistent hashing

![](assets/images/consistent-hashing1.png)

From: [distributed algorithms in nosql](https://highlyscalable.wordpress.com/2012/09/18/distributed-algorithms-in-nosql-databases/)

----

![](assets/images/consistent-hashing2.jpg)

From: [Why riak just works](http://basho.com/posts/technical/why-riak-just-works/)

----

```javascript
function queryExpires(expires) {
  var params = {
    TableName: TABLE,
    IndexName: EXPIRES_INDEX,
    KeyConditionExpression: '#type = :v_type AND #expires < :v_expires',
    ExpressionAttributeNames: {'#type': 'type', '#expires': 'expires'},
    ExpressionAttributeValues: {
      ':v_type': {'S': 'connect-session'},
      ':v_expires': {'N': expires.toString()}
    },
    ProjectionExpression: 'id'
  }
  return new Promise(function(res, rej) {
    db.query(params, function(err, data) {
      if (err) {
        rej(err);
      } else {
        res(data);
      }
    });
  });
}
```

# Document DB

* MongoDB
* ElasticSearch

# MongoDB

* Benefit
    - Self contained, de-normalized document (very fast query)
    - Super rich query / sort / aggregate functionalities
* Drawbacks
    - Use crappy mmap / fsync() for < 3.0
    - Still young and unsteady (especially auto sharding)
    - easy to be misused
        * too many indexes v.s. too little indexes
        * try to use autoincrement id
        * try to join among different collections

# ElasticSearch

Built on top of apache lucence, provide an easy to use interface to build search index.

* Benefit
    - Very powerful to query both structured / unstructured data
    - Scalable and very easy to use
* Drawbacks
    - not suitable for main data store

----

```javascript
client.search({
  index: 'twitter',
  type: 'tweets',
  body: {
    query: {
      match: {
        body: 'elasticsearch'
      }
    }
  }
}).then(function (resp) {
    var hits = resp.hits.hits;
}, function (err) {
    console.trace(err.message);
});
```

# Summary

----

![](assets/images/nosql-triangle.png)

From: [Visual guide to nosql systems](http://blog.nahurst.com/visual-guide-to-nosql-systems)

# Queue

* ZeroMQ / nano
* SQS
* RabbitMQ / ActiveMQ / etc.

# What?

* Binary
* JSON
* XML
* MsgPack/protoBuf/avro/Thrift
* SQL/Mongo document/Redis command

[Performance benchmark](https://github.com/thekvs/cpp-serializers)

----

### msgpack examples

```javascript
var assert = require('assert');
var msgpack = require('msgpack');

var o = {"a" : 1, "b" : 2, "c" : [1, 2, 3]};
var b = msgpack.pack(o);
var oo = msgpack.unpack(b);

assert.deepEqual(oo, o);
```

# How?

* Serialize
* Deserialize

# Q&A
