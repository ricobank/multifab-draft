/// SPDX-License-Identifier: AGPL-3.0

pragma solidity 0.8.14;

contract Person {
    bytes public name;
    bytes public last;
    uint  public year;

    constructor(bytes memory _name, bytes memory _last, uint _year) {
        name = _name;
        last = _last;
        year = _year;
    }
}
