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
    nodalOfficerId.style.border ="1px solid black";
    console.log(district.value);
  }

  if (!validateTextBox(taluk.value)) {
    taluk.placeholder = 'Field can not be empty';
    taluk.style.border ="1px solid red";
  } else {
    nodalOfficerId.style.border ="1px solid black";
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

function validateTextBox(value) {
  if (value === '') {
    return false;
  } else {
    return true;
  }
}