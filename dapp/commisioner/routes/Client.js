const { profile } = require('./profile')
const { FileSystemWallet, Gateway } = require('fabric-network');

// sets the location of the wallet
// loads the connectionProfile.a yaml file

// creates an object of the gateway class


class ClientApplication {


  setRoleAndIdentity(role, identityLabel) {
    this.Profile = profile[role.toLowerCase()]
    let wallet = new FileSystemWallet(this.Profile["Wallet"])
    this.connectionOptions = {
      identity: identityLabel,
      wallet: wallet,
      discovery: { enabled: true, asLocalhost: true }
    }


  }

  initChannelAndChaincode(channelName, contractName) {
    //set channel name
    this.channel = channelName
    //set contract name
    this.contractName = contractName
  }

  async generatedAndSubmitTxn(txnName, ...args) {
    let gateway = new Gateway()
    try {
      //connects to the fabric network using the connectionOptions and connection profile
      await gateway.connect(this.Profile["CCP"], this.connectionOptions);
      // console.log(gateway)
      //connects to the network
      let channel = await gateway.getNetwork(this.channel);
      //gets the contract based on the name 
      let contract = await channel.getContract(this.contractName)
      //submits the transactions and returns the result
      let result = await contract.submitTransaction(txnName, ...args);
      return result
    } catch (error) {

      console.log(`Error processing transaction. ${error}`);
      console.log(error.stack.split('\n'));
      console.log(error.message);

    } finally {

      // Disconnect from the gateway
      console.log('Disconnect from Fabric gateway.');
      gateway.disconnect();

    }
  }
}

module.exports = {
  ClientApplication
}