% Data structure!
% Tyr Chen
% May 18th, 2017

## Why is it important? {.slide}

![](images/wirth.jpg)

## Common data structures {.slide}

* primitive
    * number: integer/float/decimal/bigInt/...
    * other: atom/symbol/bool
    * string: bitstring/unicode string/char array/binary/buffer
* compound
    * array / tuple
    * list / link list / queue
    * map / hashmap / dict / mapset / sorted map / sorted set
    * tree: binary / avl / rb / trie / merkle / ...
    * struct / record
* others
    * ds represent resources: device / file / socket / thread / process etc.
    * ds wrapping protocol: req / res
    * misc: ring, ...

## String {.slide .shout}

## String {.slide}

![](images/string_dna.jpg)

## What is a string? {.slide}

* a sequence of characters with a prefix (optional) and postfix
    * e.g. C string ends with ``\0``
* immutable nowadays!!!
    * implies thread safe
    * implies write operation (like concat) generate new strings
* known strings compiled into executable usually (e.g. in string section of ELF)

## Array / Tuple {.slide .shout}

## What is array / tuple? {.slide}

* A container contains fixed number of other data structure*
* use sequential memory
* random access by index at O(1)
* array is usually mutable, tuple not
* fixed, not easy to grow

## efficient immutable "array" {.slide}

* Change a single element, copy entire array is time-consuming
* Need a structural sharing solution
    * DAG
    * Persistent structure

## Index Vector Trie {.slide}

![](images/iamt.jpg)

## Index Vector Trie (modify) {.slide}

![](images/iamt1.jpg)

## List {.slide .shout}

## What is a list? {.slide}

* usually double linklist
* can append or prepend O(1)
* unless stored, length(list) is O(n)
    * python O(1), erlang O(n)
* find, insert_at, remove_at need traverse at O(n)
* applied to Enumerable interface

## double linklist {.slide}

![](images/double-linklist.png){width=800px}

## Map {.slide .shout}

## What is a map? {.slide}

* a container holding any number key -> value pairs
* could be implemented as hash array with proper collision management
    * python dict
    * chaining v.s. open addressing with probe
* red-black tree
    * C++ std map
* HAMT (Hash Array Mapped Trie) for FP
    * erlang, scala, clojure, etc.

## Complexity Comparison {.slide}

![](images/hash_vs_rb.webp){width=800px height=385px}

## Hash table with chaining {.slide}

![](images/hash_ll.jpg){width=800px height=410px}

worst case O(n/k) while k = size of hash table

## Hash table with RB tree {.slide}

![](images/rb_tree.png)

## HAMT {.slide}

![](images/hamt.jpg)

## Trees {.slide .shout}

## AVL tree {.slide}

* Binary search tree with balance property
* height of left / right differ by at most 1
* O(logN)

## AVL tree {.slide}

![](images/avl.jpg)

## AVL vs RB tree {.slide}

* fast lookup: AVL
    * both O(logN) but AVL traverse less usually
    * height: 1.44log(N) vs 2log(N))
* fast insert: RB - RB rotation O(1)
* general purpose: RB
* Usage
    * AVL: erlang sorted set
    * RB: java TreeMap / TreeSet, C++ map / set

## Trie {.slide}

![](images/trie.jpg)

## Trie tree {.slide}

* functionality:
    * key membership
    * prefix lookup
    * pattern lookup
    * inclusion / exclusion
* Usage
    * route lookup
    * pattern match
* Variant
    * Patricia trie (aka radix trie)

## Merkle tree {.slide}

* provide cryptographically-strong authentication for any component of the tree
* used to verify the integrity of large data
    * ZFS, BT, Git, blockchain

## Merkle tree: how it looks like {.slide}

![](images/merkle.png){width=900px height=250px}

## Merkle tree: verify inclusion {.slide}

![](images/merkle1.png){width=900px height=250px}

## References {.slide}

* [Purely Functional Structures](https://www.amazon.com/Purely-Functional-Structures-Chris-Okasaki/dp/0521663504)
* [AVL Trees vs. Red-Black Trees](http://discuss.fogcreek.com/joelonsoftware/default.asp?cmd=show&ixPost=22948)
* [Immutable data and react](https://www.youtube.com/watch?v=I7IdS-PbEgI)
* [The blockchain](http://chimera.labs.oreilly.com/books/1234000001802/ch07.html)
* [Pragmatic Programming Techniques](http://horicky.blogspot.com/2009/11/nosql-patterns.html)

## Questions (1) {.slide}

Data structures to choose: array, list, stack, queue, tree, graph, set, map

1. You have to store social network “feeds”. You do not know the size, and
things may need to be dynamically added.
2. You need to store undo/redo operations in a word processor.
3. You need to evaluate an expression (i.e., parse).
4. You need to store the friendship information on a social networking site. I.e., who is friends with who.
5. You need to store an image (1000 by 1000 pixels) as a bitmap.


## Questions (2) {.slide}

1. To implement printer spooler so that jobs can be printed in the order of their arrival.
2. To implement back functionality in the internet browser.
3. To store the possible moves in a chess game.
4. To store a set of fixed key words which are referenced very frequently.
5. To store the customer order information in a drive-in burger place. (Customers keep on coming and they have to get their correct food at the payment/food collection window.)
6. To store the genealogy information of biological species.
