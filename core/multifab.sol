/// SPDX-License-Identifier: AGPL-3.0

pragma solidity 0.8.14;

error NoProto();

contract Multifab {
    mapping(bytes32=>bytes) public protos;

    event Added(address indexed caller, bytes32 indexed codehash);
    event Built(address indexed caller, address indexed made, bytes args);

    function cache(bytes calldata code) external returns (bytes32 codehash) {
        codehash = keccak256(code);
        protos[codehash] = code;
        emit Added(msg.sender, codehash);
    }

    function build(bytes32 codehash, bytes calldata args) external returns (address made) {
        bytes memory code = protos[codehash];
        if (code.length == 0) revert NoProto();
        bytes memory full = abi.encodePacked(code, args);
        assembly {
            made := create(0, add(full, 32), mload(full))
        }
        emit Built(msg.sender, made, args);
    }
}
