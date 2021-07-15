const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async () => {
    const instance = await StarNotary.deployed();

    const tokenId = 1;
    const starName = "DB Star";

    await instance.createStar(starName, tokenId, {from: accounts[0]});
    const star = await instance.tokenIdToStarInfo.call(tokenId);

    assert.equal(star, starName);
});

it('lets user1 put up their star for sale', async () => {
    const instance = await StarNotary.deployed();

    const user1 = accounts[1];

    const starId = 2;
    const starName = "DB Star";

    const starPrice = web3.utils.toWei(".01", "ether");


    await instance.createStar(starName, starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});

    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async () => {
    const instance = await StarNotary.deployed();

    const user1 = accounts[1];
    const user2 = accounts[2];

    const starId = 3;
    const starName = "DB Star";

    const starPrice = web3.utils.toWei(".01", "ether");
    const balance = web3.utils.toWei(".05", "ether");

    await instance.createStar(starName, starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});

    const balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);

    await instance.buyStar(starId, {from: user2, value: balance});

    const balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    const value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    const value2 = Number(balanceOfUser1AfterTransaction);

    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async () => {
    const instance = await StarNotary.deployed();

    const user1 = accounts[1];
    const user2 = accounts[2];

    const starId = 4;
    const starName = "DB Star";

    const starPrice = web3.utils.toWei(".01", "ether");
    const balance = web3.utils.toWei(".05", "ether");

    await instance.createStar(starName, starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});

    await instance.buyStar(starId, {from: user2, value: balance});

    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async () => {
    const instance = await StarNotary.deployed();

    const user1 = accounts[1];
    const user2 = accounts[2];

    const starId = 5;
    const starName = "DB Star";

    const starPrice = web3.utils.toWei(".01", "ether");
    const balance = web3.utils.toWei(".05", "ether");

    await instance.createStar(starName, starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});

    const balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);

    await instance.buyStar(starId, {from: user2, value: balance, gasPrice: 0});

    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    const value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);

    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async () => {
    const instance = await StarNotary.deployed();

    const tokenId = 6;
    const starName = "DB Star";

    await instance.createStar(starName, tokenId, {from: accounts[0]})
    const star = await instance.tokenIdToStarInfo.call(tokenId);

    assert.equal(star, starName);
});

it('lets 2 users exchange stars', async () => {
    const instance = await StarNotary.deployed();

    const tokenIdForTheFirstStar = 7;
    const tokenIdForTheSecondStar = 8;
    const starName = "DBStar";

    await instance.createStar(starName, tokenIdForTheFirstStar, {from: accounts[0]})
    await instance.createStar(starName, tokenIdForTheSecondStar, {from: accounts[1]})

    await instance.exchangeStars(tokenIdForTheFirstStar, tokenIdForTheSecondStar);

    assert.equal(await instance.ownerOf.call(tokenIdForTheFirstStar), accounts[1]);
    assert.equal(await instance.ownerOf.call(tokenIdForTheSecondStar), accounts[0]);
});

it('lets a user transfer a star', async () => {
    const instance = await StarNotary.deployed();

    const tokenId = 9;
    const starName = "DB Star";

    await instance.createStar(starName, tokenId, {from: accounts[0]});

    await instance.transferStar(accounts[1], tokenId);

    assert.equal(await instance.ownerOf.call(tokenId), accounts[1]);
});

it('lookUptokenIdToStarInfo test', async () => {
    const instance = await StarNotary.deployed();

    const tokenId = 10;
    const starName = "DB Star";

    await instance.createStar(starName, tokenId, {from: accounts[0]})

    assert.equal(await instance.lookUptokenIdToStarInfo.call(tokenId), starName);
});