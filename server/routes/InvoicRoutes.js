import express from 'express'
import { deleteInvoice, invoices, newInvoive, updateInvoice} from '../controller/InvoiceController.js';


const invoiceRoutes=express.Router();
invoiceRoutes.post('/create',newInvoive)
invoiceRoutes.post('/get',invoices)
invoiceRoutes.delete('/delete/:id',deleteInvoice)
invoiceRoutes.put('/update/:id',updateInvoice)


export default invoiceRoutes;