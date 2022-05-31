

contract Multifab {
    mapping(bytes32=>address) protos;

    // the prototype constructor might fail without arguments,
    // so we might have to pass something in even if we never
    // call that contract again. These useless args are called `blah`.
    function add(bytes code, bytes blah) returns (bytes32) {
        bytes32 codehash = keccak256(code);
        if (protos[codehash]) {
            return codehash;
        } else {
            // protos[codehash] = CREATE(code, blah)
        }
    }

    function new(bytes32 codehash, bytes args) {
        require(protos[codehash] != 0);
        return CREATE(EXTCODECOPY(protos[codehash]), args);
    }
}