% Policy Engine in a Week
% Tyr Chen
% Jan 13th, 2017

## Ideation {.slide}

* Build the whole policy tree with Erlang's pattern matching engine
* PoC code 200 lines
* Each policy check spent 20us, 500 policy check around 60ms
* The compilation stage takes more thant **10 min**
* No external API
* No series support

## Status quo {.slide}

* 1400 LoC with 70% test coverage
* Rich features:
    * batch policy check. 100 videos 350us, 100 series 7ms
    * get available window. 1 video ~600us
    * coming soon, leaving soon. ~4ms for whole contents
    * autonomous rebuild.
    * All with full fledged rest API.
* Now the compilation stage takes **just ~20s**
* release and hot reload

## Challenges everywhere {.slide .shout}

## C1: compilation time {.slide .shout}

## The problem {.slide}

* We have 100k contents in database.
    * Thus we generate a function for every records.
    * contribute to 99% of the compilation time
* We mixed all the code together thus compiler can't do parallel compilation
    * generate video (100k)
    * generate series (~1000)
    * generate window (~2k)
    * generate leaving / coming (from ~2k of data)

## The solution {.slide}

* for 100k+ contents we have around 3k unique policies...
    * build a map for holding the id -> policy_hash
    * generate 3k functions for each policies
* for series / window / scheduler support, separate them out from video code

## The core code {.slide}

```elixir
def match(id, app, platform, country, timestamp) do
  case Map.get(@contents, id) do
    nil -> false
    key ->
      {result, _} = do_parse(key, app, platform, country, timestamp)
      result
  end
end
policies
  |> Enum.map(fn {k, policy} ->
    case Parser.parse(policy) do
      {:ok, expr} ->
        defp do_parse(unquote(k), app, platform, country, date) do
          {unquote(expr), {app, platform, country, date}} # just for compiling warning
        end
      {:error, {_, error, token}} -> :error
    end
  end)
```

## C2: Parse the window {.slide .shout}

## The policy {.slide}

```elixir
# content id: 268532
app in ["tubitv"] and (
  ( country in ["US","VI","PR","GU"] and date >= 1/1/2016 and date <= 12/31/2016 )
  or
  ( country = "CA" and date >= 3/1/2016 and date <= 2/28/2017 )
)
```

* in US, the window is closed
* in CA, it is active!

## The AST {.slide}

```elixir
{:ok,
 {:and, [line: 1],
  [{:in, [line: 1], [{:app, [line: 1], nil}, ["tubitv"]]},
   {:or, [line: 1],
    [{:and, [line: 1],
      [{:and, [line: 1],
        [{:in, [line: 1],
          [{:country, [line: 1], nil}, ["US", "VI", "PR", "GU"]]},
         {:>=, [line: 1], [{:date, [line: 1], nil}, 1451606400]}]},
       {:<=, [line: 1], [{:date, [line: 1], nil}, 1483142400]}]},
     {:and, [line: 1],
      [{:and, [line: 1],
        [{:==, [line: 1], [{:country, [line: 1], nil}, "CA"]},
         {:>=, [line: 1], [{:date, [line: 1], nil}, 1456790400]}]},
       {:<=, [line: 1], [{:date, [line: 1], nil}, 1488240000]}]}]}]}}
```

## How could we parse that information? {.slide}

```elixir
defp do_match({op, _, [{:date, _, nil}, timestamp]}, state) when is_integer(timestamp) do
  [{:date, op, timestamp}|state]
end
defp do_match({_op, _, [{:app, _, nil}, _app]}, state) do
  state
end
defp do_match({op, _, [{:platform, _, nil}, platform]}, state) do
  [{:platform, op, platform}|state]
end
defp do_match({op, _, [{:country, _, nil}, country]}, state) do
  [{:country, op, country}|state]
end
defp do_match({_op, _, [left, right]}, state) do
  new_state = do_match(left, state)
  do_match(right, new_state)
end
```

## Mission accomplished! {.slide}

```bash
iex(9)> PolicyEngine.get_active_windows("268532", "tubitv", "android", "CA")
[%{"end" => "2/28/2017", "start" => "3/1/2016"}]
iex(10)> PolicyEngine.get_active_windows("268532", "tubitv", "android", "US")
[]
```

* just 16 lines of code the parse the AST
* totally 100 LoC to get the window out from policy

## C3: Leaving soon! {.slide .shout}

## The problem {.slide}

* how to know that which contents in our collection are available:
    * next 7, 30, 90 days in US for android?
    * how about what title will be in window in March?
* policy is not a queriable data so we can't run db query on it

## The solution: brute force! {.slide}

