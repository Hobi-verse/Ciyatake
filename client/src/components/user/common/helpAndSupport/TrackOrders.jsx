import {
  ArrowLeft,
  Search,
  Package,
  CheckCircle,
  Truck,
  MapPin,
  Home,
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  // Mock order data - in real app, this would come from API/database
  const mockOrderData = {
    orderId: "CYT123456789",
    placedDate: "October 10, 2025",
    totalAmount: "₹3,499",
    paymentMethod: "Credit Card (****1234)",
    deliveryAddress:
      "123 Fashion Street, Andheri West, Mumbai, Maharashtra - 400058",
    currentStatus: "shipped",
    courierPartner: "BlueDart Express",
    trackingNumber: "BD987654321",
    expectedDelivery: "October 20, 2025",
    product: {
      name: "Premium Cotton Casual Shirt",
      image:
        "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=200&h=200",
      quantity: 2,
      price: "₹1,749",
    },
    statusHistory: [
      {
        status: "placed",
        date: "Oct 10, 2025",
        time: "10:30 AM",
        completed: true,
      },
      {
        status: "packed",
        date: "Oct 11, 2025",
        time: "02:15 PM",
        completed: true,
      },
      {
        status: "shipped",
        date: "Oct 13, 2025",
        time: "09:00 AM",
        completed: true,
      },
      { status: "out_for_delivery", date: "", time: "", completed: false },
      { status: "delivered", date: "", time: "", completed: false },
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, validate order and email, then fetch data
    if (orderNumber && email) {
      setShowTracking(true);
    }
  };

  const getStatusIcon = (status, completed) => {
    const iconClass = completed ? "text-green-600" : "text-gray-400";
    const size = "w-8 h-8";

    switch (status) {
      case "placed":
        return <CheckCircle className={`${size} ${iconClass}`} />;
      case "packed":
        return <Package className={`${size} ${iconClass}`} />;
      case "shipped":
        return <Truck className={`${size} ${iconClass}`} />;
      case "out_for_delivery":
        return <MapPin className={`${size} ${iconClass}`} />;
      case "delivered":
        return <Home className={`${size} ${iconClass}`} />;
      default:
        return <Package className={`${size} ${iconClass}`} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      placed: "Order Placed",
      packed: "Packed",
      shipped: "Shipped",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
    };
    return labels[status] || status;
  };

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}, []);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-5xl px-4 py-8 mx-auto sm:px-6 lg:px-8 sm:py-12">
        <a
          href="/"
          className="inline-flex items-center text-[#8b7355] hover:text-[#a08968] mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </a>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#8b7355] mb-6 sm:mb-8">
          Track Your Order
        </h1>

        {/* Input Form */}
        {!showTracking && (
          <div className="p-6 bg-white shadow-md rounded-xl sm:p-8">
            <p className="mb-6 text-gray-600">
              Enter your order details to track your shipment status.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="orderNumber"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Order Number *
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., CYT123456789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-transparent transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8b7355] text-white py-3 px-6 rounded-lg hover:bg-[#a08968] transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 font-medium"
              >
                <Search className="w-5 h-5" />
                <span>Track Order</span>
              </button>
            </form>
          </div>
        )}

        {/* Tracking Results */}
        {showTracking && (
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="p-6 bg-white shadow-md rounded-xl sm:p-8">
              <h2 className="text-2xl font-semibold text-[#8b7355] mb-6">
                Order Summary
              </h2>

              {/* Product Info */}
              <div className="flex flex-col gap-4 pb-6 border-b border-gray-200 sm:flex-row sm:gap-6">
                <img
                  src={mockOrderData.product.image}
                  alt={mockOrderData.product.name}
                  className="object-cover w-full h-48 rounded-lg sm:w-32 sm:h-32"
                />
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    {mockOrderData.product.name}
                  </h3>
                  <p className="mb-2 text-gray-600">
                    Quantity: {mockOrderData.product.quantity}
                  </p>
                  <p className="text-lg font-semibold text-[#8b7355]">
                    {mockOrderData.product.price} each
                  </p>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 sm:gap-6">
                <div>
                  <p className="mb-1 text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">
                    {mockOrderData.orderId}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Placed Date</p>
                  <p className="font-semibold text-gray-800">
                    {mockOrderData.placedDate}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Total Amount</p>
                  <p className="font-semibold text-[#8b7355] text-xl">
                    {mockOrderData.totalAmount}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold text-gray-800">
                    {mockOrderData.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <p className="mb-2 text-sm text-gray-500">Delivery Address</p>
                <p className="leading-relaxed text-gray-800">
                  {mockOrderData.deliveryAddress}
                </p>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="p-6 bg-white shadow-md rounded-xl sm:p-8">
              <h2 className="text-2xl font-semibold text-[#8b7355] mb-8">
                Order Status
              </h2>
              /* Mobile View - Vertical Timeline */
              <div className="block lg:hidden">
                {mockOrderData.statusHistory.map((item, index) => (
                  <div key={index} className="flex items-start mb-8 last:mb-0">
                    <div className="flex flex-col items-center mr-4">
                      {getStatusIcon(item.status, item.completed)}
                      {index < mockOrderData.statusHistory.length - 1 && (
                        <div
                          className={`w-1 h-16 mt-2 ${
                            item.completed ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3
                        className={`font-semibold text-lg mb-1 ${
                          item.completed ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {getStatusLabel(item.status)}
                      </h3>
                      {item.completed && (
                        <p className="text-sm text-gray-600">
                          {item.date} at {item.time}
                        </p>
                      )}
                      {!item.completed &&
                        item.status === "out_for_delivery" && (
                          <p className="text-sm text-gray-500">Expected soon</p>
                        )}
                      {!item.completed && item.status === "delivered" && (
                        <p className="text-sm text-gray-500">Pending</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop View - Horizontal Timeline */}
              <div className="hidden lg:block">
                <div className="relative flex items-start justify-between">
                  {/* Progress Line */}
                  <div className="absolute left-0 right-0 h-1 bg-gray-300 top-8 -z-10">
                    <div
                      className="h-full transition-all duration-500 bg-green-500"
                      style={{
                        width: `${
                          (mockOrderData.statusHistory.filter(
                            (s) => s.completed
                          ).length -
                            1) *
                          25
                        }%`,
                      }}
                    />
                  </div>

                  {mockOrderData.statusHistory.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center"
                      style={{ width: "20%" }}
                    >
                      <div className="p-2 bg-white rounded-full">
                        {getStatusIcon(item.status, item.completed)}
                      </div>
                      <h3
                        className={`font-semibold text-center mt-4 mb-1 ${
                          item.completed ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {getStatusLabel(item.status)}
                      </h3>
                      {item.completed && (
                        <div className="text-sm text-center text-gray-600">
                          <p>{item.date}</p>
                          <p>{item.time}</p>
                        </div>
                      )}
                      {!item.completed &&
                        item.status === "out_for_delivery" && (
                          <p className="text-sm text-gray-500">Expected soon</p>
                        )}
                      {!item.completed && item.status === "delivered" && (
                        <p className="text-sm text-gray-500">Pending</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="p-6 bg-white shadow-md rounded-xl sm:p-8">
              <h2 className="text-2xl font-semibold text-[#8b7355] mb-6">
                Shipment Details
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start space-x-3">
                  <Truck className="w-6 h-6 text-[#8b7355] flex-shrink-0 mt-1" />
                  <div>
                    <p className="mb-1 text-sm text-gray-500">
                      Courier Partner
                    </p>
                    <p className="font-semibold text-gray-800">
                      {mockOrderData.courierPartner}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Package className="w-6 h-6 text-[#8b7355] flex-shrink-0 mt-1" />
                  <div>
                    <p className="mb-1 text-sm text-gray-500">
                      Tracking Number
                    </p>
                    <p className="font-semibold text-gray-800">
                      {mockOrderData.trackingNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-[#8b7355] flex-shrink-0 mt-1" />
                  <div>
                    <p className="mb-1 text-sm text-gray-500">
                      Expected Delivery
                    </p>
                    <p className="font-semibold text-gray-800">
                      {mockOrderData.expectedDelivery}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="bg-[#f5f1e8] rounded-lg p-4">
                  <p className="text-sm leading-relaxed text-gray-700">
                    <span className="font-semibold">Note:</span> Delivery times
                    are estimates and may vary based on location and courier
                    availability. You will receive updates via email and SMS.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowTracking(false)}
                className="bg-[#8b7355] text-white py-3 px-8 rounded-lg hover:bg-[#a08968] transition-all shadow-md hover:shadow-lg font-medium"
              >
                Track Another Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
