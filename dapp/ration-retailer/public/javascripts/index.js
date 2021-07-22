function validateMakeRetailerFoodPurchaseForm() {
  let retailerPurchaseNumber = document.querySelector('#retailerPurchaseNumber1');
  let rationRetailerId = document.querySelector('#rationRetailerId');
  let rationCardColour = document.querySelector('#rationCardColour');
  let itemName = document.querySelector('#itemName');

  if (!validateTextBox(retailerPurchaseNumber.value)) {
    retailerPurchaseNumber.placeholder = 'Field can not be empty';
    retailerPurchaseNumber.style.border ="1px solid red";
  } else {
    retailerPurchaseNumber.style.border ="1px solid black";
    console.log(retailerPurchaseNumber.value);
  }

  if (!validateTextBox(rationRetailerId.value)) {
    rationRetailerId.placeholder = 'Field can not be empty';
    rationRetailerId.style.border ="1px solid red";
  } else {
    rationRetailerId.style.border ="1px solid black";
    console.log(rationRetailerId.value);
  }

  if (rationCardColour.value === 'Select Ration Card Colour') {
    alert('Please select any valid ration card colour option');
    return false;
  } else {
    console.log(rationCardColour.value);
  }

  if (itemName.value === 'Select Item Name') {
    alert('Please select any valid food item name option');
    return false;
  } else {
    console.log(itemName.value);
  }
  
  return validateTextBox(retailerPurchaseNumber.value) &&
    validateTextBox(rationRetailerId.value) &&
    rationCardColour.value !== 'Select Ration Card Colour' &&
    itemName.value !== 'Select Item Name';
}

function validateReadRetailerPurchase() {
  let retailerPurchaseNumber = document.querySelector('#retailerPurchaseNumber2');

  if (!validateTextBox(retailerPurchaseNumber.value)) {
    retailerPurchaseNumber.placeholder = 'Field can not be empty';
    retailerPurchaseNumber.style.border ="1px solid red";
  } else {
    retailerPurchaseNumber.style.border ="1px solid black";
    console.log(retailerPurchaseNumber.value);
  }

  return validateTextBox(retailerPurchaseNumber.value)
}

function validateMakeRetailerKerosinePurchaseForm() {
  let retailerPurchaseNumber = document.querySelector('#retailerPurchaseNumber');
  let rationRetailerId = document.querySelector('#rationRetailerId');

  if (!validateTextBox(retailerPurchaseNumber.value)) {
    retailerPurchaseNumber.placeholder = 'Field can not be empty';
    retailerPurchaseNumber.style.border ="1px solid red";
  } else {
    retailerPurchaseNumber.style.border ="1px solid black";
    console.log(retailerPurchaseNumber.value);
  }

  if (!validateTextBox(rationRetailerId.value)) {
    rationRetailerId.placeholder = 'Field can not be empty';
    rationRetailerId.style.border ="1px solid red";
  } else {
    rationRetailerId.style.border ="1px solid black";
    console.log(rationRetailerId.value);
  }

  return validateTextBox(retailerPurchaseNumber.value) &&
    validateTextBox(rationRetailerId.value);
}

function validateMakeConsumerPurchaseForm() {
  let consumerPurchaseNumber = document.querySelector('#consumerPurchaseNumber1');
  let retailerPurchaseNumber = document.querySelector('#retailerPurchaseNumber');
  let rationCardNumber = document.querySelector('#rationCardNumber');

  if (!validateTextBox(consumerPurchaseNumber.value)) {
    consumerPurchaseNumber.placeholder = 'Field can not be empty';
    consumerPurchaseNumber.style.border ="1px solid red";
  } else {
    consumerPurchaseNumber.style.border ="1px solid black";
    console.log(consumerPurchaseNumber.value);
  }

  if (!validateTextBox(retailerPurchaseNumber.value)) {
    retailerPurchaseNumber.placeholder = 'Field can not be empty';
    retailerPurchaseNumber.style.border ="1px solid red";
  } else {
    retailerPurchaseNumber.style.border ="1px solid black";
    console.log(retailerPurchaseNumber.value);
  }

  if (!validateTextBox(rationCardNumber.value)) {
    rationCardNumber.placeholder = 'Field can not be empty';
    rationCardNumber.style.border ="1px solid red";
  } else {
    rationCardNumber.style.border ="1px solid black";
    console.log(rationCardNumber.value);
  }

  return validateTextBox(consumerPurchaseNumber.value) &&
    validateTextBox(retailerPurchaseNumber.value) &&
    validateTextBox(rationCardNumber.value);
}

function validateReadConsumerPurchase() {
  let consumerPurchaseNumber = document.querySelector('#consumerPurchaseNumber2');

  if (!validateTextBox(consumerPurchaseNumber.value)) {
    consumerPurchaseNumber.placeholder = 'Field can not be empty';
    consumerPurchaseNumber.style.border ="1px solid red";
  } else {
    consumerPurchaseNumber.style.border ="1px solid black";
    console.log(consumerPurchaseNumber.value);
  }

  return validateTextBox(consumerPurchaseNumber.value)
}


function validateTextBox(value) {
  if (value === '') {
    return false;
  } else {
    return true;
  }
}