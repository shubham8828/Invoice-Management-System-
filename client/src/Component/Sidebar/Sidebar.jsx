import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaCog,
    FaThList,
    FaFileMedical 
}from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FcAbout } from "react-icons/fc";
import { MdContactPhone } from "react-icons/md";
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom';


const Sidebar = ({children,setToken}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const token=localStorage.getItem('token')
    const menuItem=[
        {
            path:"/dashboard",
            name:"Dashboard",
            icon:<FaTh/>
        },
       
        {
            path:"/invoices",
            name:"Invoives",
            icon:<FaThList/>
        },
        {
            path:"/new-invoice",
            name:"NewInvoice",
            icon:<FaFileMedical />
        },
        {
            path:"/setting",
            name:"Setting",
            icon:<FaCog/>
        },
        {
            path:"/about",
            name:"About",
            icon:<FcAbout/>
        },
        {
            path:"/contact",
            name:"Contact",
            icon:<MdContactPhone/>
        },
        {
            path:"/login",
            name:"Login",
            icon:<FaUserAlt/>
        }
    ]

        {
            token&&(menuItem.pop())
        }
        
        const logOut=()=>{
           
                localStorage.clear()
                toast.success("Logout successfull",{position:"top-center"})
                setToken(localStorage.getItem('token'))
           

        }
    return (
        <div className="container">
           <div style={{width: isOpen ? "300px" : "50px"}} className="sidebar">
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo">AIMPS</h1>
                   <div style={{marginLeft: isOpen ? "100px" : "0px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                           
                       </NavLink>

                   ))
                    
               }
                
                {
                           token&& <div className='logout-main'>
                                    <div className="logout-icon" onClick={logOut}><RiLogoutBoxRLine/></div>
                                    <div style={{display: isOpen ? "block" : "none"}} >
                                        <button onClick={logOut} className='logout'>Logout</button>
                                    </div>
                                </div>
                           }


           </div>
           <main>{children}</main>
        </div>
    );
};

export default Sidebar;