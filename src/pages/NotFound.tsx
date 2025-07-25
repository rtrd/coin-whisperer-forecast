import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { IndexHeader } from "@/components/IndexHeader";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' }
  ];

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 | Page Not Found | Pump Parade</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to Pump Parade for cryptocurrency analysis and price predictions." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <script async src="https://appsha-prm.ctengine.io/js/script.js?wkey=Fkrv2lWxUV"></script>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          {/* Homepage Header */}
          <IndexHeader 
            selectedCrypto="bitcoin"
            cryptoOptions={cryptoOptions}
            currentPrice={50000}
            priceChange={2.5}
          />

          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <p className="text-2xl text-gray-300 mb-6">Oops! Page not found</p>
              <p className="text-lg text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
              <Link 
                to="/" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
