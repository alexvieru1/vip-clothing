"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { BackgroundGradient } from "./ui/background-gradient";
import { Badge } from "./ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./ui/pagination"; // Import the Pagination components
import { brands } from "@/constants/brands";
import { IconMenu2 } from "@tabler/icons-react";
import { ModeToggle } from "./mode-toggle";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

// Define the Product type
type Product = {
  id: number;
  title: string;
  price: string;
  image: string;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]); // All products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Filtered products
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // Selected brands
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 12; // Products per page

  useEffect(() => {
    fetch("/data/products.json")
      .then((response) => response.json())
      .then((data: Product[]) => {
        setProducts(data);
        setFilteredProducts(data); // Initialize with all products
      });
  }, []);

  const handleBrandClick = (brand: string) => {
    if (!selectedBrands.includes(brand)) {
      const updatedBrands = [...selectedBrands, brand];
      setSelectedBrands(updatedBrands);

      const filtered = products.filter((product) =>
        updatedBrands.some((b) =>
          product.title.toLowerCase().includes(b.toLowerCase())
        )
      );
      setFilteredProducts(filtered);
      setCurrentPage(1); // Reset to the first page
    }
  };

  const removeBrand = (brand: string) => {
    const updatedBrands = selectedBrands.filter((b) => b !== brand);
    setSelectedBrands(updatedBrands);

    if (updatedBrands.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        updatedBrands.some((b) =>
          product.title.toLowerCase().includes(b.toLowerCase())
        )
      );
      setFilteredProducts(filtered);
    }
    setCurrentPage(1); // Reset to the first page
  };

  // Calculate paginated products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const generatePaginationItems = () => {
    const paginationItems = [];
    const ellipsisOffset = 2; // Pages to show before/after current page

    for (let page = 1; page <= totalPages; page++) {
      const isEllipsisBefore =
        page > ellipsisOffset + 1 && page < currentPage - ellipsisOffset;
      const isEllipsisAfter =
        page < totalPages - ellipsisOffset &&
        page > currentPage + ellipsisOffset;

      if (
        page === 1 || // Always show first page
        page === totalPages || // Always show last page
        (page >= currentPage - ellipsisOffset &&
          page <= currentPage + ellipsisOffset) // Pages near the current page
      ) {
        paginationItems.push(
          <PaginationItem key={page}>
            <PaginationLink
              isActive={currentPage === page}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (page === currentPage - ellipsisOffset - 1 &&
          currentPage > ellipsisOffset + 1) ||
        (page === currentPage + ellipsisOffset + 1 &&
          currentPage < totalPages - ellipsisOffset)
      ) {
        // Add a single ellipsis before or after the current page's range
        paginationItems.push(<PaginationEllipsis key={`ellipsis-${page}`} />);
      }
    }

    return paginationItems;
  };

  if (!products.length) {
    return <p>Loading products...</p>; // Loading state
  }

  return (
    <div>
      <header className="bg-neutral-100 dark:bg-neutral-900 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Drawer>
            <DrawerTrigger>
              <IconMenu2
                className="md:hidden text-gray-700 dark:text-gray-300 cursor-pointer"
                size={24}
              />
            </DrawerTrigger>
            <DrawerContent className="h-[75vh] max-h-[calc(100vh-50px)] p-4">
                <DrawerTitle className="text-lg font-bold mb-4">
                  Filter by Brands
                </DrawerTitle>
                <DrawerDescription className="text-sm text-gray-500 mb-4">
                  Select a brand to filter products.
                </DrawerDescription>
              <ScrollArea>
                <div className="flex flex-col gap-2">
                  {brands.map((brand) => (
                    <div
                      key={brand}
                      onClick={() => handleBrandClick(brand)}
                      className="text-sm cursor-pointer hover:text-blue-500"
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>

          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
            LOGO
          </p>
          <ModeToggle />
        </div>
      </header>
      <div className="flex p-4">
        {/* Scroll Area */}
        <div className="hidden md:flex">
          <ScrollArea className="h-[calc(100vh+100px)] w-48 rounded-lg border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-semibold leading-none">
                Brands
              </h4>
              {brands.map((brand) => (
                <React.Fragment key={brand}>
                  <div
                    onClick={() => handleBrandClick(brand)}
                    className="text-sm cursor-pointer hover:text-blue-500"
                  >
                    {brand}
                  </div>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex-1">
          {/* Selected Filters */}
          <div className="mb-4 mx-4">
            {selectedBrands.map((brand) => (
              <Badge
                key={brand}
                className="mr-2 mb-2 cursor-pointer"
                onClick={() => removeBrand(brand)}
              >
                {brand}
                <span className="ml-1 text-red-500 cursor-pointer">x</span>
              </Badge>
            ))}
          </div>
          {/* Products Grid */}
          <div className="md:mx-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="max-w-xs">
                <BackgroundGradient className="rounded-[22px] max-h-96 max-w-xs p-4 bg-white dark:bg-zinc-900 shadow-md">
                  <Image
                    src={product.image}
                    alt={product.title}
                    height="300"
                    width="300"
                    className="object-contain"
                  />
                  <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                    {product.title}
                  </p>
                  <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
                    <span>Buy now</span>
                    <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                      {product.price}
                    </span>
                  </button>
                </BackgroundGradient>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              />
              {generatePaginationItems()}
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
              />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Products;
