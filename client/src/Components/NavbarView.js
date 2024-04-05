import React, { useState } from "react";
import logo from '../Assets/logoo.svg'

function NavbarView() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="Navbar">
                <img
                    src={logo}
                />
                <div className={`nav-items ${isOpen && "open"}`}>
                    <a href="/">Locations</a>
                    <a href="/devices">Devices</a>
                </div>
                <div
                    className={`nav-toggle ${isOpen && "open"}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="bar"></div>
                </div>
            </div>
        </>
    )
}

export default NavbarView