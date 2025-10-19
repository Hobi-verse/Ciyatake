import { formatINR } from "../../../utils/currency.js";
import QuantitySelector from "../../common/QuantitySelector.jsx";

const EditableOrderItem = ({ 
  item, 
  onQuantityChange, 
  className = "", 
  showSize = true 
}) => {
  if (!item) {
    return null;
  }

  const { title, size, price, quantity = 1, imageUrl, id } = item;

  const handleQuantityChange = (newQuantity) => {
    onQuantityChange?.(id, newQuantity);
  };

  return (
    <article
      className={`flex gap-4 rounded-2xl border border-[#DCECE9] bg-white p-4 ${className}`.trim()}
    >
      <div className="h-20 w-20 overflow-hidden rounded-2xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title ?? "Product image"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#DCECE9] text-xs text-slate-500">
            No image
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {showSize && size ? (
            <p className="text-xs text-slate-500">Size {size}</p>
          ) : null}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#b8985b]">
            {formatINR(price)} each
          </p>
          
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            max={10}
            variant="pill"
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Total: {formatINR(price * quantity)}</span>
        </div>
      </div>
    </article>
  );
};

export default EditableOrderItem;