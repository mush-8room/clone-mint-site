import styles from '../styles/Home.module.css';
import {NFTStorage, File} from "nft.storage";
import fs from "fs";

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGYzNTMwQ2U4ZUY0Mjg3MUNBNmU0QTNhNjRDMWRFNWJiQzQ4RmM3NjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTEzODM4NTEzMiwibmFtZSI6Ik15TkZUIn0.h_ULL1udwcd1lghbsEellhwRHYt39-OBnjAfO6tnbVo";

export default function Home() {
    
    async function uploadToIPFS() {
        const {name, description, price} = formInput

        const data = JSON.stringify({
            name, description, image: fileUrl
        })

        // try {
        //     const added = await 
        // }
    }
    
    return (
    <>
    <div>Home</div>
    </>
    )
}
