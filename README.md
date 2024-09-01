
# Visiting the project

This project is deployed by github-pages. [Link](https://ylai06.github.io/Artisoul/) 

## Steps to set the Environment
1. Install Metamask browser [download](https://metamask.io/download/)
2. Create Metamask test account [Tutorial](https://medium.com/@crypto.nao.news/%E6%96%B0%E6%89%8B%E7%B3%BB%E5%88%97-metamask-%E4%BB%8B%E7%B4%B9-%E4%B8%8A-%E9%8C%A2%E5%8C%85%E5%89%B5%E5%BB%BA%E6%95%99%E5%AD%B8-2bef512120a6)
3. Add test blockchain network [Tutorial](https://medium.com/@razor07/how-to-get-sepolia-eth-from-a-faucet-7420e5ceacb3)

- Testnet
  - Network Name — Sepolia Testnet
  - New RPC URL — https://eth-sepolia.g.alchemy.com/v2/[TEST_NET_KEY]
  - Chain ID — 11155111
  - Currency Symbol — SepoliaETH
  - Block explorer URL — https://sepolia.etherscan.io/

4. Get test ETH coins [Google Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
5. [Project website](https://ylai06.github.io/Artisoul)

- Test account
  - Email julialai0202@gmail.com
  - Password 123456
6. Download digital assets and choose a picture from [dotown](https://dotown.maeda-design-room.net/)
7. User testing
8. [Survey](https://forms.gle/N1mVCW2SWx75DHMs5)

# Getting Started with Code

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- nvm use 20.0.0

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More about ACL files

Ultimately you need to check the Link header in the response to actually know, but for now you can be pretty sure that

- If it’s a “directory” then it will be /.acl
- If it’s an actual file then it will be /that-file.acl


## Compile your contract

To make sure everything is working so far, let’s compile our contract:
`npx hardhat compile`

start a local node:
`npx hardhat node`

Deploy (Example):
`npx hardhat run --network localhost scriptsNFT/deploy-market.js`
- NFT marketplace Contract deployed to address: 0xaD16EC538856733c0b3C4fbba720df89cCaeb313

## Folders
- contracts/ is where we’ll keep our NFT smart contract code
- scripts/ is where we’ll keep scripts to deploy and interact with our smart contract

## Smart contract
[Alchemy](https://dashboard.alchemy.com/apps) -> nft-manage

## Hardhat
npx hardhat run scripts/deploy-market.js --network localhost