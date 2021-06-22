/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
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
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
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
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"civil supplies network 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"civil supplies network 1002 value"}'));
    });

    describe('#civilSuppliesNetworkExists', () => {

        it('should return true for a civil supplies network', async () => {
            await contract.civilSuppliesNetworkExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a civil supplies network that does not exist', async () => {
            await contract.civilSuppliesNetworkExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createCivilSuppliesNetwork', () => {

        it('should create a civil supplies network', async () => {
            await contract.createCivilSuppliesNetwork(ctx, '1003', 'civil supplies network 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"civil supplies network 1003 value"}'));
        });

        it('should throw an error for a civil supplies network that already exists', async () => {
            await contract.createCivilSuppliesNetwork(ctx, '1001', 'myvalue').should.be.rejectedWith(/The civil supplies network 1001 already exists/);
        });

    });

    describe('#readCivilSuppliesNetwork', () => {

        it('should return a civil supplies network', async () => {
            await contract.readCivilSuppliesNetwork(ctx, '1001').should.eventually.deep.equal({ value: 'civil supplies network 1001 value' });
        });

        it('should throw an error for a civil supplies network that does not exist', async () => {
            await contract.readCivilSuppliesNetwork(ctx, '1003').should.be.rejectedWith(/The civil supplies network 1003 does not exist/);
        });

    });

    describe('#updateCivilSuppliesNetwork', () => {

        it('should update a civil supplies network', async () => {
            await contract.updateCivilSuppliesNetwork(ctx, '1001', 'civil supplies network 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"civil supplies network 1001 new value"}'));
        });

        it('should throw an error for a civil supplies network that does not exist', async () => {
            await contract.updateCivilSuppliesNetwork(ctx, '1003', 'civil supplies network 1003 new value').should.be.rejectedWith(/The civil supplies network 1003 does not exist/);
        });

    });

    describe('#deleteCivilSuppliesNetwork', () => {

        it('should delete a civil supplies network', async () => {
            await contract.deleteCivilSuppliesNetwork(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a civil supplies network that does not exist', async () => {
            await contract.deleteCivilSuppliesNetwork(ctx, '1003').should.be.rejectedWith(/The civil supplies network 1003 does not exist/);
        });

    });

});