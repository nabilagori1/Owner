import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Filter, Sparkles, X, Check, Utensils } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_LIST } from '../data/menuData';
import { MenuItem } from '../types';

export const DigitalMenuView: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addToCart,
    cart,
    updateCartQuantity,
    setActiveModalProduct,
    selectedTable,
    setSelectedTable,
  } = useApp();

  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Filter items based on Category, Search query, and Featured flag
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      // Featured match
      if (onlyFeatured && !item.featured) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [menuItems, selectedCategory, searchQuery, onlyFeatured, sortBy]);

  // Check how many of this item is currently in the cart
  const getItemCartQty = (itemId: string) => {
    return cart
      .filter((ci) => ci.menuItemId === itemId)
      .reduce((sum, ci) => sum + ci.quantity, 0);
  };

  const handleAddClick = (item: MenuItem) => {
    if (item.customizationOptions && item.customizationOptions.length > 0) {
      setActiveModalProduct(item);
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="py-10 bg-[#F7F2E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Table Banner if table QR scanned */}
        {selectedTable && (
          <div className="mb-6 p-4 rounded-sm bg-[#24364B] text-[#FFFDF8] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B99568] flex items-center justify-center font-bold text-xs text-[#24364B]">
                {selectedTable}
              </div>
              <div>
                <p className="text-xs tracking-wider uppercase font-semibold text-[#E9DDC9]">
                  DINE-IN ORDERING ACTIVE
                </p>
                <p className="text-sm font-medium">
                  Ordering directly to <span className="underline font-bold">Table #{selectedTable}</span> on the Rooftop Terrace
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTable(null)}
              className="text-xs text-[#E9DDC9] hover:text-white underline cursor-pointer"
            >
              Clear Table
            </button>
          </div>
        )}

        {/* Menu Page Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#68705A] font-semibold mb-2">
            100% PURE VEGETARIAN · ROOFTOP DINING
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#24364B] tracking-tight">
            The Digital Menu
          </h1>
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-[1px] w-12 bg-[#B99568]/40" />
            <div className="text-[#B99568] text-xs">✦</div>
            <div className="h-[1px] w-12 bg-[#B99568]/40" />
          </div>
          <p className="text-sm text-[#765D49]">
            Explore our extensive selection of comfort food, freshly brewed Gujarati chais, artisan coffees, thin crust pizzas, and hot sizzlers.
          </p>
        </div>

        {/* Search Bar & Quick Filters */}
        <div className="bg-[#FFFDF8] border border-[#E9DDC9] p-4 rounded-sm shadow-xs mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#765D49]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food, drinks & favourites (e.g. coffee, pizza, maggi, chai)..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#F7F2E8]/60 border border-[#E9DDC9] rounded-sm text-sm text-[#24364B] placeholder-[#765D49]/60 focus:outline-none focus:border-[#B99568]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between md:justify-end">
              <button
                onClick={() => setOnlyFeatured(!onlyFeatured)}
                className={`px-3.5 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border ${
                  onlyFeatured
                    ? 'bg-[#24364B] text-[#FFFDF8] border-[#24364B]'
                    : 'bg-[#FFFDF8] text-[#765D49] border-[#E9DDC9] hover:bg-[#E9DDC9]/30'
                }`}
              >
                ★ Favourites Only
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm text-xs text-[#24364B] font-medium focus:outline-none focus:border-[#B99568] cursor-pointer"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Horizontal Navigation Chips */}
        <div className="relative mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none no-scrollbar">
            {CATEGORIES_LIST.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#24364B] text-[#FFFDF8] border-[#24364B] shadow-xs'
                      : 'bg-[#FFFDF8] text-[#765D49] border-[#E9DDC9] hover:border-[#B99568] hover:text-[#24364B]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Current Category Label */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E9DDC9]">
          <span className="text-xs uppercase tracking-widest text-[#765D49] font-semibold">
            {selectedCategory === 'ALL' ? 'All Offerings' : selectedCategory} ({filteredItems.length} items)
          </span>
          {searchQuery && (
            <span className="text-xs text-[#68705A]">
              Matching "{searchQuery}"
            </span>
          )}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-8">
            <Utensils className="w-10 h-10 text-[#B99568] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl font-bold text-[#24364B]">
              No dishes found matching your criteria
            </h3>
            <p className="mt-1 text-sm text-[#765D49]">
              Try searching for something else, or switch to "ALL" categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setOnlyFeatured(false);
              }}
              className="mt-4 px-5 py-2 bg-[#24364B] text-[#FFFDF8] rounded-sm text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const inCartCount = getItemCartQty(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveModalProduct(item)}
                  className={`group bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer hover:border-[#B99568]/60 ${
                    !item.available ? 'opacity-60 grayscale-[0.4]' : ''
                  }`}
                >
                  {/* Food Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E9DDC9]/30">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Vegetarian Indicator */}
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs p-1 rounded-xs border border-gray-200 shadow-xs">
                      <div className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center p-0.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    {/* Badge */}
                    {item.badge && (
                      <div className="absolute top-2.5 right-2.5 bg-[#24364B] text-[#FFFDF8] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                        {item.badge}
                      </div>
                    )}

                    {!item.available && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold tracking-widest uppercase">
                        Sold Out Today
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] tracking-widest text-[#765D49] font-medium uppercase mb-1">
                        <span>{item.category}</span>
                        {item.spicyLevel && item.spicyLevel > 0 && (
                          <span className="text-[#6E3030]">
                            {'🌶️'.repeat(item.spicyLevel)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#24364B] group-hover:text-[#68705A] transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#765D49]/80 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Pricing & Add to Cart button */}
                    <div className="mt-4 pt-3 border-t border-[#E9DDC9]/50 flex items-center justify-between">
                      <div>
                        <div className="text-base font-bold text-[#24364B] font-mono tabular-nums">
                          ₹{item.price}
                        </div>
                        {item.customizationOptions && item.customizationOptions.length > 0 && (
                          <div className="text-[10px] text-[#B99568]">
                            Customizable
                          </div>
                        )}
                      </div>

                      {item.available && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center"
                        >
                          <button
                            onClick={() => handleAddClick(item)}
                            className="bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
