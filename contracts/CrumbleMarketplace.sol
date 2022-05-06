//SPDX-License-Identifier: Unlicense
// pragma solidity ^0.8.0;

// import "./CrumbleToken.sol";

// contract CrumbleMarketPlace {
//     // 마켓이 하는 일
//     // 1. 생성한 NFT를 리스팅
//     // 2. 리스팅된(판매중인) NFT들 확인
//     // 3. NFT 구매
//     using Counters for Counters.Counter;
//     Counters.Counter private _crumbleSale;

//     CrumbleToken private _token;

//     mapping (uint256 => CrumbleForSale) crumbleForSale;

//     struct CrumbleForSale {
//         uint256 tokenId;
//         address payable seller;
//         address payable owner;
//         uint256 price;
//         bool isSold;
//     }

//     event CrumbleAddedForSale (
//         uint256 tokenId,
//         address seller,
//         address owner,
//         uint256 price,
//         bool isSold
//     );

//     constructor (CrumbleToken token){
//         _token = token;
//     }

//     function setCrumbleForSale(uint256 tokenId, uint256 price) public returns (uint256){
//         require(price > 0, "Price must be over 0");
//         require(_token.getItem(tokenId).owner == msg.sender, "Only owner can listing token");

//         crumbleForSale[tokenId] = CrumbleForSale({
//             tokenId: tokenId,
//             seller: payable(msg.sender),
//             owner: payable(address(this)),
//             price: price,
//             isSold: false
//         });

//         // approve or transfer?
//         _token.approve(address(this), tokenId);
//         // _token.transferFrom(msg.sender, address(this), tokenId);

//         emit CrumbleAddedForSale(
//             tokenId, 
//             msg.sender, 
//             address(this), 
//             price, 
//             false
//         );
//     }

//     // function buyCrumble(uint256 tokenId) payable external{
        
//     // }

//     // fetch all exsiting items
//     function fetchAllCrumbles() public view returns (CrumbleToken[] memory){
//         uint totalItemCount = _token.tokenId();
        
//         CrumbleToken[] memory items = new CrumbleToken[](totalItemCount);
//         // for(uint i = 0; i < )

//     }

//     // fetch only on sale items
//     function fetchCrumblesOnSale() public view returns (CrumbleForSale[] memory) {

//         CrumbleForSale[] memory saleItems = new CrumbleForSale[](_crumbleSale.current());
//     }

//     // fetch my items
//     function fetchMyCrumbles() public view returns (CrumbleToken[] memory) {
//         uint totalItemCnt = _token.tokenId();
//         uint myItemCnt = 0;
//         uint currentIdx;

//         for(uint i = 0; i < totalItemCnt; i++){
//             // why i + 1?
//             if(_token.getItem(i + 1).owner == msg.sender){
//                 myItemCnt++;
//             }
//         }

//         CrumbleToken[] memory items = new CrumbleToken[](myItemCnt);
//         for(uint i = 0; i < myItemCnt; i++){
//             if(_token.getItem(i + 1).owner == msg.sender){
//                 CrumbleToken currentItem = _token.getItem(i + 1);
//                 items[currentIdx] = currentItem;
//                 currentIdx++;
//             } 
//         }
//         return items;
//     }
// }