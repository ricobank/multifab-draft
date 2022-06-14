require('@nomiclabs/hardhat-ethers')

require('./mock-deploy.js')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    paths: {
        sources: "core"
    },
    solidity: {
        version: '0.8.14',
        settings: {
            optimizer: {
                enabled: true,
                runs: 20000
            }
        }
    }
}
