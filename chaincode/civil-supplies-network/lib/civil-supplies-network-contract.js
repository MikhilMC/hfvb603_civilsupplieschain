/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class CivilSuppliesNetworkContract extends Contract {

    makeCharacterArray(base) {
        return Array.from(Array(base)).map((e, i) => i.toString(base));
    }

    makeRandomStringId(array, len) {
        let id = '';
        for(let i = 0; i < len; i++) {
            id += array[Math.floor(Math.random() * array.length)];
        }
        return id;
    }

    // ------------------------START Commisioner-------------------------
    
    // nodalOfficerExists
    // @params: nodalOfficerId
    async nodalOfficerExists(ctx, nodalOfficerId) {
        const buffer = await ctx.stub.getState(nodalOfficerId);
        return (!!buffer && buffer.length > 0);
    }

    // createNodalOfficer
    // properties: district, taluk
    async createNodalOfficer(ctx, district, taluk) {
        let nodalOfficerId;
        while (true) {
            nodalOfficerId = this.makeRandomStringId(this.makeCharacterArray(10), 3);
            const exists = await this.nodalOfficerExists(ctx, nodalOfficerId);
            if (!exists) {
                break;
            }
        }
        const asset = {
            district,
            taluk,
            dataType: 'Nodal Officer'
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(nodalOfficerId, buffer);
        return nodalOfficerId;
    }

    // readNodalOfficer
    // @params: nodalOfficerId
    async readNodalOfficer(ctx, nodalOfficerId) {
        const exists = await this.nodalOfficerExists(ctx, nodalOfficerId);
        if (!exists) {
            throw new Error(`The Nodal Officer ${nodalOfficerId} does not exist`);
        }
        const buffer = await ctx.stub.getState(nodalOfficerId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    // updateNodalOfficer
    // @params: nodalOfficerId, district, taluk
    async updateNodalOfficer(ctx, nodalOfficerId, newDistrict, newTaluk) {
        const exists = await this.nodalOfficerExists(ctx, nodalOfficerId);
        if (!exists) {
            throw new Error(`The Nodal Officer ${nodalOfficerId} does not exist`);
        }
        const asset = {
            district: newDistrict,
            taluk: newTaluk,
            dataType: 'Nodal Officer'
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(nodalOfficerId, buffer);
    }

    // deleteNodalOfficer
    // @params: nodalOfficerId
    async deleteNodalOfficer(ctx, nodalOfficerId) {
        const exists = await this.nodalOfficerExists(ctx, nodalOfficerId);
        if (!exists) {
            throw new Error(`The Nodal Officer ${nodalOfficerId} does not exist`);
        }
        await ctx.stub.deleteState(nodalOfficerId);
    }

    // rationRetailerExists
    // @params: rationRetailerId
    async rationRetailerExists(ctx, rationRetailerId) {
        const buffer = await ctx.stub.getState(rationRetailerId);
        return (!!buffer && buffer.length > 0);
    }

    // createRationRetailer
    // properties: district, taluk, LSGBody, wardNo
    // @params: district, taluk, LSGBody, wardNo
    async createRationRetailer(ctx, district, taluk, LSGBody, wardNo) {
        let rationRetailerId;
        while (true) {
            rationRetailerId = this.makeRandomStringId(this.makeCharacterArray(10), 5);
            const exists = await this.rationRetailerExists(ctx, rationRetailerId);
            if (!exists) {
                break;
            }
        }
        const asset = {
            district,
            taluk,
            LSGBody,
            wardNo,
            dataType: 'Ration Retailer'
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(rationRetailerId, buffer);
        return rationRetailerId;
    }

    // readRationRetailer
    // @params: rationRetailerId
    async readRationRetailer(ctx, rationRetailerId) {
        const exists = await this.rationRetailerExists(ctx, rationRetailerId);
        if (!exists) {
            throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
        }
        const buffer = await ctx.stub.getState(rationRetailerId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    // updateRationRetailer
    // @params: rationRetailerId, newDistrict, newTaluk, newLSGBody, newWardNo
    async updateRationRetailer(ctx, rationRetailerId, newDistrict, newTaluk, newLSGBody, newWardNo) {
        const exists = await this.rationRetailerExists(ctx, rationRetailerId);
        if (!exists) {
            throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
        }
        const asset = {
            district: newDistrict,
            taluk: newTaluk,
            LSGBody: newLSGBody,
            wardNo: newWardNo,
            dataType: 'Ration Retailer'
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(rationRetailerId, buffer);
    }

    // deleteRationRetailer
    // @params: rationRetailerId
    async deleteRationRetailer(ctx, rationRetailerId) {
        const exists = await this.rationRetailerExists(ctx, rationRetailerId);
        if (!exists) {
            throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
        }
        await ctx.stub.deleteState(rationRetailerId);
    }

    // async civilSuppliesNetworkExists(ctx, civilSuppliesNetworkId) {
    //     const buffer = await ctx.stub.getState(civilSuppliesNetworkId);
    //     return (!!buffer && buffer.length > 0);
    // }

    // async createCivilSuppliesNetwork(ctx, civilSuppliesNetworkId, value) {
    //     const exists = await this.civilSuppliesNetworkExists(ctx, civilSuppliesNetworkId);
    //     if (exists) {
    //         throw new Error(`The civil supplies network ${civilSuppliesNetworkId} already exists`);
    //     }
    //     const asset = { value };
    //     const buffer = Buffer.from(JSON.stringify(asset));
    //     await ctx.stub.putState(civilSuppliesNetworkId, buffer);
    // }

    // async readCivilSuppliesNetwork(ctx, civilSuppliesNetworkId) {
    //     const exists = await this.civilSuppliesNetworkExists(ctx, civilSuppliesNetworkId);
    //     if (!exists) {
    //         throw new Error(`The civil supplies network ${civilSuppliesNetworkId} does not exist`);
    //     }
    //     const buffer = await ctx.stub.getState(civilSuppliesNetworkId);
    //     const asset = JSON.parse(buffer.toString());
    //     return asset;
    // }

    // async updateCivilSuppliesNetwork(ctx, civilSuppliesNetworkId, newValue) {
    //     const exists = await this.civilSuppliesNetworkExists(ctx, civilSuppliesNetworkId);
    //     if (!exists) {
    //         throw new Error(`The civil supplies network ${civilSuppliesNetworkId} does not exist`);
    //     }
    //     const asset = { value: newValue };
    //     const buffer = Buffer.from(JSON.stringify(asset));
    //     await ctx.stub.putState(civilSuppliesNetworkId, buffer);
    // }

    // async deleteCivilSuppliesNetwork(ctx, civilSuppliesNetworkId) {
    //     const exists = await this.civilSuppliesNetworkExists(ctx, civilSuppliesNetworkId);
    //     if (!exists) {
    //         throw new Error(`The civil supplies network ${civilSuppliesNetworkId} does not exist`);
    //     }
    //     await ctx.stub.deleteState(civilSuppliesNetworkId);
    // }

}

module.exports = CivilSuppliesNetworkContract;
