import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Star, Crown } from "lucide-react";

const Subscribe = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white text-shadow-lg">
              Upgrade to Premium
            </h1>
            <p className="text-gray-300 mt-2">
              Unlock advanced AI predictions and premium features
            </p>
          </div>
        </div>

        {/* Subscription Content */}
        <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Unlock Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Advanced AI Price Predictions</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Real-Time Market Analysis</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Exclusive Trading Signals</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Priority Support</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Ad-Free Experience</span>
              </div>
            </div>

            {/* Pricing Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Plan */}
              <Card className="bg-gray-700/50 border-gray-600 hover:border-blue-500 transition-all">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-semibold text-white">Monthly</CardTitle>
                  <div className="flex items-center justify-center mt-2">
                    <span className="text-gray-300">$</span>
                    <span className="text-3xl font-bold text-white">19</span>
                    <span className="text-gray-300">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Subscribe Monthly
                  </Button>
                </CardContent>
              </Card>

              {/* Yearly Plan */}
              <Card className="bg-gray-700/50 border-gray-600 hover:border-purple-500 transition-all">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-semibold text-white flex items-center justify-center gap-2">
                    Yearly <Badge className="bg-purple-600">Save 20%</Badge>
                  </CardTitle>
                  <div className="flex items-center justify-center mt-2">
                    <span className="text-gray-300">$</span>
                    <span className="text-3xl font-bold text-white">179</span>
                    <span className="text-gray-300">/year</span>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Subscribe Yearly
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Premium Benefits */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                <Star className="h-5 w-5 inline-block mr-1 align-middle" />
                Premium Benefits
              </h3>
              <p className="text-gray-300">
                Unlock exclusive features and get the most out of our AI-powered platform.
              </p>
            </div>

            {/* Guarantee */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                <CheckCircle className="h-4 w-4 inline-block mr-1 align-middle" />
                30-Day Money-Back Guarantee
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              What Our Premium Users Say
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Testimonial 1 */}
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <p className="text-gray-300 italic">
                "The AI predictions are incredibly accurate! I've made significant profits since upgrading to premium."
              </p>
              <p className="text-sm text-gray-400 mt-2">- John S.</p>
            </div>

            {/* Testimonial 2 */}
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <p className="text-gray-300 italic">
                "The real-time market analysis has helped me make informed decisions and stay ahead of the game."
              </p>
              <p className="text-sm text-gray-400 mt-2">- Emily K.</p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 border-purple-700 shadow-2xl">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Unlock Premium?
            </h2>
            <p className="text-gray-300 mb-6">
              Upgrade now and take your crypto trading to the next level!
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-medium transition-all">
              Get Premium Now
              <Crown className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscribe;
