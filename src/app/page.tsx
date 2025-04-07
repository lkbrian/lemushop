"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  Category,
  pageableContent,
  type Product,
  type ProductList,
} from "@/lib/types";
import { storeApi } from "@/lib/api";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { useStore } from "@/context/store-context";
import { debounce } from "lodash";
import { toast } from "sonner";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
import Paginator from "@/components/paginator";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingFilter, setLoadingFilter] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { state } = useStore();
  const { store } = state;
  const [pageContent, setPageContent] = useState<pageableContent>();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(15);
  useEffect(() => {
    setCategories(store?.categories || []);
  }, [store?.categories]);

  if (error) {
    toast.error(error);
  }

  const fetchProducts = useCallback(async () => {
    setSize(15);
    try {
      setLoading(true);
      setError(null);
      if (store) {
        const response: ProductList = await storeApi.getStoreProducts(
          store.storeId,
          searchQuery.trim(),
          selectedCategories,
          page,
          size
        );

        // const { content, ...rest } = response;
        setPageContent(response);

        setProducts(response.content || []);
        // console.log("<<pagination>>", pageContent);
        // console.log("<<total pages>>", pageContent?.totalPages);
      }
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Fetch products error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [store, page, size, searchQuery, selectedCategories]);

  useEffect(() => {
    fetchProducts();
    return () => {
      // Cleanup if needed
    };
  }, [fetchProducts]);

  const handleFilter = useCallback(async () => {
    try {
      setPage(0);

      setLoadingFilter(true);
      if (store) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error during filtering:", error);
      setError("Failed to apply filters");
    } finally {
      setLoadingFilter(false);
    }
  }, [store, fetchProducts]);

  const debouncedFilter = useMemo(() => {
    return debounce(handleFilter, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategories]);

  useEffect(() => {
    debouncedFilter();
    return () => debouncedFilter.cancel();
  }, [searchQuery, selectedCategories, debouncedFilter]);

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
  // const paginate  = async(id:number)=>{
  //   try{
  //     fetchProducts()

  //   }catch(error){
  //     console.log(error)
  //   }
  //   finally{

  //   }

  // }
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
                // setPage(0);
              }}
              className="w-[350px] md:w-[300px] sm:w-auto"
            />
            <Button type="submit" size="icon" className="bg-theme-color">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 cursor-pointer">
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
            [1, 2, 3, 4, 5].map((index) => <ProductCardSkeleton key={index} />)}
          {loadingFilter &&
            !loading &&
            products.length === 0 &&
            [1, 2, 3, 4, 5].map((index) => <ProductCardSkeleton key={index} />)}
        </div>
        {!loading && !loadingFilter && products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button className="bg-theme-color" onClick={clearAllFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {!loading &&
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleQuickView}
                  />
                ))}
            </div>
            <div className="mx-auto py-3">
              {/* {pageContent?.totalPages && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem
                      onClick={() => !pageContent.first && setPage(page - 1)}
                    >
                      <PaginationPrevious />
                    </PaginationItem>

                    <PaginationItem onClick={() => setPage(0)}>
                      <PaginationLink isActive={pageContent.number === 0}>
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {pageContent.number > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {Array.from({ length: pageContent.totalPages }, (_, i) => {
                      // Only display pages near current page
                      if (
                        i > 0 && // Skip first page (already shown)
                        i < pageContent.totalPages - 1 && // Skip last page (will show later)
                        Math.abs(i - pageContent.number) <= 1 // Show current ±1 pages
                      ) {
                        return (
                          <PaginationItem key={i} onClick={() => setPage(i)}>
                            <PaginationLink isActive={pageContent.number === i}>
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    {pageContent.number < pageContent.totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {pageContent.totalPages > 1 && (
                      <PaginationItem
                        onClick={() => setPage(pageContent.totalPages - 1)}
                      >
                        <PaginationLink
                          isActive={
                            pageContent.number === pageContent.totalPages - 1
                          }
                        >
                          {pageContent.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem
                      onClick={() => !pageContent.last && setPage(page + 1)}
                    >
                      <PaginationNext />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )} */}
              {!loading && pageContent && (
                <Paginator
                  totalPages={pageContent?.totalPages}
                  number={pageContent?.number} // zero-indexed
                  first={pageContent?.first}
                  last={pageContent?.last}
                  onPageChange={setPage}
                  currentPage={page}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* 
            previous ..  curr-2 curr-1  current.. */}

      <ProductDrawer
        id={selectedProduct?.id}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
}

/* {Array.from(pageContent.totalPages).map(()=>{
  <PaginationItem>
    <PaginationLink href="#">1</PaginationLink>
  </PaginationItem>;
})} */
