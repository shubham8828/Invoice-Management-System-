import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './InvoiceDetails.css';
import axios from "axios";

const InvoiceDetails = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state);
  const [user, setUser] = useState();
  const [isEditing, setIsEditing] = useState(false); // Track if we are in edit mode
  const [editableProducts, setEditableProducts] = useState(data.products);
  const logo = localStorage.getItem('image');

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  // Fetch user data
  useEffect(() => {
    const email = localStorage.getItem('email');
    const fetchUserData = async () => {
      try {
        const response = await axios.post('https://invoice-management-system-server.vercel.app/user', { email });
        setUser(response.data.user);
      } catch (error) {
        alert("Internal Server Error");
      }
    };

    fetchUserData();
  }, []);

  // Handle edit/update toggle
  const handleEditClick = () => {
    if (isEditing) {
      // When in update mode, save the updated data
      saveUpdatedData();
    }
    setIsEditing(!isEditing); // Toggle edit mode
  };

  // Handle change for editable fields
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...editableProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setEditableProducts(updatedProducts);
  };

  // Save updated data to the database
  const saveUpdatedData = async () => {
    try {
      // Prepare the updated invoice object
      const updatedInvoice = {
        ...data,
        products: editableProducts, // Ensure editableProducts is defined and updated correctly
      };
  
      // Send a PUT request to update the invoice
      const response = await axios.put(`https://invoice-management-system-server.vercel.app/update/${data.invoiceId}`, updatedInvoice);
      
      // Log the response or updated invoice data if needed
      console.log(response.data);
  
      // Update the data state with the new values
      setData(updatedInvoice);
  
      // Alert the user that the update was successful
      alert("Invoice updated successfully!");

    } catch (error) {
      // Handle errors, such as displaying an alert
      alert("Failed to update the invoice. Please try again.");
    }
  };
  

  return (
    <div className="invoice-container">
      <div className="btn-container">
        <button className="print-btn" onClick={handleEditClick}>
          {isEditing ? "Update" : "Edit"}
        </button>
        <button className="print-btn">Print</button>
      </div>
      <div className="header-conatainer">
        <h1>INVOICE</h1>
        <img src={logo} alt="company logo" />
      </div>

      <div className="main-detail-container">
        {user && (
          <div className="detail-container">
            <span>{user.name}</span> <br />
            <span>{user.address}</span> <br />
            <span>{user.email}</span> <br />
          </div>
        )}

        <div className="detail-container">
          <h3>Bill to: </h3>
          <span>{data.to}</span> <br />
          <span>{data.phone}</span> <br />
          <span>{data.address}</span>
        </div>

        <div className="detail-container">
          <h4>Invoice Number: </h4>
          <span>{data.invoiceId}</span> <br /><br />
          <h4>Date:</h4>
          <span>{formatDate(data.date)}</span>
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {editableProducts.map((item, index) => {
            const srNo = index + 1;
            const price = parseFloat(item.price);
            const quantity = parseFloat(item.quantity);
            const total = price * quantity;
            return (
              <tr key={item.id}>
                <td>{srNo}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                    />
                  ) : (
                    price
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                    />
                  ) : (
                    quantity
                  )}
                </td>
                <td>{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="invoice-main-footer">
        <div className="invoice-footer">
          <p>Sub Total</p>
          <span>{(data.total - data.total * 0.18).toFixed(2)}</span>
        </div>
        <div className="invoice-footer">
          <p>GST (18%)</p>
          <span>{(data.total * 0.18).toFixed(2)}</span>
        </div>
        <div className="invoice-footer">
          <p>Total</p>
          <span>{data.total}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
