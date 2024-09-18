import Invoice from '../model/InvoiceSchema.js' // Ensure the correct path to your Invoice model

export const newInvoive = async (req, res) => {
  try {
    // Extract bill data from the request body
    const { to, phone, address, products, total, email } = req.body;

    // Create a new bill instance
    const newInvoice = new Invoice({
      to,
      phone,
      address,
      products,
      total,
      email,
    });

    // Save the new bill to the database
    await newInvoice.save();
      res.status(200).json({ msg: "Invoice created successfully",invoice : newInvoice });
  } catch (error) {
    // Handle errors and send an error response
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get all invoice created by sigle user

export const invoices=async(req,res)=>{
  
  try {
    const email=req.body.email;
    const invoices=await Invoice.find({email})
    res.status(200).json({invoices})
    
  } catch (error) {
    res.status(500).json({msg:"Internal Server Error"})
  }
  

  }

// delete invoice 
export const deleteInvoice= async (req,res)=>{
  try {
    const invoiceId = req.params.id
    
    // Find the invoice by ID and delete it
    const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId)
    
    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Return success message
    res.json({ msg: 'Invoice deleted successfully', invoice: deletedInvoice });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

// Update the invoice 

export const updateInvoice = async (req, res) => {
  console.log("updateInvoice")

  const { id } = req.params;
  const updatedInvoice = req.body;
  console.log(updateInvoice)

  try {
    const invoice = await Invoice.findByIdAndUpdate(id, updatedInvoice, { new: true });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


