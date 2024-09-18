import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Invoice.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  // Fetch invoices from the backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await axios.post('http://localhost:4000/invoice/get', { email });
        setInvoices(response.data.invoices);
        console.log(response.data)

      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  // Handle invoice deletion
  const deleteInvoice = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/invoice/delete/${id}`)
      .then((res)=>{
        toast.success(res.data.msg,{position:'top-center'})
        setInvoices(invoices.filter(invoice => invoice._id !== id));
      })
     
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error("Internal Server Error",{position:'top-center'})

    }
  };

  return (
    <div className='invoices-container'>
      {invoices.length > 0 ? (
        invoices.map((data) => {
          // Split the 'to' field by space
          const [firstName] = data.to.split(' ');

          return (
            <div className="box" key={data._id}>
              <p>{firstName}</p>
              <p>{new Date(data.date).toLocaleDateString()}</p>
              <p>Rs. {data.total}</p>
              <button 
                className="delete-btn"
                onClick={() => deleteInvoice(data._id)}
              >
                <i className="fa-solid fa-trash"></i> Delete
              </button>
              <button
                onClick={() => navigate("/invoice-details", { state: data })}
                className="view-btn"
              >
                <i className="fa-solid fa-eye"></i> View
              </button>
            </div>
          );
        })
      ) : (
        <div className="no-invoice-wrapper">
          <p>You Don't Have Any Invoices</p>
          <button onClick={() => navigate('/new-invoice')}>Create New Invoice</button>
        </div>
      )}
    </div>
  );
};

export default Invoices;
