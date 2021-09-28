import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from '@mui/styles';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const useStyles = makeStyles({
  navBar: {
    height: '64px',
    marginBottom: '24px',
  },
  toolbar: {
    maxWidth: 1200,
    width: "100%",
    margin: "0 auto",
  },
  wallet: {
    display: 'flex',
    marginRight: '36px',
    marginLeft: 'auto'
  },
});

export const NavBar = () => {
  const classes = useStyles();
  const { wallet } = useWallet();

  return (
    <div className={classes.navBar}>
      <AppBar >
        <Toolbar className={classes.toolbar}>
            <div>
              Gmoot Rarity Checker
            </div>
          <div className={classes.wallet}>
              <WalletMultiButton />
              {wallet && <WalletDisconnectButton />}
            </div>
        </Toolbar>
      </AppBar>
    </div>
  )
};

