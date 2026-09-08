import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { MapPin, Plus, Trash2, Check, X, Pencil } from "lucide-react";
import { toast } from "sonner";

const INITIAL_FORM_STATE = {
  title: "",
  contactName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export const ProfileAddressesTab = React.memo(function ProfileAddressesTab() {
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      title: "Primary Central Warehouse",
      contactName: "Rahul Sharma",
      phone: "+91 98765 43210",
      line1: "Plot No. 42, GIDC Industrial Estate, Phase 2",
      line2: "Near Express Highway Circle",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "382445",
      isDefault: true,
    },
    {
      id: "addr-2",
      title: "Retail Branch Store #1",
      contactName: "Sanjay Patel",
      phone: "+91 98250 11223",
      line1: "Shop 12-14, Ground Floor, Trade Center Complex",
      line2: "C.G. Road",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380009",
      isDefault: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(INITIAL_FORM_STATE);

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setIsModalOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isModalOpen]);

  const handleOpenAdd = () => {
    setEditingAddressId(null);
    setAddressForm(INITIAL_FORM_STATE);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      title: addr.title || "",
      contactName: addr.contactName || "",
      phone: addr.phone || "",
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed.");
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast.success("Default shipping address updated.");
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.title || !addressForm.line1 || !addressForm.pincode) {
      toast.error("Please fill in required fields (Label, Street, Pincode).");
      return;
    }

    if (editingAddressId) {
      // Editing existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddressId
            ? { ...addr, ...addressForm }
            : addr
        )
      );
      toast.success("Delivery address updated successfully! ✓");
    } else {
      // Adding new address
      const created = {
        id: `addr-${Date.now()}`,
        ...addressForm,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, created]);
      toast.success("New delivery address added successfully! ✓");
    }

    setIsModalOpen(false);
    setEditingAddressId(null);
    setAddressForm(INITIAL_FORM_STATE);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-poppins font-bold text-lg text-slate-900">
            Saved Delivery Addresses
          </h2>
          <p className="text-xs text-slate-500 font-inter mt-0.5">
            Default delivery destinations for freight dispatch and cargo logistics
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-poppins text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={cn(
              "p-4 sm:p-5 rounded-2xl border transition-all duration-150 relative flex flex-col justify-between",
              addr.isDefault
                ? "border-accent/40 bg-orange-50/20 shadow-xs"
                : "border-slate-200/80 bg-white hover:border-slate-300"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-poppins font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  <MapPin
                    size={15}
                    className={addr.isDefault ? "text-accent" : "text-slate-400"}
                  />
                  {addr.title}
                </span>
                {addr.isDefault && (
                  <span className="text-[10px] font-poppins font-bold uppercase bg-accent text-white px-2 py-0.5 rounded-md shadow-2xs">
                    Default
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-slate-700 font-inter">
                {addr.contactName} {addr.phone && `(${addr.phone})`}
              </p>
              <p className="text-xs text-slate-500 font-inter mt-1 leading-relaxed">
                {addr.line1}
                {addr.line2 && `, ${addr.line2}`}
                <br />
                {addr.city}, {addr.state} -{" "}
                <strong className="text-slate-700">{addr.pincode}</strong>
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                {!addr.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[11px] font-poppins font-semibold text-accent hover:underline cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[11px] font-poppins font-medium text-emerald-600 flex items-center gap-1">
                    <Check size={12} /> Primary Hub
                  </span>
                )}

                {/* Edit Address Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(addr)}
                  className="inline-flex items-center gap-1 text-[11px] font-poppins font-semibold text-slate-600 hover:text-accent cursor-pointer transition-colors"
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                aria-label="Delete address"
                title="Delete address"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding/editing address - Portal to document.body */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-all duration-200 animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-modal-title"
          >
            <div className="relative bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-slate-200 animate-fadeIn">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all hover:rotate-90 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              <div className="mb-4 pr-8">
                <h3
                  id="address-modal-title"
                  className="font-poppins font-bold text-base text-slate-900"
                >
                  {editingAddressId ? "Edit Delivery Address" : "Add Delivery Location"}
                </h3>
                <p className="text-xs text-slate-400 font-inter mt-0.5">
                  {editingAddressId
                    ? "Update location destination and contact details"
                    : "Add warehouse or store address for freight dispatch"}
                </p>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-poppins font-semibold text-slate-600 uppercase">
                    Address Label <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Central Warehouse / Surat Branch / Retail Shop"
                    value={addressForm.title}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, title: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm mt-1 outline-none focus:border-accent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-poppins font-semibold text-slate-600 uppercase">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={addressForm.contactName}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          contactName: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs mt-1 outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-poppins font-semibold text-slate-600 uppercase">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, phone: e.target.value })
                      }
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs mt-1 outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-poppins font-semibold text-slate-600 uppercase">
                    Address Line 1 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Plot / Shop No, Industrial Area, Street"
                    value={addressForm.line1}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, line1: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm mt-1 outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-poppins font-semibold text-slate-600 uppercase">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Near landmark, Phase, Area"
                    value={addressForm.line2}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, line2: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm mt-1 outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-poppins font-semibold text-slate-600 uppercase">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Ahmedabad"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs mt-1 outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-poppins font-semibold text-slate-600 uppercase">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="Gujarat"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs mt-1 outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-poppins font-semibold text-slate-600 uppercase">
                      Pincode <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="380001"
                      value={addressForm.pincode}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, pincode: e.target.value })
                      }
                      className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs mt-1 outline-none focus:border-accent"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-accent text-white font-poppins text-xs font-bold shadow-xs hover:bg-accent-hover cursor-pointer transition-all"
                  >
                    {editingAddressId ? "Update Address" : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
});

export default ProfileAddressesTab;
