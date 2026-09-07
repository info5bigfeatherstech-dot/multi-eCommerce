"use client";

import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { notifyAddToCart, notifyWishlist } from "@/lib/notify";
import { formatCurrency, cn } from "@/lib/utils";
import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import {
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ShoppingBag,
  Heart,
  Star,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
  Search,
} from "lucide-react";
import Button from "@/components/ui/Button";

// Category slug mapping helper
const SLUG_TO_NAME_MAP = {
  "home-living": "Home & Living",
  "kitchen-dining": "Kitchen & Dining",
  "electronics-gadgets": "Electronics & Gadgets",
  "beauty-personal-care": "Beauty & Personal Care",
  "beauty-care": "Beauty & Personal Care",
  "sports-fitness": "Sports & Fitness",
  "jewellery-accessories": "Jewellery & Accessories",
  "jewellery-acc": "Jewellery & Accessories",
  "home-decor": "Home Decor",
  "stationery-office-school": "Stationery, Office & School",
  "stationery-office": "Stationery, Office & School",
  "gifts-lifestyle": "Gifts & Lifestyle",
  "travel-outdoor": "Travel & Outdoor",
  "mix-items": "Mix Items",
  "under-99": "Deals Under ₹99",
  "mega-sale": "Mega Sale Wholesale",
  "just-arrived": "Just Arrived Collection",
};

export function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const storeProducts = useAppSelector((state) => state.products.items);
  const allProducts = storeProducts && storeProducts.length > 0 ? storeProducts : productsData;
  const categories = useAppSelector((state) => state.categories.items) || categoriesData;
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  // States
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedIds, setAddedIds] = useState({});

  // Lookup active category metadata
  const activeCategory = useMemo(() => {
    return (
      categories.find((c) => c.slug === slug || c.id === slug) || {
        name: SLUG_TO_NAME_MAP[slug] || (slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Category Products"),
        slug: slug,
        subCategories: [],
        itemCount: 150,
      }
    );
  }, [categories, slug]);

  // Filter products by category slug
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];
    const categoryName = SLUG_TO_NAME_MAP[slug] || activeCategory.name;

    if (slug === "under-99") {
      list = list.filter((p) => p.price <= 99);
    } else if (slug === "mega-sale") {
      list = list.filter((p) => p.isSale || (p.discount && parseInt(p.discount) >= 50));
    } else if (slug === "just-arrived") {
      list = list.slice(0, 12);
    } else if (categoryName) {
      const lowerCat = categoryName.toLowerCase();
      const matched = list.filter(
        (p) =>
          p.category &&
          (p.category.toLowerCase().includes(lowerCat) ||
            lowerCat.includes(p.category.toLowerCase()))
      );

      // If specific mock category has few items, include other high-rating items as related
      if (matched.length > 0) {
        list = matched;
      } else {
        // Fallback sample so category is never empty
        list = list.slice(0, 8);
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "discount") {
      list.sort((a, b) => {
        const discA = parseInt(a.discount) || 0;
        const discB = parseInt(b.discount) || 0;
        return discB - discA;
      });
    }

    return list;
  }, [allProducts, slug, activeCategory, searchQuery, sortBy]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addItem(product));
    notifyAddToCart(product, {
      onOpenCart: () => dispatch(setCartDrawerOpen(true)),
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    const isCurrentInWishlist = wishlistItems.some(
      (item) =>
        (item.slug && product.slug && item.slug === product.slug) ||
        (item.id && product.id && item.id === product.id)
    );
    dispatch(toggleWishlist(product));
    notifyWishlist(product, !isCurrentInWishlist, {
      onViewWishlist: () => navigate("/wishlist"),
    });
  };

  return (
    <div className="py-6 font-albert-sans space-y-6 animate-fadeIn max-w-[1600px] mx-auto px-4">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-inter text-slate-500 flex-wrap">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1 font-semibold">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400">Categories</span>
        <span>/</span>
        <span className="text-slate-900 font-bold">{activeCategory.name}</span>
      </div>

      {/* Category Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-slate-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent font-poppins font-black text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Factory Direct
            </span>
            <span className="text-xs text-slate-300 font-inter">
              GST Invoice & Bulk Rates Guaranteed
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-poppins font-black tracking-tight text-white">
            {activeCategory.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-inter leading-relaxed max-w-xl">
            Explore premium factory-manufactured {activeCategory.name.toLowerCase()} at competitive wholesale pricing. Fast dispatch across all PIN codes in India.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Subcategory Filter Pills (if present) */}
      {activeCategory.subCategories && activeCategory.subCategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setSelectedSubCategory("all")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-poppins font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs",
              selectedSubCategory === "all"
                ? "bg-primary text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:border-accent"
            )}
          >
            All Products
          </button>
          {activeCategory.subCategories.map((sub) => {
            const isSelected = selectedSubCategory === sub.slug;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubCategory(sub.slug)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-poppins font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs flex items-center gap-1.5",
                  isSelected
                    ? "bg-accent text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-accent"
                )}
              >
                <span>{sub.name}</span>
                {sub.itemCount && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-md",
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    {sub.itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Filter & Sort Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search within Category */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search in ${activeCategory.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-inter focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Count & Sort Selector */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          <span className="text-xs text-slate-500 font-inter whitespace-nowrap">
            Showing <strong className="text-slate-800 font-poppins">{filteredProducts.length}</strong> items
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 font-inter hidden md:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-poppins font-bold text-slate-700 bg-white focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="featured">Featured Deals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-poppins font-bold text-lg text-slate-800">
            No products match your filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-inter">
            Try clearing the search query or exploring other wholesale categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSubCategory("all");
            }}
            className="px-5 py-2.5 rounded-xl bg-accent text-white font-poppins font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {filteredProducts.map((product) => {
            const productSlug = product.slug || product.id;
            const isInWishlist = wishlistItems.some(
              (item) =>
                (item.slug && product.slug && item.slug === product.slug) ||
                (item.id && product.id && item.id === product.id)
            );
            const isAdded = !!addedIds[product.id];

            return (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${productSlug}`)}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3 shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Top Image Box */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-2.5">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Discount Badge */}
                  {product.discount && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-accent text-white text-[10px] font-poppins font-black shadow-sm">
                      {product.discount}
                    </span>
                  )}

                  {/* Wishlist Heart Icon */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer z-10"
                    aria-label="Toggle Wishlist"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isInWishlist
                          ? "fill-rose-500 text-rose-500"
                          : "text-slate-400 hover:text-rose-500"
                      )}
                    />
                  </button>

                  {/* MOQ Pill */}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[9px] font-inter font-semibold">
                    MOQ: {product.moq || 1} Pc
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 text-left flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 mb-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating || 4.8}</span>
                      <span className="text-slate-400 font-normal">
                        ({product.reviewCount || 42})
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3
                      title={product.name}
                      className="font-poppins font-bold text-xs text-slate-800 line-clamp-2 leading-snug group-hover:text-accent transition-colors"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Price Row */}
                  <div className="pt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-poppins font-black text-accent">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-slate-400 line-through font-inter">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={cn(
                        "w-full mt-2.5 py-2 px-3 rounded-xl font-poppins font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 shadow-xs cursor-pointer",
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-primary hover:bg-primary-700 text-white"
                      )}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Added ✓</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
