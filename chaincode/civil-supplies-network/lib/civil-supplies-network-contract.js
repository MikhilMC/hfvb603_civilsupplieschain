/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class CivilSuppliesNetworkContract extends Contract {

  // determineRationCardType
  // @param: income
  determineRationCardType(income, members) {
    if (income === 0 && members === 0) {
      return { type: null, colour: null };
    }
    if (members > 0) {
      if (income < 10000) {
        return { type: 'Antyodaya Anna Yojana', colour: 'Yellow' };
      } else if (income >= 10000 && income < 25000) {
        return { type: 'Priority House Holds', colour: 'Pink' };
      } else if (income >= 25000 && income < 50000) {
        return { type: 'Non-priority with State subsidy', colour: 'Blue' };
      } else if (income > 50000) {
        return { type: 'Non-priority and non-subsidy', colour: 'White' };
      }
    }
  }

  willTypeChangeOccure(currentIncome, newIncome, currentMembers, newMembers) {

    const type1 = this.determineRationCardType(currentIncome, currentMembers);
    const type2 = this.determineRationCardType(newIncome, newMembers);
    if (type1['type'] === type2['type'] && type1['colour'] === type2['colour']) {
      return { changeOccure: false };
    } else {
      return {
        changeOccure: true,
        type: type2['type'],
        colour: type2['colour'],
        oldColour: type1['colour']
      };
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
      yellowCardConsumers: 0,
      pinkCardConsumers: 0,
      blueCardConsumers: 0,
      whiteCardConsumers: 0,
      electrifiedHomes: 0,
      nonElectrifiedHomes: 0,
      yellowCardFamilies: 0,
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

    const retailerDetails = await this.readRationRetailer(ctx, rationRetailerId);
    retailerDetails['nodalOfficerId'] = newNodalOfficerId;
    retailerDetails['LSGBody'] = newLSGBody;
    retailerDetails['wardNumber'] = newWardNumber;

    const buffer = Buffer.from(JSON.stringify(retailerDetails));
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
    houseNumber,
    isHomeElectrified,
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

    const cardType = this.determineRationCardType(0, 0);

    if (isHomeElectrified) {
      retailerDetails['electrifiedHomes']++;
    } else {
      retailerDetails['nonElectrifiedHomes']++;
    }

    const rationCard = {
      nodalOfficerId: retailerDetails['nodalOfficerId'],
      rationRetailerId,
      district: officerDetails['district'],
      taluk: officerDetails['taluk'],
      LSGBody: retailerDetails['LSGBody'],
      wardNumber: retailerDetails['wardNumber'],
      familyHead: null,
      familyHeadNumber: null,
      doesFamilyHeadAvailable: false,
      houseNumber,
      totalFamilyIncome: 0,
      totalFamilyMembers: 0,
      mobileNumber,
      rationCardType: cardType['type'],
      rationCardColour: cardType['colour'],
      isHomeElectrified,
      dataType: 'Ration Card'
    };

    const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
    await ctx.stub.putState(rationRetailerId, retailerBuffer);

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

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);
    const retailerDetails = await this.readRationRetailer(ctx, rationCardDetails['rationRetailerId']);

    switch (rationCardDetails['rationCardColour']) {
      case 'Yellow':
        retailerDetails['yellowCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        retailerDetails['yellowCardFamilies']--;
        break;
      case 'Pink':
        retailerDetails['pinkCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        break;
      case 'Blue':
        retailerDetails['blueCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        break;
      case 'White':
        retailerDetails['whiteCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        break;
      default:
        break;
    }

    if (rationCardDetails['isHomeElectrified']) {
      retailerDetails['electrifiedHomes']--;
    } else {
      retailerDetails['nonElectrifiedHomes']--;
    }

    const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
    await ctx.stub.putState(rationCardDetails['rationRetailerId'], retailerBuffer);

    await ctx.stub.deleteState(rationCardNumber);
  }

  // shiftHouseInSameWard
  // @params: rationCardNumber, newHouseNumber, isNewHomeElectrified
  async shiftHouseInSameWard(ctx, rationCardNumber, newHouseNumber, isNewHomeElectrified) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);
    const retailerDetails = await this.readRationRetailer(ctx, rationCardDetails['rationRetailerId']);

    if (rationCardDetails['isHomeElectrified'] && !isNewHomeElectrified) {
      retailerDetails['electrifiedHomes']--;
      retailerDetails['nonElectrifiedHomes']++;
    } else if (!rationCardDetails['isHomeElectrified'] && isNewHomeElectrified) {
      retailerDetails['electrifiedHomes']++;
      retailerDetails['nonElectrifiedHomes']--;
    }

    rationCardDetails['houseNumber'] = newHouseNumber;
    rationCardDetails['isHomeElectrified'] = isNewHomeElectrified;

    const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
    await ctx.stub.putState(rationCardDetails['rationRetailerId'], retailerBuffer);

    const buffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // shiftHouseInSameLSGBody
  // @params: rationCardNumber, newHouseNumber, newRationRetailerId, isNewHomeElectrified
  async shiftHouseInSameLSGBody(
    ctx,
    rationCardNumber,
    newHouseNumber,
    newRationRetailerId,
    isNewHomeElectrified
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
    const currentRetailerId = rationCardDetails['rationRetailerId'];
    const currentRetailerDetails = await this.readRationRetailer(ctx, currentRetailerId);
    const newRetailerDetails = await this.readRationRetailer(ctx, newRationRetailerId);

    switch (rationCardDetails['rationCardColour']) {
      case 'Yellow':
        currentRetailerDetails['yellowCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        currentRetailerDetails['yellowCardFamilies']--;
        newRetailerDetails['yellowCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['yellowCardFamilies']++;
        break;
      case 'Pink':
        currentRetailerDetails['pinkCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['pinkCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        break;
      case 'Blue':
        currentRetailerDetails['blueCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['blueCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        break;
      case 'White':
        currentRetailerDetails['whiteCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['whiteCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        break;
      default:
        break;
    }

    if (rationCardDetails['isHomeElectrified'] && !isNewHomeElectrified) {
      currentRetailerDetails['electrifiedHomes']--;
      newRetailerDetails['nonElectrifiedHomes']++;
    } else if (!rationCardDetails['isHomeElectrified'] && isNewHomeElectrified) {
      newRetailerDetails['electrifiedHomes']++;
      currentRetailerDetails['nonElectrifiedHomes']--;
    } else if (!rationCardDetails['isHomeElectrified'] && !isNewHomeElectrified) {
      newRetailerDetails['nonElectrifiedHomes']++;
      currentRetailerDetails['nonElectrifiedHomes']--;
    } else if (rationCardDetails['isHomeElectrified'] && isNewHomeElectrified) {
      newRetailerDetails['electrifiedHomes']++;
      currentRetailerDetails['electrifiedHomes']--;
    }

    rationCardDetails['houseNumber'] = newHouseNumber;
    rationCardDetails['wardNumber'] = newRetailerDetails['wardNumber'];
    rationCardDetails['rationRetailerId'] = newRationRetailerId;
    rationCardDetails['isHomeElectrified'] = isNewHomeElectrified;

    const currentRetailerBuffer = Buffer.from(JSON.stringify(currentRetailerDetails));
    await ctx.stub.putState(currentRetailerId, currentRetailerBuffer);

    const newRetailerBuffer = Buffer.from(JSON.stringify(newRetailerDetails));
    await ctx.stub.putState(newRationRetailerId, newRetailerBuffer);

    const buffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // shiftHouseInSameTaluk
  // @params: rationCardNumber, newHouseNumber, newRationRetailerId, isNewHomeElectrified
  async shiftHouseInSameTaluk(
    ctx,
    rationCardNumber,
    newHouseNumber,
    newRationRetailerId,
    isNewHomeElectrified
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
    const currentRetailerId = rationCardDetails['rationRetailerId'];
    const currentRetailerDetails = await this.readRationRetailer(ctx, currentRetailerId)
    const newRetailerDetails = await this.readRationRetailer(ctx, newRationRetailerId);

    switch (rationCardDetails['rationCardColour']) {
      case 'Yellow':
        currentRetailerDetails['yellowCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        currentRetailerDetails['yellowCardFamilies']--;
        newRetailerDetails['yellowCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['yellowCardFamilies']++;
        break;
      case 'Pink':
        currentRetailerDetails['pinkCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['pinkCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        break;
      case 'Blue':
        currentRetailerDetails['blueCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['blueCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        break;
      case 'White':
        currentRetailerDetails['whiteCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['whiteCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        break;
      default:
        break;
    }

    if (rationCardDetails['isHomeElectrified'] && !isNewHomeElectrified) {
      currentRetailerDetails['electrifiedHomes']--;
      newRetailerDetails['nonElectrifiedHomes']++;
    } else if (!rationCardDetails['isHomeElectrified'] && isNewHomeElectrified) {
      newRetailerDetails['electrifiedHomes']++;
      currentRetailerDetails['nonElectrifiedHomes']--;
    } else if (!rationCardDetails['isHomeElectrified'] && !isNewHomeElectrified) {
      newRetailerDetails['nonElectrifiedHomes']++;
      currentRetailerDetails['nonElectrifiedHomes']--;
    } else if (rationCardDetails['isHomeElectrified'] && isNewHomeElectrified) {
      newRetailerDetails['electrifiedHomes']++;
      currentRetailerDetails['electrifiedHomes']--;
    }

    rationCardDetails['houseNumber'] = newHouseNumber;
    rationCardDetails['wardNumber'] = newRetailerDetails['wardNumber'];
    rationCardDetails['LSGBody'] = newRetailerDetails['LSGBody'];
    rationCardDetails['rationRetailerId'] = newRationRetailerId;
    rationCardDetails['isHomeElectrified'] = isNewHomeElectrified;

    const currentRetailerBuffer = Buffer.from(JSON.stringify(currentRetailerDetails));
    await ctx.stub.putState(currentRetailerId, currentRetailerBuffer);

    const newRetailerBuffer = Buffer.from(JSON.stringify(newRetailerDetails));
    await ctx.stub.putState(newRationRetailerId, newRetailerBuffer);

    const buffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // shiftHouseToAnotherTaluk
  // @params: rationCardNumber, newHouseNumber, newRationRetailerId, isNewHomeElectrified
  async shiftHouseToAnotherTaluk(
    ctx,
    rationCardNumber,
    newHouseNumber,
    newRationRetailerId,
    isNewHomeElectrified
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
    const currentRetailerId = rationCardDetails['rationRetailerId'];
    const currentRetailerDetails = await this.readRationRetailer(ctx, currentRetailerId)
    const newRetailerDetails = await this.readRationRetailer(ctx, newRationRetailerId);
    const officerDetails = await this.readNodalOfficer(ctx, newRetailerDetails['nodalOfficerId']);

    switch (rationCardDetails['rationCardColour']) {
      case 'Yellow':
        currentRetailerDetails['yellowCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        currentRetailerDetails['yellowCardFamilies']--;
        newRetailerDetails['yellowCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['yellowCardFamilies']++;
        break;
      case 'Pink':
        currentRetailerDetails['pinkCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['pinkCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        break;
      case 'Blue':
        currentRetailerDetails['blueCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['blueCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        break;
      case 'White':
        currentRetailerDetails['whiteCardConsumers'] -= rationCardDetails['totalFamilyMembers'];
        newRetailerDetails['whiteCardConsumers'] += rationCardDetails['totalFamilyMembers'];
        break;
      default:
        break;
    }

    if (rationCardDetails['isHomeElectrified'] && !isNewHomeElectrified) {
      currentRetailerDetails['electrifiedHomes']--;
      newRetailerDetails['nonElectrifiedHomes']++;
    } else if (!rationCardDetails['isHomeElectrified'] && isNewHomeElectrified) {
      newRetailerDetails['electrifiedHomes']++;
      currentRetailerDetails['nonElectrifiedHomes']--;
    } else if (!rationCardDetails['isHomeElectrified'] && !isNewHomeElectrified) {
      newRetailerDetails['nonElectrifiedHomes']++;
      currentRetailerDetails['nonElectrifiedHomes']--;
    } else if (rationCardDetails['isHomeElectrified'] && isNewHomeElectrified) {
      newRetailerDetails['electrifiedHomes']++;
      currentRetailerDetails['electrifiedHomes']--;
    }

    rationCardDetails['houseNumber'] = newHouseNumber;
    rationCardDetails['district'] = officerDetails['district'];
    rationCardDetails['taluk'] = officerDetails['taluk'];
    rationCardDetails['wardNumber'] = newRetailerDetails['wardNumber'];
    rationCardDetails['LSGBody'] = newRetailerDetails['LSGBody'];
    rationCardDetails['nodalOfficerId'] = newRetailerDetails['nodalOfficerId'];
    rationCardDetails['rationRetailerId'] = newRationRetailerId;
    rationCardDetails['isHomeElectrified'] = isNewHomeElectrified;

    const currentRetailerBuffer = Buffer.from(JSON.stringify(currentRetailerDetails));
    await ctx.stub.putState(currentRetailerId, currentRetailerBuffer);

    const newRetailerBuffer = Buffer.from(JSON.stringify(newRetailerDetails));
    await ctx.stub.putState(newRationRetailerId, newRetailerBuffer);


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

  // changeHomeElectrificationStatus
  // @params: rationCardNumber
  async changeHomeElectrificationStatus(ctx, rationCardNumber) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);
    const retailerDetails = await this.readRationRetailer(ctx, rationCardDetails['rationRetailerId'])

    if (rationCardDetails['isHomeElectrified']) {
      rationCardDetails['isHomeElectrified'] = false;
      retailerDetails['nonElectrifiedHomes']++;
      retailerDetails['electrifiedHomes']--;
    } else {
      rationCardDetails['isHomeElectrified'] = true;
      retailerDetails['nonElectrifiedHomes']--;
      retailerDetails['electrifiedHomes']++;
    }

    const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
    await ctx.stub.putState(rationCardDetails['rationRetailerId'], retailerBuffer);

    const buffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, buffer);
  }

  // changeIncome
  // @params: rationCardNumber, newIncome
  // async changeIncome(ctx, rationCardNumber, newIncome) {
  //   const exists = await this.rationCardExist(ctx, rationCardNumber);
  //   if (!exists) {
  //     throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
  //   }

  //   const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);

  //   const cardType = this.determineRationCardType(newIncome);

  //   rationCardDetails['income'] = newIncome;
  //   rationCardDetails['rationCardType'] = cardType['type'];
  //   rationCardDetails['rationCardColour'] = cardType['colour']

  //   const buffer = Buffer.from(JSON.stringify(rationCardDetails));
  //   await ctx.stub.putState(rationCardNumber, buffer);
  // }

  // consumerExist
  // @param: consumerNumber
  async consumerExist(ctx, consumerNumber) {
    const buffer = await ctx.stub.getState(consumerNumber);
    return (!!buffer && buffer.length > 0);
  }

  // addConsumer
  // @params: rationCardNumber, familyMember
  async addConsumer(
    ctx,
    consumerNumber,
    rationCardNumber,
    name,
    age,
    sex,
    occupation,
    individualIncome,
    isFamilyHead
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
    const retailerDetails = await this.readRationRetailer(ctx, rationCardDetails['rationRetailerId'])

    if (!rationCardDetails['doesFamilyHeadAvailable']) {
      if (isFamilyHead) {
        rationCardDetails['familyHead'] = name;
        rationCardDetails['familyHeadNumber'] = consumerNumber;
        rationCardDetails['doesFamilyHeadAvailable'] = true;
      }
    } else {
      if (isFamilyHead) {
        isFamilyHead = false;
      }
    }

    const currentIncome = rationCardDetails['totalFamilyIncome'];
    const latestIncome = currentIncome + individualIncome;
    rationCardDetails['totalFamilyIncome'] = latestIncome;
    const familyMembers = rationCardDetails['totalFamilyMembers'];
    const typeChange = this.willTypeChangeOccure(currentIncome, latestIncome, familyMembers, familyMembers+1);

    if (typeChange['changeOccure']) {
      rationCardDetails['rationCardType'] = typeChange['type'];
      rationCardDetails['rationCardColour'] = typeChange['colour'];

      if (familyMembers !== 0) {
        switch (typeChange['oldColour']) {
          case 'Yellow':
            retailerDetails['yellowCardConsumers'] -= familyMembers;
            retailerDetails['yellowCardFamilies']--;
            break;
          case 'Pink':
            retailerDetails['pinkCardConsumers'] -= familyMembers;
            break;
          case 'Blue':
            retailerDetails['blueCardConsumers'] -= familyMembers;
            break;
          case 'White':
            retailerDetails['whiteCardConsumers'] -= familyMembers;
            break;
          default:
            break;
        }
      }

      switch (typeChange['colour']) {
        case 'Yellow':
          retailerDetails['yellowCardConsumers'] += (familyMembers + 1);
          rationCardDetails['yellowCardFamilies']++;
          break;
        case 'Pink':
          retailerDetails['pinkCardConsumers'] += (familyMembers + 1);
          break;
        case 'Blue':
          retailerDetails['blueCardConsumers'] += (familyMembers + 1);
          break;
        case 'White':
          retailerDetails['whiteCardConsumers'] += (familyMembers + 1);
          break;
        default:
          break;
      }
    } else {
      switch (rationCardDetails['rationCardColour']) {
        case 'Yellow':
          retailerDetails['yellowCardConsumers']++;
          break;
        case 'Pink':
          retailerDetails['pinkCardConsumers']++;
          break;
        case 'Blue':
          retailerDetails['blueCardConsumers']++;
          break;
        case 'White':
          retailerDetails['whiteCardConsumers']++;
          break;
        default:
          break;
      }
    }

    rationCardDetails['totalFamilyMembers'] = familyMembers + 1;

    let consumer = {
      consumerNumber,
      rationCardNumber,
      nodalOfficerId: rationCardDetails['nodalOfficerId'],
      rationRetailerId: rationCardDetails['rationRetailerId'],
      name,
      age,
      sex,
      occupation,
      individualIncome,
      isFamilyHead,
      dataType: 'Consumer Account'
    };

    const rationCardBuffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(rationCardNumber, rationCardBuffer);

    const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
    await ctx.stub.putState(rationCardDetails['rationRetailerId'], retailerBuffer);

    const consumberBuffer = Buffer.from(JSON.stringify(consumer));
    await ctx.stub.putState(consumerNumber, consumberBuffer);
  }

  // readConsumer
  // @param: consumerNumber
  async readConsumer(ctx, consumerNumber) {
    const exists = await this.consumerExist(ctx, consumerNumber);
    if (!exists) {
      throw new Error(`The Consumer ${consumerNumber} does not exist`);
    }

    const buffer = await ctx.stub.getState(consumerNumber);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  // deleteConsumer
  // @param: consumerNumber
  async deleteConsumer(ctx, consumerNumber) {
    const exists = await this.consumerExist(ctx, consumerNumber);
    if (!exists) {
      throw new Error(`The Consumer ${consumerNumber} does not exist`);
    }

    const consumer = await this.readConsumer(ctx, consumerNumber);
    const rationCardDetails = await this.readRationCard(ctx, consumer['rationCardNumber']);
    const retailerDetails = await this.readRationRetailer(ctx, consumer['rationRetailerId'])

    if (rationCardDetails['doesFamilyHeadAvailable']) {
      if (consumer['isFamilyHead']) {
        rationCardDetails['familyHead'] = null;
        rationCardDetails['familyHeadNumber'] = null;
        rationCardDetails['doesFamilyHeadAvailable'] = false;
      }
    }

    const currentIncome = rationCardDetails['totalFamilyIncome'];
    const latestIncome = currentIncome - consumer['individualIncome'];
    rationCardDetails['totalFamilyIncome'] = latestIncome;
    const familyMembers = rationCardDetails['totalFamilyMembers'];
    const typeChange = this.willTypeChangeOccure(currentIncome, latestIncome, familyMembers, familyMembers-1);

    if (typeChange['changeOccure']) {
      rationCardDetails['rationCardType'] = typeChange['type'];
      rationCardDetails['rationCardColour'] = typeChange['colour'];

      if (familyMembers !== 0) {
        switch (typeChange['oldColour']) {
          case 'Yellow':
            retailerDetails['yellowCardConsumers'] -= familyMembers;
            retailerDetails['yellowCardFamilies']--;
            break;
          case 'Pink':
            retailerDetails['pinkCardConsumers'] -= familyMembers;
            break;
          case 'Blue':
            retailerDetails['blueCardConsumers'] -= familyMembers;
            break;
          case 'White':
            retailerDetails['whiteCardConsumers'] -= familyMembers;
            break;
          default:
            break;
        }
      }

      switch (typeChange['colour']) {
        case 'Yellow':
          retailerDetails['yellowCardConsumers'] += (familyMembers - 1);
          retailerDetails['yellowCardFamilies']++
          break;
        case 'Pink':
          retailerDetails['pinkCardConsumers'] += (familyMembers - 1);
          break;
        case 'Blue':
          retailerDetails['blueCardConsumers'] += (familyMembers - 1);
          break;
        case 'White':
          retailerDetails['whiteCardConsumers'] += (familyMembers - 1);
          break;
        default:
          break;
      }
    } else {
      switch (rationCardDetails['rationCardColour']) {
        case 'Yellow':
          retailerDetails['yellowCardConsumers']--;
          break;
        case 'Pink':
          retailerDetails['pinkCardConsumers']--;
          break;
        case 'Blue':
          retailerDetails['blueCardConsumers']--;
          break;
        case 'White':
          retailerDetails['whiteCardConsumers']--;
          break;
        default:
          break;
      }
    }

    rationCardDetails['totalFamilyMembers'] = familyMembers - 1;

    const rationCardBuffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(consumer['rationCardNumber'], rationCardBuffer);

    const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
    await ctx.stub.putState(rationCardDetails['rationRetailerId'], retailerBuffer);

    await ctx.stub.deleteState(consumerNumber);
  }

  // updateConsumerPersonalDetails
  // @params: consumerNumber, newName, newAge
  async updateConsumerPersonalDetails(ctx, consumerNumber, newName, newAge, newSex) {
    const exists = await this.consumerExist(ctx, consumerNumber);
    if (!exists) {
      throw new Error(`The Consumer ${consumerNumber} does not exist`);
    }

    const consumer = await this.readConsumer(ctx, consumerNumber);
    const rationCardDetails = await this.readRationCard(ctx, consumer['rationCardNumber']);

    if (rationCardDetails['doesFamilyHeadAvailable']) {
      if (consumer['isFamilyHead']) {
        rationCardDetails['familyHead'] = newName;
      }
    }

    consumer['name'] = newName;
    consumer['age'] = newAge;
    consumer['sex'] = newSex;

    const rationCardBuffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(consumer['rationCardNumber'], rationCardBuffer);

    const consumberBuffer = Buffer.from(JSON.stringify(consumer));
    await ctx.stub.putState(consumerNumber, consumberBuffer);
  }

  // updateConsumerProfessionalDetails
  // @params: consumerNumber, newOccupation, newIndividualIncome
  async updateConsumerProfessionalDetails(ctx, consumerNumber, newOccupation, newIndividualIncome) {
    const exists = await this.consumerExist(ctx, consumerNumber);
    if (!exists) {
      throw new Error(`The Consumer ${consumerNumber} does not exist`);
    }

    const consumer = await this.readConsumer(ctx, consumerNumber);
    const rationCardDetails = await this.readRationCard(ctx, consumer['rationCardNumber']);
    const retailerDetails = await this.readRationRetailer(ctx, consumer['rationRetailerId']);

    const currentIndividualIncome = consumer['individualIncome'];
    const currentFamilyIncome = rationCardDetails['totalFamilyIncome'];
    const newFamilyIncome = currentFamilyIncome - currentIndividualIncome + newIndividualIncome;
    const familyMembers = rationCardDetails['totalFamilyMembers'];
    const typeChange = this.willTypeChangeOccure(currentFamilyIncome, newFamilyIncome, familyMembers, familyMembers);

    if (typeChange['changeOccure']) {
      rationCardDetails['rationCardType'] = typeChange['type'];
      rationCardDetails['rationCardColour'] = typeChange['colour'];

      switch (typeChange['oldColour']) {
        case 'Yellow':
          retailerDetails['yellowCardConsumers'] -= familyMembers;
          retailerDetails['yellowCardFamilies']--;
          break;
        case 'Pink':
          retailerDetails['pinkCardConsumers'] -= familyMembers;
          break;
        case 'Blue':
          retailerDetails['blueCardConsumers'] -= familyMembers;
          break;
        case 'White':
          retailerDetails['whiteCardConsumers'] -= familyMembers;
          break;
        default:
          break;
      };

      switch (typeChange['colour']) {
        case 'Yellow':
          retailerDetails['yellowCardConsumers'] += familyMembers;
          retailerDetails['yellowCardFamilies']++;
          break;
        case 'Pink':
          retailerDetails['pinkCardConsumers'] += familyMembers;
          break;
        case 'Blue':
          retailerDetails['blueCardConsumers'] += familyMembers;
          break;
        case 'White':
          retailerDetails['whiteCardConsumers'] += familyMembers;
          break;
        default:
          break;
      }
    }

    consumer['occupation'] = newOccupation;
    consumer['individualIncome'] = newIndividualIncome;
    rationCardDetails['totalFamilyIncome'] = newFamilyIncome;

    const rationCardBuffer = Buffer.from(JSON.stringify(rationCardDetails));
    await ctx.stub.putState(consumer['rationCardNumber'], rationCardBuffer);

    const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
    await ctx.stub.putState(consumer['rationRetailerId'], retailerBuffer);

    const consumberBuffer = Buffer.from(JSON.stringify(consumer));
    await ctx.stub.putState(consumerNumber, consumberBuffer);
  }

  // shiftConsumerToAnotherFamily
  // @params: consumerNumber, newRationCardNumber
  async shiftConsumerToAnotherFamily(ctx, consumerNumber, newRationCardNumber) {
    const consumerExists = await this.consumerExist(ctx, consumerNumber);
    if (!consumerExists) {
      throw new Error(`The Consumer ${consumerNumber} does not exist`);
    }

    const cardExists = await this.rationCardExist(ctx, newRationCardNumber);
    if (!cardExists) {
      throw new Error(`The Ration Card ${newRationCardNumber} does not exist`);
    }

    const consumer = await this.readConsumer(ctx, consumerNumber);
    const currentCardNumber = consumer['rationCardNumber'];
    const currentFamily = await this.readRationCard(ctx, currentCardNumber);
    const currentFamilyMembers = currentFamily['totalFamilyMembers'];
    const newFamily = await this.readRationCard(ctx, newRationCardNumber);
    const newFamilyMembers = newFamily['totalFamilyMembers'];
    const currentRetailerId = consumer['rationRetailerId']
    const currentRetailer = await this.readRationRetailer(ctx, currentRetailerId);
    const newRetailer = await this.readRationRetailer(ctx, newFamily['rationRetailerId']);

    if (currentFamily['doesFamilyHeadAvailable']) {
      if (consumer['isFamilyHead']) {
        currentFamily['familyHead'] = null;
        currentFamily['familyHeadNumber'] = null;
        currentFamily['doesFamilyHeadAvailable'] = false;
      }
    }

    if (!newFamily['doesFamilyHeadAvailable']) {
      if (consumer['isFamilyHead']) {
        newFamily['familyHead'] = consumer['name'];
        newFamily['familyHeadNumber'] = consumerNumber;
        newFamily['doesFamilyHeadAvailable'] = true;
      }
    } else {
      if (consumer['isFamilyHead']) {
        consumer['isFamilyHead'] = false;
      }
    }

    const income = consumer['individualIncome'];
    const currentFamilyCurrentIncome = currentFamily['totalFamilyIncome'];
    const currentFamilyLatestIncome = currentFamilyCurrentIncome - income;
    const typeChange1 = this.willTypeChangeOccure(currentFamilyCurrentIncome, currentFamilyLatestIncome, currentFamilyMembers, currentFamilyMembers-1);

    if (typeChange1['changeOccure']) {
      currentFamily['rationCardType'] = typeChange1['type'];
      currentFamily['rationCardColour'] = typeChange1['colour'];

      if (currentFamilyMembers !== 0) {
        switch (typeChange1['oldColour']) {
          case 'Yellow':
            currentRetailer['yellowCardConsumers'] -= currentFamilyMembers;
            currentRetailer['yellowCardFamilies']--;
            break;
          case 'Pink':
            currentRetailer['pinkCardConsumers'] -= currentFamilyMembers;
            break;
          case 'Blue':
            currentRetailer['blueCardConsumers'] -= currentFamilyMembers;
            break;
          case 'White':
            currentRetailer['whiteCardConsumers'] -= currentFamilyMembers;
            break;
          default:
            break;
        }
      }

      switch (typeChange1['colour']) {
        case 'Yellow':
          currentRetailer['yellowCardConsumers'] += (currentFamilyMembers - 1);
          currentRetailer['yellowCardFamilies']++;
          break;
        case 'Pink':
          currentRetailer['pinkCardConsumers'] += (currentFamilyMembers - 1);
          break;
        case 'Blue':
          currentRetailer['blueCardConsumers'] += (currentFamilyMembers - 1);
          break;
        case 'White':
          currentRetailer['whiteCardConsumers'] += (currentFamilyMembers - 1);
          break;
        default:
          break;
      }
    } else {
      switch (currentFamily['rationCardColour']) {
        case 'Yellow':
          currentRetailer['yellowCardConsumers']--;
          break;
        case 'Pink':
          currentRetailer['pinkCardConsumers']--;
          break;
        case 'Blue':
          currentRetailer['blueCardConsumers']--;
          break;
        case 'White':
          currentRetailer['whiteCardConsumers']--;
          break;
        default:
          break;
      }
    }

    currentFamily['totalFamilyMembers'] = currentFamilyMembers - 1;
    currentFamily['totalFamilyIncome'] = currentFamilyLatestIncome;

    const newFamilyCurrentIncome = newFamily['totalFamilyIncome'];
    const newFamilyLatestIncome = newFamilyCurrentIncome + income;
    const typeChange2 = this.willTypeChangeOccure(newFamilyCurrentIncome, newFamilyLatestIncome, newFamilyMembers, newFamilyMembers+1);

    if (typeChange2['changeOccure']) {
      newFamily['rationCardType'] = typeChange2['type'];
      newFamily['rationCardColour'] = typeChange2['colour'];

      if (newFamilyMembers !== 0) {
        switch (typeChange2['oldColour']) {
          case 'Yellow':
            newRetailer['yellowCardConsumers'] -= newFamilyMembers;
            newRetailer['yellowCardFamilies']--;
            break;
          case 'Pink':
            newRetailer['pinkCardConsumers'] -= newFamilyMembers;
            break;
          case 'Blue':
            newRetailer['blueCardConsumers'] -= newFamilyMembers;
            break;
          case 'White':
            newRetailer['whiteCardConsumers'] -= newFamilyMembers;
            break;
          default:
            break;
        }
      }

      switch (typeChange2['colour']) {
        case 'Yellow':
          newRetailer['yellowCardConsumers'] += (newFamilyMembers + 1);
          newRetailer['yellowCardFamilies']++;
          break;
        case 'Pink':
          newRetailer['pinkCardConsumers'] += (newFamilyMembers + 1);
          break;
        case 'Blue':
          newRetailer['blueCardConsumers'] += (newFamilyMembers + 1);
          break;
        case 'White':
          newRetailer['whiteCardConsumers'] += (newFamilyMembers + 1);
          break;
        default:
          break;
      }
    } else {
      switch (rationCardDetails['rationCardColour']) {
        case 'Yellow':
          newRetailer['yellowCardConsumers']++;
          break;
        case 'Pink':
          newRetailer['pinkCardConsumers']++;
          break;
        case 'Blue':
          newRetailer['blueCardConsumers']++;
          break;
        case 'White':
          newRetailer['whiteCardConsumers']++;
          break;
        default:
          break;
      }
    }

    newFamily['totalFamilyMembers'] = newFamilyMembers + 1;
    newFamily['totalFamilyIncome'] = newFamilyLatestIncome;

    consumer['rationCardNumber'] = newRationCardNumber;
    consumer['nodalOfficerId'] = newFamily['nodalOfficerId'];
    consumer['rationRetailerId'] = newFamily['rationRetailerId'];

    const currentFamilyBuffer = Buffer.from(JSON.stringify(currentFamily));
    await ctx.stub.putState(currentCardNumber, currentFamilyBuffer);

    const newFamilyBuffer = Buffer.from(JSON.stringify(newFamily));
    await ctx.stub.putState(newRationCardNumber, newFamilyBuffer);

    const currentRetailerBuffer = Buffer.from(JSON.stringify(currentRetailer));
    await ctx.stub.putState(currentRetailerId, currentRetailerBuffer);

    const newRetailerBuffer = Buffer.from(JSON.stringify(newRetailer));
    await ctx.stub.putState(newFamily['rationRetailerId'], newRetailerBuffer);

    const consumberBuffer = Buffer.from(JSON.stringify(consumer));
    await ctx.stub.putState(consumerNumber, consumberBuffer);
  }

  // retailerPurchaseExist
  // @param: retailerPurchaseNumber
  async retailerPurchaseExist(ctx, retailerPurchaseNumber) {
    const buffer = await ctx.stub.getState(retailerPurchaseNumber);
    return (!!buffer && buffer.length > 0);
  }

  // makeRetailerFoodItemsPurchase
  // @params: retailerPurchaseNumber, rationRetailerId, rationCardColour, itemName
  async makeRetailerFoodItemsPurchase(
    ctx,
    retailerPurchaseNumber,
    rationRetailerId,
    rationCardColour,
    itemName
  ) {
    const purchaseExist = await this.retailerPurchaseExist(ctx, retailerPurchaseNumber);
    if (purchaseExist) {
      throw new Error(`The Retailer Purchase ${retailerPurchaseNumber} already exist`);
    }

    const retailerExists = await this.rationRetailerExists(ctx, rationRetailerId);
    if (!retailerExists) {
      throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
    }

    const retailerDetails = await this.readRationRetailer(ctx, rationRetailerId);

    const purchaseDetails = {};
    if (rationCardColour === 'Yellow' && itemName === 'Rice') {
      purchaseDetails['totalQuantity'] = retailerDetails['yellowCardFamilies'] * 30;
      purchaseDetails['isDistributedIndividually'] = false;
      purchaseDetails['overallQuantity'] = 30;
      purchaseDetails['pricePerQuantity'] = 0;
      purchaseDetails['basicUnit'] = 'Kg';
    } else if (rationCardColour === 'Yellow' && itemName === 'Wheet') {
      purchaseDetails['totalQuantity'] = retailerDetails['yellowCardFamilies'] * 5;
      purchaseDetails['isDistributedIndividually'] = false;
      purchaseDetails['overallQuantity'] = 5;
      purchaseDetails['pricePerQuantity'] = 0;
      purchaseDetails['basicUnit'] = 'Kg';
    } else if (rationCardColour === 'Yellow' && itemName === 'Sugar') {
      purchaseDetails['totalQuantity'] = retailerDetails['yellowCardConsumers'] * 0.4;
      purchaseDetails['isDistributedIndividually'] = true;
      purchaseDetails['individualQuantity'] = 0.4;
      purchaseDetails['pricePerQuantity'] = 13.5;
      purchaseDetails['basicUnit'] = 'Kg';
    } else if (rationCardColour === 'Pink' && itemName === 'Rice') {
      purchaseDetails['totalQuantity'] = retailerDetails['pinkCardConsumers'] * 4;
      purchaseDetails['isDistributedIndividually'] = true;
      purchaseDetails['individualQuantity'] = 4;
      purchaseDetails['pricePerQuantity'] = 2;
      purchaseDetails['basicUnit'] = 'Kg';
    } else if (rationCardColour === 'Pink' && itemName === 'Wheet') {
      purchaseDetails['totalQuantity'] = retailerDetails['pinkCardConsumers'] * 1;
      purchaseDetails['isDistributedIndividually'] = true;
      purchaseDetails['individualQuantity'] = 1;
      purchaseDetails['pricePerQuantity'] = 2;
      purchaseDetails['basicUnit'] = 'Kg';
    } else if (rationCardColour === 'Pink' && itemName === 'Sugar') {
      purchaseDetails['totalQuantity'] = retailerDetails['pinkCardConsumers'] * 0.4;
      purchaseDetails['isDistributedIndividually'] = true;
      purchaseDetails['individualQuantity'] = 0.4;
      purchaseDetails['pricePerQuantity'] = 13.5;
      purchaseDetails['basicUnit'] = 'Kg';
    } else if (rationCardColour === 'Blue' && itemName === 'Rice') {
      purchaseDetails['totalQuantity'] = retailerDetails['blueCardConsumers'] * 2;
      purchaseDetails['isDistributedIndividually'] = true;
      purchaseDetails['individualQuantity'] = 2;
      purchaseDetails['basicUnit'] = 'Kg';
      purchaseDetails['pricePerQuantity'] = 4;
    } else if (rationCardColour === 'Blue' && itemName === 'Wheet') {
      purchaseDetails['totalQuantity'] = retailerDetails['blueCardConsumers'] * 2;
      purchaseDetails['isDistributedIndividually'] = true;
      purchaseDetails['individualQuantity'] = 2;
      purchaseDetails['basicUnit'] = 'Kg';
      purchaseDetails['pricePerQuantity'] = 6.7;
    } else if (rationCardColour === 'Blue' && itemName === 'Fortified Atta') {
      purchaseDetails['totalQuantity'] = retailerDetails['blueCardConsumers'] * 2;
      purchaseDetails['isDistributedIndividually'] = true;
      purchaseDetails['individualQuantity'] = 2;
      purchaseDetails['basicUnit'] = 'Kg';
      purchaseDetails['pricePerQuantity'] = 17;
    } else if (rationCardColour === 'White' && itemName === 'Rice') {
      purchaseDetails['totalQuantity'] = retailerDetails['whiteCardConsumers'] * 2;
      purchaseDetails['isDistributedIndividually'] = true;
      purchaseDetails['individualQuantity'] = 2;
      purchaseDetails['basicUnit'] = 'Kg';
      purchaseDetails['pricePerQuantity'] = 10.9;
    } else if (rationCardColour === 'White' && itemName === 'Wheet') {
      purchaseDetails['totalQuantity'] = retailerDetails['whiteCardConsumers'] * 2;
      purchaseDetails['isDistributedIndividually'] = true;
      purchaseDetails['individualQuantity'] = 2;
      purchaseDetails['basicUnit'] = 'Kg';
      purchaseDetails['pricePerQuantity'] = 6.7;
    } else if (rationCardColour === 'White' && itemName === 'Fortified Atta') {
      purchaseDetails['totalQuantity'] = retailerDetails['whiteCardConsumers'] * 2;
      purchaseDetails['isDistributedIndividually'] = true;
      purchaseDetails['individualQuantity'] = 2;
      purchaseDetails['basicUnit'] = 'Kg';
      purchaseDetails['pricePerQuantity'] = 17;
    }
    
    const asset = {
      retailerPurchaseNumber,
      nodalOfficerId: retailerDetails['nodalOfficerId'],
      rationRetailerId,
      rationCardColour,
      itemName,
      basicUnit: purchaseDetails['basicUnit'],
      isDistributedIndividually: purchaseDetails['isDistributedIndividually'],
      overallQuantity: !purchaseDetails['isDistributedIndividually']? purchaseDetails.overallQuantity: 0,
      individualQuantity: purchaseDetails['isDistributedIndividually']? purchaseDetails.individualQuantity: 0,
      pricePerQuantity: purchaseDetails['pricePerQuantity'],
      totalQuantity: purchaseDetails['totalQuantity'],
      presentQuantity: purchaseDetails['totalQuantity'],
      purchaseDate: Date(Date.now()),
      dataType: 'Retailer Food Items Purchase'
    }

    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(retailerPurchaseNumber, buffer);
  }

  // makeRetailerKerosinePurchase
  // @params: retailerPurchaseNumber, rationRetailerId, rationCardColour, itemName
  async makeRetailerKerosinePurchase(ctx, retailerPurchaseNumber, rationRetailerId) {
    const purchaseExist = await this.retailerPurchaseExist(ctx, retailerPurchaseNumber);
    if (purchaseExist) {
      throw new Error(`The Retailer Purchase ${retailerPurchaseNumber} already exist`);
    }

    const retailerExists = await this.rationRetailerExists(ctx, rationRetailerId);
    if (!retailerExists) {
      throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
    }

    const retailerDetails = await this.readRationRetailer(ctx, rationRetailerId);

    const totalQuantity = retailerDetails['nonElectrifiedHomes'] * 4 + retailerDetails['electrifiedHomes'] * 0.5;

    const asset = {
      retailerPurchaseNumber,
      nodalOfficerId: retailerDetails['nodalOfficerId'],
      rationRetailerId,
      itemName: 'Kerosine',
      basicUnit: 'Litre',
      isDistributedIndividually: false,
      nonElectrifiedHomesQuantity: 4,
      electrifiedHomesQuantity: 0.5,
      nonElectrifiedHomesPricePerQuantity: 18,
      electrifiedHomesPricePerQuantity: 17,
      totalQuantity,
      presentQuantity: totalQuantity,
      purchaseDate: Date(Date.now()),
      dataType: 'Retailer Kerosine Purchase'
    }

    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(retailerPurchaseNumber, buffer);
  }

  // readRetailerPurchase
  // @param: retailerPurchaseNumber
  async readRetailerPurchase(ctx, retailerPurchaseNumber) {
    const exists = await this.retailerPurchaseExist(ctx, retailerPurchaseNumber);
    if (!exists) {
      throw new Error(`The Retailer Purchase ${retailerPurchaseNumber} does not exist`);
    }

    const buffer = await ctx.stub.getState(retailerPurchaseNumber);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  // deleteRetailerPurchase
  // @param: retailerPurchaseNumber
  async deleteRetailerPurchase(ctx, retailerPurchaseNumber) {
    const exists = await this.retailerPurchaseExist(ctx, retailerPurchaseNumber);
    if (!exists) {
      throw new Error(`The Retailer Purchase ${retailerPurchaseNumber} does not exist`);
    }

    await ctx.stub.deleteState(retailerPurchaseNumber);
  }

  // consumerPurchaseExist
  // @param: consumerPurchaseNumber
  async consumerPurchaseExist(ctx, consumerPurchaseNumber) {
    const buffer = await ctx.stub.getState(consumerPurchaseNumber);
    return (!!buffer && buffer.length > 0);
  }

  // makeConsumerPurchase
  // @params: consumerPurchaseNumber, retailerPurchaseNumber, rationCardNumber
  async makeConsumerPurchase(ctx, consumerPurchaseNumber, retailerPurchaseNumber, rationCardNumber) {
    const consumerPurchaseExists = await this.consumerPurchaseExist(ctx, consumerPurchaseNumber);
    if (consumerPurchaseExists) {
      throw new Error(`The Consumer Purchase ${consumerPurchaseNumber} already exist`);
    }

    const retailerPurchaseExists = await this.retailerPurchaseExist(ctx, retailerPurchaseNumber);
    if (!retailerPurchaseExists) {
      throw new Error(`The Retailer Purchase ${retailerPurchaseNumber} does not exist`);
    }

    const rationCardExists = await this.rationCardExist(ctx, rationCardNumber);
    if (!rationCardExists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const retailerPurchase = await this.readRetailerPurchase(ctx, retailerPurchaseNumber);
    const rationCard = await this.readRationCard(ctx, rationCardNumber);

    let quantity, pricePerQuantity, price;
    if (retailerPurchase['itemName'] === 'Kerosine') {
      if (rationCard['isHomeElectrified']) {
        quantity = retailerPurchase['electrifiedHomesQuantity'];
        pricePerQuantity = retailerPurchase['electrifiedHomesPricePerQuantity'];
      } else {
        quantity = retailerPurchase['nonElectrifiedHomesQuantity'];
        pricePerQuantity = retailerPurchase['nonElectrifiedHomesPricePerQuantity'];
      }
    } else {
      if (retailerPurchase['isDistributedIndividually']) {
        quantity = retailerPurchase['individualQuantity'] * rationCard['totalFamilyMembers'];
      } else {
        quantity = retailerPurchase['overallQuantity'];
      }
      pricePerQuantity = retailerPurchase['pricePerQuantity'];
    }
    price = quantity * pricePerQuantity;

    let asset = {
      consumerPurchaseNumber,
      retailerPurchaseNumber,
      nodalOfficerId: rationCard['nodalOfficerId'],
      rationRetailerId: rationCard['rationRetailerId'],
      itemName: retailerPurchase['itemName'],
      quantity,
      pricePerQuantity,
      price,
      purchaseDate: Date(Date.now()),
      dataType: 'Consumer Purchase'
    }

    retailerPurchase['presentQuantity'] -= quantity;

    if (retailerPurchase['presentQuantity'] === 0) {
      await this.deleteRetailerPurchase(ctx, retailerPurchaseNumber);
    } else {
      const retailerPurchaseBuffer = Buffer.from(JSON.stringify(retailerPurchase));
      await ctx.stub.putState(retailerPurchaseNumber, retailerPurchaseBuffer); 
    }

    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(consumerPurchaseNumber, buffer);
  }

}

module.exports = CivilSuppliesNetworkContract;
