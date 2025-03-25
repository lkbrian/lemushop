"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  //  ShoppingBag
  Store,
  Shield,
  BarChart,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      {/* <nav className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold">Lemupay</div>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-gray-400">
              Home
            </Link>
            <Link href="/shop" className="hover:text-gray-400">
              Shop
            </Link>
            <Link href="#marketplace" className="hover:text-gray-400">
              Marketplace
            </Link>
            <Link href="#storefront" className="hover:text-gray-400">
              Storefront
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="hover:text-gray-400">
              <ShoppingBag className="h-5 w-5" />
            </Link>
            <Button size="sm" className="rounded-full" asChild>
              <Link href="/register">Join Now</Link>
            </Button>
            <button className="md:hidden focus:outline-none">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
              </svg>
            </button>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
              Unlock Your Online Business Potential with Lemupay
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              Our exclusive marketplace for verified users offers a secure
              environment to showcase your products and attract targeted
              customers. Start your entrepreneurial journey with ease using
              Lemupay&apos;s storefront option to list products, receive
              payments, and control your sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/register">
                  Join Us Today <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full"
                asChild
              >
                <Link href="/shop">Explore Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50" id="marketplace">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Elevate Your Sales with Lemupay
          </h2>
          <p className="text-xl mb-12 text-center text-gray-600 max-w-3xl mx-auto">
            Transform your entrepreneurial ambitions into reality with our
            comprehensive platform designed for business growth.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Marketplace for Verified Users
              </h3>
              <p className="text-gray-600">
                Experience our premium Marketplace, designed for verified users
                to connect securely with eager buyers, enhancing authenticity
                and quality in every transaction.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Empower Your Storefront
              </h3>
              <p className="text-gray-600">
                Launch your own storefront effortlessly, showcasing your
                products and receiving payments instantly while managing sales
                at your convenience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Join Our Thriving Ecosystem
              </h3>
              <p className="text-gray-600">
                Whether you&apos;re an experienced seller or just starting,
                Lemupay provides the essential tools to thrive, embracing your
                entrepreneurial dreams with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Empower Your Business with Lemupay
          </h2>
          <p className="text-xl mb-12 text-center text-gray-600 max-w-3xl mx-auto">
            Unlock the potential of our Marketplace and Storefront to grow your
            online presence and revenues.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border rounded-lg p-8">
              <h3 className="text-xl font-bold mb-2">Storefront</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">Free</span>
                <span className="text-gray-500 ml-2">/ for all users</span>
              </div>
              <p className="text-gray-600 mb-6">
                Easily set up your own online shop and receive payments
                directly.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Create Your Shop
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  List Products Easily
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Direct Payment Withdrawal
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Simple Management Tools
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Start Your Free Storefront
              </Button>
            </div>

            <div className="border rounded-lg p-8 bg-primary/5 border-primary relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Marketplace</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-gray-500 ml-2">/ month</span>
              </div>
              <p className="text-gray-600 mb-6">
                Join a secure space to connect with premium customers.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Access to Verified Customers
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Enhanced Security for Transactions
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Showcase Unique Products
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  24/7 Customer Support
                </li>
              </ul>
              <Button className="w-full">Explore the Marketplace</Button>
            </div>

            <div className="border rounded-lg p-8">
              <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">$149</span>
                <span className="text-gray-500 ml-2">/ month</span>
              </div>
              <p className="text-gray-600 mb-6">
                For serious sellers looking to maximize potential.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Unlimited Access to Features
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  200 GB Storage Space
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Unlimited User Accounts
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Dedicated Support Team
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Upgrade to Premium Plan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Unleash Your Business Potential with Lemupay
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Our Marketplace is exclusively designed for verified users, offering
            a secure and dynamic platform to showcase your products. Connect
            with a targeted audience that values quality and authenticity.
          </p>
          <Button size="lg" className="rounded-full" asChild>
            <Link href="/register">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
