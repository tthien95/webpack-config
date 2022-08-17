import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.scss';

const activeStyle = ({ isActive }: { isActive: boolean }) =>
  isActive ? styles['nav-active'] : undefined;

const menuButtonHandler = (event: React.MouseEvent) => {
  event.preventDefault();
  const anchor = document.getElementById(styles[`nav-toggle`])!;
  const navBar = document.getElementById('navbar')!;
  anchor.classList.toggle(styles.active);
  navBar.classList.toggle(styles.expand);
};
export default function Navigation() {
  return (
    <header>
      <div className={`${styles.wrap}`}>
        <div className={`${styles.logo}`}>
          <a href="#!">Web Logo</a>
        </div>
        <div className={styles[`nav-mobile`]}>
          <a id={styles[`nav-toggle`]} href="#!" onClick={menuButtonHandler}>
            <span></span>
          </a>
        </div>
        <nav id="navbar" className={styles[`nav-container`]}>
          <ul>
            <li>
              <NavLink to="/" className={activeStyle}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/new-user" className={activeStyle}>
                Add User
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
