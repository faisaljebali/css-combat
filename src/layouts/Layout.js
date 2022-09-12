import React from 'react';

const Layout =({children}) =>{
    return(
        <>
        <header className="header-combat-css">
        <div className="logo"><span className="css-logo">CSS</span><svg viewBox="0 0 28 28" aria-hidden="true" className="icon-css-combat" height="40" width="40"><path d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z"></path></svg><span className='combat-logo'>COMBAT</span></div>
            {/* <Navbar/> */}
        </header>
        <main>{children}</main>
        </>
    )
}

export default Layout;