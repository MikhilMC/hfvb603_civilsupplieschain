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
      wardNO: '4',
      dataType: 'Ration Retailer'
    };
    let rationRetailer2 = {
      nodalOfficerId: '10',
      LSGBody: 'Arimpur',
      wardNO: '5',
      dataType: 'Ration Retailer'
    }

    ctx.stub.getState.withArgs('10').resolves(Buffer.from(JSON.stringify(nodalOfficer1)));
    ctx.stub.getState.withArgs('11').resolves(Buffer.from(JSON.stringify(nodalOfficer2)));
    ctx.stub.getState.withArgs('100').resolves(Buffer.from(JSON.stringify(rationRetailer1)));
    ctx.stub.getState.withArgs('101').resolves(Buffer.from(JSON.stringify(rationRetailer2)));
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
      await contract.rationRetailerExists(ctx, '103').should.eventually.be.false;
    });

  });

  describe('#createRationRetailer', () => {

    it('should create a ration retailer', async () => {
      // "102", "11", "Vatanappally", "4"
      let retailer = {
        nodalOfficerId: '11',
        LSGBody: 'Vatanappally',
        wardNo: '4',
        dataType: 'Ration Retailer'
      }

      await contract.createRationRetailer(ctx, '102', '11', 'Vatanappally', '4');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '102', Buffer.from(JSON.stringify(retailer))
      );
    });

    it('should throw an error for a ration retailer that already exists', async () => {
      await contract.createRationRetailer(ctx, '100', '10', 'Thrissur', '3')
        .should.be.rejectedWith(/The Ration Retailer 100 already exist/);
    });

    it('should throw an error for a nodal officer that does not exist', async () => {
      await contract.createRationRetailer(ctx, '103', '13', 'Thrissur', '3')
      .should.be.rejectedWith(/The Nodal Officer 13 does not exist/);
    });

  });

  describe('#readRationRetailer', () => {

    it('should return a ration retailer', async () => {
      await contract.readRationRetailer(ctx, '100').should.eventually.deep.equal({
        nodalOfficerId: '10',
        LSGBody: 'Arimpur',
        wardNO: '4',
        dataType: 'Ration Retailer'
      });
    });

    it('should throw an error for a ration retailer that does not exist', async () => {
      await contract.readRationRetailer(ctx, '103')
        .should.be.rejectedWith(/The Ration Retailer 103 does not exist/);
    });

  });

  describe('#updateRationRetailer', () => {

    it('should update a nodal officer', async () => {
      let officer = {
        nodalOfficerId: '11',
        LSGBody: 'Chavakkad',
        wardNo: '22',
        dataType: 'Ration Retailer'
      }

      await contract.updateRationRetailer(ctx, '101', '11', 'Chavakkad', '22');
      ctx.stub.putState.should.have.been.calledOnceWithExactly(
        '101', Buffer.from(JSON.stringify(officer))
      );
    });

    it('should throw an error for a ration retailer that does not exist', async () => {
      await contract.updateRationRetailer(ctx, '103', '11', 'Thrissur', '22')
      .should.be.rejectedWith(/The Ration Retailer 103 does not exist/);
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
      await contract.deleteRationRetailer(ctx, '103')
        .should.be.rejectedWith(/The Ration Retailer 103 does not exist/);
    });

  });

});