// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@aws-amplify/ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTasks } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ user, signOut }) => {
  return (
    <nav style={styles.navbar}>
      <img src="/logo.png" alt="Logo" style={styles.logo} />
      <div style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>
          <FontAwesomeIcon icon={faHome} style={styles.icon} /> Home
        </Link>
        <Link to="/task-manager" style={styles.navLink}>
          <FontAwesomeIcon icon={faTasks} style={styles.icon} /> Task Manager
        </Link>
      </div>
      <div style={styles.userSection}>
        <span style={styles.username}>Hello, {user.username}</span>
        <Button style={styles.logoutButton} onClick={signOut}>Logout</Button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    color: 'white',
    padding: '10px 20px',
    borderBottom: '2px solid #444'
  },
  logo: {
    height: 40,
  },
  navLinks: {
    display: 'flex',
    gap: 15
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: 18
  },
  icon: {
    marginRight: 5
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  username: {
    fontSize: 18
  },
  logoutButton: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: 5
  }
};

export default Navbar;
