let profile = {
  commisioner: {
    "Wallet": "/home/mikhil/hyperledger_fabric/CHFVB603_CivilSuppliesChain/network/wallets/Commisioner",
    "CCP": "/home/mikhil/hyperledger_fabric/CHFVB603_CivilSuppliesChain/network/gateways/Commisioner/Commisioner gateway.json"
  },
  nodal_officer: {
    "Wallet": "/home/mikhil/hyperledger_fabric/CHFVB603_CivilSuppliesChain/network/wallets/NodalOfficer",
    "CCP": "/home/mikhil/hyperledger_fabric/CHFVB603_CivilSuppliesChain/network/gateways/NodalOfficer/Nodal Officer gateway.json"
  },
  ration_retailer: {
    "Wallet": "/home/mikhil/hyperledger_fabric/CHFVB603_CivilSuppliesChain/network/wallets/RationRetailer",
    "CCP": "/home/mikhil/hyperledger_fabric/CHFVB603_CivilSuppliesChain/network/gateways/RationRetailer/Ration Retailer gateway.json"
  }
}

module.exports = {
  profile
}