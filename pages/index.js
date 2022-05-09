import { ethers } from 'ethers'
import { crumbleTokenAddress } from '../config'

import CrumbleToken from '../artifacts/contracts/CrumbleToken.sol/CrumbleToken.json'
import { useState, useEffect } from 'react'
import Web3Modal from 'web3modal'
// metamask 연결시키기
// create-nft, public-mint 페이지로의 이동 

export default function Home() {
  const [nftCnt, setNftCnt] = useState(0);
  const [price, setPrice] = useState(0);
  const [account, setAccount] = useState('');
  const [seller, setSeller] = useState('');
  // const [owner, setOwner] = useState('');
  const [crumbles, setCrumbles] = useState([]);
  
  // page가 load되면 metamask 연결
  useEffect(() => {
    connect()
    getUnmintedCrumbles()
  }, [])

  async function connect() {
    // localhost로 deploy시
    // provider : 접속하고자하는 블락체인 네트워크의 인터페이스
    // metamask로 연결하기
    // const provider = new ethers.providers.JsonRpcProvider()
    console.log("connect metamask");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    signer.getAddress().then((value) => 
      setAccount(value)
    )
  }

  async function getUnmintedCrumbles() {
    // provider : a connection to etherium network
    // signer : hold private key and can sign things
    console.log("get unminted list");
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(crumbleTokenAddress, CrumbleToken.abi, provider)

    const data = await contract.fetchCrumbleList() 
    const items = await Promise.all(data.map(async i => {
      const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      
      let item =  {
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        price,
      }
    return item;
    }))
    console.log(items)
    setCrumbles(items);
  }

  async function createNFT() {
    console.log("create NFT");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(crumbleTokenAddress, CrumbleToken.abi, signer);

    for (let i = 0; i < nftCnt; i++) {
      // 입력받은 갯수만큼 nft 발행
      // tokenURI, price 필요(tokenURI는 그냥 임의값 넣어줌)
      // tokenId는 contract에서 자동 생성
      const newPrice = ethers.utils.parseUnits(price, 'ether');
      const transaction = await contract.createCrumble(i, newPrice);
      await transaction.wait();
    }
  }

  async function publicMint() {
    // 존재하는 NFT 순차적으로 민팅
    console.log("public mint");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(crumbleTokenAddress, CrumbleToken.abi, signer);

    // const price = ethers.utils.parseUnits(crumbles[0].price.toString(), 'ether')
    const price = ethers.utils.parseUnits(crumbles[0].price.toString(), 'ether');
    console.log(price);
    const transaction = await contract.publicMint({value: price});
    await transaction.wait();
  }

  // image upload 제외하고 갯수 or ID 받아서 NFT 생성하기
  // 다른 계정 연결해서 public minting 진행하기
  // 한 페이지에서 실행

  return (
    <>
      <h1>NFT MINTING</h1>
      <div className='userInfo'>account : {account}</div>
      <hr/>
      <div>
        {crumbles.length != 0 ? (
          crumbles.map((crumble, idx) => 
           <div key={idx}>
              <p><b>tokenId: {crumble.tokenId}</b></p>
              <pre>seller: {crumble.seller}</pre>
              <pre>owner: {crumble.owner}</pre>
              <pre>price: {crumble.price} ETH</pre>
            </div>
          )
          ) : <div>민팅 가능한 아이템이 존재하지 않습니다.</div>}
      </div>
      <div>
        <h2>Create NFT</h2>
        <lable><b>생성 갯수 - </b>
          <input type="text" onChange={(e) => setNftCnt(e.target.value)}/>
        </lable>
        <br/>
        <lable><b>가격 - </b>
          <input type="text" onChange={(e) => setPrice(e.target.value)}/>
          <span> ETH</span>
        </lable>
        <br/>
        <button onClick={createNFT}>create</button>
      </div>
      <div>
          <h2>Mint NFT</h2>
        {crumbles.length != 0 ? (
          <button onClick={publicMint}>Mint</button>
        ): <div>모든 물량이 소진되었습니다.</div>
        }
      </div>
    </>
  )
}
