% Boundary
% Tyr Chen
% Mar 9th, 2017

## What is boundary? {.slide}

<div style="float: left">
> In topology and mathematics in general, the boundary of a subset S of a topological space X is the set of points which can be approached both from S and from the outside of S.
>
> -- Wikipedia
</div>

<div style="float: right">
![](images/boundary.png){width=400px height=300px}
</div>

## Why is it matter? {.slide}

* The boundary makes a set a **black box**
* Communication can only be through **interface**
* one shall not surpass the border - **clear ownership**

## Examples {.slide}

* border of countries
* border of organizations

## Let's go back to software {.slide .shout}

## Build time - the way we organize code {.slide .shout}

## Function / Macro {.slide}

* a fragment of code
* like a cell
* the smallest unit of code that separate from others
* should do one thing and do it well

## Cell {.slide}

![](images/cell.jpg)

## Function {.slide}

![](images/fun_fragment.jpg){width=900px}

## Class / Module {.slide}

* usually a __FILE__
* like a biology tissue
* groups a list of functions to achieve a **functionality**
* public vs private

## Tissue {.slide}

![](images/tissue.png)

## Module {.slide}

![](images/module_fragment.jpg)

## Component / Service {.slide}

* directories and sub-directories
* like a organ
* groups a list of classes / modules to provide a specific **service**
* external vs internal

## Organ {.slide}

![](images/kidney.jpg)

See? no single point of failure

## Component {.slide}

![](images/component_fragment.jpg)

## Project / Application / Sub-system {.slide}

*  a groups of sub-directories
* like a system inside a body
* utilize a list of components / services to fulfill a **purpose**

## Body system {.slide}

![](images/circulatory_system.jpg)

## Application {.slide}

![](images/system_fragment.jpg)

## Solution {.slide}

* a groups of projects / applications
* Like a body
* orchestrate multiple applications / deployments to serve a **business**

## One thing that irrelevant {.slide}

When building a solution, think about when the sub-system should be a:

* dummy one, like respiratory system
    * logging, error reporting, monitor, etc.
    * content API
* intelligent one, like immune system
    * behavior based reaction system (e.g. firewall, dynamic user classification)
    * category / AD API
* command and control center, like a brain
    * e.g. the S part of SDN (software-defined network)
    * CMS UI

## Let's rethink about the boundaries {.slide .shout}

## Architecture and design {.slide}

|      Type      |    Format / Interface    |                Impact             |
|----------------|--------------------------|-----------------------------------|
| Solution       | a group of applications  | business / tech vision            |
| Application    | a group of directories   | High level arch / orchestration   |
| Component      | directories              | high level design                 |
| Module         | file                     | low level design                  |
| Function       | a code fragment          | interface design / think twice    |

__A good boundary is that the interface speaks for itself.__

## Good example {.slide}

![](images/good_layout.jpg)

## Bad example {.slide}

![](images/bad_layout.jpg)

## Run time - the way we run the code {.slide .shout}

## Comparison {.slide}

|  build time    |        Run time                  |
|----------------|----------------------------------|
| Solution       | your deployments in data center  |
| Project        | OS process / processes           |
| Component      | ???                              |
| Module         | Module                           |
| Function       | Function                         |

## Where does component fit in? {.slide}

* an OS process?
* a thread?

Looks we don't have good tool for that...

## while erlang VM has something... {.slide}

![](images/system_fragment.jpg)

## Summary {.slide}

* Make it clear on build-time boundary and run-time boundary
* Design for the boundaries
* Layer things up as what our body do
