/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub } = require('fabric-shim');
const { CivilSuppliesNetworkContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

  constructor() {
    this.stub = sinon.createStubInstance(ChaincodeStub);
    // this.clientIdentity = sinon.createStubInstance(ClientIdentity);
    this.logging = {
      getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
      setLevel: sinon.stub(),
    };
  }

}

describe('CivilSuppliesNetworkContract', () => {

  let contract;
  let ctx;

  beforeEach(() => {
    contract = new CivilSuppliesNetworkContract();
    ctx = new TestContext();

    let nodalOfficer1 = {
      district: 'Thrissur',
      taluk: 'Thrissur',
      dataType: 'Nodal Officer'
    };

    let nodalOfficer2 = {
      district: 'Thrissur',
      taluk: 'Chavakkad',
      dataType: 'Nodal Officer'
    };

    let rationRetailer1 = {
      nodalOfficerId: '10',
      LSGBody: 'Arimpur',
      wardNumber: '4',
      yellowCardConsumers: 0,
      pinkCardConsumers: 0,
      blueCardConsumers: 2,
      whiteCardConsumers: 0,
      electrifiedHomes: 2,
      nonElectrifiedHomes: 0,
      yellowCardFamilies: 0,
      dataType: 'Ration Retailer'
    };

    let rationRetailer2 = {
      nodalOfficerId: '10',
      LSGBody: 'Arimpur',
      wardNumber: '5',
      yellowCardConsumers: 0,
      pinkCardConsumers: 0,
      blueCardConsumers: 0,
      whiteCardConsumers: 0,
      electrifiedHomes: 0,
      nonElectrifiedHomes: 0,
      yellowCardFamilies: 0,
      dataType: 'Ration Retailer'
    };

    let rationRetailer3 = {
      nodalOfficerId: '10',
      LSGBody: 'Manalur',
      wardNumber: '5',
      yellowCardConsumers: 0,
      pinkCardConsumers: 0,
      blueCardConsumers: 0,
      whiteCardConsumers: 0,
      electrifiedHomes: 0,
      nonElectrifiedHomes: 0,
      yellowCardFamilies: 0,
      dataType: 'Ration Retailer'
    };

    let rationRetailer4 = {
      nodalOfficerId: '11',
      LSGBody: 'Thrithallur',
      wardNumber: '7',
      yellowCardConsumers: 0,
      pinkCardConsumers: 0,
      blueCardConsumers: 0,
      whiteCardConsumers: 0,
      electrifiedHomes: 1,
      nonElectrifiedHomes: 0,
      yellowCardFamilies: 0,
      dataType: 'Ration Retailer'
    };

    let rationCard1 = {
      nodalOfficerId: '10',
      rationRetailerId: '100',
      district: 'Thrissur',
      taluk: 'Thrissur',
      LSGBody: 'Arimpur',
      wardNumber: '4',
      familyHead: 'Regha',
      familyHeadNumber: '1000000000000000',
      doesFamilyHeadAvailable: true,
      houseNumber: '234',
      totalFamilyIncome: 25000,
      totalFamilyMembers: 2,
      mobileNumber: '9497625356',
      rationCardType: 'Non-priority with State subsidy',
      rationCardColour: 'Blue',
      isHomeElectrified: true,
      dataType: 'Ration Card'
    };

    let rationCard2 = {
      nodalOfficerId: '10',
      rationRetailerId: '100',
      district: 'Thrissur',
      taluk: 'Thrissur',
      LSGBody: 'Arimpur',
      wardNumber: '4',
      familyHead: null,
      familyHeadNumber: null,
      doesFamilyHeadAvailable: false,
      houseNumber: '235',
      totalFamilyIncome: 0,
      totalFamilyMembers: 0,
      mobileNumber: '9897625356',
      rationCardType: null,
      rationCardColour: null,
      isHomeElectrified: true,
      dataType: 'Ration Card'
    }

    let rationCard3 = {
      nodalOfficerId: '11',
      rationRetailerId: '103',
      district: 'Thrissur',
      taluk: 'Chavakkad',
      LSGBody: 'Thrithallur',
      wardNumber: '7',
      familyHead: null,
      familyHeadNumber: null,
      doesFamilyHeadAvailable: false,
      houseNumber: '236',
      totalFamilyIncome: 0,
      totalFamilyMembers: 0,
      mobileNumber: '9897625345',
      rationCardType: null,
      rationCardColour: null,
      isHomeElectrified: true,
      dataType: 'Ration Card'
    }

    let consumer1 = {
      consumerNumber: '1000000000000000',
      rationCardNumber: '1000000000',
      nodalOfficerId: '10',
      rationRetailerId: '100',
      name: 'Regha',
      age: '52',
      sex: 'Female',
      occupation: 'Clerk',
      individualIncome: 12500,
      isFamilyHead: true,
      dataType: 'Consumer Account'
    }

    let consumer2 = {
      consumerNumber: '1000000000000001',
      rationCardNumber: '1000000000',
      nodalOfficerId: '10',
      rationRetailerId: '100',
      name: 'Mohanan',
      age: '56',
      sex: 'Male',
      occupation: 'Farmer',
      individualIncome: 12500,
      isFamilyHead: false,
      dataType: 'Consumer Account'
    }

    let retailerPurchase1 = {
      retailerPurchaseNumber: '10000000000000000000',
      nodalOfficerId: '10',
      rationRetailerId: '100',
      rationCardColour: 'Blue',
      itemName: 'Rice',
      basicUnit: 'Kg',
      isDistributedIndividually: true,
      overallQuantity: 0,
      individualQuantity: 2,
      pricePerQuantity: 4,
      totalQuantity: 4,
      presentQuantity: 4,
      purchaseDate: Date(Date.now()),
      dataType: 'Retailer Food Items Purchase'
    }

    let retailerPurchase2 = {
      retailerPurchaseNumber: '10000000000000000001',
      nodalOfficerId: '10',
      rationRetailerId: '100',
      itemName: 'Kerosine',
      basicUnit: 'Litre',
      isDistributedIndividually: false,
      nonElectrifiedHomesQuantity: 4,
      electrifiedHomesQuantity: 0.5,
      nonElectrifiedHomesPricePerQuantity: 18,
      electrifiedHomesPricePerQuantity: 17,
      totalQuantity: 1,
      presentQuantity: 1,
      purchaseDate: Date(Date.now()),
      dataType: 'Retailer Kerosine Purchase'
    }

    let retailerPurchase3 = {
      retailerPurchaseNumber: '10000000000000000002',
      nodalOfficerId: '11',
      rationRetailerId: '103',
      itemName: 'Kerosine',
      basicUnit: 'Litre',
      isDistributedIndividually: false,
      nonElectrifiedHomesQuantity: 4,
      electrifiedHomesQuantity: 0.5,
      nonElectrifiedHomesPricePerQuantity: 18,
      electrifiedHomesPricePerQuantity: 17,
      totalQuantity: 0.5,
      presentQuantity: 0.5,
      purchaseDate: Date(Date.now()),
      dataType: 'Retailer Kerosine Purchase'
    }

    let consumerPurchase = {
      consumerPurchaseNumber: '1000000000000000000000000',
      retailerPurchaseNumber: '10000000000000000000',
      nodalOfficerId: '11',
      rationRetailerId: '103',
      itemName: 'Kerosine',
      quantity: 0.5,
      pricePerQuantity: 17,
      price: 8.5,
      purchaseDate: Date(Date.now()),
      dataType: 'Consumer Purchase'
    }

    ctx.stub.getState.withArgs('10').resolves(Buffer.from(JSON.stringify(nodalOfficer1)));
    ctx.stub.getState.withArgs('11').resolves(Buffer.from(JSON.stringify(nodalOfficer2)));

    ctx.stub.getState.withArgs('100').resolves(Buffer.from(JSON.stringify(rationRetailer1)));
    ctx.stub.getState.withArgs('101').resolves(Buffer.from(JSON.stringify(rationRetailer2)));
    ctx.stub.getState.withArgs('102').resolves(Buffer.from(JSON.stringify(rationRetailer3)));
    ctx.stub.getState.withArgs('103').resolves(Buffer.from(JSON.stringify(rationRetailer4)));

    ctx.stub.getState.withArgs('1000000000')
      .resolves(Buffer.from(JSON.stringify(rationCard1)));
    ctx.stub.getState.withArgs('1000000001')
      .resolves(Buffer.from(JSON.stringify(rationCard2)));
    ctx.stub.getState.withArgs('1000000002')
      .resolves(Buffer.from(JSON.stringify(rationCard3)));

    ctx.stub.getState.withArgs('1000000000000000')
      .resolves(Buffer.from(JSON.stringify(consumer1)));
    ctx.stub.getState.withArgs('1000000000000001')
      .resolves(Buffer.from(JSON.stringify(consumer2)));

    ctx.stub.getState.withArgs('10000000000000000000')
      .resolves(Buffer.from(JSON.stringify(retailerPurchase1)));
    ctx.stub.getState.withArgs('10000000000000000001')
      .resolves(Buffer.from(JSON.stringify(retailerPurchase2)));
    ctx.stub.getState.withArgs('10000000000000000002')
      .resolves(Buffer.from(JSON.stringify(retailerPurchase3)));

    ctx.stub.getState.withArgs('1000000000000000000000000')
      .resolves(Buffer.from(JSON.stringify(consumerPurchase)));
  });

  describe('#nodalOfficerExists', () => {

    it('should return true for a nodal officer', async () => {
      await contract.nodalOfficerExists(ctx, '10').should.eventually.be.true;
    });

    it('should return false for a nodal officer that does not exist', async () => {
      await contract.nodalOfficerExists(ctx, '13').should.eventually.be.false;
    });

  });

  describe('#createNodalOfficer', () => {

    it('should create a nodal officer', async () => {
      // "12", "Thrissur", "Mukundapuram"
      let officer = {
        district: 'Thrissur',
        taluk: 'Mukundapuram',
        dataType: 'Nodal Officer'
      }

      await contract.createNodalOfficer(ctx, '12', 'Thrissur', 'Mukundapuram');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '12', Buffer.from(JSON.stringify(officer))
      );
    });

    it('should throw an error for a nodal officer that already exists', async () => {
      await contract.createNodalOfficer(ctx, '10', 'Thrissur', 'Mukundapuram')
        .should.be.rejectedWith(/The Nodal Officer 10 already exist/
        );
    });

  });

  describe('#readNodalOfficer', () => {

    it('should return a nodal officer', async () => {
      await contract.readNodalOfficer(ctx, '10').should.eventually.deep.equal({
        district: 'Thrissur',
        taluk: 'Thrissur',
        dataType: 'Nodal Officer'
      });
    });

    it('should throw an error for a nodal officer that does not exist', async () => {
      await contract.readNodalOfficer(ctx, '13')
        .should.be.rejectedWith(/The Nodal Officer 13 does not exist/
        );
    });

  });

  describe('#updateNodalOfficer', () => {

    it('should update a nodal officer', async () => {
      let officer = {
        district: 'Thrissur',
        taluk: 'Chalakkudy',
        dataType: 'Nodal Officer'
      }

      await contract.updateNodalOfficer(ctx, '11', 'Thrissur', 'Chalakkudy');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '11', Buffer.from(JSON.stringify(officer)
        )
      );
    });

    it('should throw an error for a nodal officer that does not exist', async () => {
      await contract.updateNodalOfficer(ctx, '13', 'Thrissur', 'Chalakkudy')
        .should.be.rejectedWith(/The Nodal Officer 13 does not exist/
        );
    });

  });

  describe('#deleteNodalOfficer', () => {

    it('should delete a nodal officer', async () => {
      await contract.deleteNodalOfficer(ctx, '11');
      ctx.stub.deleteState.should.have.been.calledOnceWithExactly('11');
    });

    it('should throw an error for a nodal officer that does not exist', async () => {
      await contract.deleteNodalOfficer(ctx, '13')
        .should.be.rejectedWith(/The Nodal Officer 13 does not exist/
        );
    });

  });

  describe('#rationRetailerExists', () => {

    it('should return true for a ration retailer', async () => {
      await contract.rationRetailerExists(ctx, '100').should.eventually.be.true;
    });

    it('should return false for a ration retailer that does not exist', async () => {
      await contract.rationRetailerExists(ctx, '105').should.eventually.be.false;
    });

  });

  describe('#createRationRetailer', () => {

    it('should create a ration retailer', async () => {
      // "102", "11", "Vatanappally", "4"
      let retailer = {
        nodalOfficerId: '11',
        LSGBody: 'Vatanappally',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 0,
        whiteCardConsumers: 0,
        electrifiedHomes: 0,
        nonElectrifiedHomes: 0,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }

      await contract.createRationRetailer(ctx, '104', '11', 'Vatanappally', '4');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '104', Buffer.from(JSON.stringify(retailer)
        )
      );
    });

    it('should throw an error for a ration retailer that already exists', async () => {
      await contract.createRationRetailer(ctx, '100', '10', 'Thrissur', '3')
        .should.be.rejectedWith(/The Ration Retailer 100 already exist/);
    });

    it('should throw an error for a nodal officer that does not exist', async () => {
      await contract.createRationRetailer(ctx, '104', '13', 'Thrissur', '3')
        .should.be.rejectedWith(/The Nodal Officer 13 does not exist/);
    });

  });

  describe('#readRationRetailer', () => {

    it('should return a ration retailer', async () => {
      await contract.readRationRetailer(ctx, '100').should.eventually.deep.equal({
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 2,
        whiteCardConsumers: 0,
        electrifiedHomes: 2,
        nonElectrifiedHomes: 0,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      });
    });

    it('should throw an error for a ration retailer that does not exist', async () => {
      await contract.readRationRetailer(ctx, '105')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#updateRationRetailer', () => {

    it('should update a ration retailer', async () => {
      let retailer = {
        nodalOfficerId: '11',
        LSGBody: 'Chavakkad',
        wardNumber: '22',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 0,
        whiteCardConsumers: 0,
        electrifiedHomes: 0,
        nonElectrifiedHomes: 0,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }

      await contract.updateRationRetailer(ctx, '101', '11', 'Chavakkad', '22');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '101', Buffer.from(JSON.stringify(retailer))
      );
    });

    it('should throw an error for a ration retailer that does not exist', async () => {
      await contract.updateRationRetailer(ctx, '105', '11', 'Thrissur', '22')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

    it('should throw an error for a nodal officer that does not exist', async () => {
      await contract.updateRationRetailer(ctx, '100', '13', 'Thrissur', '22')
        .should.be.rejectedWith(/The Nodal Officer 13 does not exist/);
    });

  });

  describe('#deleteRationRetailer', () => {

    it('should delete a ration retailer', async () => {
      await contract.deleteRationRetailer(ctx, '101');
      ctx.stub.deleteState.should.have.been.calledOnceWithExactly('101');
    });

    it('should throw an error for a ration retailer that does not exist', async () => {
      await contract.deleteRationRetailer(ctx, '105')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#rationCardExist', () => {

    it('should return true for a ration card', async () => {
      await contract.rationCardExist(ctx, '1000000000').should.eventually.be.true;
    });

    it('should return false for a ration card that does not exist', async () => {
      await contract.rationCardExist(ctx, '1000000003').should.eventually.be.false;
    });

  });

  describe('#createRationCard', () => {

    it('should create a ration card', async () => {
      let retailer = {
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 2,
        whiteCardConsumers: 0,
        electrifiedHomes: 2,
        nonElectrifiedHomes: 1,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }

      let rationCard = {
        nodalOfficerId: '10',
        rationRetailerId: '100',
        district: 'Thrissur',
        taluk: 'Thrissur',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        familyHead: null,
        familyHeadNumber: null,
        doesFamilyHeadAvailable: false,
        houseNumber: '233',
        totalFamilyIncome: 0,
        totalFamilyMembers: 0,
        mobileNumber: '9896625356',
        rationCardType: null,
        rationCardColour: null,
        isHomeElectrified: false,
        dataType: 'Ration Card'
      }

      await contract.createRationCard(ctx, '1000000003', '100', '233', false, '9896625356');
      ctx.stub.putState.should.have.been.calledWithExactly(
        '100', Buffer.from(JSON.stringify(retailer))
      ).and.calledWithExactly(
        '1000000003', Buffer.from(JSON.stringify(rationCard))
      );
    });

    it('should throw an error for a ration card that already exists', async () => {
      await contract.createRationCard(ctx, '1000000000', '100', '233', false, '9896625356')
        .should.be.rejectedWith(/The Ration Card 1000000000 already exist/);
    });

    it('should throw an error for a ration retailer does not exists', async () => {
      await contract.createRationCard(ctx, '1000000004', '105', '233', false, '9896625356')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#readRationCard', () => {

    it('should return a ration card', async () => {
      await contract.readRationCard(ctx, '1000000000').should.eventually.deep.equal({
        nodalOfficerId: '10',
        rationRetailerId: '100',
        district: 'Thrissur',
        taluk: 'Thrissur',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        familyHead: 'Regha',
        familyHeadNumber: '1000000000000000',
        doesFamilyHeadAvailable: true,
        houseNumber: '234',
        totalFamilyIncome: 25000,
        totalFamilyMembers: 2,
        mobileNumber: '9497625356',
        rationCardType: 'Non-priority with State subsidy',
        rationCardColour: 'Blue',
        isHomeElectrified: true,
        dataType: 'Ration Card'
      });
    });

    it('should throw an error for a ration card that does not exist', async () => {
      await contract.readRationCard(ctx, '1000000003')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

  describe('#deleteRationCard', () => {

    it('should delete a ration card', async () => {
      await contract.deleteRationCard(ctx, '1000000001');
      ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1000000001');
    });

    it('should throw an error for a ration card that does not exist', async () => {
      await contract.deleteRationCard(ctx, '1000000003')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

  describe('#shiftHouseInSameWard', () => {

    it('should change the house number and electrification status of the ration card', async () => {
      let retailer = {
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 2,
        whiteCardConsumers: 0,
        electrifiedHomes: 1,
        nonElectrifiedHomes: 1,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }
      let rationCard = {
        nodalOfficerId: '10',
        rationRetailerId: '100',
        district: 'Thrissur',
        taluk: 'Thrissur',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        familyHead: 'Regha',
        familyHeadNumber: '1000000000000000',
        doesFamilyHeadAvailable: true,
        houseNumber: '456',
        totalFamilyIncome: 25000,
        totalFamilyMembers: 2,
        mobileNumber: '9497625356',
        rationCardType: 'Non-priority with State subsidy',
        rationCardColour: 'Blue',
        isHomeElectrified: false,
        dataType: 'Ration Card'
      }

      await contract.shiftHouseInSameWard(ctx, '1000000000', '456', false);
      ctx.stub.putState.should.have.been.calledWithExactly(
        '100', Buffer.from(JSON.stringify(retailer))
      ).and.calledWithExactly(
        '1000000000', Buffer.from(JSON.stringify(rationCard))
      );
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.shiftHouseInSameWard(ctx, '1000000003', '100')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

  describe('#shiftHouseInSameLSGBody', () => {

    it('should change the house number,electrification status, ward number, and ration retailer ID of the ration card', async () => {
      let retailer1 = {
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 0,
        whiteCardConsumers: 0,
        electrifiedHomes: 1,
        nonElectrifiedHomes: 0,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }
      let retailer2 = {
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '5',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 2,
        whiteCardConsumers: 0,
        electrifiedHomes: 0,
        nonElectrifiedHomes: 1,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }
      let rationCard = {
        nodalOfficerId: '10',
        rationRetailerId: '101',
        district: 'Thrissur',
        taluk: 'Thrissur',
        LSGBody: 'Arimpur',
        wardNumber: '5',
        familyHead: 'Regha',
        familyHeadNumber: '1000000000000000',
        doesFamilyHeadAvailable: true,
        houseNumber: '456',
        totalFamilyIncome: 25000,
        totalFamilyMembers: 2,
        mobileNumber: '9497625356',
        rationCardType: 'Non-priority with State subsidy',
        rationCardColour: 'Blue',
        isHomeElectrified: false,
        dataType: 'Ration Card'
      }

      await contract.shiftHouseInSameLSGBody(ctx, '1000000000', '456', '101', false);
      ctx.stub.putState.should.have.been.calledWithExactly(
        '100', Buffer.from(JSON.stringify(retailer1))
      ).and.calledWithExactly(
        '101', Buffer.from(JSON.stringify(retailer2))
      ).and.calledWithExactly(
        '1000000000', Buffer.from(JSON.stringify(rationCard))
      );
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.shiftHouseInSameLSGBody(ctx, '1000000003', '100', '101')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

    it('should throw an error for a ration retailer does not exists', async () => {
      await contract.shiftHouseInSameLSGBody(ctx, '1000000000', '100', '105')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#shiftHouseInSameTaluk', () => {

    it('should change the house number,electrification status, ward number, LSG body, and ration retailer ID of the ration card', async () => {
      let retailer1 = {
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 0,
        whiteCardConsumers: 0,
        electrifiedHomes: 1,
        nonElectrifiedHomes: 0,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }
      let retailer2 = {
        nodalOfficerId: '10',
        LSGBody: 'Manalur',
        wardNumber: '5',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 2,
        whiteCardConsumers: 0,
        electrifiedHomes: 0,
        nonElectrifiedHomes: 1,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }
      let rationCard = {
        nodalOfficerId: '10',
        rationRetailerId: '102',
        district: 'Thrissur',
        taluk: 'Thrissur',
        LSGBody: 'Manalur',
        wardNumber: '5',
        familyHead: 'Regha',
        familyHeadNumber: '1000000000000000',
        doesFamilyHeadAvailable: true,
        houseNumber: '456',
        totalFamilyIncome: 25000,
        totalFamilyMembers: 2,
        mobileNumber: '9497625356',
        rationCardType: 'Non-priority with State subsidy',
        rationCardColour: 'Blue',
        isHomeElectrified: false,
        dataType: 'Ration Card'
      }

      await contract.shiftHouseInSameTaluk(ctx, '1000000000', '456', '102', false);
      ctx.stub.putState.should.have.been.calledWithExactly(
        '100', Buffer.from(JSON.stringify(retailer1))
      ).and.calledWithExactly(
        '102', Buffer.from(JSON.stringify(retailer2))
      ).and.calledWithExactly(
        '1000000000', Buffer.from(JSON.stringify(rationCard))
      );
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.shiftHouseInSameTaluk(ctx, '1000000003', '100', '101')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

    it('should throw an error for a ration retailer does not exists', async () => {
      await contract.shiftHouseInSameTaluk(ctx, '1000000000', '100', '105')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#shiftHouseToAnotherTaluk', () => {

    it('should change the house number,electrification status, ward number, LSG body, taluk, district, nodal officer id and ration retailer ID of the ration card', async () => {
      let retailer1 = {
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 0,
        whiteCardConsumers: 0,
        electrifiedHomes: 1,
        nonElectrifiedHomes: 0,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }
      let retailer2 = {
        nodalOfficerId: '11',
        LSGBody: 'Thrithallur',
        wardNumber: '7',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 2,
        whiteCardConsumers: 0,
        electrifiedHomes: 1,
        nonElectrifiedHomes: 1,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }
      let rationCard = {
        nodalOfficerId: '11',
        rationRetailerId: '103',
        district: 'Thrissur',
        taluk: 'Chavakkad',
        LSGBody: 'Thrithallur',
        wardNumber: '7',
        familyHead: 'Regha',
        familyHeadNumber: '1000000000000000',
        doesFamilyHeadAvailable: true,
        houseNumber: '456',
        totalFamilyIncome: 25000,
        totalFamilyMembers: 2,
        mobileNumber: '9497625356',
        rationCardType: 'Non-priority with State subsidy',
        rationCardColour: 'Blue',
        isHomeElectrified: false,
        dataType: 'Ration Card'
      }

      await contract.shiftHouseToAnotherTaluk(ctx, '1000000000', '456', '103', false);
      ctx.stub.putState.should.have.been.calledWithExactly(
        '100', Buffer.from(JSON.stringify(retailer1))
      ).and.calledWithExactly(
        '103', Buffer.from(JSON.stringify(retailer2))
      ).and.calledWithExactly(
        '1000000000', Buffer.from(JSON.stringify(rationCard))
      );
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.shiftHouseToAnotherTaluk(ctx, '1000000003', '100', '101')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

    it('should throw an error for a ration retailer does not exists', async () => {
      await contract.shiftHouseToAnotherTaluk(ctx, '1000000000', '100', '105')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#changeMobileNumber', () => {

    it('should change the mobile number of the ration card', async () => {
      let rationCard = {
        nodalOfficerId: '10',
        rationRetailerId: '100',
        district: 'Thrissur',
        taluk: 'Thrissur',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        familyHead: 'Regha',
        familyHeadNumber: '1000000000000000',
        doesFamilyHeadAvailable: true,
        houseNumber: '234',
        totalFamilyIncome: 25000,
        totalFamilyMembers: 2,
        mobileNumber: '9876543210',
        rationCardType: 'Non-priority with State subsidy',
        rationCardColour: 'Blue',
        isHomeElectrified: true,
        dataType: 'Ration Card'
      }

      await contract.changeMobileNumber(ctx, '1000000000', '9876543210');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '1000000000', Buffer.from(JSON.stringify(rationCard)));
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.changeMobileNumber(ctx, '1000000003', '9876543210')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

  describe('#changeHomeElectrificationStatus', () => {

    it('should change the income and type of the ration card', async () => {
      let retailer = {
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 2,
        whiteCardConsumers: 0,
        electrifiedHomes: 1,
        nonElectrifiedHomes: 1,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      }
      let rationCard = {
        nodalOfficerId: '10',
        rationRetailerId: '100',
        district: 'Thrissur',
        taluk: 'Thrissur',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        familyHead: 'Regha',
        familyHeadNumber: '1000000000000000',
        doesFamilyHeadAvailable: true,
        houseNumber: '234',
        totalFamilyIncome: 25000,
        totalFamilyMembers: 2,
        mobileNumber: '9497625356',
        rationCardType: 'Non-priority with State subsidy',
        rationCardColour: 'Blue',
        isHomeElectrified: false,
        dataType: 'Ration Card'
      }

      await contract.changeHomeElectrificationStatus(ctx, '1000000000');
      ctx.stub.putState.should.have.been.calledWithExactly(
        '100', Buffer.from(JSON.stringify(retailer))
      ).and.calledWithExactly(
        '1000000000', Buffer.from(JSON.stringify(rationCard))
      );
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.changeHomeElectrificationStatus(ctx, '1000000003')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

  describe('#consumerExist', () => {

    it('should return true for a consumer', async () => {
      await contract.consumerExist(ctx, '1000000000000000').should.eventually.be.true;
    });

    it('should return false for a consumer that does not exist', async () => {
      await contract.consumerExist(ctx, '1000000000000003').should.eventually.be.false;
    });

  });

  describe('#addConsumer', () => {

    it('should add one family member', async () => {
      let retailer = {
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 0,
        blueCardConsumers: 3,
        whiteCardConsumers: 0,
        electrifiedHomes: 2,
        nonElectrifiedHomes: 0,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      };
      let rationCard = {
        nodalOfficerId: '10',
        rationRetailerId: '100',
        district: 'Thrissur',
        taluk: 'Thrissur',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        familyHead: 'Regha',
        familyHeadNumber: '1000000000000000',
        doesFamilyHeadAvailable: true,
        houseNumber: '234',
        totalFamilyIncome: 25000,
        totalFamilyMembers: 3,
        mobileNumber: '9497625356',
        rationCardType: 'Non-priority with State subsidy',
        rationCardColour: 'Blue',
        isHomeElectrified: true,
        dataType: 'Ration Card'
      };
      let consumer = {
        consumerNumber: '1000000000000002',
        rationCardNumber: '1000000000',
        nodalOfficerId: '10',
        rationRetailerId: '100',
        name: 'Mikhil',
        age: '28',
        sex: 'Male',
        occupation: 'Unemployed',
        individualIncome: 0,
        isFamilyHead: false,
        dataType: 'Consumer Account'
      }

      await contract.addConsumer(ctx, '1000000000000002', '1000000000', 'Mikhil', '28', 'Male', 'Unemployed', 0, false);

      ctx.stub.putState.should.have.been.calledWithExactly(
        '100', Buffer.from(JSON.stringify(retailer))
      ).and.calledWithExactly(
        '1000000000', Buffer.from(JSON.stringify(rationCard))
      ).and.calledWithExactly(
        '1000000000000002', Buffer.from(JSON.stringify(consumer))
      );
    });

    it('should throw an error for a consumer that already exists', async () => {
      await contract.addConsumer(ctx, '1000000000000000', '1000000000', 'Mikhil', '28', 'Unemployed', 0, false)
        .should.be.rejectedWith(/The Consumer 1000000000000000 already exist/);
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.addConsumer(ctx, '10000000000000000', '1000000003', 'Mikhil', '28', 'Unemployed', 0, false)
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

  describe('#readConsumer', () => {

    it('should return a consumer', async () => {
      await contract.readConsumer(ctx, '1000000000000000').should.eventually.deep.equal({
        consumerNumber: '1000000000000000',
        rationCardNumber: '1000000000',
        nodalOfficerId: '10',
        rationRetailerId: '100',
        name: 'Regha',
        age: '52',
        sex: 'Female',
        occupation: 'Clerk',
        individualIncome: 12500,
        isFamilyHead: true,
        dataType: 'Consumer Account'
      });
    });

    it('should throw an error for a consumer that does not exists', async () => {
      await contract.readConsumer(ctx, '1000000000000002')
        .should.be.rejectedWith(/The Consumer 1000000000000002 does not exist/);
    });

  });

  describe('#deleteConsumer', () => {
    let retailer =

      it('should delete a family member', async () => {
        let retailer = {
          nodalOfficerId: '10',
          LSGBody: 'Arimpur',
          wardNumber: '4',
          yellowCardConsumers: 0,
          pinkCardConsumers: 1,
          blueCardConsumers: 0,
          whiteCardConsumers: 0,
          electrifiedHomes: 2,
          nonElectrifiedHomes: 0,
          yellowCardFamilies: 0,
          dataType: 'Ration Retailer'
        };
        let rationCard = {
          nodalOfficerId: '10',
          rationRetailerId: '100',
          district: 'Thrissur',
          taluk: 'Thrissur',
          LSGBody: 'Arimpur',
          wardNumber: '4',
          familyHead: 'Regha',
          familyHeadNumber: '1000000000000000',
          doesFamilyHeadAvailable: true,
          houseNumber: '234',
          totalFamilyIncome: 12500,
          totalFamilyMembers: 1,
          mobileNumber: '9497625356',
          rationCardType: 'Priority House Holds',
          rationCardColour: 'Pink',
          isHomeElectrified: true,
          dataType: 'Ration Card'
        }

        await contract.deleteConsumer(ctx, '1000000000000001');
        ctx.stub.putState.should.have.been.calledWithExactly(
          '100', Buffer.from(JSON.stringify(retailer))
        ).and.calledWithExactly(
          '1000000000', Buffer.from(JSON.stringify(rationCard))
        );
        ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1000000000000001');
      });

    it('should throw an error for a ration card that does not exist', async () => {
      await contract.deleteConsumer(ctx, '1000000000000002')
        .should.be.rejectedWith(/The Consumer 1000000000000002 does not exist/);
    });

  });

  describe('#updateConsumerPersonalDetails', () => {
    let rationCard =

      it('should change the name, age and sex of the consumer', async () => {
        let rationCard = {
          nodalOfficerId: '10',
          rationRetailerId: '100',
          district: 'Thrissur',
          taluk: 'Thrissur',
          LSGBody: 'Arimpur',
          wardNumber: '4',
          familyHead: 'Rekha',
          familyHeadNumber: '1000000000000000',
          doesFamilyHeadAvailable: true,
          houseNumber: '234',
          totalFamilyIncome: 25000,
          totalFamilyMembers: 2,
          mobileNumber: '9497625356',
          rationCardType: 'Non-priority with State subsidy',
          rationCardColour: 'Blue',
          isHomeElectrified: true,
          dataType: 'Ration Card'
        };
        let consumer = {
          consumerNumber: '1000000000000000',
          rationCardNumber: '1000000000',
          nodalOfficerId: '10',
          rationRetailerId: '100',
          name: 'Rekha',
          age: '54',
          sex: 'Female',
          occupation: 'Clerk',
          individualIncome: 12500,
          isFamilyHead: true,
          dataType: 'Consumer Account'
        };
        await contract.updateConsumerPersonalDetails(ctx, '1000000000000000', 'Rekha', '54', 'Female');
        ctx.stub.putState.should.have.been.calledWithExactly(
          '1000000000', Buffer.from(JSON.stringify(rationCard))
        ).and.calledWithExactly(
          '1000000000000000', Buffer.from(JSON.stringify(consumer))
        );
      });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.updateConsumerPersonalDetails(ctx, '1000000000000003', 'Mikhil', '28')
        .should.be.rejectedWith(/The Consumer 1000000000000003 does not exist/);
    });

  });

  describe('#updateConsumerProfessionalDetails', () => {

    it('should update the proffessional details of a consumer', async () => {
      let retailer = {
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 2,
        blueCardConsumers: 0,
        whiteCardConsumers: 0,
        electrifiedHomes: 2,
        nonElectrifiedHomes: 0,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      };
      let rationCard = {
        nodalOfficerId: '10',
        rationRetailerId: '100',
        district: 'Thrissur',
        taluk: 'Thrissur',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        familyHead: 'Regha',
        familyHeadNumber: '1000000000000000',
        doesFamilyHeadAvailable: true,
        houseNumber: '234',
        totalFamilyIncome: 22500,
        totalFamilyMembers: 2,
        mobileNumber: '9497625356',
        rationCardType: 'Priority House Holds',
        rationCardColour: 'Pink',
        isHomeElectrified: true,
        dataType: 'Ration Card'
      };
      let consumer = {
        consumerNumber: '1000000000000000',
        rationCardNumber: '1000000000',
        nodalOfficerId: '10',
        rationRetailerId: '100',
        name: 'Regha',
        age: '52',
        sex: 'Female',
        occupation: 'Clerk',
        individualIncome: 10000,
        isFamilyHead: true,
        dataType: 'Consumer Account'
      }

      await contract.updateConsumerProfessionalDetails(ctx, '1000000000000000', 'Clerk', 10000);

      ctx.stub.putState.should.have.been.calledWithExactly(
        '100', Buffer.from(JSON.stringify(retailer))
      ).and.calledWithExactly(
        '1000000000', Buffer.from(JSON.stringify(rationCard))
      ).and.calledWithExactly(
        '1000000000000000', Buffer.from(JSON.stringify(consumer))
      );
    });

    it('should throw an error for a consumer that does not exists', async () => {
      await contract.updateConsumerProfessionalDetails(ctx, '1000000000000003', 'Clerk', 10000)
        .should.be.rejectedWith(/The Consumer 1000000000000003 does not exist/);
    });

  });

  describe('#shiftConsumerToAnotherFamily', () => {

    it('should shift one consumer to another family', async () => {

      await contract.shiftConsumerToAnotherFamily(ctx, '1000000000000000', '1000000002');
      let retailer1 = {
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        yellowCardConsumers: 0,
        pinkCardConsumers: 1,
        blueCardConsumers: 0,
        whiteCardConsumers: 0,
        electrifiedHomes: 2,
        nonElectrifiedHomes: 0,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      };
      let retailer2 = {
        nodalOfficerId: '11',
        LSGBody: 'Thrithallur',
        wardNumber: '7',
        yellowCardConsumers: 0,
        pinkCardConsumers: 1,
        blueCardConsumers: 0,
        whiteCardConsumers: 0,
        electrifiedHomes: 1,
        nonElectrifiedHomes: 0,
        yellowCardFamilies: 0,
        dataType: 'Ration Retailer'
      };
      let rationCard1 = {
        nodalOfficerId: '10',
        rationRetailerId: '100',
        district: 'Thrissur',
        taluk: 'Thrissur',
        LSGBody: 'Arimpur',
        wardNumber: '4',
        familyHead: null,
        familyHeadNumber: null,
        doesFamilyHeadAvailable: false,
        houseNumber: '234',
        totalFamilyIncome: 12500,
        totalFamilyMembers: 1,
        mobileNumber: '9497625356',
        rationCardType: 'Priority House Holds',
        rationCardColour: 'Pink',
        isHomeElectrified: true,
        dataType: 'Ration Card'
      };
      let rationCard2 = {
        nodalOfficerId: '11',
        rationRetailerId: '103',
        district: 'Thrissur',
        taluk: 'Chavakkad',
        LSGBody: 'Thrithallur',
        wardNumber: '7',
        familyHead: 'Regha',
        familyHeadNumber: '1000000000000000',
        doesFamilyHeadAvailable: true,
        houseNumber: '236',
        totalFamilyIncome: 12500,
        totalFamilyMembers: 1,
        mobileNumber: '9897625345',
        rationCardType: 'Priority House Holds',
        rationCardColour: 'Pink',
        isHomeElectrified: true,
        dataType: 'Ration Card'
      };
      let consumer = {
        consumerNumber: '1000000000000000',
        rationCardNumber: '1000000002',
        nodalOfficerId: '11',
        rationRetailerId: '103',
        name: 'Regha',
        age: '52',
        sex: 'Female',
        occupation: 'Clerk',
        individualIncome: 12500,
        isFamilyHead: true,
        dataType: 'Consumer Account'
      }

      ctx.stub.putState.should.have.been.calledWithExactly(
        '100', Buffer.from(JSON.stringify(retailer1))
      ).and.calledWithExactly(
        '103', Buffer.from(JSON.stringify(retailer2))
      ).and.calledWithExactly(
        '1000000000', Buffer.from(JSON.stringify(rationCard1))
      ).and.calledWithExactly(
        '1000000002', Buffer.from(JSON.stringify(rationCard2))
      ).and.calledWithExactly(
        '1000000000000000', Buffer.from(JSON.stringify(consumer))
      );
    });

    it('should throw an error for a consumer that does not exists', async () => {
      await contract.shiftConsumerToAnotherFamily(ctx, '1000000000000003', '1000000001')
        .should.be.rejectedWith(/The Consumer 1000000000000003 does not exist/);
    });

  });

  describe('#retailerPurchaseExist', () => {

    it('should return true for a retailer purchase', async () => {
      await contract.retailerPurchaseExist(ctx, '10000000000000000000').should.eventually.be.true;
    });

    it('should return false for a retailer purchase that does not exist', async () => {
      await contract.retailerPurchaseExist(ctx, '10000000000000000003').should.eventually.be.false;
    });

  });

  describe('#makeRetailerFoodItemsPurchase', () => {

    it('should make a retailer purchase', async () => {
      let retailerPurchase = {
        retailerPurchaseNumber: '10000000000000000003',
        nodalOfficerId: '10',
        rationRetailerId: '100',
        rationCardColour: 'Blue',
        itemName: 'Fortified Atta',
        basicUnit: 'Kg',
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 2,
        pricePerQuantity: 17,
        totalQuantity: 4,
        presentQuantity: 4,
        purchaseDate: Date(Date.now()),
        dataType: 'Retailer Food Items Purchase'
      }

      await contract.makeRetailerFoodItemsPurchase(ctx, '10000000000000000003', '100', 'Blue', 'Fortified Atta');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '10000000000000000003', Buffer.from(JSON.stringify(retailerPurchase))
      );
    });

    it('should throw an error for a retailer purchase that already exists', async () => {
      await contract.makeRetailerFoodItemsPurchase(ctx, '10000000000000000000', '100', 'Blue', 'Fortified Atta')
        .should.be.rejectedWith(/The Retailer Purchase 10000000000000000000 already exist/);
    });

    it('should throw an error for a ration retailer does not exists', async () => {
      await contract.makeRetailerFoodItemsPurchase(ctx, '10000000000000000003', '105', 'Blue', 'Fortified Atta')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#makeRetailerKerosinePurchase', () => {

    it('should make a retailer kerosine purchase', async () => {
      let retailerPurchase = {
        retailerPurchaseNumber: '10000000000000000003',
        nodalOfficerId: '11',
        rationRetailerId: '103',
        itemName: 'Kerosine',
        basicUnit: 'Litre',
        isDistributedIndividually: false,
        nonElectrifiedHomesQuantity: 4,
        electrifiedHomesQuantity: 0.5,
        nonElectrifiedHomesPricePerQuantity: 18,
        electrifiedHomesPricePerQuantity: 17,
        totalQuantity: 0.5,
        presentQuantity: 0.5,
        purchaseDate: Date(Date.now()),
        dataType: 'Retailer Kerosine Purchase'
      }

      await contract.makeRetailerKerosinePurchase(ctx, '10000000000000000003', '103');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '10000000000000000003', Buffer.from(JSON.stringify(retailerPurchase))
      );
    });

    it('should throw an error for a retailer kerosine purchase that already exists', async () => {
      await contract.makeRetailerKerosinePurchase(ctx, '10000000000000000001', '103')
        .should.be.rejectedWith(/The Retailer Purchase 10000000000000000001 already exist/);
    });

    it('should throw an error for a ration retailer does not exists', async () => {
      await contract.makeRetailerKerosinePurchase(ctx, '10000000000000000003', '105')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#readRetailerPurchase', () => {

    it('should return a retailer purchase', async () => {
      await contract.readRetailerPurchase(ctx, '10000000000000000000').should.eventually.deep.equal({
        retailerPurchaseNumber: '10000000000000000000',
        nodalOfficerId: '10',
        rationRetailerId: '100',
        rationCardColour: 'Blue',
        itemName: 'Rice',
        basicUnit: 'Kg',
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 2,
        pricePerQuantity: 4,
        totalQuantity: 4,
        presentQuantity: 4,
        purchaseDate: Date(Date.now()),
        dataType: 'Retailer Food Items Purchase'
      });
    });

    it('should throw an error for a retailer purchase that does not exist', async () => {
      await contract.readRetailerPurchase(ctx, '10000000000000000003')
        .should.be.rejectedWith(/The Retailer Purchase 10000000000000000003 does not exist/);
    });

  });

  describe('#deleteRetailerPurchase', () => {

    it('should delete a retailer purchase', async () => {
      await contract.deleteRetailerPurchase(ctx, '10000000000000000000');
      ctx.stub.deleteState.should.have.been.calledOnceWithExactly('10000000000000000000');
    });

    it('should throw an error for a retailer purchase that does not exist', async () => {
      await contract.deleteRetailerPurchase(ctx, '10000000000000000003')
        .should.be.rejectedWith(/The Retailer Purchase 10000000000000000003 does not exist/);
    });

  });

  describe('#consumerPurchaseExist', () => {

    it('should return true for a customer purchase', async () => {
      await contract.consumerPurchaseExist(ctx, '1000000000000000000000000').should.eventually.be.true;
    });

    it('should return false for a customer purchase that does not exist', async () => {
      await contract.consumerPurchaseExist(ctx, '1000000000000000000000001').should.eventually.be.false;
    });

  });

  describe('#makeConsumerPurchase', () => {

    it('should make a consumer purchase of rice', async () => {
      let consumerPurchase = {
        consumerPurchaseNumber: '1000000000000000000000001',
        retailerPurchaseNumber: '10000000000000000000',
        nodalOfficerId: '10',
        rationRetailerId: '100',
        itemName: 'Rice',
        quantity: 4,
        pricePerQuantity: 4,
        price: 16,
        purchaseDate: Date(Date.now()),
        dataType: 'Consumer Purchase'
      }

      await contract.makeConsumerPurchase(ctx, '1000000000000000000000001', '10000000000000000000', '1000000000');
      ctx.stub.deleteState.should.have.been.calledOnceWithExactly('10000000000000000000');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '1000000000000000000000001', Buffer.from(JSON.stringify(consumerPurchase))
      );
    });

    it('should make a consumer purchase of kerosine', async () => {
      let retailerPurchase = {
        retailerPurchaseNumber: '10000000000000000001',
        nodalOfficerId: '10',
        rationRetailerId: '100',
        itemName: 'Kerosine',
        basicUnit: 'Litre',
        isDistributedIndividually: false,
        nonElectrifiedHomesQuantity: 4,
        electrifiedHomesQuantity: 0.5,
        nonElectrifiedHomesPricePerQuantity: 18,
        electrifiedHomesPricePerQuantity: 17,
        totalQuantity: 1,
        presentQuantity: 0.5,
        purchaseDate: Date(Date.now()),
        dataType: 'Retailer Kerosine Purchase'
      }
      let consumerPurchase = {
        consumerPurchaseNumber: '1000000000000000000000001',
        retailerPurchaseNumber: '10000000000000000001',
        nodalOfficerId: '10',
        rationRetailerId: '100',
        itemName: 'Kerosine',
        quantity: 0.5,
        pricePerQuantity: 17,
        price: 8.5,
        purchaseDate: Date(Date.now()),
        dataType: 'Consumer Purchase'
      }

      await contract.makeConsumerPurchase(ctx, '1000000000000000000000001', '10000000000000000001', '1000000000');
      ctx.stub.putState.should.have.been.calledWithExactly(
        '10000000000000000001', Buffer.from(JSON.stringify(retailerPurchase))
      ).and.calledWithExactly(
        '1000000000000000000000001', Buffer.from(JSON.stringify(consumerPurchase))
      );
    });

    it('should throw an error for a consumer purchase that already exists', async () => {
      await contract.makeConsumerPurchase(ctx, '1000000000000000000000000', '10000000000000000003', '1000000000')
        .should.be.rejectedWith(/The Consumer Purchase 1000000000000000000000000 already exist/);
    });

    it('should throw an error for a retailer purchase that does not exists', async () => {
      await contract.makeConsumerPurchase(ctx, '1000000000000000000000001', '10000000000000000003', '1000000000')
        .should.be.rejectedWith(/The Retailer Purchase 10000000000000000003 does not exist/);
    });

    it('should throw an error for a ration card does not exists', async () => {
      await contract.makeConsumerPurchase(ctx, '1000000000000000000000001', '10000000000000000000', '1000000003')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

});