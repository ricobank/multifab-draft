// const Buffer = require('node:buffer')
const dpack = require('@etherpacks/dpack')
const hh = require('hardhat')
const ethers = hh.ethers
const { b32, fail, hear, revert, send, snapshot, wait, want } = require('minihat')

describe('multifab', ()=>{
    let multifab
    let personhash

    let ali, bob, cat
    let ALI, BOB, CAT

    const name = Buffer.from("dan");
    const last = Buffer.from("eli");
    const year = 12345

    before(async ()=>{
        [ali, bob, cat] = await ethers.getSigners();
        [ALI, BOB, CAT] = [ali, bob, cat].map(x => x.address)
        const pack = await hh.run('multifab-mock-deploy')
        const dapp = await dpack.load(pack, hh.ethers, ali)
        multifab = dapp.multifab

        const person_type = await ethers.getContractFactory('Person', ali)
        const blah = ethers.utils.defaultAbiCoder.encode([ "bytes", "bytes", "uint256" ], [ name, last, year ])

        // TODO add events
        personhash = await multifab.callStatic.cache(person_type.bytecode, blah)
        await send(multifab.cache, person_type.bytecode, blah)

        await snapshot(hh)
    })

    beforeEach(async ()=>{
        await revert(hh)
    })

    it('build', async () => {
        const args = ethers.utils.defaultAbiCoder.encode([ "bytes", "bytes", "uint256" ], [ name, last, year ])
        // TODO add events
        const address1 = await multifab.callStatic.build(personhash, args)
        await send(multifab.build, personhash, args)
        console.log(address1)
    })
})
