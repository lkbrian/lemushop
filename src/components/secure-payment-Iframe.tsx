"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface SecurePaymentIframeProps {
  paymentUrl: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
  height?: string;
}

export function SecurePaymentIframe({
  paymentUrl,
  onComplete,
  onError,
  height = "500px",
}: SecurePaymentIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const allowedDomain = "lemuapps.com"; // Only allow URLs from this domain

  // Validate the payment URL
  const isValidPaymentUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.hostname === allowedDomain ||
        parsedUrl.hostname.endsWith(`.${allowedDomain}`)
      );
    } catch (e) {
      console.error("Invalid payment URL:", e);
      return false;
    }
  };

  useEffect(() => {
    // Validate the URL before attempting to load
    if (!isValidPaymentUrl(paymentUrl)) {
      setError("Invalid payment URL. Security check failed.");
      setIsLoading(false);
      if (onError) onError("Invalid payment URL");
      return;
    }

    // Set up message event listener for communication with the iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin of the message
      if (
        new URL(event.origin).hostname !== allowedDomain &&
        !new URL(event.origin).hostname.endsWith(`.${allowedDomain}`)
      ) {
        console.warn(
          "Received message from unauthorized origin:",
          event.origin
        );
        return;
      }

      // Handle messages from the payment iframe
      if (event.data.type === "payment_complete") {
        if (onComplete) onComplete();
      } else if (event.data.type === "payment_error") {
        setError(event.data.message || "Payment processing error");
        if (onError) onError(event.data.message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [paymentUrl, onComplete, onError]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError("Failed to load payment page. Please try again.");
    setIsLoading(false);
    if (onError) onError("Failed to load payment page");
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="absolute inset-0 bg-black/5 pointer-events-none z-10 rounded-lg"></div>

      <div className="relative w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-600">Loading secure payment page...</p>
              <p className="text-xs text-gray-500 mt-2">
                Please do not refresh the page
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-20 p-4">
            <div className="text-center max-w-md">
              <div className="bg-red-100 text-red-800 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Error
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        )}

        {/* The secure iframe */}
        {!error && (
          <iframe
            ref={iframeRef}
            src={isValidPaymentUrl(paymentUrl) ? paymentUrl : "about:blank"}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="w-full h-full border-0"
            style={{ height }}
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
            referrerPolicy="no-referrer-when-downgrade"
            title="Secure Payment"
          />
        )}
      </div>

      {/* Security badge */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-3 h-3 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Secure payment processing
        </div>
      </div>
    </div>
  );
}
