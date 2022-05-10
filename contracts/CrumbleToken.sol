//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// NFT
contract CrumbleToken is ERC721URIStorage{
    // NFT에서 필요한 것들?
    // TODO: mint
    // 민팅 = 블록체인에 아이템을 기록함
    // 1. 토큰 생성
    // 2. 생성한 토큰 리스팅 = market에 올림(판매 가능한 상태로 변경)
    // 3. 민팅(판매) 진행
    // 3-1. 소유자 전환
    // 3-2. 구매자로부터 판매자에게 리스팅한 금액만큼이 넘어감
    // 3-3. 판매리스트에서 내려감
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    // address public marketplace;
    // address payable owner;
    uint256 private _mintIdx;

    // ERC721() 부분은 상속받은 부모 컨트랙트(ERC721)의 constructor에 넣어줄 값을 전달하는 것
    constructor () ERC721("Crumble","CRB") {
        // owner = payable(msg.sender);
        _mintIdx = 0;
    }

    mapping(uint256 => Crumble) private crumbles;

    // NFT에 대한 정보 작성
    struct Crumble {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isSold;
    }

    event CrumbleCreated (
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price,
        bool isSold
    );

    function createCrumble(string memory tokenURI, uint256 price) public returns (uint256) {
        _tokenId.increment();
        uint256 newTokenId = _tokenId.current();

        // token 생성
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        crumbles[newTokenId] = Crumble({
            tokenId: newTokenId,
            seller: payable(msg.sender),
            owner: payable(address(this)),
            price: price,
            isSold: false
        });

        // 발행한 NFT를 판매할 수 있도록 변경 >> owner를 contract로 변경
        // approve는 owner가 바뀌지 않음
        // transfer는 owner가 변경됨
        _transfer(msg.sender, address(this), newTokenId);
        // approve(address(this), newTokenId);
        emit CrumbleCreated(newTokenId, msg.sender, address(this), price, false);

        return newTokenId;
    }

    // transfer를 하기 위해서는 함수가 payable이어야함 >> 돈의 이동이 있을 때에는 payable이 필수
    function publicMint() public payable {
        // 민팅을 하는 사람에게 랜덤 or 순차적으로 생성되어있는 NFT를 넘겨줌
        // 한 번에 하나의 NFT가 민팅됨
        uint currentMint = _mintIdx + 1;
        uint price = crumbles[currentMint].price;
        address payable seller = crumbles[currentMint].seller;

        require(seller != msg.sender, "Seller can't mint Crumble");
        require(msg.value == price, "Please pay proper price");

        crumbles[currentMint].seller = payable(address(0)); // seller가 없음
        crumbles[currentMint].owner = payable(msg.sender); // owner가 변경됨
        crumbles[currentMint].isSold = true;
        // _mint(msg.sender, _mintIdx);
        _transfer(address(this), msg.sender, currentMint);
        _mintIdx += 1;

        // 민팅을 성공하면 출금이 일어남        
        // crumbles[currentMint].owner.transfer(price);
        // msg.value : 송금 보낸 코인의 값, message와 함께 보낸 wei의 값
        crumbles[currentMint].seller.transfer(msg.value);
    }

    // minting 가능한 crumble list return
    function fetchCrumbleList() public view returns (Crumble[] memory) {
        uint crumbleCnt = _tokenId.current();
        uint unmintedCrumble = crumbleCnt - _mintIdx;
        
        Crumble[] memory unminted = new Crumble[](unmintedCrumble);
        for (uint i = 0; i < unmintedCrumble; i++) {
            // unminted 된 것들만 보여줘야 함
            Crumble storage current = crumbles[_mintIdx + i + 1];
            unminted[i] = current;
        }

        return unminted;
    }

    function fetchAllCrumbles() public view returns (Crumble[] memory) {
        uint crumbleCnt = _tokenId.current();
        // uint currentIdx = 0;
        
        Crumble[] memory allCrumble = new Crumble[](crumbleCnt);
        for (uint i = 0; i < crumbleCnt; i++) {
            Crumble storage current = crumbles[i + 1];
            allCrumble[i] = current;
        }

        return allCrumble;
    }
    // function setMarketplace(address market) public {
    //     marketplace = market;
    // }


    // function tokenId() public view returns (uint256) {
    //     return _tokenId.current();
    // }

    // function getItem(uint256 tokenId) public view returns (ItemToken memory) {
    //     return Items[tokenId];
    // }

    // function setItem(uint256 tokenId, address seller, address owner, address creator, string memory uri, bool sold) external pure returns (ItemToken memory){
    //     return ItemToken(tokenId, payable(seller), payable(owner), creator, uri, sold);
    // }
    
}
