import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">EcoShop</h3>
            <p className="text-gray-600">
              Your one-stop shop for all your needs with the best prices and
              quality.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-gray-900"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Electronics"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Clothing"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Home"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Home & Kitchen
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
            <p className="mt-4 text-gray-600">
              Sign up for our newsletter to get updates on new products and
              promotions.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-600">
          <p>© {new Date().getFullYear()} EcoShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
