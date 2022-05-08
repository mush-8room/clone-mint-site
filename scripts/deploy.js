const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const CrumbleToken = await hre.ethers.getContractFactory("CrumbleToken");
    const crumbleToken = await CrumbleToken.deploy();

    await crumbleToken.deployed;

    console.log("CrumbleToken deployed to:", crumbleToken.address);

    // deploy된 addr을 config.js 파일에 저장
    fs.writeFileSync("./config.js", `export const crumbleTokenAddress = '${crumbleToken.address}'`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
