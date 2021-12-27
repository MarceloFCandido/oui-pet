import React from 'react';

import './Header.css';

import logo from '../../assets/logo.svg';

import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';

function Header() {

    return (
        <header>
            <section className='logo'>
                <img src={logo} alt="logo da página. Um garçom francês segurando um pano no antebraço." />
            </section>

            <section className='forma-de-pagamento'>
                <select name="forma-de-pagamento" id="forma-de-pagamento">
                    <option value="real" defaultValue={true}>R$</option>
                    <option value="bitcoin">bitcoin</option>
                    <option value="ethereum">ethereum</option>
                    <option value="ripple">ripple</option>
                </select>
            </section>

            <section className='pesquisa'>
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, border: '1px solid white' }}
                >
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Pesquisar"
                        inputProps={{ 'aria-label': 'pesquisar' }}
                    />
                    <IconButton color="primary" sx={{ p: '10px' }} aria-label="cancel">
                        <HighlightOffIcon sx={{ color: 'gray' }} />
                    </IconButton>
                </Paper>
                <IconButton type="submit" sx={{ p: '10px', border: '1px solid white', borderRadius: '20%', marginLeft: '1em' }} aria-label="shopping-cart">
                    <ShoppingCartIcon sx={{ color: 'yellow' }} />
                </IconButton>
            </section>
        </header >
    );
}

export default Header;