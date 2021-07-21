function validateCreateRationCardForm() {
  let rationCardNumber = document.querySelector('#rationCardNumber1');
  let rationRetailerId = document.querySelector('#rationRetailerId');
  let houseNumber = document.querySelector('#houseNumber');
  let mobileNumber = document.querySelector('#mobileNumber');
  let electricity1 = document.querySelector('#electricity1');
  let electricity2 = document.querySelector('#electricity2');

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  if (!validateTextBox(rationRetailerId.value)) {
    rationRetailerId.placeholder = 'Field can not be empty';
    rationRetailerId.style.border ="1px solid red";
  } else {
    rationRetailerId.style.border ="1px solid black";
    console.log(rationRetailerId.value);
  }

  if (!validateTextBox(houseNumber.value)) {
    houseNumber.placeholder = 'Field can not be empty';
    houseNumber.style.border ="1px solid red";
  } else {
    houseNumber.style.border ="1px solid black";
    console.log(houseNumber.value);
  }

  if (!validateTextBox(mobileNumber.value)) {
    mobileNumber.placeholder = 'Field can not be empty';
    mobileNumber.style.border ="1px solid red";
  } else {
    mobileNumber.style.border ="1px solid black";
    console.log(mobileNumber.value);
  }

  if (!(electricity1.checked || electricity2.checked)) {
    alert('Please select the electricity connection status!!!');
    return false;
  } else {
    if (electricity1.checked === true) {
      console.log('yes');
    } else {
      console.log('no');
    }
  }

  return validateTextBox(rationCardNumber.value) &&
    validateTextBox(rationRetailerId.value) &&
    validateTextBox(houseNumber.value) &&
    validateTextBox(houseNumber.value) &&
    (electricity1.checked || electricity2.checked);
}

function validateReadRationCardForm() {
  let rationCardNumber = document.querySelector('#rationCardNumber2');

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  return validateTextBox(rationCardNumber.value);
}

function validateDeleteRationCardForm() {
  let rationCardNumber = document.querySelector('#rationCardNumber');

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  return validateTextBox(rationCardNumber.value);
}

function validateShiftFamilyInSameWardForm() {
  let rationCardNumber = document.querySelector('#rationCardNumber');
  let newHouseNumber = document.querySelector('#newHouseNumber');
  let newElectricity1 = document.querySelector('#newElectricity1');
  let newElectricity2 = document.querySelector('#newElectricity2');

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  if (!validateTextBox(newHouseNumber.value)) {
    newHouseNumber.placeholder = 'Field can not be empty';
    newHouseNumber.style.border ="1px solid red";
  } else {
    newHouseNumber.style.border ="1px solid black";
    console.log(newHouseNumber.value);
  }

  if (!(newElectricity1.checked || newElectricity2.checked)) {
    alert('Please select the electricity connection status!!!');
    return false;
  } else {
    if (newElectricity1.checked === true) {
      console.log('yes');
    } else {
      console.log('no');
    }
  }

  return validateTextBox(rationCardNumber.value) &&
    validateTextBox(newHouseNumber.value) &&
    (electricity1.checked || electricity2.checked);
}

function validateShiftFamilyInSameLSGBodyForm() {
  let rationCardNumber = document.querySelector('#rationCardNumber');
  let newHouseNumber = document.querySelector('#newHouseNumber');
  let newRationRetailerId = document.querySelector('#newRationRetailerId');
  let newElectricity1 = document.querySelector('#newElectricity1');
  let newElectricity2 = document.querySelector('#newElectricity2');

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  if (!validateTextBox(newHouseNumber.value)) {
    newHouseNumber.placeholder = 'Field can not be empty';
    newHouseNumber.style.border ="1px solid red";
  } else {
    newHouseNumber.style.border ="1px solid black";
    console.log(newHouseNumber.value);
  }

  if (!validateTextBox(newRationRetailerId.value)) {
    newRationRetailerId.placeholder = 'Field can not be empty';
    newRationRetailerId.style.border ="1px solid red";
  } else {
    newRationRetailerId.style.border ="1px solid black";
    console.log(newRationRetailerId.value);
  }

  if (!(newElectricity1.checked || newElectricity2.checked)) {
    alert('Please select the electricity connection status!!!');
    return false;
  } else {
    if (newElectricity1.checked === true) {
      console.log('yes');
    } else {
      console.log('no');
    }
  }

  return validateTextBox(rationCardNumber.value) &&
    validateTextBox(newHouseNumber.value) &&
    validateTextBox(newRationRetailerId.value) &&
    (newElectricity1.checked || newElectricity2.checked);
}

function validateChangeMobileNumberForm() {
  let rationCardNumber = document.querySelector('#rationCardNumber');
  let newMobileNumber = document.querySelector('#newMobileNumber');

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  if (!validateTextBox(newMobileNumber.value)) {
    newMobileNumber.placeholder = 'Field can not be empty';
    newMobileNumber.style.border ="1px solid red";
  } else {
    newMobileNumber.style.border ="1px solid black";
    console.log(newMobileNumber.value);
  }

  return validateTextBox(rationCardNumber.value) &&
    validateTextBox(newMobileNumber.value)
}

function validateChangeElectricityConnectionForm() {
  let rationCardNumber = document.querySelector('#rationCardNumber');

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  return validateTextBox(rationCardNumber.value)
}

