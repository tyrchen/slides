% Sharing economy in China
% Tyr Chen
% June 29th, 2017

## The bicycle sharing war {.slide}

![](images/crowded_bikes.jpg)

## What is a so-called "shared bike" {.slide}

<iframe width="800" height="450" src="https://www.youtube.com/embed/5mqrtbMxBDc" frameborder="0" allowfullscreen></iframe>

## Players {.slide}

![](images/bike_vendors.jpg)

## Leaders {.slide}

![](images/bike_leaders.jpg)

## The hardware {.slide}

* Auto charging (solar & charging while ride)
* Intelligent lock (GPS & mobile chip)
* chain-less transmission
* solid tire

## The lock {.slide}

![](images/mobike_lock.jpg)

## Upon unlocking (1) {.slide}

* (user is authorized by the system)
* user to use the app to scan the QR code
* the unique id of the lock is identified
* the backend examined the bike condition and send unlock signal (mark it as using)
* the signal arrived at the bike
    * signal could be SMS message, a phone call, or a message through network (my guesses)
    * the hard part is how to wake up a bike from standby AQAP

## Upon unlocking (2) {.slide}

* security check from the lock
* automatic unlock (and alarm the user)
* send signal back to backend, and start user session
* the backend signal the app, display the unlocked info in user's mobile app
* all this happened less than 5s
* the whole experience is smooth, just as playing a game (actually they adopted game ideas)

## Upon riding {.slide}

* The mobile chip is active working, sending data back through 3G/4G network
* The user's app is sending data back as well if it is active
* the transmission system try to charge the battery if needed
* the backend system calculate the calories, distance and the fees

## Upon locking {.slide}

* user manually lock the bike
* message was sent through network
* the backend mark the bike as usable again and terminate user's session
* it might calculate user's credit based on where the bike is parked (my guess)
* A report is generated once unlock is finished


## Technology challenges {.slide}

* Security
    * network security
    * physical security (stolen, abandoned, etc.)
* Operation
    * Geo positioning / status tracking (what is GPS / cellular signal is weak)
    * Battery life (what if out of battery?)
    * maintenance
* User credit
    * what if user put bike in the middle of the road?
    * what if user abuse the bike (e.g. put their own lock on it)?

## Is it really sharing economy? {.slide}

* It's more like a time-sharing renting system in IoT
* sharing is C2C, this is B2C
* B2C model is much better for occupy the market
    * as long as it is a proved demand, money helps to open the market
    * for mobike, each bike costs 1000-3000 RMB, which, for a 100k order, it costs 100M - 300M RMB (14M - 43M USD)
    * ofo and mobike have railsed 1.2B USD in past 2 years

## How is it changing the game? {.slide}

* taxi / didi lost massive orders for trip less than 5km (3 miles)
* "bike + public transportation + bike" became much convenience and time-friendly way (people hate traffic jam)
    * I reduced my usage of taxi / didi by 60% this trip back to Beijing
* After 2 years, the whole China shared-bike market is > 50M orders / day (ofo + mobike is over 50M)
* The next massive entrance of the mobile internet traffic
    * baidu, taobao, wechat, didi, and now, mobike / ofo
    * I use it 2 - 6 times per day (round-trip hotel to office, round-trip office to restaurants)
* it makes the city smarter

## City hotspot {.slide}

![](images/bike_data.jpg)

## Let's look at real numbers (1) {.slide}

![](images/bike_car.jpg)

## Let's look at real numbers (2) {.slide}

![](images/bike_rickshaws.jpg)

## How big is the market? {.slide}

![](images/bike_market.jpg)

## Something interesting {.slide}

![](images/bike_carbon.jpg)

## Other sharing economy {.slide .shout}

## Shared charger {.slide}

![](images/shared_charger.jpg)

## Shared umbrella {.slide}

![](images/shared_umbrella.jpg)

## Shared basketball {.slide}

![](images/shared_basketball.jpeg)


## References {.slide}

* [mobike explainer](https://www.youtube.com/embed/5mqrtbMxBDc)
* [mobike white paper](https://www.slideshare.net/MatthewBrennan6/mobike-white-paper-2017)
* [mobike patents](http://www.cnipr.com/yysw/zscqzlygl/201703/t20170321_201598.htm)
* [mobike patent: an IoT based bike-renting system](https://juejin.im/entry/58aac42b1b69e6006c0bd96d)
