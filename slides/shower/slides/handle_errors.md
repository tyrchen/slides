% The internals of exceptions
% Tyr Chen
% Jul 12th, 2017

## What is an exception {.slide .shout}

## How do we handle exception in ancient times? {.slide}

```c
char *buf = malloc(size);
// use return value for error check
if (!buf) {
  // handle the case "out of memory"
}
// use return value + magic errno
if (select(...) < 0) {
  switch (errno) {
    case EINTR: ...
    case EGAIN: ...
    ...
  }
}
```

## pros / cons {.slide}

* simple, concise
* control flow is easy to understand
* error is hard to bubble up
* normal flow & error flow are mixed

## then we got this {.slide}

```javascript
try {
  // some bad, but small probability event happen
} catch (e) {
  // save the world
} finally { // not all lang has it (e.g. c++)
  // save the ass
}
```

## in a glance {.slide}

* errors get bubbled up easily
* you got separation of concerns
    * you can throw error in lower level code
    * then you handle it in higher level code
* still pretty simple to use and understand

## what happened when an error is thrown? {.slide .shout}

## example {.slide}
* exception terminates the current function immediately

```javascript
// pseudo code
function read(filename) {
  file = open(filename); // <- error here ends the function
  buf = read_all(file);
  return to_string(data);
}
```
* and it further bypass all functions in call chain to the place handles the exception

```
process_config() -> load_config() -> read() -> open()
        |                                         |
        ^---------------------------------------- <                              
```

## How could that happen? {.slide .shout}

## Revisit call stack {.slide}

![](images/call_stack.jpg)

## The approach to exception handling {.slide}

* catch block / finally block registers its location somewhere upon compilation
    * stack
    * a separate exception table
* throw statement trigger stack unwind
    * look for a matched ``catch`` in current frame
    * terminate current frame and continue looking for ``catch`` in previous frame
    * unless found a match, terminate the process

## Python Example: source {.slide}

```python
import dis
def exp():
    try:
        raise Exception('oops')
    except ValueError:
        print('value error')
    except Exception as e:
        print(e)
    finally:
        pass

if __name__ == '__main__':
    exp()
    dis.dis(exp)
```

## Python Example: bytecode {.slide}

```python
3           0 SETUP_FINALLY           68 (to 71)
            3 SETUP_EXCEPT            16 (to 22)

4           6 LOAD_GLOBAL              0 (Exception)
            9 LOAD_CONST               1 ('oops')
           12 CALL_FUNCTION            1
           15 RAISE_VARARGS            1
           18 POP_BLOCK
           19 JUMP_FORWARD            45 (to 67)

5     >>   22 DUP_TOP
           23 LOAD_GLOBAL              1 (ValueError)
           26 COMPARE_OP              10 (exception match)
           29 POP_JUMP_IF_FALSE       43
           32 POP_TOP
           33 POP_TOP
           34 POP_TOP

6          35 LOAD_CONST               2 ('value error')
           38 PRINT_ITEM
           39 PRINT_NEWLINE
           40 JUMP_FORWARD            24 (to 67)

7     >>   43 DUP_TOP
           44 LOAD_GLOBAL              0 (Exception)
           47 COMPARE_OP              10 (exception match)
           50 POP_JUMP_IF_FALSE       66
           53 POP_TOP
           54 STORE_FAST               0 (e)
           57 POP_TOP

8          58 LOAD_FAST                0 (e)
           61 PRINT_ITEM
           62 PRINT_NEWLINE
           63 JUMP_FORWARD             1 (to 67)
      >>   66 END_FINALLY
      >>   67 POP_BLOCK
           68 LOAD_CONST               0 (None)

10    >>   71 END_FINALLY
           72 LOAD_CONST               0 (None)
           75 RETURN_VALUE
```

## Java example: source {.slide}

```java
class exp {
	public static void main(String[] args) throws Exception {
		try {
			throw new Exception();
		} catch (Exception e) {
			System.out.print("got exception!");
		} finally {
			System.out.print("hello world!");
		}
	}
}
```

## Java example: bytecode {.slide}

