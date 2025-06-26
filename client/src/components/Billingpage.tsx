import React, { useState, useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import { navigateTo } from '../utils/navigation';

export default function BillingPage() {
  const { cartItems, getCartTotal } = useCartContext();
  const [customer, setCustomer] = useState({ name: '', email: '', address: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigateTo('/cart');
    }
  }, [cartItems]);

  useEffect(() => {
    setIsFormValid(customer.name && customer.email && customer.address);
  }, [customer]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const total = getCartTotal();
  const tax = total * 0.05;
  const grandTotal = total + tax;

  const handleSubmit = () => {
    if (isFormValid) {
      setSubmitted(true);
    }
  };

  const handleBackToForm = () => {
    setSubmitted(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
       <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigateTo('')}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigateTo('products')}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Products
            </button>
            <span className="text-gray-400">/</span>
         
          </nav>
        </div>
      </div>
      {!submitted ? (
        /* Premium Billing Form */
        <div className="max-w-2xl mx-auto p-6 pt-12">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-b from-blue-400 to-purple-700 p-8 text-center">
              <div className="text-4xl mb-3">🧾</div>
              <h1 className="text-3xl font-bold text-white mb-2">Billing Details</h1>
              <p className="text-blue-100">Please provide your information to generate invoice</p>
            </div>

            {/* Cart Summary */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Order Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-gray-500">Items</div>
                  <div className="font-bold text-lg text-gray-800">{cartItems.length}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-gray-500">Subtotal</div>
                  <div className="font-bold text-lg text-gray-800">₹{total.toLocaleString('en-IN')}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-gray-500">Total</div>
                  <div className="font-bold text-lg text-blue-600">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  value={customer.name}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  value={customer.email}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shipping Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  placeholder="Enter your complete shipping address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 resize-none"
                  rows={4}
                  value={customer.address}
                  onChange={handleInput}
                  required
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                  isFormValid 
                    ? 'bg-gray-900 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transform  transition-all duration-200 shadow-lg' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>📄</span>
                  Generate Invoice
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Premium A4 Invoice */
        <div className="p-4">
          {/* Print Controls */}
          <div className="max-w-4xl mx-auto mb-6 print:hidden">
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBackToForm}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                ← Back to Form
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                🖨️ Print Invoice
              </button>
            </div>
          </div>

          {/* A4 Invoice */}
          <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none" style={{ aspectRatio: '210/297', minHeight: '297mm' }}>
            <div className="h-full p-12 flex flex-col print:p-8">
              
              {/* Header Section */}
              <div className="flex justify-between items-start mb-12 print:mb-8">
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-lg mb-4 print:bg-gray-800">
                    <h1 className="text-3xl font-bold tracking-wide">INVOICE</h1>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="font-semibold text-gray-800">Your Company Name</div>
                    <div>123 Business Avenue</div>
                    <div>City, State 12345</div>
                    <div>Phone: +91 98765 43210</div>
                    <div>Email: info@company.com</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600 print:border-gray-400">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-8">
                        <span className="font-semibold text-gray-700">Invoice No:</span>
                        <span className="font-mono">INV-{Date.now().toString().slice(-6)}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="font-semibold text-gray-700">Date:</span>
                        <span>{new Date().toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="font-semibold text-gray-700">Due Date:</span>
                        <span>{new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill To Section */}
              <div className="mb-8 print:mb-6">
                <div className="border-l-4 border-blue-600 pl-4 mb-4 print:border-gray-400">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">BILL TO</h2>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg print:bg-transparent print:border print:border-gray-300">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <div className="font-bold text-gray-800 mb-2">{customer.name}</div>
                      <div className="text-gray-600 leading-relaxed">{customer.address}</div>
                    </div>
                    <div>
                      <div className="space-y-1">
                        <div><span className="font-semibold text-gray-700">Email:</span> {customer.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="flex-1 mb-8 print:mb-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden print:rounded-none">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white print:bg-gray-800">
                        <th className="px-4 py-4 text-left text-sm font-semibold tracking-wide">#</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold tracking-wide">DESCRIPTION</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold tracking-wide">QTY</th>
                        <th className="px-4 py-4 text-right text-sm font-semibold tracking-wide">UNIT PRICE</th>
                        <th className="px-4 py-4 text-right text-sm font-semibold tracking-wide">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cartItems.map((item, i) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm font-medium text-gray-600">
                            {String(i + 1).padStart(2, '0')}
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-800">{item.name}</div>
                          </td>
                          <td className="px-4 py-4 text-center text-sm text-gray-600">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-gray-600 font-mono">
                            ₹{item.price.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-4 text-right font-semibold text-gray-800 font-mono">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end mb-8 print:mb-6">
                <div className="w-80">
                  <div className="bg-gray-50 rounded-lg p-6 border print:bg-transparent">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Subtotal</span>
                        <span className="font-mono text-gray-800">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Tax (5%)</span>
                        <span className="font-mono text-gray-800">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t-2 border-gray-800">
                        <span className="text-lg font-bold text-gray-800">GRAND TOTAL</span>
                        <span className="text-xl font-bold text-blue-600 font-mono print:text-gray-800">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="mt-auto pt-8 border-t border-gray-200 print:pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-gray-600 print:gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">PAYMENT TERMS</h3>
                    <p className="leading-relaxed">
                      Payment is due within 30 days of invoice date. 
                      Late payments may incur additional charges.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">PAYMENT METHOD</h3>
                    <p className="leading-relaxed">
                      Bank Transfer, UPI, or Cheque payable to "Your Company Name"
                    </p>
                  </div>
                </div>
                
                <div className="text-center mt-8 pt-6 border-t border-gray-100 print:mt-4 print:pt-4">
                  <div className="inline-flex items-center gap-2 text-green-600 font-medium print:text-gray-600">
                    <span className="text-lg">💚</span>
                    <span>Thank you for your business!</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This is a computer generated invoice and does not require signature.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}