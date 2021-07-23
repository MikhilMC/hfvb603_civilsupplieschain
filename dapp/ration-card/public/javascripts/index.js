function validateReadRationCardForm() {
  let rationCardNumber = document.querySelector('#rationCardNumber1');

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  return validateTextBox(rationCardNumber.value);
}

function validateReadFamilyMembersForm() {
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

function validateReadConsumerPurchasesForm() {
  let rationCardNumber = document.querySelector('#rationCardNumber3');

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  return validateTextBox(rationCardNumber.value);
}

function validateTextBox(value) {
  if (value === '') {
    return false;
  } else {
    return true;
  }
}