```code
public static void main(java.lang.String[]) throws java.lang.Exception;
  descriptor: ([Ljava/lang/String;)V
  flags: ACC_PUBLIC, ACC_STATIC
  Code:
    stack=2, locals=3, args_size=1
       0: new           #2                  // class java/lang/Exception
       3: dup
       4: invokespecial #3                  // Method java/lang/Exception."<init>":()V
       7: athrow
       8: astore_1
       9: getstatic     #4                  // Field java/lang/System.out:Ljava/io/PrintStream;
      12: ldc           #5                  // String got exception!
      14: invokevirtual #6                  // Method java/io/PrintStream.print:(Ljava/lang/String;)V
      17: getstatic     #4                  // Field java/lang/System.out:Ljava/io/PrintStream;
      20: ldc           #7                  // String hello world!
      22: invokevirtual #6                  // Method java/io/PrintStream.print:(Ljava/lang/String;)V
      25: goto          39
      28: astore_2
      29: getstatic     #4                  // Field java/lang/System.out:Ljava/io/PrintStream;
      32: ldc           #7                  // String hello world!
      34: invokevirtual #6                  // Method java/io/PrintStream.print:(Ljava/lang/String;)V
      37: aload_2
      38: athrow
      39: return
    Exception table:
       from    to  target type
           0     8     8   Class java/lang/Exception
           0    17    28   any
```

## C++ example: source {.slide}

```C++
#include <iostream>
#include <exception>
using namespace std;
void throw_exception() {
  void *buf = malloc(10); // dangerous!
  ...
  throw 0xdeadbeef;
  ...
}
int main() {
  try {
    throw_exception();
  } catch(int i) {
    cout << i << endl;
  }

	return 0;
}
```

## C++ assembly {.slide}

```asm
00000024 <_Z15throw_exceptionv>:
  24:	e92d4800 	push	{fp, lr}
  28:	e28db004 	add	fp, sp, #4
  2c:	e24dd008 	sub	sp, sp, #8
  30:	e3a0000a 	mov	r0, #10
  34:	ebfffffe 	bl	0 <malloc>
  38:	e1a03000 	mov	r3, r0
  3c:	e50b3008 	str	r3, [fp, #-8]
  40:	e3a00004 	mov	r0, #4
  44:	ebfffffe 	bl	0 <__cxa_allocate_exception>
  48:	e1a03000 	mov	r3, r0
  4c:	e1a00003 	mov	r0, r3
  50:	e59f300c 	ldr	r3, [pc, #12]	; 64 <_Z15throw_exceptionv+0x40>
  54:	e5803000 	str	r3, [r0]
  58:	e3a02000 	mov	r2, #0
  5c:	e59f1004 	ldr	r1, [pc, #4]	; 68 <_Z15throw_exceptionv+0x44>
  60:	ebfffffe 	bl	0 <__cxa_throw>
  64:	deadbeef 	.word	0xdeadbeef
  68:	00000000 	.word	0x00000000

0000006c <main>:
  6c:	e92d4800 	push	{fp, lr}
  70:	e28db004 	add	fp, sp, #4
  74:	e24dd008 	sub	sp, sp, #8
  78:	ebfffffe 	bl	24 <_Z15throw_exceptionv>
  7c:	e3a03000 	mov	r3, #0
  80:	ea000015 	b	dc <main+0x70>
  84:	e1a02000 	mov	r2, r0
  88:	e1a03001 	mov	r3, r1
  8c:	e3530001 	cmp	r3, #1
  90:	0a000000 	beq	98 <main+0x2c>
  94:	ebfffffe 	bl	0 <__cxa_end_cleanup>
  98:	e1a03002 	mov	r3, r2
  9c:	e1a00003 	mov	r0, r3
  a0:	ebfffffe 	bl	0 <__cxa_begin_catch>
  a4:	e1a03000 	mov	r3, r0
  a8:	e5933000 	ldr	r3, [r3]
  ac:	e50b3008 	str	r3, [fp, #-8]
  b0:	e51b1008 	ldr	r1, [fp, #-8]
  b4:	e59f0030 	ldr	r0, [pc, #48]	; ec <main+0x80>
  b8:	ebfffffe 	bl	0 <_ZNSolsEi>
  bc:	e1a03000 	mov	r3, r0
  c0:	e59f1028 	ldr	r1, [pc, #40]	; f0 <main+0x84>
  c4:	e1a00003 	mov	r0, r3
  c8:	ebfffffe 	bl	0 <_ZNSolsEPFRSoS_E>
  cc:	ebfffffe 	bl	0 <__cxa_end_catch>
  d0:	eaffffe9 	b	7c <main+0x10>
  d4:	ebfffffe 	bl	0 <__cxa_end_catch>
  d8:	ebfffffe 	bl	0 <__cxa_end_cleanup>
  dc:	e1a00003 	mov	r0, r3
  e0:	e24bd004 	sub	sp, fp, #4
  e4:	e8bd4800 	pop	{fp, lr}
  e8:	e12fff1e 	bx	lr
	...
```

