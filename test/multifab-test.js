const dpack = require('@etherpacks/dpack')
const hh = require('hardhat')
const ethers = hh.ethers
const { revert, send, snapshot, want } = require('minihat')

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

        const person_factory = await ethers.getContractFactory('Person', ali)
        const receipt = await send(multifab.cache, person_factory.bytecode);
        [, personhash] = receipt.events.find(event => event.event === 'Added').args

        await snapshot(hh)
    })

    beforeEach(async ()=>{
        await revert(hh)
    })

    it('instance gets correct constructor args', async () => {
        const args = ethers.utils.defaultAbiCoder.encode([ "bytes", "bytes", "uint256" ], [ name, last, year ])
        const receipt = await send(multifab.build, personhash, args)
        const [, dan_addr, ] = receipt.events.find(event => event.event === 'Built').args
        const person_type = await hh.artifacts.readArtifact('Person')
        const dan = new ethers.Contract(dan_addr, person_type.abi, ali)
        const res_name = await dan.name()
        const res_last = await dan.last()
        const res_year = await dan.year()

        want(res_name).to.eql('0x' + name.toString('hex'))
        want(res_last).to.eql('0x' + last.toString('hex'))
        want(res_year).to.eql(ethers.BigNumber.from(year))
    })
})
