import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  MenuItem,
  Menu,
  Typography,
  Dialog, DialogTitle,
} from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import { isMobile } from 'react-device-detect';
import logo from '../../assets/commerce.png';
import useStyles from './styles';
import { Cart } from '../index';
import { commerce } from '../../lib/commerce';

const PrimarySearchAppBar = ({ totalItems }) => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const classes = useStyles();
  const location = useLocation();

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const mobileMenuId = 'primary-search-account-menu-mobile';

  const [open, setOpen] = React.useState(false);

  const fetchCart = async () => {
    // eslint-disable-next-line no-use-before-define
    setCart(await commerce.cart.retrieve());
  };

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleUpdateCartQty = async (lineItemId, quantity) => {
    const response = await commerce.cart.update(lineItemId, { quantity });

    // eslint-disable-next-line no-use-before-define
    setCart(response.cart);
  };
  const [cart, setCart] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (lineItemId) => {
    const response = await commerce.cart.remove(lineItemId);

    setCart(response.cart);
  };

  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();

    setCart(response.cart);
  };

  const renderMobileMenu = (
    <Menu anchorEl={mobileMoreAnchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} id={mobileMenuId} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={isMobileMenuOpen} onClose={handleMobileMenuClose}>
      <MenuItem>
        <IconButton onClick={handleClickOpen} aria-label="Show cart items" color="inherit">
          <Badge badgeContent={totalItems} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
      </Dialog>
    </Menu>
  );

  return (
    <>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
            <img src={logo} alt="commerce.js" height="25px" className={classes.image} /> Commerce.js
          </Typography>
          <div className={classes.grow} />
          {location.pathname === '/' && (
          <div className={classes.button}>
            <IconButton onClick={handleClickOpen} aria-label="Show cart items" color="inherit">
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </div>
          )}
          <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title" />
            <Cart cart={cart} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} onEmptyCart={handleEmptyCart} />
          </Dialog>
        </Toolbar>
      </AppBar>
      {isMobile && renderMobileMenu}
    </>
  );
};

export default PrimarySearchAppBar;
