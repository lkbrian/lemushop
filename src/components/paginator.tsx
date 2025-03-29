import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PageContent } from "@/lib/types";

const Paginator = ({
  totalPages,
  currentPage,
  number,
  first,
  last,
  onPageChange,
}: PageContent) => {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem onClick={() => !first && onPageChange(currentPage - 1)}>
          <PaginationPrevious className="cursor-pointer" />
        </PaginationItem>

        {/* Always show first page */}
        <PaginationItem
          className="cursor-pointer"
          onClick={() => onPageChange(0)}
        >
          <PaginationLink className="cursor-pointer" isActive={number === 0}>
            1
          </PaginationLink>
        </PaginationItem>

        {/* Show ellipsis if current page is far from start */}
        {number > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Show pages around current page */}
        {Array.from({ length: totalPages }, (_, i) => {
          // Only display pages near current page
          if (
            i > 0 && // Skip first page (already shown)
            i < totalPages - 1 && // Skip last page (will show later)
            Math.abs(i - number) <= 1 // Show current ±1 pages
          ) {
            return (
              <PaginationItem
                className="cursor-pointer"
                key={i}
                onClick={() => onPageChange(i)}
              >
                <PaginationLink
                  className="cursor-pointer"
                  isActive={number === i}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            );
          }
          return null;
        })}

        {/* Show ellipsis if current page is far from end */}
        {number < totalPages - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Always show last page */}
        {totalPages > 1 && (
          <PaginationItem
            className="cursor-pointer"
            onClick={() => onPageChange(totalPages - 1)}
          >
            <PaginationLink
              className="cursor-pointer"
              isActive={number === totalPages - 1}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem
          className="cursor-pointer"
          onClick={() => !last && onPageChange(currentPage + 1)}
        >
          <PaginationNext className="cursor-pointer" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default Paginator;
