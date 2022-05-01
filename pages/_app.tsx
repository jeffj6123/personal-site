import '../styles/style.scss';
import type { AppProps } from 'next/app'
import { NightMode } from '../components/toggle';
import Link from 'next/link';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* <a name="home"></a> */}

      <div className="header">
        <div className="navbar-wrapper">
          <div className="navigation">
            <Link href="/#home">
              <a className="link"><i style={{ display: 'flex' }} className="ri-home-line"></i></a>
            </Link>
            <Link href="/#projects">
              <a className="link" >Projects</a>
            </Link>
            <Link href="/#About">
              <a className="link">About</a>
            </Link>
            <Link href="/#history">
              <a className="link" >History</a>
            </Link>
            <Link href="/blog">
              <a className="link">Blog</a>
            </Link>
            <Link href="https://github.com/jeffj6123/personal-site" >
              <a target="_blank" rel="noreferrer" className="view-code">
                View the <i className="code-icon ri-code-s-slash-line"></i>
              </a>
            </Link>
          </div>
        </div>

        <NightMode></NightMode>

        <div className="mobile-nav" id="mobile-nav">
          <i className="ri-menu-line"></i>
        </div>
      </div>
      <Component {...pageProps} />
    </div>)
}

export default MyApp
