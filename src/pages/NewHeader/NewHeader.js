import React, { useState } from 'react';
import './NewHeader.css';
import Logo from '../../assets/heptagon_logo_final.png';
export default function NewHeader() {
    return (
        <>
            <div className='header'>
                <img className='logo' src={Logo}></img>
                <span className='logo_title'>Heptagon</span>
            </div>
        </>       
    )
}