/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class CivilSuppliesNetworkContract extends Contract {

  // nodalOfficerExists
  // @param: nodalOfficerId
  async nodalOfficerExists(ctx, nodalOfficerId) {
    const buffer = await ctx.stub.getState(nodalOfficerId);
    return (!!buffer && buffer.length > 0);
  }

  // createNodalOfficer
  // properties: nodalOfficerId, district, taluk
  // @params: nodalOfficerId, district, taluk
  async createNodalOfficer(ctx, nodalOfficerId, district, taluk) {
    const exists = await this.nodalOfficerExists(ctx, nodalOfficerId);
    if (exists) {
      throw new Error(`The Nodal Officer ${nodalOfficerId} already exist`);
    }

    const asset = {
      district,
      taluk,
      dataType: 'Nodal Officer'
    };

    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(nodalOfficerId, buffer);
  }

  // readNodalOfficer
  // @param: nodalOfficerId
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
  // @param: nodalOfficerId
  async deleteNodalOfficer(ctx, nodalOfficerId) {
    const exists = await this.nodalOfficerExists(ctx, nodalOfficerId);
    if (!exists) {
      throw new Error(`The Nodal Officer ${nodalOfficerId} does not exist`);
    }

    await ctx.stub.deleteState(nodalOfficerId);
  }

  // rationRetailerExists
  // @param: rationRetailerId
  async rationRetailerExists(ctx, rationRetailerId) {
    const buffer = await ctx.stub.getState(rationRetailerId);
    return (!!buffer && buffer.length > 0);
  }

  // createRationRetailer
  // properties: nodalOfficerId, LSGBody, wardNo
  // @params: rationRetailerId, nodalOfficerId, LSGBody, wardNo
  async createRationRetailer(
    ctx,
    rationRetailerId,
    nodalOfficerId,
    LSGBody,
    wardNo
  ) {
    const exists = await this.rationRetailerExists(ctx, rationRetailerId);
    if (exists) {
      throw new Error(`The Ration Retailer ${rationRetailerId} already exist`);
    }

    const officerExists = await this.nodalOfficerExists(ctx, nodalOfficerId);
    if (!officerExists) {
      throw new Error(`The Nodal Officer ${nodalOfficerId} does not exist`);
    }

    const asset = {
      nodalOfficerId,
      LSGBody,
      wardNo,
      dataType: 'Ration Retailer'
    };

    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(rationRetailerId, buffer);
  }

  // readRationRetailer
  // @param: rationRetailerId
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
  // @params: rationRetailerId, newNodalOfficerId, newLSGBody, newWardNo
  async updateRationRetailer(
    ctx,
    rationRetailerId,
    newNodalOfficerId,
    newLSGBody,
    newWardNo
  ) {
    const exists = await this.rationRetailerExists(ctx, rationRetailerId);
    if (!exists) {
      throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
    }

    const officerExists = await this.nodalOfficerExists(ctx, newNodalOfficerId);
    if (!officerExists) {
      throw new Error(`The Nodal Officer ${newNodalOfficerId} does not exist`);
    }

    const asset = {
      nodalOfficerId: newNodalOfficerId,
      LSGBody: newLSGBody,
      wardNo: newWardNo,
      dataType: 'Ration Retailer'
    };

    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(rationRetailerId, buffer);
  }

  // deleteRationRetailer
  // @param: rationRetailerId
  async deleteRationRetailer(ctx, rationRetailerId) {
    const exists = await this.rationRetailerExists(ctx, rationRetailerId);
    if (!exists) {
      throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
    }

    await ctx.stub.deleteState(rationRetailerId);
  }

  // rationCardExist
  // @param: rationCardNumber
  // async rationCardExist(ctx, rationCardNumber) {
  //   const buffer = await ctx.stub.getState(rationCardNumber);
  //   return (!!buffer && buffer.length > 0);
  // }

  // createRationCard
  // properties: nodalOfficerId, rationRetailerId, familyHead, houseNumber,
  //             familyMembers, income, mobileNumber
  // @params: rationCardNumber, nodalOfficerId, rationRetailerId, familyHead, houseNumber,
  //             familyMembers, income, mobileNumber
  // async createRationCard(
  //   ctx,
  //   rationCardNumber,
  //   nodalOfficerId,
  //   rationRetailerId,
  //   familyHead,
  //   houseNumber,
  //   familyMembers,
  //   income,
  //   mobileNumber
  // ) {

  // }

}

module.exports = CivilSuppliesNetworkContract;