## Something interesting in C++ {.slide}

* Compiler inserts a bunch of stuff
    * ``__cxa_allocate_exception``: allocate exception object (for potential exception)
    * ``__cxa_throw``: stack unwind. find an exception handler in exception table, otherwise ``std::terminate``
    * ``__cxa_begin_catch`` / ``__cxa_end_catch``: maintain exception object (e.g. refcount), and make sure call stack is valid
    * ``__cxa_end_cleanup``: deallocate exception object
* Dangerous to throw exceptions if the call chain didn't do RAII properly

## The caveats of exception {.slide}

* performance
* readability (how do I know a fun throws exception)
* maintainability (especially for lang that needs manage mem manually, e.g. C++)
    * google say no to C++ exception

## Java tried to address readability issue {.slide}

* if exception is throw but not handled, state that in function signature

```java
private function connect(String[] host) throws SocketException {};
```

* compiler punishes you if you don't do so

```java
import java.net.*;
import java.util.zip.*;
class exp {
	public static void main(String[] args) throws ZipException {
		throw new SocketException();
	}
}
```

## but it introduces more issues... {.slide}

* I just want to write my code...

```java
import java.nio.file.*;
class filer {
  public String getContent(Path file) {
    byte[] content = Files.readAllBytes(file);
    return new String(content);
  }
}
```

## people was forced to make choice {.slide}

```java
class filer {
  public String getContent(Path file) throws IOException {
    byte[] content = Files.readAllBytes(file);
    return new String(content);
  }
}
// OR
class filer {
  public String getContent(Path file) {
    try {
      byte[] content = Files.readAllBytes(file);
      return new String(content);
    } catch (Exception e) {
      return "";
    }
  }
}
```

## what's the issue? {.slide}

* exceptions everywhere
* exception was handled without care
* the hight level code now need to do if else check
* C# says no to "checked exception"

## Bigger issue of exception! {.slide}

* example: when parsing a csv for a list of users, one line contains bad "age", what do you do?
* you throw errors so that becomes somebody else's problem

```java
throw new haha.notMyProblem();
```

## the revenge of golang {.slide}

* philosophy: exception tends to be misused, so I go back to old C way

```go
f, err := os.Open("filename.ext")
if err != nil {
    log.Fatal(err)
}
```

* the hidden reason
    * go wants to replace C in some areas - upon dealing low level stuff, errors mostly need to be addressed immediately
* it's not a good solution though
    * thus go introduces ``panic``, ``defer`` and ``recover``
    * panic is a better named __throw__
    * defer + recover allows one to do catch/finally

## In summary {.slide}

* you pays performance penalty on exception
* hold your fire on throwing exception: think second
* do not handle exception and convert it to a case that caller need to handle with if/else
* there are other ways (maybe better) to handle errors
    * Either / Maybe / Option / Promise in various languages


## Another view on errors {.slide .shout}

## Do we really want to terminate the callchain? {.slide}

* mostly, something bad happen, the low level code doesn't know how to do.
    * so control is passed to high level code by try/catch.
* what if high level code just register handler for errors so that error will be handled in low level code?
* This is lisp way - recover at the place that error happened (error as event)
    * low level code __signal__ the error (same as __throw__)
    * low level code __restart__ based on handler provided by high level code
    * high level code register __handler__ (same as __catch__)

## Do we really CAN handle the error? {.slide}

* sometimes no
* a database connection error leads to parts of system depending on db unworkable
* we had to crash the system rather than hiding the problem (make things worse)
* this is erlang way - let it crash
    * when bad thing happen, rather than handle it, crash
    * the parts of the system which depend on it crashed as well
    * all crashed parts restart automatically
    * the system is auto recovered from failure

## References {.slide}

1. [ARM exception EABI](http://infocenter.arm.com/help/topic/com.arm.doc.ihi0038b/IHI0038B_ehabi.pdf)
2. [C++ exception ABI](https://itanium-cxx-abi.github.io/cxx-abi/abi-eh.html)
3. [Google C++ exception guide](https://google.github.io/styleguide/cppguide.html#Exceptions)
4. [Compiler internals](http://www.hexblog.com/wp-content/uploads/2012/06/Recon-2012-Skochinsky-Compiler-Internals.pdf)
5. [Errors and exceptions in erlang](http://learnyousomeerlang.com/errors-and-exceptions)
6. [Beyond Exception Handling: Conditions and Restarts](http://www.gigamonkeys.com/book/beyond-exception-handling-conditions-and-restarts.html)
