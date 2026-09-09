import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateVerificationStatus } from "@/store/slices/adminOrdersSlice";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Phone,
  MessageSquare,
  Check,
  X,
  Search,
  Building2,
  MapPin,
  FileCheck2,
  Edit3,
  ThumbsUp,
  Ban,
  HelpCircle,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DeliveryVerificationView() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.adminOrders.items);

  const [activeFilter, setActiveFilter] = useState("Pending Verification");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNotesOrderId, setEditingNotesOrderId] = useState(null);
  const [noteText, setNoteText] = useState("");

  const filteredOrders = orders.filter((order) => {
    if (activeFilter !== "All" && order.verificationStatus !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.businessName.toLowerCase().includes(q) ||
        order.customer.phone.includes(q) ||
        order.customer.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = orders.filter((o) => o.verificationStatus === "Pending Verification").length;
  const verifiedCount = orders.filter((o) => o.verificationStatus === "Verified").length;
  const flaggedCount = orders.filter((o) => o.verificationStatus === "Flagged").length;

  const handleApprove = (order) => {
    dispatch(
      updateVerificationStatus({
        orderId: order.id,
        verificationStatus: "Verified",
        verificationNotes: `Verified by Admin on ${new Date().toLocaleDateString("en-IN")}. Approved for warehouse packing.`,
      })
    );
    toast.success(`Order ${order.id} approved for dispatch!`);
  };

  const handleFlag = (order) => {
    const reason = prompt("Enter reason for flagging order:", "Customer phone unreachable or invalid address");
    if (reason !== null) {
      dispatch(
        updateVerificationStatus({
          orderId: order.id,
          verificationStatus: "Flagged",
          verificationNotes: `FLAGGED: ${reason}`,
        })
      );
      toast.error(`Order ${order.id} flagged and held from dispatch.`);
    }
  };

  const handleSaveNotes = (orderId) => {
    dispatch(
      updateVerificationStatus({
        orderId,
        verificationStatus: orders.find((o) => o.id === orderId)?.verificationStatus,
        verificationNotes: noteText,
      })
    );
    toast.success("Verification notes updated!");
    setEditingNotesOrderId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-inter">
            <span>Orders</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Delivery Verification</span>
          </div>
          <h1 className="text-2xl font-poppins font-black text-slate-900 mt-1">
            Order & Customer Verification Before Dispatch
          </h1>
          <p className="text-xs text-slate-500 font-inter">
            Prevent RTO fraud, verify wholesale buyer credentials, and approve orders before handover to logistics
          </p>
        </div>
      </div>

      {/* Verification Status Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveFilter("Pending Verification")}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between",
            activeFilter === "Pending Verification"
              ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400/20"
              : "bg-white border-slate-200 hover:border-amber-200"
          )}
        >
          <div>
            <span className="text-xs font-poppins font-bold text-amber-700 block">Pending Verification</span>
            <span className="text-2xl font-poppins font-black text-slate-900 block mt-1">{pendingCount}</span>
            <span className="text-[11px] text-slate-400 font-inter">Action required immediately</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => setActiveFilter("Verified")}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between",
            activeFilter === "Verified"
              ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20"
              : "bg-white border-slate-200 hover:border-emerald-200"
          )}
        >
          <div>
            <span className="text-xs font-poppins font-bold text-emerald-700 block">Verified & Approved</span>
            <span className="text-2xl font-poppins font-black text-slate-900 block mt-1">{verifiedCount}</span>
            <span className="text-[11px] text-slate-400 font-inter">Safe to dispatch</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => setActiveFilter("Flagged")}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between",
            activeFilter === "Flagged"
              ? "bg-rose-50 border-rose-300 ring-2 ring-rose-400/20"
              : "bg-white border-slate-200 hover:border-rose-200"
          )}
        >
          <div>
            <span className="text-xs font-poppins font-bold text-rose-700 block">Flagged / Held Orders</span>
            <span className="text-2xl font-poppins font-black text-slate-900 block mt-1">{flaggedCount}</span>
            <span className="text-[11px] text-slate-400 font-inter">Suspicious or invalid data</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {["All", "Pending Verification", "Verified", "Flagged"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-poppins font-bold transition-all cursor-pointer",
                activeFilter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search buyer, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-accent font-inter"
          />
        </div>
      </div>

      {/* Order Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-poppins font-bold text-sm text-slate-700">No orders in "{activeFilter}" queue</p>
            <p className="text-xs text-slate-400 mt-1">Select another filter above to review orders.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const cleanPhone = order.customer.phone.replace(/[^0-9]/g, "");
            const isEditing = editingNotesOrderId === order.id;

            return (
              <div
                key={order.id}
                className={cn(
                  "bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-4",
                  order.verificationStatus === "Flagged"
                    ? "border-rose-300 bg-rose-50/20"
                    : order.verificationStatus === "Pending Verification"
                    ? "border-amber-300 bg-amber-50/10"
                    : "border-slate-200"
                )}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-poppins font-black text-base text-slate-900">{order.id}</span>
                    <span className="text-xs text-slate-500">{order.date}</span>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-poppins font-bold",
                        order.verificationStatus === "Verified" && "bg-emerald-100 text-emerald-800",
                        order.verificationStatus === "Pending Verification" && "bg-amber-100 text-amber-800",
                        order.verificationStatus === "Flagged" && "bg-rose-100 text-rose-800"
                      )}
                    >
                      {order.verificationStatus}
                    </span>
                    {order.paymentMethod.includes("Cash") && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        ⚠️ COD High Risk Check
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-poppins font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-accent" />
                      <span>Call Buyer</span>
                    </a>
                    <a
                      href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(order.customer.name)},%20this%20is%20ApexMart%20Wholesale%20verifying%20your%20order%20${order.id}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-poppins font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs font-inter">
                  {/* Buyer details */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider block">
                      Buyer Identity
                    </span>
                    <p className="font-bold text-slate-900">{order.customer.name}</p>
                    <p className="text-slate-600 font-medium">{order.customer.businessName}</p>
                    <p className="text-slate-500 font-mono">GSTIN: {order.customer.gstNumber}</p>
                    <p className="text-slate-500">Phone: {order.customer.phone}</p>
                  </div>

                  {/* Shipping address & serviceability */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider block">
                      Destination Address
                    </span>
                    <p className="text-slate-700 leading-relaxed">{order.customer.address}</p>
                    <p className="text-slate-900 font-bold">
                      {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                      <Check className="w-3 h-3" /> Pincode Serviceable by Delhivery / BlueDart
                    </span>
                  </div>

                  {/* Order Financials & Risk */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-poppins font-bold text-slate-400 uppercase tracking-wider block">
                      Financial Summary
                    </span>
                    <p className="text-sm font-poppins font-bold text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-slate-600">Payment: <strong>{order.paymentMethod}</strong></p>
                    <p className="text-slate-500">Items: {order.items.length} products ({order.items.reduce((s, i) => s + i.qty, 0)} units)</p>
                  </div>
                </div>

                {/* Verification Notes Bar */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-poppins font-bold text-slate-700 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-accent" />
                      <span>Internal Verification Log:</span>
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingNotesOrderId(order.id);
                          setNoteText(order.verificationNotes);
                        }}
                        className="text-[11px] text-accent hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Log</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={2}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-inter focus:outline-none focus:border-accent"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingNotesOrderId(null)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNotes(order.id)}
                          className="px-3 py-1 bg-slate-900 text-white font-poppins font-bold text-xs rounded-lg hover:bg-slate-800"
                        >
                          Save Log
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-700 italic">{order.verificationNotes}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    {order.verificationStatus !== "Verified" && (
                      <button
                        onClick={() => handleApprove(order)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-poppins font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Approve For Dispatch</span>
                      </button>
                    )}

                    {order.verificationStatus !== "Flagged" && (
                      <button
                        onClick={() => handleFlag(order)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-poppins font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Flag / Hold Order</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Order Status: <strong className="text-slate-700">{order.orderStatus}</strong>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
