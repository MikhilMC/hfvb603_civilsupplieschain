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
  console.log(rationCardColour.value);
  console.log(itemName.value);
  
  return validateTextBox(retailerPurchaseNumber.value) &&
    validateTextBox(rationRetailerId.value);
}


function validateTextBox(value) {
  if (value === '') {
    return false;
  } else {
    return true;
  }
}