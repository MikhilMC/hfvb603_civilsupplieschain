# CHFVB603_CivilSuppliesChain

# CIVIL SUPPLIES CHAIN

## Setting Up:

**STEP 1 :** Download the repository using the command 
```
git clone https://gitlab.com/MikhilMC/chfvb603_civilsupplieschain.git
```

**STEP 2 :** Go to the **CHFVB603_CivilSuppliesChain/network** directory and initialize Hyperledger Fabric network using **ansible**
```
cd CHFVB603_CivilSuppliesChain/network
ansible-playbook playbook.yml
```

**STEP 3 :** Then go to the directory
**CHFVB603_CivilSuppliesChain/chaincode/civil-supplies-network**, and open VS Code from that folder. (NB: Please remember that VS Code must be of version **1.39.2**.)
```
cd CHFVB603_CivilSuppliesChain/chaincode/civil-supplies-network
code .
```

**STEP 4 :** Then open the **IBM BLOCKCHAIN PLATFORM** vs code extension. In **FABRIC ENVIRONMENT** section, we can add a blockchain environment using the option **Add an Ansible-created network**. Select the **CHFVB603_CivilSuppliesChain/network** as the location.

**STEP 5 :** After that go to the **SMART CONTRACT** section of the **IBM BLOCKCHAIN PLATFORM** extension, and select the **Package Open Project** option from it. This step will package the most recent smart constract with name and it's version.

**STEP 6 :** Then connect to the previously connected blockchain network, and install and instantiate the previously packaged smart contract. This step will deploy the smart contract in the blockchain network.

**STEP 7 :** After this go to the folder **CHFVB603_CivilSuppliesChain/dapp**. This folder contains 4 folders namely **commisioner**, **nodal-officer**, **ration-retailer**, and **ration-card**. The first 3 are the dapps of 3 organizations in this project, which is designated for different functions, and the latter is used to only display details in a ration card.

## EXECUTION FLOW

### COMMISIONER SECTION

**STEP 8 :** Go to commisioner dapp directory first. Install dependencies and start the app by typing the given commands. Then open browser and type http://localhost:3000.
```
cd commisioner
npm install
npm start
```

**STEP 9 :** Select the option for creating the Nodal Officer first.
```
ex:
  nodalOfficerId1: 10
  district: Thrissur
  Taluk: Thrissur
```

**STEP 10 :** Select the second form in that page itself to read the details of a nodal officer.
```
ex:
  nodalOfficerId2: 10
```

**STEP 11 :** Go back to the home page and then choose the option for creating the Ration Retailer.
```
ex:
  rationRetailerId1: 20
  nodalOfficerId: 10
  LSGBody: Arimpur
  wardNumber: 4
```

**STEP 12 :** The form in the below section will read the details of a ration retailer
```
ex:
  rationRetailerId: 20
```
### NODAL OFFICER SECTION

**STEP 13 :** Then go to the directory **CHFVB603_CivilSuppliesChain/dapp/ration-retailer**. Install dependencies, start the dapp and then go to http://localhost:4000 in browser
```
cd CHFVB603_CivilSuppliesChain/dapp/ration-retailer
npm install
npm start
```

**STEP 14 :** Use the option to create ration card and give the appropriate inputs.
```
ex:
  rationCardNumber1: 30
  rationRetailerId: 20
  houseNumber: 123
  isHomeElectrified: no
  mobileNumber: 9876543210
```
**STEP 15 :** The form in the below section will read the details of a ration card
```
ex:
  rationCardNumber2: 30
```

**STEP 16 :** Then go back to home page and select option for deleting a ration card.
```
ex:
  rationCardNumber: 30
```

**STEP 17 :** Then go back to home page and select option for adding a new consumer to the ration card.
```
ex:
  consumerNumber1: 40
  rationCardNumber: 30
  name: Bob
  age: 24
  sex: Male
  occupation: Builder
  individualIncome: 15000
```

