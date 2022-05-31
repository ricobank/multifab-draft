
`multifab` is an object that constructs new contracts by copying
code from existing contracts with `EXTCODECOPY`. It is inspired
by [an old idea](https://github.com/nexusdev/the-factory), now
motivated by a real use case: Vyper doesn't have factories!

It might also end up being more useful overall because this way we
can log info about the constructor arguments and so on. Finally
we might be able to get some gas savings for some deployment cases.

Here is some pseudocode, we could probably use yul or raw bytecode:

```
event added( caller   : indexed address
             codehash : indexed bytes32
             code     : bytes )
event built( caller   : indexed address
             codehash : indexed bytes32
             args     : bytes )

protos : bytes32 -> address

fn add(code : bytes, protoargs : bytes) : address {
    hash = keccak256(code)
    if protos[hash] != 0 {
        return protos[hash]
    }
    return CREATE(code, protoargs)
}

fn new(hash : bytes32, args : bytes) : address {
    assert protos[hash] != 0
    code = EXTCODECOPY(protos[hash])
    return CREATE(code, args)
}
```