import { SEOHead } from '@/components/SEOHead';

export const PrivacyPolicy = () => {
  const seoData = {
    title: "Privacy Policy - PumpParade.com",
    description: "Learn about how PumpParade.com collects, uses, and protects your data. Our comprehensive privacy policy covers GDPR and CCPA compliance.",
    canonical: "https://pumpparade.com/privacy-policy",
    keywords: "privacy policy, data protection, GDPR, CCPA, PumpParade, cryptocurrency",
    openGraph: {
      title: "Privacy Policy - PumpParade.com",
      description: "Learn about how PumpParade.com collects, uses, and protects your data. Our comprehensive privacy policy covers GDPR and CCPA compliance.",
      type: "website",
      url: "https://pumpparade.com/privacy-policy",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy - PumpParade.com", 
      description: "Learn about how PumpParade.com collects, uses, and protects your data. Our comprehensive privacy policy covers GDPR and CCPA compliance.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead seoData={seoData} />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-white mb-8 border-b border-primary pb-4">
            Privacy Policy for PumpParade.com
          </h1>
          
          <p className="text-gray-300 mb-8">
            <strong>Last updated:</strong> 25/09/2025
          </p>

          <p className="text-gray-300 mb-8">
            PumpParade.com ("we," "our," or "us") values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services. It also describes your rights under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
          </p>

          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            1. Information We Collect
          </h2>
          
          <p className="text-gray-300 mb-4">
            We do not collect personal information unless you choose to provide it (for example, if you contact us directly). However, we and our partners may collect certain information automatically when you use our website, such as:
          </p>
          
          <ul className="text-gray-300 mb-8 space-y-2">
            <li>IP address (anonymized where required)</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited, time spent, and referring URLs</li>
          </ul>
          
          <p className="text-gray-300 mb-8">
            This data is generally collected through cookies and similar technologies.
          </p>

          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            2. Use of Information
          </h2>
          
          <p className="text-gray-300 mb-4">
            We use the collected information to:
          </p>
          
          <ul className="text-gray-300 mb-8 space-y-2">
            <li>Improve and maintain our website</li>
            <li>Measure site performance and analytics</li>
            <li>Show relevant content and advertising</li>
          </ul>
          
          <p className="text-gray-300 mb-8">
            We work with 7+ advertising and analytics partners. These partners may receive some of the above information, typically in aggregated or anonymized form, to provide better ad experiences.
          </p>

          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            3. Sharing of Information
          </h2>
          
          <p className="text-gray-300 mb-4">
            <strong>We do not sell your personal information.</strong>
          </p>
          
          <p className="text-gray-300 mb-4">
            We may share limited, anonymized data with:
          </p>
          
          <ul className="text-gray-300 mb-8 space-y-2">
            <li>Advertising and analytics partners</li>
            <li>Service providers who help us operate the website</li>
            <li>Legal authorities, if required by law</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            4. Your Rights (GDPR & CCPA)
          </h2>
          
          <p className="text-gray-300 mb-4">
            Depending on where you live, you may have the right to:
          </p>
          
          <ul className="text-gray-300 mb-4 space-y-2">
            <li>Access the data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Opt-out of data sharing with third parties</li>
            <li>Restrict or object to certain types of processing</li>
            <li>Request that your data be transferred to another service (GDPR only)</li>
          </ul>
          
          <p className="text-gray-300 mb-8">
            To exercise your rights, please contact us at{' '}
            <a href="mailto:pumpparade@engagemedia.tv" className="text-primary hover:text-primary/80 underline">
              pumpparade@engagemedia.tv
            </a>.
          </p>

          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            5. Cookies and Tracking
          </h2>
          
          <p className="text-gray-300 mb-4">
            We and our partners use cookies and similar technologies to personalize content and ads, measure performance, and analyze traffic.
          </p>
          
          <p className="text-gray-300 mb-8">
            You can manage or disable cookies through your browser settings or via our cookie consent banner.
          </p>

          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            6. Data Retention
          </h2>
          
          <p className="text-gray-300 mb-8">
            We retain collected information only as long as necessary to provide our services and comply with legal obligations.
          </p>

          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            7. Data Security
          </h2>
          
          <p className="text-gray-300 mb-8">
            We use reasonable technical and organizational measures to protect your data against loss, misuse, or unauthorized access.
          </p>

          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            8. International Data Transfers
          </h2>
          
          <p className="text-gray-300 mb-8">
            If you are located in the European Union, your information may be transferred outside the EU. In such cases, we ensure appropriate safeguards are in place to comply with GDPR requirements.
          </p>

          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            9. Do Not Track (DNT)
          </h2>
          
          <p className="text-gray-300 mb-8">
            Our website does not currently respond to "Do Not Track" signals, but you can opt out of personalized ads using your browser or device settings.
          </p>

          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            10. Contact Us
          </h2>
          
          <p className="text-gray-300 mb-4">
            If you have any questions about this Privacy Policy or wish to exercise your rights, you can contact us at:
          </p>
          
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
            <p className="text-gray-300 mb-2">
              <strong>Email:</strong>{' '}
              <a href="mailto:pumpparade@engagemedia.tv" className="text-primary hover:text-primary/80 underline">
                pumpparade@engagemedia.tv
              </a>
            </p>
            <p className="text-gray-300">
              <strong>Website:</strong>{' '}
              <a href="/" className="text-primary hover:text-primary/80 underline">
                PumpParade.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};