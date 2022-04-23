const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  describe("BidwatcherMarket", function() {
    it("Should create and execute market sales", async function() {
      /* deploy the marketplace */
      const BidwatcherMarketplace = await ethers.getContractFactory("BidwatcherMarketplace")
      const bidwatcherMarketplace = await BidwatcherMarketplace.deploy()
      await bidwatcherMarketplace.deployed()

      let listingPrice = await bidwatcherMarketplace.getListingPrice()
      listingPrice = listingPrice.toString()

      const auctionPrice = ethers.utils.parseUnits('1', 'ether')

      /* create two tokens */
      await bidwatcherMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, { value: listingPrice })
      await bidwatcherMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: listingPrice })

      const [_, buyerAddress] = await ethers.getSigners()

      /* execute sale of token to another user */
      await bidwatcherMarketplace.connect(buyerAddress).createMarketSale(1, { value: auctionPrice })

      /* resell a token */
      await bidwatcherMarketplace.connect(buyerAddress).resellToken(1, auctionPrice, { value: listingPrice })

      /* query for and return the unsold items */
      items = await bidwatcherMarketplace.fetchMarketItems()
      items = await Promise.all(items.map(async i => {
        const tokenUri = await bidwatcherMarketplace.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri
        }
        return item
      }))
      console.log('items: ', items)
    })
  })});
