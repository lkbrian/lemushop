"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
// import { products } from "@/lib/data";
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
import { Category, type Product, type ProductList } from "@/lib/types";
import { storeApi } from "@/lib/api";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { useStore } from "@/context/store-context";
import { debounce } from "lodash";
import { toast } from "sonner";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [sortBy] = useState<string>("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingFilter, setLoadingFilter] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { state } = useStore();
  const { store } = state;

  // Memoized categories from store
  useEffect(() => {
    setCategories(store?.categories || []);
  }, [store?.categories]);

  if (error) {
    toast.error(error);
  }
  // Fetch products with proper cleanup
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (store) {
        const response: ProductList = await storeApi.getStoreProducts(
          store.storeId
        );
        setProducts(response.content || []);
      }
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Fetch products error:", err);
      // Consider setting products to empty array here to avoid displaying stale data
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [store]);

  // Initial fetch and cleanup
  useEffect(() => {
    fetchProducts();
    return () => {
      // Cancel any pending API requests if component unmounts
      // (implementation depends on your API client)
    };
  }, [fetchProducts]);

  // Filter products with error handling and loading states
  const handleFilter = useCallback(async () => {
    try {
      setLoadingFilter(true);
      const filteredProducts = await storeApi.filterProducts(
        searchQuery.trim(),
        selectedCategories
      );
      setProducts(filteredProducts?.content || []);
    } catch (error) {
      console.error("Error during filtering:", error);
      setError("Failed to apply filters");
      // Keep current products or set to empty array based on your UX needs
    } finally {
      setLoadingFilter(false);
    }
  }, [searchQuery, selectedCategories]);

  // Automatically filter when search or categories change (with debounce)
  // Debounce search to avoid too many API calls
  const debouncedFilter = useMemo(() => {
    return debounce(handleFilter, 300);
    //Dono't remve the cooment below it has been use to supress a warning - lkbrian
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategories]);
  useEffect(() => {
    debouncedFilter();
    return () => debouncedFilter.cancel();
  }, [searchQuery, selectedCategories, debouncedFilter]);

  // Memoized sorted products to avoid unnecessary recalculations
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.salePrice - b.salePrice;
        case "price-high":
          return b.salePrice - a.salePrice;
        case "newest":
          return (b.id || 0) - (a.id || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "featured":
        default:
          const discountDiff = (b.discount || 0) - (a.discount || 0);
          if (discountDiff !== 0) return discountDiff;
          return (b.rating || 0) - (a.rating || 0);
      }
    });
  }, [products, sortBy]);

  const handleQuickView = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c.id === category.id)
        ? prev.filter((c) => c.id !== category.id)
        : [...prev, category]
    );
  };

  const removeCategory = (category: Category) => {
    setSelectedCategories((prev) => prev.filter((c) => c.id !== category.id));
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
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
              {categories?.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Selected Filters */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className="text-sm text-gray-500">Filters:</span>
            {selectedCategories.map((category: Category) => (
              <span
                key={category.id}
                // variant="secondary"
                className="flex items-center gap-1 h-6 pl-2 text-sm bg-gray-200 rounded-full"
              >
                {category.name}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {loading &&
            sortedProducts.length === 0 &&
            [1, 2, 3, 4, 5].map((index) => <ProductCardSkeleton key={index} />)}
          {loadingFilter &&
            sortedProducts.length === 0 &&
            [1, 2, 3, 4, 5].map((index) => <ProductCardSkeleton key={index} />)}
        </div>
        {!loading && !loadingFilter && sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={clearAllFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {!loading &&
              sortedProducts.map((product) => (
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
        id={selectedProduct?.id}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
}
