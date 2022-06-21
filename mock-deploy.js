const fs = require('fs')
const dpack = require('@etherpacks/dpack')

task('multifab-mock-deploy', async (args, hh)=> {
    const packdir = args.packdir ?? './pack/'
    if (!fs.existsSync(packdir)) fs.mkdirSync(packdir)

    const multifab_type = await hh.artifacts.readArtifact('Multifab')
    const multifab_deployer = await hh.ethers.getContractFactory('Multifab')
    const tx_multifab = await multifab_deployer.deploy()
    await tx_multifab.deployed()

    const pb = await dpack.builder(hh.network.name)
    await pb.packObject({
        objectname: 'multifab',
        typename: 'Multifab',
        address: tx_multifab.address,
        artifact: multifab_type
    }, alsoPackType=true)
    const pack = await pb.build()

    const show =(o)=> JSON.stringify(o, null, 2)

    fs.writeFileSync(packdir + `Multifab.json`, show(multifab_type))
    fs.writeFileSync(packdir + `multifab_${hh.network.name}.dpack.json`, show(pack))

    return pack
})
