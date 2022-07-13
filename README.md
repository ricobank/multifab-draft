
`multifab` is an object that constructs new contracts by copying
code from existing contracts with `EXTCODECOPY`. It is inspired
by [an old idea](https://github.com/nexusdev/the-factory), now
motivated by a real use case: Vyper doesn't have factories!


### usage

multifab has two functions:

```
function cache(bytes calldata code) external returns (bytes32 codehash);
```

Call `cache` with some contract code to make multifab deploy a dummy version and return its codehash.
Now you can call `build` with that codehash.

```
function build(bytes32 codehash, bytes calldata args) external returns (address made) {
```

Call `build` with a codehash (must have been `cache`d prior) and arguments, get back the address of a new instance of that contract built with those constructor arguments.