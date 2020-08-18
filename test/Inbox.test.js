const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider); // <== create an instance of "Web3" constructor

const { interface, bytecode } = require('../compile');

let accounts, inbox; // <== declared here so that
                     //     we can use them in describe()
const INITIAL_STRING = "Hi There!"

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts(); // <== returns account ID of 10 accounts
                                             //     that ganache created

    // Use one of those accounts to deploy
    inbox = await new web3.eth.Contract(JSON.parse(interface)).deploy({
        data: bytecode,
        arguments: [ INITIAL_STRING ]
    }).send({ from: accounts[0], gas: '1000000' });

    inbox.setProvider(provider);
});

describe('Inbox Contracts', () => {
    it('deploys a contract', () => {
        // console.log(inbox);
        // console.log(accounts);

        // This is a good way to test whether
        // contract has deployed successfully or not
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async ()=> {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});

// ===============
// MOCHA - EXAMPLE (Uncomment The Code Below To understand How Mocha works)
// - use "npm run test"
// -> beforeEach() contains the common part that occurs in every it()
// -> describe() binds together several it()
// -> it() contains single test assertion
// ===============
// class Car {
//     park() {
//         return 'stopped';
//     }

//     drive() {
//         return 'vroom';
//     }
// }

// let car;
// beforeEach(() => {
//     car = new Car();
// });

// describe('Car', () => {
//     it('can park', () => {
//         assert.equal(car.park(), 'stopped');
//     });

//     it('can drive', () => {
//         assert.equal(car.drive(), 'vroom');
//     });
// });