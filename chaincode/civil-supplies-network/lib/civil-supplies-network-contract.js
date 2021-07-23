/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const shim = require('fabric-shim');

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
      return { changeOccure: false, status: 'No change' };
    } else if (type1['type'] === null && type1['colour'] === null) {
      return {
        changeOccure: true,
        status: 'Current Family Empty',
        type: type2['type'],
        newColour: type2['colour']
      };
    } else if (type2['type'] === null && type2['colour'] === null) {
      return {
        changeOccure: true,
        status: 'New Family Empty',
        type: type1['type'],
        oldColour: type1['colour']
      };
    } else {
      return {
        changeOccure: true,
        status: 'Change occures',
        type: type2['type'],
        newColour: type2['colour'],
        oldColour: type1['colour']
      };
    }
  }

  determinePurchaseDetails(cardColour, foodItem, consumers) {
    if (cardColour === 'Yellow' && foodItem === 'Rice') {
      return {
        totalQuantity: consumers * 30,
        isDistributedIndividually: false,
        overallQuantity: 30,
        individualQuantity: 0,
        pricePerQuantity: 0,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'Yellow' && foodItem === 'Wheat') {
      return {
        totalQuantity: consumers * 5,
        isDistributedIndividually: false,
        overallQuantity: 5,
        individualQuantity: 0,
        pricePerQuantity: 0,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'Yellow' && foodItem === 'Sugar') {
      return {
        totalQuantity: consumers * 0.4,
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 0.4,
        pricePerQuantity: 13.5,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'Pink' && foodItem === 'Rice') {
      return {
        totalQuantity: consumers * 4,
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 4,
        pricePerQuantity: 2,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'Pink' && foodItem === 'Wheat') {
      return {
        totalQuantity: consumers * 1,
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 1,
        pricePerQuantity: 2,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'Pink' && foodItem === 'Sugar') {
      return {
        totalQuantity: consumers * 0.4,
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 0.4,
        pricePerQuantity: 13.5,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'Blue' && foodItem === 'Rice') {
      return {
        totalQuantity: consumers * 2,
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 2,
        pricePerQuantity: 4,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'Blue' && foodItem === 'Wheat') {
      return {
        totalQuantity: consumers * 2,
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 2,
        pricePerQuantity: 6.5,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'Blue' && foodItem === 'Fortified Atta') {
      return {
        totalQuantity: consumers * 2,
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 2,
        pricePerQuantity: 17,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'White' && foodItem === 'Rice') {
      return {
        totalQuantity: consumers * 2,
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 2,
        pricePerQuantity: 11,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'White' && foodItem === 'Wheat') {
      return {
        totalQuantity: consumers * 2,
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 2,
        pricePerQuantity: 6.5,
        basicUnit: 'Kg'
      }
    } else if (cardColour === 'White' && foodItem === 'Fortified Atta') {
      return {
        totalQuantity: consumers * 2,
        isDistributedIndividually: true,
        overallQuantity: 0,
        individualQuantity: 2,
        pricePerQuantity: 17,
        basicUnit: 'Kg'
      }
    }
  }

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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'CommisionerMSP') {
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

      let createNodalOfficerEvent = {
        Type: 'Creating a nodal officer',
        NodalOfficerID: nodalOfficerId
      }
      await ctx.stub.setEvent('createNodalOfficerEvent', Buffer.from(JSON.stringify(createNodalOfficerEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'CommisionerMSP') {
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
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // deleteNodalOfficer
  // @param: nodalOfficerId
  async deleteNodalOfficer(ctx, nodalOfficerId) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'CommisionerMSP') {
      const exists = await this.nodalOfficerExists(ctx, nodalOfficerId);
      if (!exists) {
        throw new Error(`The Nodal Officer ${nodalOfficerId} does not exist`);
      }

      await ctx.stub.deleteState(nodalOfficerId);
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'CommisionerMSP') {
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

      let createRationRetailerEvent = {
        Type: 'Creating a ration retailer',
        RationRetailerId: rationRetailerId
      }
      await ctx.stub.setEvent('createRationRetailerEvent', Buffer.from(JSON.stringify(createRationRetailerEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'CommisionerMSP') {
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
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // deleteRationRetailer
  // @param: rationRetailerId
  async deleteRationRetailer(ctx, rationRetailerId) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'CommisionerMSP') {
      const exists = await this.rationRetailerExists(ctx, rationRetailerId);
      if (!exists) {
        throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
      }

      await ctx.stub.deleteState(rationRetailerId);
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
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
      console.log(typeof isHomeElectrified);
      let electricity;
      if (isHomeElectrified === true || isHomeElectrified === 'true') {
        retailerDetails['electrifiedHomes']++;
        electricity = true;
      } else {
        retailerDetails['nonElectrifiedHomes']++;
        electricity = false;
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
        isHomeElectrified: electricity,
        dataType: 'Ration Card'
      };

      const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
      await ctx.stub.putState(rationRetailerId, retailerBuffer);

      const buffer = Buffer.from(JSON.stringify(rationCard));
      await ctx.stub.putState(rationCardNumber, buffer);

      let createRationCardEvent = {
        Type: 'Creating a ration card',
        RationCardNumber: rationCardNumber
      }
      await ctx.stub.setEvent('createRationCardEvent', Buffer.from(JSON.stringify(createRationCardEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
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

      let deleteRationCardEvent = {
        Type: 'Deleting a ration card',
        RationCardNumber: rationCardNumber
      }
      await ctx.stub.setEvent('deleteRationCardEvent', Buffer.from(JSON.stringify(deleteRationCardEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // shiftHouseInSameWard
  // @params: rationCardNumber, newHouseNumber, isNewHomeElectrified
  async shiftHouseInSameWard(ctx, rationCardNumber, newHouseNumber, isNewHomeElectrified) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
      const exists = await this.rationCardExist(ctx, rationCardNumber);
      if (!exists) {
        throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
      }

      const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);
      const retailerDetails = await this.readRationRetailer(ctx, rationCardDetails['rationRetailerId']);

      let electricity;
      if (isNewHomeElectrified === true || isNewHomeElectrified === 'true') {
        electricity = true;
      } else {
        electricity = false;
      }

      if (rationCardDetails['isHomeElectrified'] && !electricity) {
        retailerDetails['electrifiedHomes']--;
        retailerDetails['nonElectrifiedHomes']++;
      } else if (!rationCardDetails['isHomeElectrified'] && electricity) {
        retailerDetails['electrifiedHomes']++;
        retailerDetails['nonElectrifiedHomes']--;
      }

      rationCardDetails['houseNumber'] = newHouseNumber;
      rationCardDetails['isHomeElectrified'] = electricity;

      const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
      await ctx.stub.putState(rationCardDetails['rationRetailerId'], retailerBuffer);

      const buffer = Buffer.from(JSON.stringify(rationCardDetails));
      await ctx.stub.putState(rationCardNumber, buffer);

      let shiftHouseInSameWardEvent = {
        Type: 'Shifting house in same ward',
        RationCardNumber: rationCardNumber
      }
      await ctx.stub.setEvent('shiftHouseInSameWardEvent', Buffer.from(JSON.stringify(shiftHouseInSameWardEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
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

      if (currentRetailerId === newRationRetailerId) {
        throw new Error(`The new Ration Retailer ${newRationRetailerId} is same as the current one.`);
      }

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

      let electricity;
      if (isNewHomeElectrified === true || isNewHomeElectrified === 'true') {
        electricity = true;
      } else {
        electricity = false;
      }

      if (rationCardDetails['isHomeElectrified'] && !electricity) {
        currentRetailerDetails['electrifiedHomes']--;
        newRetailerDetails['nonElectrifiedHomes']++;
      } else if (!rationCardDetails['isHomeElectrified'] && electricity) {
        newRetailerDetails['electrifiedHomes']++;
        currentRetailerDetails['nonElectrifiedHomes']--;
      } else if (!rationCardDetails['isHomeElectrified'] && !electricity) {
        newRetailerDetails['nonElectrifiedHomes']++;
        currentRetailerDetails['nonElectrifiedHomes']--;
      } else if (rationCardDetails['isHomeElectrified'] && electricity) {
        newRetailerDetails['electrifiedHomes']++;
        currentRetailerDetails['electrifiedHomes']--;
      }

      rationCardDetails['houseNumber'] = newHouseNumber;
      rationCardDetails['wardNumber'] = newRetailerDetails['wardNumber'];
      rationCardDetails['rationRetailerId'] = newRationRetailerId;
      rationCardDetails['isHomeElectrified'] = electricity;

      const currentRetailerBuffer = Buffer.from(JSON.stringify(currentRetailerDetails));
      await ctx.stub.putState(currentRetailerId, currentRetailerBuffer);

      const newRetailerBuffer = Buffer.from(JSON.stringify(newRetailerDetails));
      await ctx.stub.putState(newRationRetailerId, newRetailerBuffer);

      const buffer = Buffer.from(JSON.stringify(rationCardDetails));
      await ctx.stub.putState(rationCardNumber, buffer);

      let shiftHouseInSameLSGBodyEvent = {
        Type: 'Shifting house in LSG body',
        RationCardNumber: rationCardNumber
      }
      await ctx.stub.setEvent('shiftHouseInSameLSGBodyEvent', Buffer.from(JSON.stringify(shiftHouseInSameLSGBodyEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
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

      if (currentRetailerId === newRationRetailerId) {
        throw new Error(`The new Ration Retailer ${newRationRetailerId} is same as the current one.`);
      }

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

      let electricity;
      if (isNewHomeElectrified === true || isNewHomeElectrified === 'true') {
        electricity = true;
      } else {
        electricity = false;
      }

      if (rationCardDetails['isHomeElectrified'] && !electricity) {
        currentRetailerDetails['electrifiedHomes']--;
        newRetailerDetails['nonElectrifiedHomes']++;
      } else if (!rationCardDetails['isHomeElectrified'] && electricity) {
        newRetailerDetails['electrifiedHomes']++;
        currentRetailerDetails['nonElectrifiedHomes']--;
      } else if (!rationCardDetails['isHomeElectrified'] && !electricity) {
        newRetailerDetails['nonElectrifiedHomes']++;
        currentRetailerDetails['nonElectrifiedHomes']--;
      } else if (rationCardDetails['isHomeElectrified'] && electricity) {
        newRetailerDetails['electrifiedHomes']++;
        currentRetailerDetails['electrifiedHomes']--;
      }

      rationCardDetails['houseNumber'] = newHouseNumber;
      rationCardDetails['wardNumber'] = newRetailerDetails['wardNumber'];
      rationCardDetails['LSGBody'] = newRetailerDetails['LSGBody'];
      rationCardDetails['rationRetailerId'] = newRationRetailerId;
      rationCardDetails['isHomeElectrified'] = electricity;

      const currentRetailerBuffer = Buffer.from(JSON.stringify(currentRetailerDetails));
      await ctx.stub.putState(currentRetailerId, currentRetailerBuffer);

      const newRetailerBuffer = Buffer.from(JSON.stringify(newRetailerDetails));
      await ctx.stub.putState(newRationRetailerId, newRetailerBuffer);

      const buffer = Buffer.from(JSON.stringify(rationCardDetails));
      await ctx.stub.putState(rationCardNumber, buffer);

      let shiftHouseInSameTalukEvent = {
        Type: 'Shifting house in same taluk',
        RationCardNumber: rationCardNumber
      }
      await ctx.stub.setEvent('shiftHouseInSameTalukEvent', Buffer.from(JSON.stringify(shiftHouseInSameTalukEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'CommisionerMSP') {
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
      const currentOfficerId = rationCardDetails['nodalOfficerId']

      if (currentRetailerId === newRationRetailerId) {
        throw new Error(`The new Ration Retailer ${newRationRetailerId} is same as the current one.`);
      }

      const currentRetailerDetails = await this.readRationRetailer(ctx, currentRetailerId)
      const newRetailerDetails = await this.readRationRetailer(ctx, newRationRetailerId);

      if (currentOfficerId === newRetailerDetails['nodalOfficerId']) {
        throw new Error(`The new Nodal Officer ${newRetailerDetails['nodalOfficerId']} is same as the current one.`);
      }

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

      let electricity;
      if (isNewHomeElectrified === true || isNewHomeElectrified === 'true') {
        electricity = true;
      } else {
        electricity = false;
      }

      if (rationCardDetails['isHomeElectrified'] && !electricity) {
        currentRetailerDetails['electrifiedHomes']--;
        newRetailerDetails['nonElectrifiedHomes']++;
      } else if (!rationCardDetails['isHomeElectrified'] && electricity) {
        newRetailerDetails['electrifiedHomes']++;
        currentRetailerDetails['nonElectrifiedHomes']--;
      } else if (!rationCardDetails['isHomeElectrified'] && !electricity) {
        newRetailerDetails['nonElectrifiedHomes']++;
        currentRetailerDetails['nonElectrifiedHomes']--;
      } else if (rationCardDetails['isHomeElectrified'] && electricity) {
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
      rationCardDetails['isHomeElectrified'] = electricity;

      const currentRetailerBuffer = Buffer.from(JSON.stringify(currentRetailerDetails));
      await ctx.stub.putState(currentRetailerId, currentRetailerBuffer);

      const newRetailerBuffer = Buffer.from(JSON.stringify(newRetailerDetails));
      await ctx.stub.putState(newRationRetailerId, newRetailerBuffer);


      const buffer = Buffer.from(JSON.stringify(rationCardDetails));
      await ctx.stub.putState(rationCardNumber, buffer);

      let shiftFamilyToAnotherTalukEvent = {
        Type: 'Shifting one house from one taluk to another',
        RationCardNumber: rationCardNumber
      }
      await ctx.stub.setEvent('shiftFamilyToAnotherTalukEvent', Buffer.from(JSON.stringify(shiftFamilyToAnotherTalukEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // changeMobileNumber
  // @params: rationCardNumber, newMobileNumber
  async changeMobileNumber(ctx, rationCardNumber, newMobileNumber) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
      const exists = await this.rationCardExist(ctx, rationCardNumber);
      if (!exists) {
        throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
      }

      const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);

      rationCardDetails['mobileNumber'] = newMobileNumber;

      const buffer = Buffer.from(JSON.stringify(rationCardDetails));
      await ctx.stub.putState(rationCardNumber, buffer);

      let changeMobileNumberEvent = {
        Type: 'Changing mobile number registered to a ration card',
        RationCardNumber: rationCardNumber
      }
      await ctx.stub.setEvent('changeMobileNumberEvent', Buffer.from(JSON.stringify(changeMobileNumberEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // changeHomeElectrificationStatus
  // @params: rationCardNumber
  async changeHomeElectrificationStatus(ctx, rationCardNumber) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
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

      let changeElectricityConnectionStatusEvent = {
        Type: 'Changing electricity connection status for a ration card',
        RationCardNumber: rationCardNumber
      }
      await ctx.stub.setEvent('changeElectricityConnectionStatusEvent', Buffer.from(JSON.stringify(changeElectricityConnectionStatusEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

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
  ) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
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

      let familyHeadStatus;
      let familyHeadDetails = await this.determineFamilyHead(ctx, rationCardNumber);

      if (!familyHeadDetails['isFamilyHeadAvailable']) {
        familyHeadStatus = true;
      } else {
        if (familyHeadDetails['sex'] === 'Male') {
          if (sex === 'Female') {
            if (parseInt(age) >= 18) {
              familyHeadStatus = true;
            } else {
              familyHeadStatus = false;
            }
          } else {
            if (parseInt(age) > familyHeadDetails['age']) {
              familyHeadStatus = true;
            } else {
              familyHeadStatus = false;
            }
          }
        } else {
          if (sex === 'Female') {
            if (parseInt(age) > familyHeadDetails['age']) {
              familyHeadStatus = true;
            } else {
              familyHeadStatus = false;
            }
          } else {
            familyHeadStatus = false;
          }
        }
      }


      if (familyHeadStatus && rationCardDetails['doesFamilyHeadAvailable']) {
        const currentFamilyHead = await this.getCurrentFamilyHead(ctx, rationCardNumber);
        currentFamilyHead['isFamilyHead'] = false;

        rationCardDetails['familyHead'] = name;
        rationCardDetails['familyHeadNumber'] = consumerNumber;

        const currentFamilyHeadBuffer = Buffer.from(JSON.stringify(currentFamilyHead));
        await ctx.stub.putState(familyHeadDetails['id'], currentFamilyHeadBuffer);
      } else if (familyHeadStatus && !rationCardDetails['doesFamilyHeadAvailable']) {
        rationCardDetails['familyHead'] = name;
        rationCardDetails['familyHeadNumber'] = consumerNumber;
        rationCardDetails['doesFamilyHeadAvailable'] = true;
      }

      const currentIncome = rationCardDetails['totalFamilyIncome'];
      const latestIncome = currentIncome + parseFloat(individualIncome);
      rationCardDetails['totalFamilyIncome'] = latestIncome;
      const familyMembers = rationCardDetails['totalFamilyMembers'];
      const typeChange = this.willTypeChangeOccure(currentIncome, latestIncome, familyMembers, familyMembers + 1);

      if (typeChange['changeOccure']) {
        rationCardDetails['rationCardType'] = typeChange['type'];
        rationCardDetails['rationCardColour'] = typeChange['newColour'];

        if (typeChange['status'] === 'Change occures') {
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

          switch (typeChange['newColour']) {
            case 'Yellow':
              retailerDetails['yellowCardConsumers'] += (familyMembers + 1);
              retailerDetails['yellowCardFamilies']++;
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
        } else if (typeChange['status'] === 'Current Family Empty') {
          switch (typeChange['newColour']) {
            case 'Yellow':
              retailerDetails['yellowCardConsumers']++;
              retailerDetails['yellowCardFamilies']++;
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
      } else {
        switch (rationCardDetails['rationCardColour']) {
          case 'Yellow':
            retailerDetails['yellowCardConsumers']++;
            retailerDetails['yellowCardFamilies']++;
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
        age: parseInt(age),
        sex,
        occupation,
        individualIncome: parseFloat(individualIncome),
        isFamilyHead: familyHeadStatus,
        dataType: 'Consumer Account'
      };

      const rationCardBuffer = Buffer.from(JSON.stringify(rationCardDetails));
      await ctx.stub.putState(rationCardNumber, rationCardBuffer);

      const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
      await ctx.stub.putState(rationCardDetails['rationRetailerId'], retailerBuffer);

      const consumberBuffer = Buffer.from(JSON.stringify(consumer));
      await ctx.stub.putState(consumerNumber, consumberBuffer);

      let addConsumerEvent = {
        Type: 'Adding a consumer to a ration card',
        ConsumerNumber: consumerNumber
      }
      await ctx.stub.setEvent('addConsumerEvent', Buffer.from(JSON.stringify(addConsumerEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
      const exists = await this.consumerExist(ctx, consumerNumber);
      if (!exists) {
        throw new Error(`The Consumer ${consumerNumber} does not exist`);
      }

      const consumer = await this.readConsumer(ctx, consumerNumber);
      const rationCardDetails = await this.readRationCard(ctx, consumer['rationCardNumber']);
      const retailerDetails = await this.readRationRetailer(ctx, consumer['rationRetailerId'])

      let familyHeadStatus = consumer['isFamilyHead'];

      if (familyHeadStatus) {
        const secondFamilyHeadDetails = await this.determineSecondFamilyHead(ctx, consumer['rationCardNumber']);
        if (!secondFamilyHeadDetails['isSecondFamilyHeadAvailable']) {
          rationCardDetails['familyHead'] = null;
          rationCardDetails['familyHeadNumber'] = null;
          rationCardDetails['doesFamilyHeadAvailable'] = false;
        } else {
          rationCardDetails['familyHead'] = secondFamilyHeadDetails['name'];
          rationCardDetails['familyHeadNumber'] = secondFamilyHeadDetails['id'];

          const newFamilyHead = await this.readConsumer(ctx, secondFamilyHeadDetails['id']);
          newFamilyHead['isFamilyHead'] = true;

          const newFamilyHeadBuffer = Buffer.from(JSON.stringify(newFamilyHead));
          await ctx.stub.putState(secondFamilyHeadDetails['id'], newFamilyHeadBuffer);
        }
      }

      const currentIncome = rationCardDetails['totalFamilyIncome'];
      const latestIncome = currentIncome - consumer['individualIncome'];
      rationCardDetails['totalFamilyIncome'] = latestIncome;
      const familyMembers = rationCardDetails['totalFamilyMembers'];
      const typeChange = this.willTypeChangeOccure(currentIncome, latestIncome, familyMembers, familyMembers - 1);

      if (typeChange['changeOccure']) {
        if (typeChange['status'] === 'Change occures') {
          rationCardDetails['rationCardType'] = typeChange['type'];
          rationCardDetails['rationCardColour'] = typeChange['newColour'];
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

          switch (typeChange['newColour']) {
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

        } else if (typeChange['status'] === 'New Family Empty') {
          rationCardDetails['rationCardType'] = null;
          rationCardDetails['rationCardColour'] = null;

          switch (typeChange['oldColour']) {
            case 'Yellow':
              retailerDetails['yellowCardConsumers']--;
              retailerDetails['yellowCardFamilies']--
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

      let deleteConsumerEvent = {
        Type: 'Deleting a consumer',
        ConsumerNumber: consumerNumber
      }
      await ctx.stub.setEvent('deleteConsumerEvent', Buffer.from(JSON.stringify(deleteConsumerEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // updateConsumerPersonalDetails
  // @params: consumerNumber, newName, newAge
  async updateConsumerPersonalDetails(ctx, consumerNumber, newName, newAge, newSex) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
      const exists = await this.consumerExist(ctx, consumerNumber);
      if (!exists) {
        throw new Error(`The Consumer ${consumerNumber} does not exist`);
      }

      const consumer = await this.readConsumer(ctx, consumerNumber);
      const rationCardDetails = await this.readRationCard(ctx, consumer['rationCardNumber']);

      if (consumer['isFamilyHead']) {
        if (newSex === 'Female') {
          if (parseInt(newAge) < 18) {
            const secondFamilyHead = await this.determineSecondFamilyHead(ctx, consumer['rationCardNumber']);
            console.log(secondFamilyHead);
            if (secondFamilyHead['isSecondFamilyHeadAvailable']) {
              if (
                (
                  secondFamilyHead['sex'] === 'Female' &&
                  parseInt(newAge) < secondFamilyHead['age']
                ) ||
                secondFamilyHead['sex'] === 'Male'
              ) {
                consumer['isFamilyHead'] = false;
                const secondFamilyHeadDetails = await this.readConsumer(ctx, secondFamilyHead['id']);
                secondFamilyHeadDetails['isFamilyHead'] = true;

                rationCardDetails['familyHead'] = secondFamilyHead['name'];
                rationCardDetails['familyHeadNumber'] = secondFamilyHead['id'];

                const secondFamilyHeadBuffer = Buffer.from(JSON.stringify(secondFamilyHeadDetails));
                await ctx.stub.putState(secondFamilyHead['id'], secondFamilyHeadBuffer);
              } else if (
                secondFamilyHead['sex'] === 'Female' &&
                parseInt(newAge) > secondFamilyHead['age']
              ) {
                rationCardDetails['familyHead'] = newName;
              }
            } else {
              rationCardDetails['familyHead'] = newName;
            }
          } else {
            rationCardDetails['familyHead'] = newName;
          }
        } else {
          const secondFamilyHead = await this.determineSecondFamilyHead(ctx, consumer['rationCardNumber']);
          if (parseInt(newAge) < secondFamilyHead['age']) {
            consumer['isFamilyHead'] = false;
            const secondFamilyHeadDetails = await this.readConsumer(ctx, secondFamilyHead['id']);
            secondFamilyHeadDetails['isFamilyHead'] = true;

            rationCardDetails['familyHead'] = secondFamilyHead['name'];
            rationCardDetails['familyHeadNumber'] = secondFamilyHead['id'];

            const secondFamilyHeadBuffer = Buffer.from(JSON.stringify(secondFamilyHeadDetails));
            await ctx.stub.putState(secondFamilyHead['id'], secondFamilyHeadBuffer);
          } else {
            rationCardDetails['familyHead'] = newName;
          }
        }
      } else {
        const currentFamilyHead = await this.determineFamilyHead(ctx, consumer['rationCardNumber']);

        let familyHeadStatus = false;
        if (
          currentFamilyHead['sex'] === 'Male' &&
          newSex === 'Female' &&
          parseInt(newAge) >= 18
        ) {
          familyHeadStatus = true;
        } else if (
          currentFamilyHead['sex'] === 'Male' &&
          newSex === 'Male' &&
          parseInt(newAge) > currentFamilyHead['age']
        ) {
          familyHeadStatus = true;
        } else if (
          currentFamilyHead['sex'] === 'Female' &&
          newSex === 'Female' &&
          parseInt(newAge) > currentFamilyHead['age']
        ) {
          familyHeadStatus = true;
        }

        if (familyHeadStatus) {
          const currentFamilyHeadDetails = await this.readConsumer(ctx, currentFamilyHead['id'])
          currentFamilyHeadDetails['isFamilyHead'] = false;

          rationCardDetails['familyHead'] = newName;
          rationCardDetails['familyHeadNumber'] = consumerNumber;

          const currentFamilyHeadBuffer = Buffer.from(JSON.stringify(currentFamilyHeadDetails));
          await ctx.stub.putState(currentFamilyHead['id'], currentFamilyHeadBuffer);
        }
        consumer['isFamilyHead'] = familyHeadStatus;
      }

      consumer['name'] = newName;
      consumer['age'] = parseInt(newAge);
      consumer['sex'] = newSex;

      const rationCardBuffer = Buffer.from(JSON.stringify(rationCardDetails));
      await ctx.stub.putState(consumer['rationCardNumber'], rationCardBuffer);

      const consumberBuffer = Buffer.from(JSON.stringify(consumer));
      await ctx.stub.putState(consumerNumber, consumberBuffer);

      let updateConsumerPersonalDetailsEvent = {
        Type: "Updating a consumer's personal details",
        ConsumerNumber: consumerNumber
      }
      await ctx.stub.setEvent('updateConsumerPersonalDetailsEvent', Buffer.from(JSON.stringify(updateConsumerPersonalDetailsEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // updateConsumerProfessionalDetails
  // @params: consumerNumber, newOccupation, newIndividualIncome
  async updateConsumerProfessionalDetails(
    ctx,
    consumerNumber,
    newOccupation,
    newIndividualIncome
  ) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'NodalOfficerMSP') {
      const exists = await this.consumerExist(ctx, consumerNumber);
      if (!exists) {
        throw new Error(`The Consumer ${consumerNumber} does not exist`);
      }

      const consumer = await this.readConsumer(ctx, consumerNumber);
      const rationCardDetails = await this.readRationCard(ctx, consumer['rationCardNumber']);
      const retailerDetails = await this.readRationRetailer(ctx, consumer['rationRetailerId']);

      const currentIndividualIncome = consumer['individualIncome'];
      const currentFamilyIncome = rationCardDetails['totalFamilyIncome'];
      const newFamilyIncome = currentFamilyIncome - currentIndividualIncome + parseFloat(newIndividualIncome);
      const familyMembers = rationCardDetails['totalFamilyMembers'];
      const typeChange = this.willTypeChangeOccure(currentFamilyIncome, newFamilyIncome, familyMembers, familyMembers);

      if (typeChange['changeOccure'] && typeChange['status'] === 'Change occures') {
        rationCardDetails['rationCardType'] = typeChange['type'];
        rationCardDetails['rationCardColour'] = typeChange['newColour'];

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

        switch (typeChange['newColour']) {
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
      consumer['individualIncome'] = parseFloat(newIndividualIncome);
      rationCardDetails['totalFamilyIncome'] = newFamilyIncome;

      const rationCardBuffer = Buffer.from(JSON.stringify(rationCardDetails));
      await ctx.stub.putState(consumer['rationCardNumber'], rationCardBuffer);

      const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
      await ctx.stub.putState(consumer['rationRetailerId'], retailerBuffer);

      const consumberBuffer = Buffer.from(JSON.stringify(consumer));
      await ctx.stub.putState(consumerNumber, consumberBuffer);

      let updateConsumerProfessionalDetailsEvent = {
        Type: "Updating a consumer's professional details",
        ConsumerNumber: consumerNumber
      }
      await ctx.stub.setEvent('updateConsumerProfessionalDetailsEvent', Buffer.from(JSON.stringify(updateConsumerProfessionalDetailsEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // shiftConsumerToAnotherFamily
  // @params: consumerNumber, newRationCardNumber
  async shiftConsumerToAnotherFamily(ctx, consumerNumber, newRationCardNumber) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'CommisionerMSP') {
      const consumerExists = await this.consumerExist(ctx, consumerNumber);
      if (!consumerExists) {
        throw new Error(`The Consumer ${consumerNumber} does not exist`);
      }

      const cardExists = await this.rationCardExist(ctx, newRationCardNumber);
      if (!cardExists) {
        throw new Error(`The Ration Card ${newRationCardNumber} does not exist`);
      }

      const consumer = await this.readConsumer(ctx, consumerNumber);
      const income = consumer['individualIncome'];

      const currentCardNumber = consumer['rationCardNumber'];
      if (currentCardNumber === newRationCardNumber) {
        throw new Error(`The new Ration Card ${newRationCardNumber} is same as the current one`);
      }

      const newFamily = await this.readRationCard(ctx, newRationCardNumber);
      const currentFamily = await this.readRationCard(ctx, currentCardNumber);

      if (consumer['rationRetailerId'] === newFamily['rationRetailerId']) {
        const retailerDetails = await this.readRationRetailer(ctx, consumer['rationRetailerId']);
        const typeChange1 =
          this.willTypeChangeOccure(
            currentFamily['totalFamilyIncome'],
            currentFamily['totalFamilyIncome'] - income,
            currentFamily['totalFamilyMembers'],
            currentFamily['totalFamilyMembers'] - 1
          );

        switch (typeChange1['oldColour']) {
          case 'Yellow':
            retailerDetails['yellowCardConsumers'] -= currentFamily['totalFamilyMembers'];
            retailerDetails['yellowCardFamilies']--;
            break;
          case 'Pink':
            retailerDetails['pinkCardConsumers'] -= currentFamily['totalFamilyMembers'];
            break;
          case 'Blue':
            retailerDetails['blueCardConsumers'] -= currentFamily['totalFamilyMembers'];
            break;
          case 'White':
            retailerDetails['whiteCardConsumers'] -= currentFamily['totalFamilyMembers'];
            break;
          default:
            break;
        }

        if (typeChange1['changeOccure'] && typeChange1['status'] === 'Change occures') {
          currentFamily['rationCardType'] = typeChange1['type'];
          currentFamily['rationCardColour'] = typeChange1['newColour'];

          switch (typeChange1['newColour']) {
            case 'Yellow':
              retailerDetails['yellowCardConsumers'] += (currentFamily['totalFamilyMembers'] - 1);
              retailerDetails['yellowCardFamilies']++;
              break;
            case 'Pink':
              retailerDetails['pinkCardConsumers'] += (currentFamily['totalFamilyMembers'] - 1);
              break;
            case 'Blue':
              retailerDetails['blueCardConsumers'] += (currentFamily['totalFamilyMembers'] - 1);
              break;
            case 'White':
              retailerDetails['whiteCardConsumers'] += (currentFamily['totalFamilyMembers'] - 1);
              break;
            default:
              break;
          }
        } else if (typeChange1['changeOccure'] && typeChange1['status'] === 'New Family Empty') {
          currentFamily['rationCardType'] = null;
          currentFamily['rationCardColour'] = null;
        } else if (!typeChange1['changeOccure']) {
          switch (currentFamily['rationCardColour']) {
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

        const typeChange2 =
          this.willTypeChangeOccure(
            newFamily['totalFamilyIncome'],
            newFamily['totalFamilyIncome'] + income,
            newFamily['totalFamilyMembers'],
            newFamily['totalFamilyMembers'] + 1
          )

        newFamily['rationCardType'] = typeChange2['type'];
        newFamily['rationCardColour'] = typeChange2['newColour'];
        if (typeChange2['changeOccure'] && typeChange2['status'] === 'Change occures') {
          switch (typeChange2['oldColour']) {
            case 'Yellow':
              retailerDetails['yellowCardConsumers'] -= newFamily['totalFamilyMembers'];
              retailerDetails['yellowCardFamilies']--;
              break;
            case 'Pink':
              retailerDetails['pinkCardConsumers'] -= newFamily['totalFamilyMembers'];
              break;
            case 'Blue':
              retailerDetails['blueCardConsumers'] -= newFamily['totalFamilyMembers'];
              break;
            case 'White':
              retailerDetails['whiteCardConsumers'] -= newFamily['totalFamilyMembers'];
              break;
            default:
              break;
          }
        } else if (!typeChange2['changeOccure']) {
          switch (newFamily['rationCardColour']) {
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

        switch (typeChange2['newColour']) {
          case 'Yellow':
            retailerDetails['yellowCardConsumers'] += (newFamily['totalFamilyMembers'] + 1);
            retailerDetails['yellowCardFamilies']++;
            break;
          case 'Pink':
            retailerDetails['pinkCardConsumers'] += (newFamily['totalFamilyMembers'] + 1);
            break;
          case 'Blue':
            retailerDetails['blueCardConsumers'] += (newFamily['totalFamilyMembers'] + 1);
            break;
          case 'White':
            retailerDetails['whiteCardConsumers'] += (newFamily['totalFamilyMembers'] + 1);
            break;
          default:
            break;
        }

        console.log(retailerDetails);

        const retailerBuffer = Buffer.from(JSON.stringify(retailerDetails));
        await ctx.stub.putState(consumer['rationRetailerId'], retailerBuffer);
      } else {
        const currentRetailerId = consumer['rationRetailerId']
        const currentRetailer = await this.readRationRetailer(ctx, currentRetailerId);
        const newRetailer = await this.readRationRetailer(ctx, newFamily['rationRetailerId']);

        const typeChange3 =
          this.willTypeChangeOccure(
            currentFamily['totalFamilyIncome'],
            currentFamily['totalFamilyIncome'] + income,
            currentFamily['totalFamilyMembers'],
            currentFamily['totalFamilyMembers'] - 1
          );

        switch (typeChange3['oldColour']) {
          case 'Yellow':
            currentRetailer['yellowCardConsumers'] -= currentFamily['totalFamilyMembers'];
            currentRetailer['yellowCardFamilies']--;
            break;
          case 'Pink':
            currentRetailer['pinkCardConsumers'] -= currentFamily['totalFamilyMembers'];
            break;
          case 'Blue':
            currentRetailer['blueCardConsumers'] -= currentFamily['totalFamilyMembers'];
            break;
          case 'White':
            currentRetailer['whiteCardConsumers'] -= currentFamily['totalFamilyMembers'];
            break;
          default:
            break;
        }

        if (typeChange3['changeOccure'] && typeChange3['status'] === 'Change occures') {
          currentFamily['rationCardType'] = typeChange3['type'];
          currentFamily['rationCardColour'] = typeChange3['newColour'];

          switch (typeChange3['newColour']) {
            case 'Yellow':
              currentRetailer['yellowCardConsumers'] += (currentFamily['totalFamilyMembers'] - 1);
              currentRetailer['yellowCardFamilies']++;
              break;
            case 'Pink':
              currentRetailer['pinkCardConsumers'] += (currentFamily['totalFamilyMembers'] - 1);
              break;
            case 'Blue':
              currentRetailer['blueCardConsumers'] += (currentFamily['totalFamilyMembers'] - 1);
              break;
            case 'White':
              currentRetailer['whiteCardConsumers'] += (currentFamily['totalFamilyMembers'] - 1);
              break;
            default:
              break;
          }
        } else if (typeChange3['changeOccure'] && typeChange3['status'] === 'New Family Empty') {
          currentFamily['rationCardType'] = null;
          currentFamily['rationCardColour'] = null;
        } else if (!typeChange3['changeOccure']) {
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

        console.log(currentRetailer);

        const currentRetailerBuffer = Buffer.from(JSON.stringify(currentRetailer));
        await ctx.stub.putState(currentRetailerId, currentRetailerBuffer);

        const typeChange4 =
          this.willTypeChangeOccure(
            newFamily['totalFamilyIncome'],
            newFamily['totalFamilyIncome'] + income,
            newFamily['totalFamilyMembers'],
            newFamily['totalFamilyMembers'] + 1
          )

        newFamily['rationCardType'] = typeChange4['type'];
        newFamily['rationCardColour'] = typeChange4['newColour'];
        if (typeChange4['changeOccure'] && typeChange4['status'] === 'Change occures') {
          switch (typeChange4['oldColour']) {
            case 'Yellow':
              newRetailer['yellowCardConsumers'] -= newFamily['totalFamilyMembers'];
              newRetailer['yellowCardFamilies']--;
              break;
            case 'Pink':
              newRetailer['pinkCardConsumers'] -= newFamily['totalFamilyMembers'];
              break;
            case 'Blue':
              newRetailer['blueCardConsumers'] -= newFamily['totalFamilyMembers'];
              break;
            case 'White':
              newRetailer['whiteCardConsumers'] -= newFamily['totalFamilyMembers'];
              break;
            default:
              break;
          }
        } else if (!typeChange4['changeOccure']) {
          switch (newFamily['rationCardColour']) {
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

        switch (typeChange4['newColour']) {
          case 'Yellow':
            newRetailer['yellowCardConsumers'] += (newFamily['totalFamilyMembers'] + 1);
            newRetailer['yellowCardFamilies']++;
            break;
          case 'Pink':
            newRetailer['pinkCardConsumers'] += (newFamily['totalFamilyMembers'] + 1);
            break;
          case 'Blue':
            newRetailer['blueCardConsumers'] += (newFamily['totalFamilyMembers'] + 1);
            break;
          case 'White':
            newRetailer['whiteCardConsumers'] += (newFamily['totalFamilyMembers'] + 1);
            break;
          default:
            break;
        }

        console.log(newRetailer)

        const newRetailerBuffer = Buffer.from(JSON.stringify(newRetailer));
        await ctx.stub.putState(newFamily['rationRetailerId'], newRetailerBuffer);
      }

      if (currentFamily['totalFamilyMembers'] === 1) {
        currentFamily['familyHead'] = null;
        currentFamily['familyHeadNumber'] = null;
        currentFamily['doesFamilyHeadAvailable'] = false;
      } else {
        if (consumer['isFamilyHead']) {
          const secondFamilyHeadDetails = await this.determineSecondFamilyHead(ctx, currentCardNumber);
          currentFamily['familyHead'] = secondFamilyHeadDetails['name'];
          currentFamily['familyHeadNumber'] = secondFamilyHeadDetails['id'];

          const newFamilyHead = await this.readConsumer(ctx, secondFamilyHeadDetails['id']);
          newFamilyHead['isFamilyHead'] = true;

          consumer['isFamilyHead'] = false;

          const newFamilyHeadBuffer = Buffer.from(JSON.stringify(newFamilyHead));
          await ctx.stub.putState(secondFamilyHeadDetails['id'], newFamilyHeadBuffer);
        }
      }

      currentFamily['totalFamilyMembers']--;
      currentFamily['totalFamilyIncome'] -= income;

      const currentFamilyBuffer = Buffer.from(JSON.stringify(currentFamily));
      await ctx.stub.putState(currentCardNumber, currentFamilyBuffer);

      if (newFamily['totalFamilyMembers'] === 0) {
        newFamily['familyHead'] = consumer['name'];
        newFamily['familyHeadNumber'] = consumerNumber;
        newFamily['doesFamilyHeadAvailable'] = true;
      } else {
        const familyHeadDetails = await this.determineFamilyHead(ctx, newRationCardNumber);
        let familyHeadStatus;
        if (familyHeadDetails['sex'] === 'Male') {
          if (consumer['sex'] === 'Female') {
            if (consumer['age'] >= 18) {
              familyHeadStatus = true;
            } else {
              familyHeadStatus = false;
            }
          } else {
            if (consumer['age'] > familyHeadDetails['age']) {
              familyHeadStatus = true;
            } else {
              familyHeadStatus = false;
            }
          }
        } else {
          if (consumer['sex'] === 'Female') {
            if (consumer['age'] > familyHeadDetails['age']) {
              familyHeadStatus = true;
            } else {
              familyHeadStatus = false;
            }
          } else {
            familyHeadStatus = false;
          }
        }
        if (familyHeadStatus) {
          const currentFamilyHead = await this.readConsumer(ctx, familyHeadDetails['id'])
          currentFamilyHead['isFamilyHead'] = false;

          newFamily['familyHead'] = consumer['name'];
          newFamily['familyHeadNumber'] = consumerNumber;

          const currentFamilyHeadBuffer = Buffer.from(JSON.stringify(currentFamilyHead));
          await ctx.stub.putState(familyHeadDetails['id'], currentFamilyHeadBuffer);
        }
        consumer['isFamilyHead'] = familyHeadStatus;
      }

      newFamily['totalFamilyMembers']++;
      newFamily['totalFamilyIncome'] += income;

      const newFamilyBuffer = Buffer.from(JSON.stringify(newFamily));
      await ctx.stub.putState(newRationCardNumber, newFamilyBuffer);

      consumer['rationCardNumber'] = newRationCardNumber;
      consumer['nodalOfficerId'] = newFamily['nodalOfficerId'];
      consumer['rationRetailerId'] = newFamily['rationRetailerId'];

      const consumberBuffer = Buffer.from(JSON.stringify(consumer));
      await ctx.stub.putState(consumerNumber, consumberBuffer);

      let shiftConsumerToAnotherFamilyEvent = {
        Type: 'Shifting one consumer to another family',
        ConsumerNumber: consumerNumber
      }
      await ctx.stub.setEvent('shiftConsumerToAnotherFamilyEvent', Buffer.from(JSON.stringify(shiftConsumerToAnotherFamilyEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'RationRetailerMSP') {
      const purchaseExist = await this.retailerPurchaseExist(ctx, retailerPurchaseNumber);
      if (purchaseExist) {
        throw new Error(`The Retailer Purchase ${retailerPurchaseNumber} already exist`);
      }

      const retailerExists = await this.rationRetailerExists(ctx, rationRetailerId);
      if (!retailerExists) {
        throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
      }

      const retailerDetails = await this.readRationRetailer(ctx, rationRetailerId);

      let consumers;
      switch (rationCardColour) {
        case 'Yellow':
          if (itemName === 'Sugar') {
            consumers = retailerDetails['yellowCardConsumers'];
          } else {
            consumers = retailerDetails['yellowCardFamilies'];
          }
          break;
        case 'Pink':
          consumers = retailerDetails['pinkCardConsumers'];
          break;
        case 'Blue':
          consumers = retailerDetails['blueCardConsumers'];
          break;
        case 'White':
          consumers = retailerDetails['whiteCardConsumers'];
          break;
        default:
          break;
      }

      if (consumers === 0) {
        throw new Error('The set of consumers for this order is empty');
      }

      let purchaseDetails = this.determinePurchaseDetails(rationCardColour, itemName, consumers);

      console.log(purchaseDetails);

      const asset = {
        retailerPurchaseNumber,
        nodalOfficerId: retailerDetails['nodalOfficerId'],
        rationRetailerId,
        rationCardColour,
        itemName,
        basicUnit: purchaseDetails['basicUnit'],
        isDistributedIndividually: purchaseDetails['isDistributedIndividually'],
        overallQuantity: purchaseDetails['overallQuantity'],
        individualQuantity: purchaseDetails['individualQuantity'],
        pricePerQuantity: purchaseDetails['pricePerQuantity'],
        totalQuantity: purchaseDetails['totalQuantity'],
        presentQuantity: purchaseDetails['totalQuantity'],
        purchaseDate: Date(Date.now()),
        dataType: 'Retailer Food Items Purchase',
        purchaseStatus: 'Retailer purchase initiated'
      }

      console.log(asset);

      const buffer = Buffer.from(JSON.stringify(asset));
      await ctx.stub.putState(retailerPurchaseNumber, buffer);

      let retailerFoodItemsPurchaseEvent = {
        Type: 'Ration retailer purchasing a food item for the distribution',
        RetailerPurchaseNumber: retailerPurchaseNumber
      }
      await ctx.stub.setEvent('retailerFoodItemsPurchaseEvent', Buffer.from(JSON.stringify(retailerFoodItemsPurchaseEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // makeRetailerKerosinePurchase
  // @params: retailerPurchaseNumber, rationRetailerId, rationCardColour, itemName
  async makeRetailerKerosinePurchase(ctx, retailerPurchaseNumber, rationRetailerId) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'RationRetailerMSP') {
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
        dataType: 'Retailer Kerosine Purchase',
        purchaseStatus: 'Retailer purchase initiated'
      }

      console.log(asset);

      const buffer = Buffer.from(JSON.stringify(asset));
      await ctx.stub.putState(retailerPurchaseNumber, buffer);

      let retailerKerosinePurchaseEvent = {
        Type: 'Ration retailer purchasing kerosine for the distribution',
        RetailerPurchaseNumber: retailerPurchaseNumber
      }
      await ctx.stub.setEvent('retailerKerosinePurchaseEvent', Buffer.from(JSON.stringify(retailerKerosinePurchaseEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
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
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'RationRetailerMSP') {
      const exists = await this.retailerPurchaseExist(ctx, retailerPurchaseNumber);
      if (!exists) {
        throw new Error(`The Retailer Purchase ${retailerPurchaseNumber} does not exist`);
      }

      await ctx.stub.deleteState(retailerPurchaseNumber);

      let deleteRetailerPurchaseEvent = {
        Type: 'Deleting ration retailer purchase record',
        RetailerPurchaseNumber: retailerPurchaseNumber
      }
      await ctx.stub.setEvent('deleteRetailerPurchaseEvent', Buffer.from(JSON.stringify(deleteRetailerPurchaseEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // consumerPurchaseExist
  // @param: consumerPurchaseNumber
  async consumerPurchaseExist(ctx, consumerPurchaseNumber) {
    const buffer = await ctx.stub.getState(consumerPurchaseNumber);
    return (!!buffer && buffer.length > 0);
  }

  // makeConsumerPurchase
  // @params: consumerPurchaseNumber, retailerPurchaseNumber, rationCardNumber
  async makeConsumerPurchase(
    ctx,
    consumerPurchaseNumber,
    retailerPurchaseNumber,
    rationCardNumber
  ) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'RationRetailerMSP') {
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

      if (retailerPurchase['rationRetailerId'] !== rationCard['rationRetailerId']) {
        throw new Error(`The Ration Card ${rationCardNumber} is not allowed to purchase using the Retailer Purchase ${retailerPurchaseNumber}.`)
      }

      if (retailerPurchase['purchaseStatus'] === 'Retailer purchase closed') {
        throw new Error(`The Consumer Purchase ${consumerPurchaseNumber} is closed.`);
      }

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
        rationCardNumber,
        nodalOfficerId: rationCard['nodalOfficerId'],
        rationRetailerId: rationCard['rationRetailerId'],
        itemName: retailerPurchase['itemName'],
        quantity,
        pricePerQuantity,
        price,
        purchaseDate: Date(Date.now()),
        dataType: 'Consumer Purchase'
      }

      console.log(asset);

      retailerPurchase['presentQuantity'] -= quantity;

      if (retailerPurchase['presentQuantity'] === 0) {
        retailerPurchase['purchaseStatus'] = 'Retailer purchase closed'
      }

      console.log(retailerPurchase);

      const retailerPurchaseBuffer = Buffer.from(JSON.stringify(retailerPurchase));
      await ctx.stub.putState(retailerPurchaseNumber, retailerPurchaseBuffer);

      const buffer = Buffer.from(JSON.stringify(asset));
      await ctx.stub.putState(consumerPurchaseNumber, buffer);

      let consumerPurchaseEvent = {
        Type: 'Consumer purchasing any item',
        ConsumerPurchaseNumber: consumerPurchaseNumber
      }
      await ctx.stub.setEvent('consumerPurchaseEvent', Buffer.from(JSON.stringify(consumerPurchaseEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // readConsumerPurchase
  // @param: consumerPurchaseNumber
  async readConsumerPurchase(ctx, consumerPurchaseNumber) {
    const exists = await this.consumerPurchaseExist(ctx, consumerPurchaseNumber);
    if (!exists) {
      throw new Error(`The Consumer Purchase ${consumerPurchaseNumber} does not exist`);
    }

    const buffer = await ctx.stub.getState(consumerPurchaseNumber);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  // deleteConsumerPurchase
  // @param: consumerPurchaseNumber
  async deleteConsumerPurchase(ctx, consumerPurchaseNumber) {
    let logger = shim.newLogger('Chaincode --> ');
    let CID = new shim.ClientIdentity(ctx.stub);
    let mspID = CID.getMSPID();
    logger.info('MSPID : ' + mspID);

    if (mspID === 'RationRetailerMSP') {
      const exists = await this.retailerPurchaseExist(ctx, consumerPurchaseNumber);
      if (!exists) {
        throw new Error(`The Retailer Purchase ${consumerPurchaseNumber} does not exist`);
      }

      await ctx.stub.deleteState(consumerPurchaseNumber);

      let deleteConsumerPurchaseEvent = {
        Type: 'Deleting ration retailer purchase record',
        ConsumerPurchaseNumber: consumerPurchaseNumber
      }
      await ctx.stub.setEvent('deleteConsumerPurchaseEvent', Buffer.from(JSON.stringify(deleteConsumerPurchaseEvent)));
    } else {
      logger.info('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
      return ('Users under the following MSP : ' +
        mspID + 'cannot perform this action');
    }
  }

  // getNodalOfficers
  async getNodalOfficers(ctx) {
    const queryString = {
      selector: {
        dataType: 'Nodal Officer',
      }
    }

    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let results = await this.getAllResults(resultsIterator, false);

    return JSON.stringify(results);
  }

  // getRationRetailers
  async getRationRetailers(ctx, nodalOfficerId) {
    const exists = await this.nodalOfficerExists(ctx, nodalOfficerId);
    if (!exists) {
      throw new Error(`The Nodal Officer ${nodalOfficerId} does not exist`);
    }

    const queryString = {
      selector: {
        nodalOfficerId: nodalOfficerId,
        dataType: 'Ration Retailer'
      }
    }

    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let results = await this.getAllResults(resultsIterator, false);

    return JSON.stringify(results);
  }

  // getRationCards
  async getRationCards(ctx, rationRetailerId) {
    const retailerExists = await this.rationRetailerExists(ctx, rationRetailerId);
    if (!retailerExists) {
      throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
    }

    const queryString = {
      selector: {
        rationRetailerId: rationRetailerId,
        dataType: 'Ration Card'
      }
    }

    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let results = await this.getAllResults(resultsIterator, false);

    return JSON.stringify(results);
  }

  // getFamilyMembers
  async getFamilyMembers(ctx, rationCardNumber) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const queryString = {
      selector: {
        rationCardNumber: rationCardNumber,
        dataType: 'Consumer Account'
      }
    }

    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let results = await this.getAllResults(resultsIterator, false);

    return JSON.stringify(results);
  }

  // getRetailerFoodItemsPurchases
  async getRetailerFoodItemsPurchases(ctx, rationRetailerId) {
    const retailerExists = await this.rationRetailerExists(ctx, rationRetailerId);
    if (!retailerExists) {
      throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
    }

    const queryString = {
      selector: {
        rationRetailerId: rationRetailerId,
        dataType: 'Retailer Food Items Purchase'
      }
    }

    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let results = await this.getAllResults(resultsIterator, false);

    return JSON.stringify(results);
  }

  // getRetailerKerosinePurchases
  async getRetailerKerosinePurchases(ctx, rationRetailerId) {
    const retailerExists = await this.rationRetailerExists(ctx, rationRetailerId);
    if (!retailerExists) {
      throw new Error(`The Ration Retailer ${rationRetailerId} does not exist`);
    }

    const queryString = {
      selector: {
        rationRetailerId: rationRetailerId,
        dataType: 'Retailer Kerosine Purchase'
      }
    }

    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let results = await this.getAllResults(resultsIterator, false);

    return JSON.stringify(results);
  }

  // getRetailerKerosinePurchases
  async getConsumerPurchases(ctx, rationCardNumber) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const queryString = {
      selector: {
        rationCardNumber: rationCardNumber,
        dataType: 'Consumer Purchase'
      }
    }

    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let results = await this.getAllResults(resultsIterator, false);

    return JSON.stringify(results);
  }

  // getAllResults
  async getAllResults(iterator, isHistory) {
    let allResults = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }

  // determineFamilyHead
  // @param: rationCardNumber
  async determineFamilyHead(ctx, rationCardNumber) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    let familyMembers = await this.getFamilyMembers(ctx, rationCardNumber);
    familyMembers = JSON.parse(familyMembers);
    console.log(typeof familyMembers, familyMembers.length);

    if (Array.isArray(familyMembers) && !familyMembers.length) {
      return { isFamilyHeadAvailable: false }
    }

    let name, age = 0, id;
    for (let i = 0; i < familyMembers.length; i++) {
      const familyMember = familyMembers[i];
      if (familyMember['Record']['sex'] === 'Female') {
        if (familyMember['Record']['age'] >= 18 && familyMember['Record']['age'] > age) {
          name = familyMember['Record']['name'];
          age = familyMember['Record']['age'];
          id = familyMember['Key'];
        }
      }
    }

    if (age !== 0) {
      return { isFamilyHeadAvailable: true, name, age, sex: 'Female', id };
    } else {
      for (let i = 0; i < familyMembers.length; i++) {
        const familyMember = familyMembers[i];
        if (familyMember['Record']['sex'] === 'Male') {
          if (familyMember['Record']['age'] > age) {
            name = familyMember['Record']['name'];
            age = familyMember['Record']['age'];
            id = familyMember['Key'];
          }
        }
      }
      return { isFamilyHeadAvailable: true, name, age, sex: 'Male', id };
    }
  }

  // determineSecondFamilyHead
  // @param: rationCardNumber
  async determineSecondFamilyHead(ctx, rationCardNumber) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    let familyMembers = await this.getFamilyMembers(ctx, rationCardNumber);
    familyMembers = JSON.parse(familyMembers);

    if (Array.isArray(familyMembers) && (!familyMembers.length || familyMembers.length === 1)) {
      return { isSecondFamilyHeadAvailable: false }
    }

    const familyHead = await this.determineFamilyHead(ctx, rationCardNumber);
    let name, age = 0, id;
    for (let i = 0; i < familyMembers.length; i++) {
      const familyMember = familyMembers[i];
      if (familyMember['Key'] !== familyHead['id']) {
        if (familyMember['Record']['sex'] === 'Female') {
          if (familyMember['Record']['age'] >= 18 && familyMember['Record']['age'] > age) {
            name = familyMember['Record']['name'];
            age = familyMember['Record']['age'];
            id = familyMember['Key'];
          }
        }
      }
    }

    if (age !== 0) {
      return { isSecondFamilyHeadAvailable: true, name, age, sex: 'Female', id };
    } else {
      for (let i = 0; i < familyMembers.length; i++) {
        const familyMember = familyMembers[i];
        if (familyMember['Key'] !== familyHead['id']) {
          if (familyMember['Record']['sex'] === 'Male') {
            if (familyMember['Record']['age'] > age) {
              name = familyMember['Record']['name'];
              age = familyMember['Record']['age'];
              id = familyMember['Key'];
            }
          }
        }
      }
      return { isSecondFamilyHeadAvailable: true, name, age, sex: 'Male', id };
    }
  }

  // getCurrentFamilyHead
  // @param: rationCardNumber
  async getCurrentFamilyHead(ctx, rationCardNumber) {
    const exists = await this.rationCardExist(ctx, rationCardNumber);
    if (!exists) {
      throw new Error(`The Ration Card ${rationCardNumber} does not exist`);
    }

    const rationCardDetails = await this.readRationCard(ctx, rationCardNumber);

    const familyHeadNumber = rationCardDetails['familyHeadNumber'];

    const familyHead = await this.readConsumer(ctx, familyHeadNumber);

    return familyHead;
  }

}

module.exports = CivilSuppliesNetworkContract;