function validateAddNewConsumerForm() {
  let consumerNumber = document.querySelector('#consumerNumber1');
  let rationCardNumber = document.querySelector('#rationCardNumber');
  let name = document.querySelector('#name');
  let age = document.querySelector('#age');
  let sex1 = document.querySelector('#sex1');
  let sex2 = document.querySelector('#sex2');
  let occupation = document.querySelector('#occupation');
  let individualIncome = document.querySelector('#individualIncome');

  if (!validateTextBox(consumerNumber.value)) {
    consumerNumber.placeholder = 'Field can not be empty';
    consumerNumber.style.border ="1px solid red";
  } else {
    consumerNumber.style.border ="1px solid black";
    console.log(consumerNumber.value);
  }

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  if (!validateTextBox(name.value)) {
    name.placeholder = 'Field can not be empty';
    name.style.border ="1px solid red";
  } else {
    name.style.border ="1px solid black";
    console.log(name.value);
  }

  if (!validateTextBox(age.value)) {
    age.placeholder = 'Field can not be empty';
    age.style.border ="1px solid red";
  } else {
    age.style.border ="1px solid black";
    console.log(age.value);
  }

  if (!validateTextBox(occupation.value)) {
    occupation.placeholder = 'Field can not be empty';
    occupation.style.border ="1px solid red";
  } else {
    occupation.style.border ="1px solid black";
    console.log(occupation.value);
  }

  if (!validateTextBox(individualIncome.value)) {
    individualIncome.placeholder = 'Field can not be empty';
    individualIncome.style.border ="1px solid red";
  } else {
    individualIncome.style.border ="1px solid black";
    console.log(individualIncome.value);
  }

  if (!(sex1.checked || sex2.checked)) {
    alert('Please select the sex!!!');
    return false;
  } else {
    if (sex1.checked === true) {
      console.log('Male');
    } else {
      console.log('Female');
    }
  }

  return validateTextBox(consumerNumber.value) &&
    validateTextBox(rationCardNumber.value) &&
    validateTextBox(name.value) &&
    validateTextBox(age.value) &&
    (sex1.checked || sex2.checked) &&
    validateTextBox(occupation.value) &&
    validateTextBox(individualIncome.value);
}

function validateReadConsumerForm() {
  let consumerNumber = document.querySelector('#consumerNumber2');

  if (!validateTextBox(consumerNumber.value)) {
    consumerNumber.placeholder = 'Field can not be empty';
    consumerNumber.style.border ="1px solid red";
  } else {
    consumerNumber.style.border ="1px solid black";
    console.log(consumerNumber.value);
  }

  return validateTextBox(consumerNumber.value);
}

function validateDeleteConsumerForm() {
  let consumerNumber = document.querySelector('#consumerNumber');

  if (!validateTextBox(consumerNumber.value)) {
    consumerNumber.placeholder = 'Field can not be empty';
    consumerNumber.style.border ="1px solid red";
  } else {
    consumerNumber.style.border ="1px solid black";
    console.log(consumerNumber.value);
  }

  return validateTextBox(consumerNumber.value);
}

function validateUpdatePersonalDetailsForm() {
  let consumerNumber = document.querySelector('#consumerNumber');
  let newName = document.querySelector('#newName');
  let newAge = document.querySelector('#newAge');
  let newSex1 = document.querySelector('#newSex1');
  let newSex2 = document.querySelector('#newSex2');

  if (!validateTextBox(consumerNumber.value)) {
    consumerNumber.placeholder = 'Field can not be empty';
    consumerNumber.style.border ="1px solid red";
  } else {
    consumerNumber.style.border ="1px solid black";
    console.log(consumerNumber.value);
  }

  if (!validateTextBox(newName.value)) {
    newName.placeholder = 'Field can not be empty';
    newName.style.border ="1px solid red";
  } else {
    newName.style.border ="1px solid black";
    console.log(newName.value);
  }

  if (!validateTextBox(newAge.value)) {
    newAge.placeholder = 'Field can not be empty';
    newAge.style.border ="1px solid red";
  } else {
    newAge.style.border ="1px solid black";
    console.log(newAge.value);
  }

  if (!(newSex1.checked || newSex2.checked)) {
    alert('Please select the sex!!!');
    return false;
  } else {
    if (newSex1.checked === true) {
      console.log('Male');
    } else {
      console.log('Female');
    }
  }

  return validateTextBox(consumerNumber.value) &&
    validateTextBox(newName.value) &&
    validateTextBox(newAge.value) &&
    (newSex1.checked || newSex2.checked);
}

function validateUpdateProfessionalDetailsForm() {
  let consumerNumber = document.querySelector('#consumerNumber');
  let newOccupation = document.querySelector('#newOccupation');
  let newIndividualIncome = document.querySelector('#newIndividualIncome');

  if (!validateTextBox(consumerNumber.value)) {
    consumerNumber.placeholder = 'Field can not be empty';
    consumerNumber.style.border ="1px solid red";
  } else {
    consumerNumber.style.border ="1px solid black";
    console.log(consumerNumber.value);
  }

  if (!validateTextBox(newOccupation.value)) {
    newOccupation.placeholder = 'Field can not be empty';
    newOccupation.style.border ="1px solid red";
  } else {
    newOccupation.style.border ="1px solid black";
    console.log(newOccupation.value);
  }

  if (!validateTextBox(newIndividualIncome.value)) {
    newIndividualIncome.placeholder = 'Field can not be empty';
    newIndividualIncome.style.border ="1px solid red";
  } else {
    newIndividualIncome.style.border ="1px solid black";
    console.log(newIndividualIncome.value);
  }

  return validateTextBox(consumerNumber.value) &&
    validateTextBox(newOccupation.value) &&
    validateTextBox(newIndividualIncome.value);
}

function validateTextBox(value) {
  if (value === '') {
    return false;
  } else {
    return true;
  }
}