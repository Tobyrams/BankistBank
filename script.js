'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APPS

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-12-15T10:00:51.364Z',
    '2023-12-18T10:00:51.364Z',
    '2023-12-19T10:00:51.364Z',
  ],
  currency: 'ZAR',
  locale: 'zu', //zulu
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2023-12-18T18:49:59.371Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Username// =========================================================================
// Function that modifies each account in the 'accounts' array by adding a 'username' property.
const createUsernames = function (accounts) {
  // Iterate over each account in the 'accounts' array.
  accounts.forEach(function (account) {
    // Generate a 'username' based on the 'owner' property of the account.
    account.username = account.owner
      .toLowerCase() // Convert the 'owner' name to lowercase.
      .split(' ') // Split the 'owner' name into an array of words.
      .map(name => name[0]) // Map each word to its first character (initial).
      .join(''); // Join the initials to form the 'username' with no spaces.
  });
};
createUsernames(accounts);
// console.log(accounts); // To view the new 'username' field

// DISPLAY Movements // =========================================================================
const formatMovementDate = function (date, locale) {
  //This is to calculate the days passed
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    //The movement date
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();

    return new Intl.DateTimeFormat(locale).format(date); //api for the date
  }
};

//Format currency funcion ======================
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  //    Sorting  the array    //
  // if (sort = true) then(?) We create a copy of the array with slice() then we sort()1  it in accending order
  // else(:) if sort is false we then display the movements in the normal order
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  //Clearing the html before we display our values
  containerMovements.innerHTML = '';

  movs.forEach(function (mov, i) {
    //This is to test if a mov is a deposit or withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, currentAccount.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    //Adding the movements to the HTML
    const html = `
    
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Account balance // =========================================================================
const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0
  );
  // Create a new property called balance
  account.balance = balance;
  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};

// Display Summary // =========================================================================
const calcDisplaySummary = function (account) {
  const deposit = account.movements
    //Filtering the movments array to only be positive values
    .filter(movements => movements > 0)
    //Sums up all the positive values together
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = formatCur(deposit, account.locale, account.currency);

  `${deposit.toFixed(2)}€`;

  const withdrawal = account.movements
    .filter(movements => movements < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(withdrawal),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter(movements => movements > 0)
    .map(mov => (mov * account.interestRate) / 100) // creates a new array of the positive values only
    .filter((interest, i, arr) => {
      // returns interest rates that are only greater than one
      // console.log(arr); //Displays all the interest (it'll show 5 times as that how many time the array loops for)
      return interest >= 1;
    })
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency
  );
};

//Updae UI// =========================================================================
const updateUI = account => {
  //Display movements
  displayMovements(account);
  //Display balance
  calcDisplayBalance(account);
  //Display summary
  calcDisplaySummary(account);
};

// Login // =========================================================================
//Event Handler
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  //Prevents form from submitting
  e.preventDefault();
  //Getting the current account user
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  //Check to see if the entered pin matches the one in the object
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Good Morining, ${
      currentAccount.owner.split(' ')[0]
    } `;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Create current date
    //api login
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };
    // getting the users language from their browser
    // const locale = navigator.language; // en-US
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Timer
    //if a timer exisits another users timer when a new user logsin then cancel the timer
    if (timer) clearInterval(timer);
    //if there is no other timer running then start a new one
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

// Transfer Money // =========================================================================
btnTransfer.addEventListener('click', function (e) {
  //Prevents form from submitting
  e.preventDefault();
  //The amount the current user is transfering
  const amount = Number(inputTransferAmount.value);
  // The account they are sending the money to
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //Validation check (to test if the current user has the funds to transfer)
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc.username !== currentAccount.username
  ) {
    //Add NEGATIVE to the current user
    currentAccount.movements.push(-amount);

    //Add POSITIVE to the recipent user
    recieverAcc.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    //Display movements, Display balance, Display summary
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    //Reset input fields
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();
  }
});

// Requerst Loan // =========================================================================
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  //Account must be greter than 0 and user needs to have at least 10%
  //of the request loan amount. eg 600 000 * 10% = 60 000
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // the timeout for when the loan is requested
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //reset timer
      clearInterval(timer);
      timer = startLogOutTimer();

      //Update UI
      updateUI(currentAccount);
    }, 2500);

    //Reset input fields
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});
// Close Account // =========================================================================
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //Deleting the current account using Splice
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    accounts.splice(index, 1);

    // Hiding the UI
    containerApp.style.opacity = 0;
    //Reset input fields
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();
    labelWelcome.textContent = 'Log in to get started';
  }
});

