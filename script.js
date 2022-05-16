'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Serban David',
  movements: [5000, 600, -700, -50, 10000],
  interestRate: 1,
  pin: 1234,
};

const accounts = [account1, account2, account3, account4, account5];

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

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  const movements = account.movements;
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  account.balance = balance;
  labelBalance.textContent = `${balance} EUR(€)`;
};

const calcDisplaySummary = function (account) {
  const movements = account.movements;

  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (currentAccount) {
  // Display movements
  displayMovements(currentAccount.movements);

  // Display balance
  calcDisplayBalance(currentAccount);

  // Display summary
  calcDisplaySummary(currentAccount);
};

//Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Clearing the input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let desc = false;

btnSort.addEventListener('click', function () {
  btnSort.blur();

  const descending = currentAccount.movements.slice(0);
  currentAccount.descending = descending.sort((a, b) => a - b);

  if (desc) {
    displayMovements(currentAccount.movements);
    desc = !desc;
  } else {
    displayMovements(currentAccount.descending);
    desc = !desc;
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE method
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -1));
console.log(arr.slice());
console.log([...arr]);

// SPLICE method -- mutates
console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);

// REVERSE method -- mutates
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT method
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN method
console.log(letters.join(' - '));


const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// Getting last element -- old way
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
// Getting last element -- new way
console.log(arr.at(-1));


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [index, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

// forEatch can not use continue or break
console.log('\n----------- FOR EACH -----------');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});


//forEatch is maps and sets
// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${value} with the key ${key}`);
});

// Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR']);
currenciesUnique.forEach(function (value, _value, set) {
  console.log(`${value}`);
});


// Challange #1
const checkDogs = function (dogsJulia, dogsKate) {
  // 1.
  const dogsCopyJulia = [...dogsJulia];
  dogsCopyJulia.splice(0, 1);
  dogsCopyJulia.splice(-2, 2);

  // 2.
  const allDogs = dogsCopyJulia.concat(dogsKate);

  // 3.
  allDogs.forEach(function (age, i) {
    age >= 3
      ? console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`)
      : console.log(`Dog number ${i + 1} is still a puppy 🐶`);
  });
  return allDogs;
};

// 4.
console.log(checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]));
console.log('\n');
console.log(checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]));


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUsd = 1.1;

const movementsUSD = movements.map(function (value) {
  return value * euroToUsd;
});

const movementsUSDArrow = movements.map(value => value * euroToUsd);

console.log(movementsUSD);
console.log(movementsUSDArrow);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescriptions);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

const withdrawal = movements.filter(mov => mov < 0);

console.log(deposits);
console.log(withdrawal);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const balance = movements.reduce(function (acc, curr) {
  return acc + curr;
}, 0);

const balanceArrow = movements.reduce((acc, value) => acc + value, 0);

console.log(balance);
console.log(balanceArrow);

// Maximum value of movements
const maximum = movements.filter(value => value >= 3000);
const maximumReduce = movements.reduce(
  (max, value) => (max < value ? (max = value) : (max = max)),
  movements[0]
);

console.log(maximum);
console.log(maximumReduce);


// Challange 2
const calcAverageHumanAge = function (ages) {
  // 1.
  const humanAge = ages
    .map(age => (age <= 2 ? age * 2 : age * 4 + 16))
    // 2.
    .filter(age => age > 18);

  const totalHumanAge = humanAge.reduce((acc, value) => acc + value, 0);
  const averageHumanAge = totalHumanAge / humanAge.length;

  console.log(`Human ages for dogs older than 18: ${humanAge}`);
  console.log(`Average human age = ${averageHumanAge}`);
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log('\n');
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * 1.1)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(acc => (acc.owner = 'Jessica Davis'));
console.log(account);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements.includes(-130));

// SOME method
const anyDeposits = movements.some(mov => mov > 2999);
console.log(anyDeposits);

// EVERY method
const allDeposits = account4.movements.every(mov => mov > 0);
console.log(allDeposits);


// FLAT method
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
const flat = arr.flat();
console.log(flat);

const arrDeep = [
  [[1, 2], 3],
  [4, 5],
];
console.log(arrDeep.flat(2));

// flat
const allMovementsSum = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(allMovementsSum);

// flatMap
const allMovementsSum2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(allMovementsSum2);


const owners = ['Serban', 'David', 'Badi', 'Me'];
console.log(owners.sort());

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// return > 0 - a, b
// return < 0 - b, a
movements.sort((a, b) => a - b);
console.log(movements);


const arr = [1, 2, 3, 4, 5, 6, 7];
const x = new Array(7);
console.log(x);
// FILL method
// x.fill(1);
x.fill(1, 3, 5);
arr.fill(23, 3, 6);
console.log(x);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

// 100 dice rolls
const dice = Array.from({ length: 100 }, _ =>
  Array.from({ length: 2 }, _ => Math.trunc(Math.random(1) * 6) + 1)
);
console.log(dice);



labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});


// Array methods practice

// 1.
const allDeposits = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(allDeposits);

// 2.
const allDeposits1k = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 1000).length;

console.log(allDeposits1k);

// 3.
const depWithSum = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(depWithSum);

// 4.
const string = 'This is a nice title';
const titleCase = function (string) {
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const title = string
    .toLowerCase()
    .split(' ')
    .map(word =>
      !exceptions.includes(word) ? word[0].toUpperCase() + word.slice(1) : word
    )
    .join(' ');

  return title;
};
console.log(titleCase(string));
console.log(titleCase('this is a LONG title but not too long'));


// Challange #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(dog => (dog.foodPortion = Math.trunc(dog.weight ** 0.75 * 28)));

// Calculate good amount of food for dog(10% down or up)
const goodAmount = function (dog) {
  const goodFood = [];
  const min = dog.foodPortion * 0.9;
  const max = dog.foodPortion * 1.1;
  goodFood.push(min);
  goodFood.push(max);
  return goodFood;
};

// 2.
dogs.forEach(dog => {
  if (dog.owners.includes('Sarah')) {
    console.log(
      `Sarah's dog is eating too ${
        dog.curFood < dog.foodPortion ? 'little.' : 'much.'
      }`
    );
  }
});

// 3.
console.log('\n');
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.foodPortion)
  .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.foodPortion)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4.
console.log('\n');
const ownerLittle = `${ownersEatTooLittle.join(
  ' and '
)}'s dogs eat too little.`;
const ownerMuch = `${ownersEatTooMuch.join(' and ')}'s dogs eat too much.`;

console.log(ownerLittle);
console.log(ownerMuch);

// 5.
console.log('\n');
console.log(dogs.some(dog => dog.curFood === dog.foodPortion));

// 6.
console.log('\n');
const checkEatingOkay = dog =>
  dog.curFood > dog.foodPortion * 0.9 && dog.curFood < dog.foodPortion * 1.1;

console.log(dogs.some(checkEatingOkay));

// 7.
console.log('\n');
console.log(dogs.filter(checkEatingOkay));

// 8.
console.log('\n');
const dogsSorted = dogs.slice().sort((a, b) => a.foodPortion - b.foodPortion);
console.log(dogsSorted);
*/
