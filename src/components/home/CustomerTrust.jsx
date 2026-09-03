"use client";

import React from "react";
import { Star, ShieldCheck, Truck, Award, CheckCircle2, Building2 } from "lucide-react";

export function CustomerTrust() {
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      business: "Kumar Electronics & Mobiles",
      location: "Delhi, India",
      comment: "Ordering Electronics & Gadgets wholesale with zero MOQ transformed my retail shop inventory turnover. Instant GST billing makes tax compliance seamless!",
      rating: 5,
      category: "Electronics & Gadgets",
    },
    {
      id: 2,
      name: "Priya Sharma",
      business: "Glow & Charm Boutique",
      location: "Mumbai, India",
      comment: "The Beauty & Personal Care section offers top quality hair trimmers and skincare tools at unbeatable factory prices. Same day dispatch is super reliable.",
      rating: 5,
      category: "Beauty & Personal Care",
    },
    {
      id: 3,
      name: "Anand Patel",
      business: "Home Comfort Mart",
      location: "Ahmedabad, India",
      comment: "Home & Living and Kitchen & Dining items sell extremely fast in our store. Packaging is sturdy and product descriptions match the physical stock perfectly.",
      rating: 5,
      category: "Home & Living",
    },
  ];

  const stats = [
    { label: "Active Retail Partners", value: "50,000+", icon: Building2 },
    { label: "Products Delivered", value: "1.2 Million+", icon: Truck },
    { label: "Verified GST Orders", value: "100%", icon: ShieldCheck },
    { label: "On-Time Dispatch Rate", value: "99.8%", icon: Award },
  ];

  return (
    <section className="py-8">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Statistics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 p-2 border-r last:border-r-0 border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-accent flex items-center justify-center flex-shrink-0">
                  <IconComp className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-poppins font-black text-xl md:text-2xl text-slate-900">
                    {stat.value}
                  </h4>
                  <p className="font-inter text-xs text-slate-500 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
          <span className="text-xs font-poppins font-bold uppercase tracking-wider text-accent">
            Trusted By Retailers
          </span>
          <h2 className="section-title text-2xl md:text-3xl font-extrabold text-slate-900">
            What Our Wholesale Buyers Say
          </h2>
          <p className="text-xs text-slate-500 font-inter">
            Thousands of store owners, resellers & business owners rely on ApexMart for direct factory sourcing.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating & Category Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-poppins font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>

                <p className="font-inter text-xs text-slate-700 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-poppins font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                  </h4>
                  <p className="font-inter text-[11px] text-slate-500">
                    {item.business} • {item.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CustomerTrust;
