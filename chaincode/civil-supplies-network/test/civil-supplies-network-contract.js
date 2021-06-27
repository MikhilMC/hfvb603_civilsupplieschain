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
      dataType: 'Ration Retailer'
    };

    let rationRetailer2 = {
      nodalOfficerId: '10',
      LSGBody: 'Arimpur',
      wardNumber: '5',
      dataType: 'Ration Retailer'
    };

    let rationRetailer3 = {
      nodalOfficerId: '10',
      LSGBody: 'Manalur',
      wardNumber: '5',
      dataType: 'Ration Retailer'
    };

    let rationRetailer4 = {
      nodalOfficerId: '11',
      LSGBody: 'Thrithallur',
      wardNumber: '7',
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
      houseNumber: '234',
      income: 25000,
      mobileNumber: '9497625356',
      rationCardType: 'Non-priority with State subsidy',
      dataType: 'Ration Card'
    };

    let rationCard2 = {
      nodalOfficerId: '10',
      rationRetailerId: '100',
      district: 'Thrissur',
      taluk: 'Thrissur',
      LSGBody: 'Arimpur',
      wardNumber: '4',
      familyHead: 'Indira',
      houseNumber: '235',
      income: 64000,
      mobileNumber: '9897625356',
      rationCardType: 'Non-priority and non-subsidy',
      dataType: 'Ration Card'
    }

    let consumer1 = {
      consumerNumber: '1000000000000000',
      rationCardNumber: '1000000000',
      nodalOfficerId: '10',
      rationRetailerId: '100',
      name: 'Regha',
      age: '52',
      occupation: 'Clerk',
      dataType: 'Consumer Account'
    }

    let consumer2 = {
      consumerNumber: '1000000000000001',
      rationCardNumber: '1000000000',
      nodalOfficerId: '10',
      rationRetailerId: '100',
      name: 'Mohanan',
      age: '56',
      occupation: 'Farmer',
      dataType: 'Consumer Account'
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
    
    ctx.stub.getState.withArgs('1000000000000000')
      .resolves(Buffer.from(JSON.stringify(consumer1)));
    ctx.stub.getState.withArgs('1000000000000001')
      .resolves(Buffer.from(JSON.stringify(consumer2)));
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
        .should.be.rejectedWith(/The Nodal Officer 10 already exist/);
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
        .should.be.rejectedWith(/The Nodal Officer 13 does not exist/);
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
        '11', Buffer.from(JSON.stringify(officer))
      );
    });

    it('should throw an error for a nodal officer that does not exist', async () => {
      await contract.updateNodalOfficer(ctx, '13', 'Thrissur', 'Chalakkudy')
        .should.be.rejectedWith(/The Nodal Officer 13 does not exist/);
    });

  });

  describe('#deleteNodalOfficer', () => {

    it('should delete a nodal officer', async () => {
      await contract.deleteNodalOfficer(ctx, '11');
      ctx.stub.deleteState.should.have.been.calledOnceWithExactly('11');
    });

    it('should throw an error for a nodal officer that does not exist', async () => {
      await contract.deleteNodalOfficer(ctx, '13')
        .should.be.rejectedWith(/The Nodal Officer 13 does not exist/);
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
        dataType: 'Ration Retailer'
      }

      await contract.createRationRetailer(ctx, '104', '11', 'Vatanappally', '4');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '104', Buffer.from(JSON.stringify(retailer))
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
        dataType: 'Ration Retailer'
      });
    });

    it('should throw an error for a ration retailer that does not exist', async () => {
      await contract.readRationRetailer(ctx, '105')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#updateRationRetailer', () => {

    it('should update a nodal officer', async () => {
      let officer = {
        nodalOfficerId: '11',
        LSGBody: 'Chavakkad',
        wardNumber: '22',
        dataType: 'Ration Retailer'
      }

      await contract.updateRationRetailer(ctx, '101', '11', 'Chavakkad', '22');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '101', Buffer.from(JSON.stringify(officer))
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
      // "102", "11", "Vatanappally", "4"

      await contract.createRationCard(ctx,'1000000002','100','Sini','233','15000','9896625356');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '1000000002', Buffer.from('{"nodalOfficerId":"10","rationRetailerId":"100","district":"Thrissur","taluk":"Thrissur","LSGBody":"Arimpur","wardNumber":"4","familyHead":"Sini","houseNumber":"233","income":"15000","mobileNumber":"9896625356","rationCardType":"Priority House Holds","dataType":"Ration Card"}'));
    });

    it('should throw an error for a ration card that already exists', async () => {
      await contract.createRationCard(ctx, '1000000000','100','Sini','233','15000','9896625356')
        .should.be.rejectedWith(/The Ration Card 1000000000 already exist/);
    });

    it('should throw an error for a ration retailer does not exists', async () => {
      await contract.createRationCard(ctx, '1000000002','105','Sini','233','15000','9896625356')
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
        houseNumber: '234',
        income: 25000,
        mobileNumber: '9497625356',
        rationCardType: 'Non-priority with State subsidy',
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

    it('should change the house number of the ration card', async () => {

      await contract.shiftHouseInSameWard(ctx,'1000000000','456');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '1000000000', Buffer.from('{"nodalOfficerId":"10","rationRetailerId":"100","district":"Thrissur","taluk":"Thrissur","LSGBody":"Arimpur","wardNumber":"4","familyHead":"Regha","houseNumber":"456","income":25000,"mobileNumber":"9497625356","rationCardType":"Non-priority with State subsidy","dataType":"Ration Card"}'));
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.shiftHouseInSameWard(ctx, '1000000003','100')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

  describe('#shiftHouseInSameLSGBody', () => {

    it('should change the house number, ward number, and ration retailer ID of the ration card', async () => {

      await contract.shiftHouseInSameLSGBody(ctx,'1000000000','456', '101');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '1000000000', Buffer.from('{"nodalOfficerId":"10","rationRetailerId":"101","district":"Thrissur","taluk":"Thrissur","LSGBody":"Arimpur","wardNumber":"5","familyHead":"Regha","houseNumber":"456","income":25000,"mobileNumber":"9497625356","rationCardType":"Non-priority with State subsidy","dataType":"Ration Card"}'));
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.shiftHouseInSameLSGBody(ctx, '1000000003','100', '101')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

    it('should throw an error for a ration retailer does not exists', async () => {
      await contract.shiftHouseInSameLSGBody(ctx, '1000000000','100', '105')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#shiftHouseInSameTaluk', () => {

    it('should change the house number, ward number, LSG body, and ration retailer ID of the ration card', async () => {

      await contract.shiftHouseInSameTaluk(ctx,'1000000000','456', '102');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '1000000000', Buffer.from('{"nodalOfficerId":"10","rationRetailerId":"102","district":"Thrissur","taluk":"Thrissur","LSGBody":"Manalur","wardNumber":"5","familyHead":"Regha","houseNumber":"456","income":25000,"mobileNumber":"9497625356","rationCardType":"Non-priority with State subsidy","dataType":"Ration Card"}'));
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.shiftHouseInSameTaluk(ctx, '1000000003','100', '101')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

    it('should throw an error for a ration retailer does not exists', async () => {
      await contract.shiftHouseInSameTaluk(ctx, '1000000000','100', '105')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#shiftHouseToAnotherTaluk', () => {

    it('should change the house number, ward number, LSG body, taluk, district, nodal officer id and ration retailer ID of the ration card', async () => {

      await contract.shiftHouseToAnotherTaluk(ctx,'1000000000','456', '103');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '1000000000', Buffer.from('{"nodalOfficerId":"11","rationRetailerId":"103","district":"Thrissur","taluk":"Chavakkad","LSGBody":"Thrithallur","wardNumber":"7","familyHead":"Regha","houseNumber":"456","income":25000,"mobileNumber":"9497625356","rationCardType":"Non-priority with State subsidy","dataType":"Ration Card"}'));
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.shiftHouseToAnotherTaluk(ctx, '1000000003','100', '101')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

    it('should throw an error for a ration retailer does not exists', async () => {
      await contract.shiftHouseToAnotherTaluk(ctx, '1000000000','100', '105')
        .should.be.rejectedWith(/The Ration Retailer 105 does not exist/);
    });

  });

  describe('#changeMobileNumber', () => {

    it('should change the mobile number of the ration card', async () => {

      await contract.changeMobileNumber(ctx,'1000000000','9876543210');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '1000000000', Buffer.from('{"nodalOfficerId":"10","rationRetailerId":"100","district":"Thrissur","taluk":"Thrissur","LSGBody":"Arimpur","wardNumber":"4","familyHead":"Regha","houseNumber":"234","income":25000,"mobileNumber":"9876543210","rationCardType":"Non-priority with State subsidy","dataType":"Ration Card"}'));
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.changeMobileNumber(ctx, '1000000003','9876543210')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

  describe('#changeIncome', () => {

    it('should change the income and type of the ration card', async () => {

      await contract.changeIncome(ctx,'1000000000','20000');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '1000000000', Buffer.from('{"nodalOfficerId":"10","rationRetailerId":"100","district":"Thrissur","taluk":"Thrissur","LSGBody":"Arimpur","wardNumber":"4","familyHead":"Regha","houseNumber":"234","income":"20000","mobileNumber":"9497625356","rationCardType":"Priority House Holds","dataType":"Ration Card"}'));
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.changeIncome(ctx, '1000000003','9876543210')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

  describe('#addFamilyMember', () => {

    it('should add one family member', async () => {

      await contract.addFamilyMember(ctx,'1000000000000002','1000000000','Mikhil','28','Unemployed');
      
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '1000000000000002', Buffer.from('{"consumerNumber":"1000000000000002","rationCardNumber":"1000000000","nodalOfficerId":"10","rationRetailerId":"100","name":"Mikhil","age":"28","occupation":"Unemployed","dataType":"Consumer Account"}'));
    });

    it('should throw an error for a customer that already exists', async () => {
      await contract.addFamilyMember(ctx,'1000000000000000','1000000000','Mikhil','28','Unemployed')
        .should.be.rejectedWith(/The Consumer 1000000000000000 already exist/);
    });

    it('should throw an error for a ration card that does not exists', async () => {
      await contract.addFamilyMember(ctx,'10000000000000000','1000000003','Regha','52','Clerk')
        .should.be.rejectedWith(/The Ration Card 1000000003 does not exist/);
    });

  });

  describe('#readFamilyMember', () => {

    it('should return a ration card', async () => {
      await contract.readFamilyMember(ctx, '1000000000000000').should.eventually.deep.equal({
        consumerNumber: '1000000000000000',
        rationCardNumber: '1000000000',
        nodalOfficerId: '10',
        rationRetailerId: '100',
        name: 'Regha',
        age: '52',
        occupation: 'Clerk',
        dataType: 'Consumer Account'
      });
    });

    it('should throw an error for a customer that does not exists', async () => {
      await contract.readFamilyMember(ctx,'1000000000000002')
        .should.be.rejectedWith(/The Consumer 1000000000000002 does not exist/);
    });

  });

  describe('#deleteFamilyMember', () => {

    it('should delete a family member', async () => {
      await contract.deleteFamilyMember(ctx, '1000000000000001');
      ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1000000000000001');
    });

    it('should throw an error for a ration card that does not exist', async () => {
      await contract.deleteFamilyMember(ctx, '1000000000000002')
        .should.be.rejectedWith(/The Consumer 1000000000000002 does not exist/);
    });

  });

});