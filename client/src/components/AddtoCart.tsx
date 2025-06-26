import { useCartContext } from '../context/CartContext';
import { navigateTo } from '../utils/navigation';

const Cart = () => {
  const { cartItems, getCartTotal, removeFromCart, updateQuantity } = useCartContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 flex items-center gap-3">
            🛒 Your Cart
            {cartItems.length > 0 && (
              <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                {cartItems.length}
              </span>
            )}
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-slate-500 text-lg">Your cart is empty</p>
              <p className="text-slate-400 text-sm mt-2">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl hover:bg-white/80 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex gap-6 items-center">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-4 min-w-[120px] h-[120px] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                          className="w-full h-full object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="text-4xl text-slate-400">📦</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-xl text-slate-800 group-hover:text-slate-900 transition-colors truncate">
                        {item.name}
                      </h2>
                      <div className="mt-2 space-y-1">
                        <p className="text-slate-500 text-sm">
                          Unit Price: <span className="font-semibold text-slate-700">₹{item.price}</span>
                        </p>
                        <p className="text-slate-600 font-medium">
                          Subtotal: <span className="text-lg font-bold text-indigo-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center bg-gradient-to-r from-indigo-50 to-blue-50 rounded-full p-1 border border-indigo-100">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200 font-bold text-lg disabled:opacity-50"
                        >
                          −
                        </button>
                        <div className="mx-4 px-3 py-1 bg-white rounded-full shadow-sm border border-indigo-100">
                          <span className="font-bold text-slate-800 text-lg min-w-[2rem] text-center block">
                            {item.quantity}
                          </span>
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, +1)}
                          className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200 font-bold text-lg"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border border-red-200 hover:border-red-300 flex items-center justify-center text-red-500 hover:text-red-600 transition-all duration-200 shadow-md hover:shadow-lg group/remove"
                      >
                        <span className="group-hover/remove:scale-110 group-hover/remove:rotate-12 transition-all duration-200 text-lg">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-lg">Total Amount:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ₹{getCartTotal()}
                    </span>
                    
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-between gap-4">
            <button
              onClick={() => navigateTo("/")}
              className="px-6 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium border border-slate-300 shadow-sm transition"
            >
              ← Back
            </button>
            <button
              onClick={() => navigateTo("Billing")}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Proceed to Checkout →
            </button>
          </div>
      </div>
    </div>
            );
};

export default Cart;
