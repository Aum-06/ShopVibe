import { Minus, Plus, Trash } from "lucide-react";
import useCartStore from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-md hover:shadow-lg transition-shadow duration-300 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:gap-6">
        <div className="shrink-0 md:w-24">
          <img
            className="h-20 w-20 rounded object-cover md:h-24 md:w-24"
            src={item.image}
            alt={item.name}
          />
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-grey-900 dark:text-white hover:text-blue-400 dark:hover:text-blue-400 hover:underline">
            {item.name}
          </p>
          <p className="mt-1 text-sm text-gray-400">{item.description}</p>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-300 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500"
            onClick={() => updateQuantity(item._id, Math.max(item.quantity - 1, 1))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</p>
          <button
            className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-300 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <p className="text-lg font-bold text-blue-400">${item.price.toFixed(2)}</p>
          <button
            className="flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-300 hover:underline"
            onClick={() => removeFromCart(item._id)}
          >
            <Trash className="h-4 w-4" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
