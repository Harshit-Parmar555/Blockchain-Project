const hre = require("hardhat");

async function main() {
  const TicketNFT = await hre.ethers.getContractFactory("TicketNFT");
  const ticketNFT = await TicketNFT.deploy();

  await ticketNFT.waitForDeployment();

  console.log("Contract deployed to:", await ticketNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
