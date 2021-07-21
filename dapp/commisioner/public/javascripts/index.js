function validateCreateNodalOfficerForm() {
  let nodalOfficerId = document.querySelector('#nodalOfficerId1');
  let district = document.querySelector('#district');
  let taluk = document.querySelector('#taluk');

  if (!validateTextBox(nodalOfficerId.value)) {
    nodalOfficerId.placeholder = 'Field can not be empty';
    nodalOfficerId.style.border ="1px solid red";
  } else {
    nodalOfficerId.style.border ="1px solid black";
    console.log(nodalOfficerId.value);
  }

  if (!validateTextBox(district.value)) {
    district.placeholder = 'Field can not be empty';
    district.style.border ="1px solid red";
  } else {
    district.style.border ="1px solid black";
    console.log(district.value);
  }

  if (!validateTextBox(taluk.value)) {
    taluk.placeholder = 'Field can not be empty';
    taluk.style.border ="1px solid red";
  } else {
    taluk.style.border ="1px solid black";
    console.log(taluk.value);
  }

  return validateTextBox(nodalOfficerId.value) && validateTextBox(district.value) && validateTextBox(taluk.value);
}

function validateReadNodalOfficerForm() {
  let nodalOfficerId = document.querySelector('#nodalOfficerId2');

  if (!validateTextBox(nodalOfficerId.value)) {
    nodalOfficerId.placeholder = 'Field can not be empty';
    nodalOfficerId.style.border ="1px solid red";
  } else {
    nodalOfficerId.style.border ="1px solid black";
    console.log(nodalOfficerId.value);
  }

  return validateTextBox(nodalOfficerId.value);
}

function validateCreateRationRetailerForm() {
  let rationRetailerId = document.querySelector('#rationRetailerId1');
  let nodalOfficerId = document.querySelector('#nodalOfficerId');
  let LSGBody = document.querySelector('#LSGBody');
  let wardNumber = document.querySelector('#wardNumber');

  if (!validateTextBox(rationRetailerId.value)) {
    rationRetailerId.placeholder = 'Field can not be empty';
    rationRetailerId.style.border ="1px solid red";
  } else {
    rationRetailerId.style.border ="1px solid black";
    console.log(nodalOfficerId.value);
  }

  if (!validateTextBox(nodalOfficerId.value)) {
    nodalOfficerId.placeholder = 'Field can not be empty';
    nodalOfficerId.style.border ="1px solid red";
  } else {
    nodalOfficerId.style.border ="1px solid black";
    console.log(nodalOfficerId.value);
  }

  if (!validateTextBox(LSGBody.value)) {
    LSGBody.placeholder = 'Field can not be empty';
    LSGBody.style.border ="1px solid red";
  } else {
    LSGBody.style.border ="1px solid black";
    console.log(LSGBody.value);
  }
  
  if (!validateTextBox(wardNumber.value)) {
    wardNumber.placeholder = 'Field can not be empty';
    wardNumber.style.border ="1px solid red";
  } else {
    wardNumber.style.border ="1px solid black";
    console.log(wardNumber.value);
  }

  return validateTextBox(rationRetailerId.value) && (nodalOfficerId.value) && validateTextBox(LSGBody.value) && validateTextBox(wardNumber.value);
}

function validateReadRationRetailerForm() {
  let rationRetailerId = document.querySelector('#rationRetailerId2');

  if (!validateTextBox(rationRetailerId.value)) {
    rationRetailerId.placeholder = 'Field can not be empty';
    rationRetailerId.style.border ="1px solid red";
  } else {
    rationRetailerId.style.border ="1px solid black";
    console.log(rationRetailerId.value);
  }

  return validateTextBox(rationRetailerId.value);
}

function validateShiftFamilyToAnotherTalukForm() {
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

function validateShiftConsumerToAnotherRationCardForm() {
  let consumerNumber = document.querySelector('#consumerNumber');
  let newRationRetailerId = document.querySelector('#newRationRetailerId');

  if (!validateTextBox(consumerNumber.value)) {
    consumerNumber.placeholder = 'Field can not be empty';
    consumerNumber.style.border ="1px solid red";
  } else {
    consumerNumber.style.border ="1px solid black";
    console.log(consumerNumber.value);
  }

  if (!validateTextBox(newRationRetailerId.value)) {
    newRationRetailerId.placeholder = 'Field can not be empty';
    newRationRetailerId.style.border ="1px solid red";
  } else {
    newRationRetailerId.style.border ="1px solid black";
    console.log(newRationRetailerId.value);
  }

  return validateTextBox(consumerNumber.value) && validateTextBox(newRationRetailerId.value);
}

function validateTextBox(value) {
  if (value === '') {
    return false;
  } else {
    return true;
  }
}