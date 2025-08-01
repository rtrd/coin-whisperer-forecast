import { Helmet } from 'react-helmet-async';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

// Common crypto FAQs for SEO
export const cryptoFAQs: FAQItem[] = [
  {
    question: "How accurate are AI cryptocurrency price predictions?",
    answer: "AI cryptocurrency price predictions use machine learning algorithms to analyze market data, sentiment, and technical indicators. While no prediction is 100% accurate, AI models can provide valuable insights by processing vast amounts of data faster than traditional analysis methods."
  },
  {
    question: "What is the MOTI Meter and how does it work?",
    answer: "The MOTI Meter is our proprietary scoring system that measures memecoin momentum through social sentiment analysis, community engagement, and viral energy indicators. It helps identify trending tokens with high potential for price movement."
  },
  {
    question: "How often is the cryptocurrency market data updated?",
    answer: "Our cryptocurrency market data is updated in real-time, with price feeds refreshed every few seconds to ensure you have the most current information for trading decisions."
  },
  {
    question: "Can I use Pump Parade for professional crypto trading?",
    answer: "Yes, Pump Parade offers professional-grade tools including technical analysis indicators, sentiment analysis, and AI-powered predictions suitable for both novice and experienced traders."
  },
  {
    question: "What makes Pump Parade different from other crypto analysis platforms?",
    answer: "Pump Parade combines AI-powered predictions, social sentiment analysis, and the unique MOTI Meter for memecoin tracking, providing a comprehensive suite of tools not found together on other platforms."
  }
];