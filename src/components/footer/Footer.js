import React from 'react';

import './Footer.css';

import logoNome from '../../assets/logo-nome.svg';

function Footer() {
    return (
        <footer>
            <section></section>
            <section className='contato'>Contato</section>
            <section className='logo'>
                <img src={logoNome} alt="logo do oui pet. Um garçon francês segurando um pano no antebraço." />
            </section>
        </footer >
    );
}

export default Footer;