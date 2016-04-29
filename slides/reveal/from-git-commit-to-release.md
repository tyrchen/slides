% Process: from commit to release
% Tyr Chen
% Feb 24th, 2015

# The importance of processes

* best practices for high quality deliverables
* make us to work as a team
* make us professional programmers

# This talk will cover

* coding
* linting
* releasing

# Coding

---

## Please checkout:

```bash
$ git clone git@github.com:adRise/git-test
$ cd git-test
```

---

## working on a feature

```bash
$ git pull # always do this to make sure you are on latest code
$ git checkout -b feature/TEST-123-awesome-feature-<your-name>
```

---

## make initial commits

* incremental changes, clean and concise
* good and understanable comments
* a good commit should not break the ``build``

```bash
$ cp example.txt <yourname>.txt
$ git add <yourname>.txt
$ git commit
```

---

## code and self review

* now change whatever you want to do in the file you moved
* use ``git diff`` to review before committing
    * ``diff-so-fancy`` is a better diff tool for diff
* quick check on your code to find silly issues (pre-hook / lint can help)

```bash
$ git diff
$ # if everything turned out fine
$ git add <yourname>.txt
$ git commit
```

---

## test (skipped for this talk)

* before push you should make sure your changes passed existing tests
    - to eliminate regression issues
* add new test cases to cover your changes
    - to eliminate new issues

---

## rebase for squash merge

* always rebase your code to allow squash commit
* we made 2 commits in this branch so we rebase to ``HEAD~2``
* then push your changes to upstream

```bash
$ git rebase -i HEAD~2
# change the commits after 1st one to squash
$ git push -u origin feature/TEST-123-awesome-feature-<your-name>
# note if you have already pushed to your branch you can -f
$ git push -f origin feature/TEST-123-awesome-feature-<your-name>
# warning: make sure only you're working on this branch and your code is the latest
```

---

## Start a pull request

* goto ``github.com/adRise/git-test`` and click "compare & pull request"
* provide a detailed explanation on what you have did
* ``@`` colleagues you want to review your code
* wait for reviewer to give you comments

---

## Hands-on (5 min)

* working on a new issue TEST-124: yet another awesome issue
* use the process you learned just now
* ah, don't forget to suffix your name in the branch you created to avoid conflicts

---

## release your code (produce owner)

* Once code is reviewed, merge your PR in github
* If this change will be released, create a new tag on it
    - [semVer]() on tag name (e.g. v2.3.1)

```bash
$ git pull # just to make sure you're in the latest code
$ git tag -a v1.0.1
$ git push origin v1.0.1
```

* goto [``github.com/adRise/git-test/releases``](https://github.com/adRise/git-test/releases) and create a release. upload assets if there's any.

# precommit hook and linting

* it is hard for human to check all to coding style
    - spacing, single quote or double quote, etc.
* it is hard for human to enforce certain rules
    - code complexity
    - arity of the function
    - length of function
    - no console log
* linting tool can help with it
* and git precommit hook can use linting tool to check before each commit

# Q&A

