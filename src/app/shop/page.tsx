"use client";

import type React from "react";

import { useState } from "react";
import { products } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductDrawer } from "@/components/product-drawer";
import type { Product } from "@/lib/types";

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("featured");

  console.log(setSortBy);
  // Get unique categories for filter
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  // Filter products based on search query and categories
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      (product.category && selectedCategories.includes(product.category));

    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.salePrice - b.salePrice;
      case "price-high":
        return b.salePrice - a.salePrice;
      case "newest":
        return b.id - a.id;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "featured":
      default:
        // Featured sorts by discount first, then rating
        const discountDiff = (b.discount || 0) - (a.discount || 0);
        if (discountDiff !== 0) return discountDiff;
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  const handleQuickView = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedProduct(product);
    console.log("from shop", product);
    setIsDrawerOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const removeCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <form
            onSubmit={handleSearch}
            className="flex gap-2 w-full sm:w-auto flex-1"
          >
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[350px] md:w-[300px] sm:w-auto"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Selected Filters */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className="text-sm text-gray-500">Filters:</span>
            {selectedCategories.map((category) => (
              <span
                key={category}
                // variant="secondary"
                className="flex items-center gap-1 h-6 pl-2 text-sm bg-gray-200 rounded-full"
              >
                {category}
                <X
                  className="h-5 w-5 cursor-pointer scale-75  bg-gray-100 rounded-full hover:bg-gray-300 "
                  onClick={() => removeCategory(category)}
                />
              </span>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="flex-1">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={clearAllFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        )}
      </div>

      <ProductDrawer
        product={selectedProduct}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
}
