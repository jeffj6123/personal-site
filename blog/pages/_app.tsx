import '../styles/style.scss';
import type { AppProps } from 'next/app'
import { NightMode } from '../components/toggle';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* <a name="home"></a> */}

      <div className="header">
        <div className="navbar-wrapper">
          <div className="navigation">
            <a className="link" href="/#home"><i style={{ display: 'flex' }} className="ri-home-line"></i></a>
            <a className="link" href="/#projects">Projects</a>
            <a className="link" href="/#About">About</a>
            <a className="link" href="/#history">History</a>

            <a href="https://github.com/jeffj6123/personal-site" target="_blank" className="view-code">
              View the <i className="code-icon ri-code-s-slash-line"></i>
            </a>
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
