% Performance!
% Tyr Chen
% May 9th, 2017

## Why is it important? {.slide}

* "We're small"?
    * we're 9x bigger than last year and will continue growing
    * any code change (esp backend) may impact > 30m devices
* "Hey we're just building a feature"?
    * ![](images/software-visible-invisible.jpg)

## Why is it important? {.slide}

* "This feature is simple"?
    * How do you know the error rate, utilization and saturation rate?
    * Have you considered what metrics to collect?
    * Do you know when something bad happen?
* "Performance is high level system stuff, irrelevant to my feature"?
    * errors are part of performance
    * even if architecture is right, bad code can still degrade performance

## Example (parental control) {.slide}

* for user, it is just a setting to different rating level
* what about matrix/content/search API?
    1. where to get user's rating setting?
    2. How do we filter a content that match user's rating?
    3. How to fulfill 1 & 2 without degrade UAPI response time?

## Example (user profile service) {.slide}

* How to handle 30m data for both update / retrieval quickly?
* How to know if anything bad happen?
* How to measure the current performance?
* How to make sure the performance maintain in a similar level as the feature of the service is growing?

## What to start? {.slide}

* Know your system - measure
* Know your status - analyze
* Get into the spot - profiling
* Improve

## Know your system {.slide .shout}

## The importance of measurement {.slide}

![](images/kelvin-measure.jpg)

## Let's get down to fundamentals {.slide}

![](images/latency.png)

## What metrics to collect from system level? {.slide}

![[source](http://www.brendangregg.com/linuxperf.html)](images/linux_perf_tools_full.png)

## What metrics to collect from VM level? {.slide}

* CPU: VM CPU utilization
* MM: what are GC metrics, VM allocators
* Threads: how OS threads are used by schedulers, async IO pool, etc.

## What metrics to collect from application level? {.slide}

* events, messages, key func calls
* errors and error rates
* response time
* benchmark result for key components

## Know your status {.slide .shout}

## Analyze from system level {.slide}

![](images/linux60.jpg)

## Analyze from VM level {.slide}

Find the right tool for your vm

![](images/observer.jpg)

## Analyze from application level {.slide}

Datadog / sentry / crashlytics / periscope is your friends

![](images/uapi.jpg)

## Analyzing approaches {.slide .shout}

## USE method {.slide}

* Utilization, Saturation, Error rate
    * Send request to make the service/resource saturated
    * check the utilization (and other metrics)
    * check the error rates
* Helps to identify the bottleneck, the latency, throughput, and parts that not correctly back pressure
* Example: UAPI contents call {network, memory, API capacity, etc.}

## Benchmark {.slide .shout}

## What is benchmark? {.slide}

* Purpose
    * Choose between solutions
    * Know the status quo / diff of throughput / latency / etc.
* Tools: ab, wrk, etc.
* Put your thought, the method, result and your conclusion somewhere (for others to repeat!)

## Benchmark tools {.slide}

![[source](http://www.brendangregg.com/Slides/LinuxConNA2014_LinuxPerfTools.pdf)](images/bench_tools.jpg)

## Benchmark demo {.slide}

* The system: cowboy (ranch acceptors 100) / plug / a gen server per content
* The problem: if we want to materialize several contents, what's the best approach, Enum or Flow?
    * My gut feeling: Flow.
* Solution 1: Flow. The load for materializing contents is distributed further to multiple processes, then aggregate back to acceptor process
* Solution 2: Enum. The load are processed in the same process.
* The result: Enum excels in throughput, Flow excels in latency

## The code under test {.slide}

```elixir
defp map_reduce(ids, platform, country, opts) do
  ids
    |> Enum.map(fn id -> {id, get(id, platform, country, opts)} end)
    |> Enum.reduce(%{}, fn {k, v}, acc -> Map.put(acc, k, v) end)
end

defp map_reduce(ids, platform, country, opts) do
  ids
    |> Flow.from_enumerable()
    |> Flow.map(fn id -> {id, get(id, platform, country, opts)} end)
    |> Flow.partition()
    |> Flow.reduce(fn -> %{} end, fn {k, v}, acc -> Map.put(acc, k, v) end)
    |> Enum.into(%{})
end
```

## The Test & result {.slide}

Test: ab -n 50000 -c 100 "http://.../api/v1/contents?ids=061,0970,2200,0970,346837,268532,312926&country=US&platform=web"
```
Enum vs Flow vs Enum (1024 acceptors)

Time taken: 125s vs 144s vs 126s
RPS       : 398.9 vs 347.1 vs 420
TPR       : 2.507ms vs 2.881ms 2.376ms
50%       : 164ms vs 274ms vs 178ms
95%       : 318ms vs 491ms vs 382ms
100%      : 13862ms vs 6175ms vs 7471ms
```

## Benchmark paradox {.slide}

* it may guide you to the wrong direction
* make sure you're testing the exactly same things
    * normal path (slow path)
    * fast path
    * super fast path (or put a fast track image)
* put deep thought on what to benchmark, and how you parse the result
* every solution has its own pro/con, choose wisely
* Thoughts:
    * what if we materialize 100 contents? who excels?

## Profiling {.slide .shout}

## What is profiling? {.slide}

* profiling is like an X-ray / CT scan to the running code
* Purpose: reveal how the system actually runs and what's the bottleneck/surprise
* Tools: gprof, fprof, lcnt, chrome etc.

## Flamegraph {.slide}

* Purpose: Have a picture on what's going on for a part of your running system
* Tools: perf / systemtap / eflame (for erlang) / find your own for other lang
* example:

```
$ mix materializer.profile --flame 268532 web US
$ make open-flame
```

## Flamegraph: video {.slide}

![](images/flame.svg)

## Flamegraph: series {.slide}

![](images/flame-series.svg)

## Profiling demo {.slide .shout}

## Improve {.slide .shout}

## Computation {.slide}

* really differentiate distribution time / compile time / load time / run time
    * e.g. chrome put a bloomfilter for malicious url in its distribution
    * e.g. policy engine / matrix API did heavy lifting on the compile time
* divide the code path to slow / fast path
    * for fast path, do less with memoize, cache, bloom filter, etc.
* use sink hole for known bad requests
* data structure! data structure! data structure!
    * right ds for right problem: tree, hash map, set, list, array, ...

## Memory {.slide}

![](images/tcp_header.jpg)

## Network {.slide}

* right protocol to use
    * TCP?
    * UDP?
    * Multicast?
* right encoding for transferring data
    * json?
    * msgpack?
    * protobuf?
    * ...

## Key take aways {.slide}

* Nothing is simple
* Know your system
* measure
* analyze
* Improve
* We need to grow our own [Brendan D. Gregg](http://www.brendangregg.com/) in all ends !!!
    * Good for your career!