**STEP 18 :** The form in the below section will read the details of a consumer
```
ex:
  consumerNumber2: 40
```

**STEP 19 :** Then go back to home page and select option for deleting a consumer.
```
ex:
  consumerNumber: 40
```

**STEP 20 :** Then go back to home page and select option for updating the personal details of a consumer.
```
ex:
  consumerNumber: 40
  newName: Alice
  newAge: 20
  newSex: Female
```

**STEP 21 :** Then go back to home page and select option for updating the professional details of a consumer.
```
ex:
  consumerNumber: 40
  newOccupation: Driver
  newIndividualIncome: 20000
```

**STEP 22 :** Then go back to home page and select option for shifting the ration card in the same ward.
```
ex:
  rationCardNumber: 30
  newHouseNumber: 123
  isNewHomeElectrified: no
```

**STEP 23 :** Then go back to home page and select option for shifting the ration card in the same LSG Body.
```
ex:
  rationCardNumber: 30
  newHouseNumber: 123
  newRationRetailerId: 21
  isNewHomeElectrified: no
```

**STEP 24 :** Then go back to home page and select option for shifting the ration card in the same Taluk.
```
ex:
  rationCardNumber: 30
  newHouseNumber: 123
  newRationRetailerId: 22
  isNewHomeElectrified: no
```

**STEP 26 :** Then go back to home page and select option for changing the mobile number of the ration card.
```
ex:
  rationCardNumber: 30
  newMobileNumber: 9988776655
```

**STEP 27 :** Then go back to home page and select option for changing electricity connection status of the ration card.
```
ex:
  rationCardNumber: 30
```
### COMMISIONER SECTION

**STEP 28 :** After this go back to commisioner dapp in browser. Select the option for shifting a ration card to another taluk.
```
ex:
  rationCardNumber: 30
  newHouseNumber: 123
  newRationRetailerId: 23
  isNewHomeElectrified: yes
```

**STEP 29 :** Then go to home page and select the option for shifting the consumer to another card
```
ex:
  consumerNumber: 40
  rationCardNumber: 31
```
### RATION RETAILER SECTION

**STEP 30 :** Go to the directory **CHFVB603_CivilSuppliesChain/dapp/ration-retailer**. Do the necessary steps just as before.
```
cd CHFVB603_CivilSuppliesChain/dapp/ration-retailer
npm install
npm start
```

***STEP 31 :** Select the option for making a retailer food items purchase
```
ex:
  retailerPurchaseNumber1: 50
  rationRetailerId: 20
  rationCardColour: Blue
  itemName: Rice
```

**STEP 32 :** The form in the below section will read the details of a retailer purchase
```
ex:
  retailerPurchaseNumber2: 50
```

***STEP 33 :** Select the option for making a retailer kerosine purchase
```
ex:
  retailerPurchaseNumber: 50
  rationRetailerId: 20
```

***STEP 34 :** Select the option for making a consumer purchase
```
ex:
  consumerPurchaseNumber1: 60
  retailerPurchaseNumber1: 50
  rationCardNumber: 30
```

**STEP 35 :** The form in the below section will read the details of a consumer purchase
```
ex:
  consumerPurchaseNumber2: 60
```

### RATION CARD SECTION

**STEP 36 :** Go to the directory **CHFVB603_CivilSuppliesChain/dapp/ration-card**. Do the necessary steps just as before.
```
cd CHFVB603_CivilSuppliesChain/dapp/ration-card
npm install
npm start
```

**STEP 37 :** The first form in the home page will read the details of a ration card
```
ex:
  rationCardNumber1: 30
```

**STEP 38 :** The second form in the home page will show all the family members included in a ration card
```
ex:
  rationCardNumber2: 30
```

**STEP 39 :** The third form in the home page will show the details of consumer purchases done for a ration card
```
ex:
  rationCardNumber3: 30
```

END