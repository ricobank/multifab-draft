/// SPDX-License-Identifier: AGPL-3.0

pragma solidity 0.8.14;

error NoProto();

contract Multifab {
    mapping(bytes32=>address) protos;

    // the prototype constructor might fail without arguments,
    // so we might have to pass something in even if we never
    // call that contract again. These useless args are called `blah`.
    function cache(bytes calldata code, bytes calldata blah) external returns (bytes32 codehash) {
        assembly {
            // get hash of code (exclude constructor args)
            let codeptr := mload(0x40)
            calldatacopy(codeptr, code.offset, code.length)
            codehash := keccak256(codeptr, code.length)

            // copy constructor args directly after code
            let fulllen := add(code.length, blah.length)
            let blahptr := add(codeptr, code.length)
            calldatacopy(blahptr, blah.offset, blah.length)

            // find and load the slot for codehash in protos
            let slotptr := add(codeptr, fulllen)
            let nextptr := add(slotptr, 32)
            mstore(slotptr, codehash)
            mstore(nextptr, protos.slot)
            let slot := keccak256(slotptr, 64)
            let addr := sload(slot)

            // if new code create it and store address
            if iszero(addr) {
                addr := create(0, codeptr, fulllen)
                sstore(slot, addr)
            }
        }
    }

    // args should be abi.encode(v1, v2), calced off chain and passed in
    // create code should be abi.encodePacked(bytecode, args)
    // encodepacked packs dynamic types in place without the length

    function build(bytes32 codehash, bytes calldata args) external returns (bytes memory) {// address addr) {
        assembly {
            let slotptr := mload(0x40)
            let nextptr := add(slotptr, 32)
            let codeptr := add(nextptr, 32)
            mstore(slotptr, codehash)
            mstore(nextptr, protos.slot)
            let slot := keccak256(slotptr, 64)
            let addr := sload(slot) // todo remove let
            if iszero(addr) {
                mstore(0, shl(224, 0xd5153c96))
                revert(0, 4)
            }
            let size := extcodesize(addr)
            extcodecopy(addr, codeptr, 0, size)

            let argsptr := add(codeptr, size)
            calldatacopy(argsptr, args.offset, args.length)

            return(codeptr, size)

//            addr := create(0, codeptr, add(size, args.length))
        }
    }
}