```elixir
defp check_scheduler(from_ts, to_ts, app, platform, country, callback) do
  schedule = @ids_with_window
    |> Stream.map(fn id -> {id, callback.(id, from_ts, to_ts, app, platform, country)} end)
    |> Stream.filter_map(fn {_, v} -> v end, fn {k, _} -> k end)
    |> Enum.to_list
  {:ok, schedule}
end
defp expires_in(id, from_ts, to_ts, app, platform, country) do
  GenVideo.match(id, app, platform, country, from_ts) and
    not GenVideo.match(id, app, platform, country, to_ts)
end
defp availables_in(id, from_ts, to_ts, app, platform, country) do
  not GenVideo.match(id, app, platform, country, from_ts) and
    GenVideo.match(id, app, platform, country, to_ts)
end
```

## Lessons learned {.slide}

* If we can make basic stuff run really fast, we open a window!
* Don't be frightened by brute force solutions!

```bash
$ mix bench

benchmark name                   iterations   average time
get single active windows              5000   362.62 µs/op
100 video policy check                 5000   571.06 µs/op
get 100 active windows                 2000   766.27 µs/op
match any series with 100 items        1000   1190.97 µs/op
leaving soon                            500   3689.95 µs/op
100 series policy check                 200   9210.93 µs/op
```

## C4: Hot reload {.slide .shout}

## The problem {.slide}

* We compile the data into code, so code as a cache
* We then need to maintain this "cache"
* Policy changed / content added, we should rebuild
* and should not impact existing services

## The solution {.slide}

* Find the right compiling function to use
* Find a way to know that we need recompile
    * we don't want compilation for every change
    * ideally every X min, if content changed during the period we compile
* Find a solution that compiling doesn't impact anything


## Compiling the code {.slide}

```elixir
defp compile do
  files = ["gen_video_policy.ex", ...]
  old_versions = [PolicyEngine.GenVideo, ...]
    |> Enum.map(fn mod -> mod.compiler_version() end)

  update_version()

  path = :policy_engine
    |> Application.app_dir
    |> Path.join("src/lib/policy_engine/gen")

  mods = files
    |> Enum.map(&(Path.join(path, &1)))
    |> Kernel.ParallelCompiler.files
end
```

## Putting a version info {.slide}

```elixir
defmodule PolicyEngine.Macro.Compiler do
  @moduledoc """
  This is an internal macro for setting up vsn and version info
  """
  defmacro __using__(_opts) do
    quote do
      alias PolicyEngine.Compiler
      @vsn Compiler.get_version()
      def compiler_version() do
        @vsn
      end
      # other stuff...
    end
  end
end
```

## Timer/Event to trigger compilation {.slide}

```elixir
def init(_) do
  children = [
    worker(Agent, [fn -> 0 end, [name: :content_changed]], id: :content_changed),
    worker(Agent, [fn -> 0 end, [name: :compiler_version]], id: :compiler_version),
    worker(Agent, [fn -> Compiler.time_shift() end, [name: :next_interval]], id: :next_interval),
    worker(Compiler, [@interval * 1000]),
  ]
  ...
  supervise(children, options)
end
def init(interval) do
  :timer.send_interval(interval, :timeout)
  {:ok, nil}
end
```

## Handle the event {.slide}

```elixir
def handle_info(:timeout, state) do
  Agent.update(:next_interval, fn _ -> time_shift() end)
  changed? = Agent.get_and_update(:content_changed, fn n -> {n, 0} end)
  case changed? do
    0 -> nil
    _ -> compile()
  end
  {:noreply, state}
end
```

## No impact to existing service? {.slide}

erlang VM make sure that. Whole flow:

```bash
iex(14)> PolicyEngine.notify(:content_changed)
1
iex(15)> PolicyEngine.notify(:content_changed)
2
Timer event triggered: db changed 2 times during the interval.
Compiling modules: [{"gen_video_policy.ex", "1.1.0-0"}, ...]

iex(16)> PolicyEngine.leaving(30, "tubitv", "android", "US")
{:ok, [299590, ...]}

Compilation finished: [{PolicyEngine.GenVideo, "1.1.0-1"}, ...]. Total spent: 26 seconds

Timer event triggered: db changed 0 times during the interval.

iex(17)> PolicyEngine.get_next_compiling_interval
41
```

## Lessons learned {.slide}

* Read the f**king source code!
* Erlang VM is an OS so you can easily do:
    * recurring task
    * cron job
    * message queue
    * kv store / database
    * ...

## service comparison {.slide}

|  Service Type    | what we use in nodejs?     | what we use in elixir? |
-------------------|----------------------------|------------------------|
| long task        | message queue and worker   | process, (with pool)   |
| recurring task   | cron job, airflow, etc.    | :timer.send_interval   |
| supervision      | supervisord, pm2, etc.     | supervision tree       |
| timer event      | typically a worker         | :timer.apply_interval  |
| KV data          | redis, memcached           | ets, dets              |
| relational data  | Postgres, mysql            | mnesia                 |
| concurrent state | db, zookeeper, etc.        | process, Agent         |


## C5: Release {.slide .shout}

## Very easy, actually! {.slide}

* you just need to add ``distillery`` and generate config
* ``MIX_ENV=prod mix release --env prod``
* push tgz to remote server
* run ``bin/policy_engine start | stop | console
* and hot reload whole app is also easy!