// SORT BUTTON // =========================================================================
// Variable to keep track of the sorting order (initially set to false for ascending order).
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted); //!sorted changes the boolean vallue to (true) which sortes the movements
  sorted = !sorted; // we update the variable to be true so when we click it again is then flips it to (false) unsorted
});

// Logout Timer // =========================================================================
const startLogOutTimer = function () {
  //This is so that the timer is call immediatley when the user is logged in and not wait a second
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //in each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // decrease 1s every second
    time--;
  };
  //set time to 5 minutes
  let time = 120;
  //call the timer every second
  const timer = setInterval(tick, 1000);
  return timer;
};

// Fake always login // =========================================================================
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//#region Converting and Checking Numbers ////////////////////////////////////////////////////
/*/


console.log(23 === 23.0);

//  Coercion  //TODO
console.log('Coercion:');
//Converting a string to a number
console.log(Number('23'));
//Or (+) as this uses explicit type coercion to convert the string to a Number
console.log(+'23');

//  Parsing   //TODO
// Parsing is usefule for when we want to get a number from css for example
// but we only want the integer value e.g. 50kg or 60cm
console.log('Parsing:');
console.log(Number.parseInt('30px'));
console.log(Number.parseInt('178cm'));
//NOTE: the value needs to start with an integer or is will retrun NaN
console.log(Number.parseInt('e23'));

//Float reads the decimal number
console.log(Number.parseFloat('2.5rem'));
//.parseInt only take the number before the decimal
console.log(Number.parseInt('2.5rem'));

//Checking if something is a numbe  //TODO
//  .isFinite() is the best way to check if something is a number
console.log('Number checking:');
console.log(Number.isFinite(20)); // true
console.log(Number.isFinite('20')); // false
console.log(Number.isFinite(+'20X')); // returns: NaN therfore its false


//*/
//#endregion

//#region Math and Rounding ////////////////////////////////////////////////////
/*/


//Square root   Math.sqrt()   //TODO
console.log('Square root: ');
console.log(Math.sqrt(25));
console.log(Math.sqrt(100));

// Max Number   Math.max()    //TODO
console.log('Max Number: ');
console.log(Math.max(5, 18, 25, 11, 23));
// max does type coercion
console.log(Math.max(5, 18, 25, '11', 23));
// doesn't do parsing
console.log(Math.max(5, 18, 25, '11cm', 23));

//  Generating a random number  //TODO
console.log('Random Number: ');
console.log(Math.trunc(Math.random() * 6) + 1);

// using functions to make it easier
const randomInt = (max, min) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

console.log(randomInt(10, 35));

// Rounding integers  (all these methods so type coersion)//TODO
console.log('Rounding Integers:');
//Remvoes decimal values Math.trunc()
console.log(Math.trunc(25.78)); //25
//Rounds to the nearest Integer   Math.round()
console.log(Math.round(25.58)); //26
console.log(Math.round(25.48)); //25
//Rounds up to the nearest int Math.ceil()
console.log(Math.ceil(25.78)); //26
//Rounds down to the nearest int Math.floor()
console.log(Math.floor(25.78)); //25

//  Rounding decmials (number).toFixed(numOfDecimals)   //TODO
console.log('Rounding Decimals:');
// .toFixed() always returnds a string and NOT a number
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.7).toFixed(10));
console.log((2.7456).toFixed(2));
//To convert it to number we'll use type conversion +
console.log(+(2.7456).toFixed(2));


//*/
//#endregion

//#region The Remainder Operator ////////////////////////////////////////////////////
/*/

console.log(5 % 2); // 1
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3); // 2
console.log(8 / 3); // 8 = 2 * 3 + 2

// Even numbers
console.log('Even Number Checker:');
// numbers are even if they are divided by 2 and return 0
const isEven = num => num % 2 === 0;
console.log(isEven(5));
console.log(isEven(25));
console.log(isEven(10));
console.log(isEven(256));
console.log(isEven(0));


//*/
//#endregion

