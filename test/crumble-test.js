const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrumbleToken Test", function () {
    // it(원하는 동작에 대한 설명, 동작)
    it("test token creation", async function () {
        const Token = await ethers.getContractFactory("CrumbleToken");
        const crumbleToken = await Token.deploy();
        await crumbleToken.deployed();
        
        await crumbleToken.createCrumble("tokenURI00", 1);
        const crumbles = await crumbleToken.fetchCrumbleList();

        const tokenAddr = crumbleToken.address;
        // 바라는 내용
        expect(crumbles[0].owner).to.equal(tokenAddr);

        // token seller should be creator
        // hardhat network에서의 account list를 불러옴
        const [seller] = await ethers.getSigners();
        expect(crumbles[0].seller).to.equal(seller.address);
    });

    it("public mint test", async function () {
        const Token = await ethers.getContractFactory("CrumbleToken");
        const crumbleToken = await Token.deploy();
        await crumbleToken.deployed();
      
        await crumbleToken.createCrumble("tokenURI00", 1);
        await crumbleToken.createCrumble("tokenURI01", 1);
        
        await expect(crumbleToken.publicMint()).to.be.revertedWith("Seller can't mint Crumble");
        
        const [seller, addr1] = await ethers.getSigners();
        // connect를 사용하면 account를 변경하여 실행할 수 있음
        await crumbleToken.connect(addr1).publicMint({value: 1});
        const crumbles = await crumbleToken.fetchAllCrumbles();

        expect(crumbles[0].owner).to.equal(addr1.address);
        expect(crumbles[0].isSold).to.equal(true);    
    });
});