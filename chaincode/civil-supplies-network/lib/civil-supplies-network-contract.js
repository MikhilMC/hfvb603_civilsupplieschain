/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class CivilSuppliesNetworkContract extends Contract {

  // determineRationCardType
  // @param: income
  determineRationCardType(income) {
    if (income < 10000) {
      return 'Antyodaya Anna Yojana';
    } else if (income >= 10000 && income < 25000) {
      return 'Priority House Holds';
    } else if (income >= 25000 && income < 50000) {
      return 'Non-priority with State subsidy';
    } else if (income > 50000) {
      return 'Non-priority and non-subsidy';
    }
  }

  // makeCharacterArray(len) {
  //   return Array.from(Array(len)).map((e, i) => i.toString(len));
  // }

  // makeRandomId(arr, len) {
  //   let id = '';
  //   for (let i = 0; i < len; i++) {
  //     id += arr[i];
  //   }
  //   return id;
  // }

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
  // properties: nodalOfficerId, LSGBody, wardNumber
  // @params: rationRetailerId, nodalOfficerId, LSGBody, wardNumber
  async createRationRetailer(
    ctx,
    rationRetailerId,
    nodalOfficerId,
    LSGBody,
    wardNumber
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
      wardNumber,
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
  // @params: rationRetailerId, newNodalOfficerId, newLSGBody, newwardNumber
  async updateRationRetailer(
    ctx,
    rationRetailerId,
    newNodalOfficerId,
    newLSGBody,
    newWardNumber
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
      wardNumber: newWardNumber,
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
  async rationCardExist(ctx, rationCardNumber) {
    const buffer = await ctx.stub.getState(rationCardNumber);
    return (!!buffer && buffer.length > 0);
  }

  // createRationCard
  // properties: nodalOfficerId, rationRetailerId, familyHead, houseNumber,
  //             familyMembers, income, mobileNumber
  // @params: rationCardNumber, nodalOfficerId, rationRetailerId, familyHead, houseNumber,
  //             familyMembers, income, mobileNumber
  async createRationCard(
    ctx,
    rationCardNumber,
    rationRetailerId,
    familyHead,
    houseNumber,
    income,
    mobileNumber
  ) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (exists) {
      throw new Error(`The Ration Card ${rationCardNumber} already exist`);
    }

    const retailerExists = await this.rationRetailerExists(ctx, rationRetailerId);
    if (!retailerExists) {
      throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
    }
    
    const retailerDetails = await this.readRationRetailer(ctx, rationRetailerId);
    const officerDetails = await this.readNodalOfficer(ctx, retailerDetails['nodalOfficerId']);

    const rationCard = {
      nodalOfficerId: retailerDetails['nodalOfficerId'],
      rationRetailerId,
      district: officerDetails['district'],
      taluk: officerDetails['taluk'],
      LSGBody: retailerDetails['LSGBody'],
      wardNumber: retailerDetails['wardNumber'],
      familyHead,
      houseNumber,
      income,
      mobileNumber,
      rationCardType: this.determineRationCardType(income),
      dataType: 'Ration Card'
    };

    const buffer = Buffer.from(JSON.stringify(rationCard));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // readRationCard
  // @param: rationCardNumber
  async readRationCard(ctx, rationCardNumber) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const buffer = await ctx.stub.getState(rationCardNumber);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  // deleteRationCard
  // @param: rationCardNumber
  async deleteRationCard(ctx, rationCardNumber) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    await ctx.stub.deleteState(rationCardNumber);
  }

  // shiftHouseInSameWard
  // @params: rationCardNumber, newHouseNumber
  async shiftHouseInSameWard(ctx, rationCardNumber, newHouseNumber) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);

    rationCardDetails['houseNumber'] = newHouseNumber;

    const buffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // shiftHouseInSameLSGBody
  // @params: rationCardNumber, newHouseNumber, newRationRetailerId
  async shiftHouseInSameLSGBody(
    ctx,
    rationCardNumber,
    newHouseNumber,
    newRationRetailerId
  ) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const retailerExists = await this.rationRetailerExists(ctx, newRationRetailerId);
    if (!retailerExists) {
      throw new Error(`The Ration Retailer ${newRationRetailerId} does not exist`);
    }

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);
    const retailerDetails = await this.readRationRetailer(ctx, newRationRetailerId);

    rationCardDetails['houseNumber'] = newHouseNumber;
    rationCardDetails['wardNumber'] = retailerDetails['wardNumber'];
    rationCardDetails['rationRetailerId'] = newRationRetailerId;

    const buffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // shiftHouseInSameTaluk
  // @params: rationCardNumber, newHouseNumber, newRationRetailerId
  async shiftHouseInSameTaluk(
    ctx,
    rationCardNumber,
    newHouseNumber,
    newRationRetailerId
  ) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const retailerExists = await this.rationRetailerExists(ctx, newRationRetailerId);
    if (!retailerExists) {
      throw new Error(`The Ration Retailer ${newRationRetailerId} does not exist`);
    }

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);
    const retailerDetails = await this.readRationRetailer(ctx, newRationRetailerId);

    rationCardDetails['houseNumber'] = newHouseNumber;
    rationCardDetails['wardNumber'] = retailerDetails['wardNumber'];
    rationCardDetails['LSGBody'] = retailerDetails['LSGBody'];
    rationCardDetails['rationRetailerId'] = newRationRetailerId;

    const buffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // shiftHouseToAnotherTaluk
  // @params: rationCardNumber, newHouseNumber, newRationRetailerId
  async shiftHouseToAnotherTaluk(
    ctx,
    rationCardNumber,
    newHouseNumber,
    newRationRetailerId
  ) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const retailerExists = await this.rationRetailerExists(ctx, newRationRetailerId);
    if (!retailerExists) {
      throw new Error(`The Ration Retailer ${newRationRetailerId} does not exist`);
    }

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);
    const retailerDetails = await this.readRationRetailer(ctx, newRationRetailerId);
    const officerDetails = await this.readNodalOfficer(ctx, retailerDetails['nodalOfficerId']);

    rationCardDetails['houseNumber'] = newHouseNumber;
    rationCardDetails['district'] = officerDetails['district'];
    rationCardDetails['taluk'] = officerDetails['taluk'];
    rationCardDetails['wardNumber'] = retailerDetails['wardNumber'];
    rationCardDetails['LSGBody'] = retailerDetails['LSGBody'];
    rationCardDetails['nodalOfficerId'] = retailerDetails['nodalOfficerId'];
    rationCardDetails['rationRetailerId'] = newRationRetailerId;

    const buffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // changeMobileNumber
  // @params: rationCardNumber, newMobileNumber
  async changeMobileNumber(ctx, rationCardNumber, newMobileNumber) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);

    rationCardDetails['mobileNumber'] = newMobileNumber;

    const buffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // changeIncome
  // @params: rationCardNumber, newIncome
  async changeIncome(ctx, rationCardNumber, newIncome) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);

    rationCardDetails['income'] = newIncome;
    rationCardDetails['rationCardType'] = this.determineRationCardType(newIncome);

    const buffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // consumerExist
  // @param: consumerNumber
  async consumerExist(ctx, consumerNumber) {
    const buffer = await ctx.stub.getState(consumerNumber);
    return (!!buffer && buffer.length > 0);
  }

  // addFamilyMember
  // @params: rationCardNumber, familyMember
  async addFamilyMember(
    ctx,
    consumerNumber,
    rationCardNumber,
    name,
    age,
    occupation
  ) {
    const exists = await this.consumerExist(ctx, consumerNumber);
    if (exists) {
      throw new Error(`The Consumer ${consumerNumber} already exist`);
    }

    const cardExists = await this.rationCardExist(ctx, rationCardNumber);
    if (!cardExists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);

    let consumer = {
      consumerNumber,
      rationCardNumber,
      nodalOfficerId: rationCardDetails['nodalOfficerId'],
      rationRetailerId: rationCardDetails['rationRetailerId'],
      name,
      age,
      occupation,
      dataType: 'Consumer Account'
    }

    const consumberBuffer = Buffer.from(JSON.stringify(consumer));
    await ctx.stub.putState(consumerNumber, consumberBuffer);
  }

  // readFamilyMember
  // @param: consumerNumber
  async readFamilyMember(ctx, consumerNumber) {
    const exists = await this.consumerExist(ctx, consumerNumber);
    if (!exists) {
      throw new Error(`The Consumer ${consumerNumber} does not exist`);
    }

    const buffer = await ctx.stub.getState(consumerNumber);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  // deleteFamilyMember
  // @param: consumerNumber
  async deleteFamilyMember(ctx, consumerNumber) {
    const exists = await this.consumerExist(ctx, consumerNumber);
    if (!exists) {
      throw new Error(`The Consumer ${consumerNumber} does not exist`);
    }

    await ctx.stub.deleteState(consumerNumber);
  }

}

module.exports = CivilSuppliesNetworkContract;
