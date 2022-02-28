import type { NextPage } from 'next';
import Graph from '../components/graph';
import LandingText from '../components/landing';

const Home: NextPage = () => {
  return (
      <div>
        <div className="screen">
          <div>
            <div className="landing-name" id="landing-tile">
              <div>
                <span>Hello, I am</span>
              </div>
              <div className="highlight-text name">
                Jeffrey Jarry
              </div>
              <div>
                and I like to make <LandingText></LandingText>
              </div>
              <div className="socials">
                <a className="contact-info" href="https://github.com/jeffj6123" target="_blank">
                  <i className="social-icon ri-github-fill shadow"></i>
                  <span className="info shadow">Jeffj6123</span>
                </a>

                <a className="contact-info" href="https://www.linkedin.com/in/jeffrey-jarry-127946b6/"
                  target="_blank">
                  <i className="social-icon ri-linkedin-box-fill shadow"></i>
                  <div className="info shadow">Jeff Jarry</div>
                </a>

                <a className="contact-info" href="mailto:jeffrey.jarry@gmail.com"
                  target="_blank">
                  <i className="social-icon ri-mail-line shadow"></i>
                  <div className="info shadow">Jeffrey.jarry@gmail.com</div>
                </a>

              </div>
            </div>
          </div>
          <Graph></Graph>

          <a className="card next-section" href="#projects">
            <i className="bounce ri-arrow-down-fill"></i>
            See Projects
            <i className="bounce ri-arrow-down-fill"></i>
          </a>
        </div>

        <div className="layout-container">
          <div id="projects" className="screen gap">
            <div>
              <h1>Projects</h1>
              <div className="underline spacer"></div>

              <div className="projects-container">
                <div className="project-tile card shadow main-bg">
                  <h2 className="shadow bounce-in project-title">
                    FFDecks
                  </h2>
                  <div className="project-content">
                    <div>
                      <h2>
                        <a href="https://ffdecks.com" target="_blank">
                          <i className="link-out ri-links-line shadow"></i>
                        </a>

                      </h2>
                      <p>
                        FFDecks is a Final Fantasy Trading Card Game deck builder, card database and tracker,
                        meta analyzer, tournament results hub, and play-testing platform.
                      </p>
                      <p style={{ marginTop: '10px' }}>
                        Developed to provide a well supported platform for the
                        community that otherwise did not exist.

                        <ul>
                          <li>
                            Angular front-end and a Python back-end, hosted on Google App Engine and
                            data is stored in Google Datastore, Firebase Real Time Database, and Firestore.
                          </li>

                          <li>
                            Configured with four different revenue streams:
                            Google AdSense, Patreon, TCG Player and Teespring
                          </li>

                          <li>
                            Voted number one community website by the players of the game.
                          </li>
                        </ul>
                      </p>
                      <div className="resources shadow">
                        <i style={{ color: '#f14e00' }} className="ri-html5-line resource"></i>
                        <i style={{ color: '#f00000' }} className="ri-angularjs-fill resource"></i>
                        <i style={{ color: 'blue' }} className="ri-css3-line resource"></i>
                        <img src="python-logo.svg" className=" resource" style={{ height: '30px' }}></img>
                        <img src="typescript-log.svg" className=" resource"
                          style={{ height: '30px' }}></img>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="project-tile card shadow main-bg">
                  <h2 className="shadow bounce-in project-title">
                    Service Fabric Explorer
                  </h2>
                  <div className="project-content">
                    <a href="https://github.com/microsoft/service-fabric-explorer" target="_blank">
                      <i className="link-out ri-github-fill shadow"></i>
                    </a>
                    <p>
                      Service Fabric Explorer (SFX) is an application used to monitor
                      and diagnose Microsoft Azure Service Fabric clusters.
                    </p>
                    <p>

                      <ul>
                        <li>
                          Originally written in AngularJS but has been migrated to Angular.\
                          Testing is done using Cypress to cover broad End to End scenarios.
                        </li>

                        <li>
                          Developed closely with feedback from support engineers and product users.
                          The development cycle used is very agile in order to prioritize the highest impact features.
                        </li>

                        <li>
                          Developed to meet A11Y accessibility standards.
                        </li>
                      </ul>
                    </p>
                    <div className="resources shadow">
                      <i style={{ color: '#f14e00' }} className="ri-html5-line resource"></i>
                      <i style={{ color: '#f00000' }} className="ri-angularjs-fill resource"></i>
                      <i style={{ color: 'blue' }} className="ri-css3-line resource"></i>
                      <img src="images/typescript-log.svg" className=" resource" style={{ height: '30px' }}></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="screen gap" id="About">
            <div className="about">
              <h1>About</h1>
              <div className="underline spacer"></div>
              <div className="card margin-bottom">
                <p>
                  I am a Software Engineer with an interest in building <span className="highlight-text">web
                    based applications</span> and have been building software since 2016.
                </p>

                <p style={{ marginTop: '10px' }}>
                  I graduated from The <span className="highlight-text">Ohio State University</span> in 2018 with a Bachelors Degree in
                  <span className="highlight-text">Computer Science</span>. The courses I took had an emphasis on data structures and algorithms.
                  While I was there I competed in multiple hackathons, and won most innovative idea from OH/IO.
                </p>

              </div>

              <div>
                <h2>Technology</h2>
                <div className="underline spacer"></div>
                <div className="card">
                  <div>
                    <ul>
                      <li>
                        <div className="technology-section">
                          <h3>
                            Javascript and Typescript
                          </h3>
                          <div className="technology-details">
                            Angularjs, Angular, Express, Firebase, Angular Material
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="technology-section">
                          <h3>
                            HTML and CSS
                          </h3>
                          <div className="technology-details">
                            Sass
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="technology-section">
                          <h3>
                            Python
                          </h3>
                          <div className="technology-details">
                            Flask and Falcon
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="technology-section">
                          <h3>
                            Databases
                          </h3>
                          <div className="technology-details">
                            Google Datastore, Firebase/Firestore, Mongodb, Memcache, Redis
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="technology-section">
                          <h3>
                            Cloud platforms
                          </h3>
                          <div className="technology-details">
                            Azure, Google Cloud Platform
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="screen gap" id="history">
            <h2>Work History</h2>
            <div className="underline spacer"></div>

            <div className="card main-bg job-tile margin-bottom shadow show-on-scroll slide-down">
              <div className="card shadow job-overview">
                <div>
                  <h3>Microsoft - Azure</h3>
                  <div className="job-timespent">
                    May, 2018 <i className="ri-arrow-right-line"></i>
                    Now
                  </div>
                </div>
                <div className="job-role card shadow">
                  Software Engineer 2 (61)
                </div>
              </div>

              <div className="job-description">
                <ul>
                  <li>
                    I Work within the supportability and observability team of the Azure Service Fabric, developing Service Fabric Explorer.
                  </li>

                  <li>
                    Write modern, well documented and tested code. Primarily in Typescript and
                    Angular with testing done in Cypress and karma.
                  </li>

                  <li>
                    Responsible for designing REST APIs, maintaining client SDKs, and updating documentation.
                  </li>
                </ul>
              </div>
            </div>
            <div className="card main-bg job-tile margin-bottom shadow show-on-scroll slide-down">
              <div className="card shadow job-overview">
                <div>
                  <h3>Scott's Miracle Gro</h3>
                  <div className="job-timespent">
                    May, 2017 <i className="ri-arrow-right-line"></i> Jan, 2018
                  </div>
                </div>
                <div className="job-role card shadow">
                  Full Stack Intern
                </div>
              </div>

              <div className="job-description">
                <ul>
                  <li>
                    I Led project development of an internal application for a trailer yard
                    management system to reduce operating cost.
                  </li>

                  <li>
                    I Performed full stack development with Google app engine,
                    webapp2, and Angular 4.
                  </li>

                  <li>
                    I Performed Requirement gathering, timeline
                    projection, user training, and developer training.
                  </li>
                </ul>
              </div>
            </div>
            <div className="card main-bg job-tile margin-bottom shadow show-on-scroll slide-down">
              <div className="card shadow job-overview">
                <div>
                  <h3>Scott's Miracle Gro</h3>
                  <div className="job-timespent">
                    May, 2016 <i className="ri-arrow-right-line"></i> Sept, 2017
                  </div>
                </div>
                <div className="job-role card shadow">
                  Full Stack Intern
                </div>
              </div>
              <div className="job-description">
                <ul>
                  <li>
                    I developed and integrated new features into an existing codebase for an
                    internal use application. I Worked within a scrum methodology for delivering
                    updates
                  </li>

                  <li>
                    Development was done using Angularjs 1.5, Bootstrap, and Google App Engine.
                  </li>

                  <li>
                    I Led user testing and release of new features at the end of the development cycle.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Home
