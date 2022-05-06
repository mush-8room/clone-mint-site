import Link from 'next/link'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <div>
        <Link href="/">Home</Link>
        <Link href="/creat-NFT">Sell NFT</Link>
        <Link href="/my-NFT">My NFT</Link>
      </div>
    <Component {...pageProps} />
  </>
  )
}

export default MyApp