//#region Numberic seperator  ////////////////////////////////////////////////////
/*/


//We use this to tell ourself and other developers what a big number means

const diameter = 287_460_000_000;
//We don't see the underscores(_) in the output which is good as we are
//using these underscores to better understand the large number.
console.log(diameter); //287460000000

//this will ont work when converting from string to number
//so only use this one numbers and not when converting
console.log(Number('230_000'));


//*/
//#endregion

//#region BIGINT  ////////////////////////////////////////////////////
/*/


//Biggest number in javascript
console.log(Number.MAX_SAFE_INTEGER);

console.log(4838430248342043823408394839483204n);
console.log(BigInt(48384302));

// Operations
console.log('Operations: ');
console.log(10000n + 10000n);
console.log(36286372637263726376237263726372632n * 10000000n);
//Math operations don't work on bigInt
// console.log(Math.sqrt(16n));

const huge = 20289830237283728378237n;
const num = 23;
console.log(huge * BigInt(num));

// Exceptions
console.log('Exceptions: ');
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');

console.log(huge + ' is REALLY big!!!');

// Divisions
console.log('Divisions:');
console.log(11n / 3n);
console.log(10 / 3);


//*/
//#endregion

//#region Dates ////////////////////////////////////////////////////
/*/

//    Creating a date   //TODO
// Ways of creating a date

const now = new Date();
console.log(now);

console.log(new Date('Aug 02 2022 18:05:41'));
console.log(new Date(account1.movementsDates[0]));

//Time passes since the creation of Unix Time
console.log(new Date(0));

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
//This is the year of the date
console.log(future.getFullYear()); // 2037
//This is the month
console.log(future.getMonth()); // 10 (p.s. Months are zero based in javascript so it's actually month 11(nov))
//This is the Day
console.log(future.getDate()); // 19
// This is the day of the week
console.log(future.getDay()); // 4 (Thursday)
console.log(future.getHours()); // 15
console.log(future.getMinutes()); // 23
console.log(future.getSeconds()); // 0
//Nicely formated string
console.log(future.toISOString());
//time stamp is the miliseconds that have passing since jan 1970
console.log(future.getTime());
console.log(new Date(2142256980000));
//To get the timestamp for the current moment
console.log(Date.now());

// there are also set methods
future.setFullYear(2049);
console.log(future);

//*/
//#endregion

//#region Operations With Dates ////////////////////////////////////////////////////
/*/


Date(year, month(zeroIndexed), date=day, hours, minutes, seconds)
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);

//Converting the date to miliseconds(ingeter/Number)
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1, 'Days Passed');
console.log(new Date().toISOString());

//*/
//#endregion

//#region Internationalizing Dates (Intl) API ////////////////////////////////////////////////////
/*/

const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'short',
};

console.log(new Intl.DateTimeFormat('en', options).format(now)); //english
console.log(new Intl.DateTimeFormat('zu', options).format(now)); //Zulu
console.log(new Intl.DateTimeFormat('pt', options).format(now)); //portuguese

//*/
//#endregion

//#region Internationalizing Numbers (Intl) API ////////////////////////////////////////////////////
/*/

const num = 3884764.23;

console.log('US:\t\t\t', new Intl.NumberFormat('en-US').format(num));
console.log('Japan:\t\t', new Intl.NumberFormat('ja-JP').format(num));
console.log('India:\t\t', new Intl.NumberFormat('en-IN').format(num));
console.log('Germany:\t', new Intl.NumberFormat('de-DE').format(num));
console.log('SA:\t\t\t', new Intl.NumberFormat('en-ZA').format(num));
console.log(
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
    num
  )
);
console.log(
  new Intl.NumberFormat('en-za', { style: 'currency', currency: 'ZAR' }).format(
    num
  )
);


//*/
//#endregion

//#region SETTIMEOUT and SETINTERVAL ////////////////////////////////////////////////////
/*/

// SETTIMEOUT timer runs just once, after a defined time
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000,
  ...ingredients
);

//clearing the timeout which deletes the timer
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//SETINTERVAL timer keeps running basically forever, until we stop it
// Now this callback function will execute every second
setInterval(function () {
  const now = new Date();
  const horus = now.getHours();
  const minutes = now.getMinutes();
  const sec = now.getSeconds();
  console.log(`${horus}:${minutes}:${sec}`);
}, 1000);

//*/
//#endregion
