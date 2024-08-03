document.addEventListener("DOMContentLoaded", () => {
  const inputSlider = document.querySelector("[data-lengthSlider]");
  const lengthDisplay = document.querySelector("[data-lengthNumber]");
  const passwordDisplay = document.querySelector("[data-passwordDisplay]");
  const copyBtn = document.querySelector("[data-copy]");
  const copyMsg = document.querySelector("[data-copyMsg]");
  const uppercaseCheck = document.querySelector("#uppercase");
  const lowercaseCheck = document.querySelector("#lowercase");
  const numbersCheck = document.querySelector("#numbers");
  const symbolsCheck = document.querySelector("#symbols");
  const indicator = document.querySelector("[data-indicator]");
  const generateBtn = document.querySelector("#generateButton");
  const allCheckBox = document.querySelectorAll("input[type=checkbox]");

  const symbols = "!@#$%^&*()_+-=[]{}|;:'\",.<>/?`~";

  // password filed is empty at start
  let password = "";
  // password length is 10 by default at starting
  let passwordLength = 10 ;
  // it's for the no. of checks that are checked by default.
  let checkCount = 1;
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  handleSlider();

  setIndicator("#ccc");

  /*set strength circle color to grey.*/

  //  it's for setting the password length to default, that's 10.
  function handleSlider() {
        passwordLength = inputSlider.value;
        lengthDisplay.innerText = passwordLength;
            // it's for the slider scrolling coloring
        const min = inputSlider.min;
        const max = inputSlider.max;
        inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
  }

  function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `opx 0px 12px 1px ${color}`;
  }

  function getRandomInteger(min, max) {
    // Math.random() returns a random number between 0 (inclusive),  and 1 (exclusive).
    // it can be decimal number also
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function generateRandomNumber() {
    return getRandomInteger(0, 10);
  }

  function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
  }

  function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
  }

  function generateSymbols() {
    const randumNumber = getRandomInteger(0, symbols.length);
    return symbols.charAt(randumNumber);
  }

  function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
  }

  async function copyContent() {
    // try catch block is used because here we used the await function which is a asynchronous function and it returns the promise and promise can be rejected or fullfilled. So if error occurred it will be in catch block and innerText should be updated as "Failed".
    try {
      await navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText = "Copied";
    } catch (e) {
      copyMsg.innerText = "Failed";
    }
    // to make the copy text visible when the copy button i pressed
    copyMsg.classList.add("active");

    // this setimeout is used because the "copied" text should be invisible after 2 sec.
    setTimeout(() => {
      copyMsg.classList.remove("active");
    }, 2000);
  }

  // there is an algorithm to suffle the array known as the
  //Fisher Yates algorithm.

  function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    let str = "";
    array.forEach((element) => (str += element));
    return str;
  }

  function handleCheckboxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
      if (checkbox.checked) {
        checkCount++;
      }
    });

    if (passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
    }
  }

  allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });

  inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
  });

  copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
  });

  generateBtn.addEventListener("click", () => {
    // none of the checkbox is checked
    if (checkCount == 0) 
        return;

    if (passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
    }

    // let's start the journey to find the new password

    // first remove old password

    password = "";

    // password according to checkboxes

    // if(uppercaseCheck.Checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.Checked){
    //     password += generateLowerCase();
    // }

    // if(symbolsCheck.Checked){
    //     password += generateSymbols();
    // }

    // if(numbersCheck.Checked){
    //     password += generateRandomNumber();
    // }

    let functionArray = [];

    if (uppercaseCheck.checked) {
      functionArray.push(generateUpperCase);
    }

    if (lowercaseCheck.checked) {
      functionArray.push(generateLowerCase);
    }

    if (symbolsCheck.checked) {
      functionArray.push(generateSymbols);
    }

    if (numbersCheck.checked) {
      functionArray.push(generateRandomNumber);
    }

    // compulsory addition
    for (let i = 0; i < functionArray.length; i++) {
      
      // functionArray[i] refers to the function stored at index i in the array. By adding (), you are calling that function.
      // Storing Functions: When a checkbox is checked, the corresponding function (such as generateUpperCase) is added to functionArray. This means functionArray contains references to functions.
      // Calling Functions: Inside the for loop, functionArray[i] gets the function at position i. The () at the end calls this function.

      password += functionArray[i]();
    }

    // remaining addition
    for (let i = 0; i < passwordLength - functionArray.length; i++) {
      let randIndex = getRandomInteger(0, functionArray.length);
      password += functionArray[randIndex]();
    }

    // shuffle the password b/c the password generated here is of in checkbox checked order

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    // now calculate the strength of the password whether it's weak, normal or strong.
    calculateStrength();
  });
});
