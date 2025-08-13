import { Link } from "wouter";
import { Mountain, Instagram, Youtube, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-brown text-white py-16" data-testid="footer">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Mountain className="text-brand-orange text-2xl" />
              <span className="font-playfair text-2xl font-bold">Milesalone</span>
            </div>
            <p className="text-gray-300 mb-4">
              Documenting authentic India travel experiences, one story at a time. From Kashmir to Kanyakumari on ₹500 per day.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-brand-orange transition-colors" data-testid="social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-orange transition-colors" data-testid="social-youtube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-orange transition-colors" data-testid="social-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:hello@milesalone.com" className="text-gray-300 hover:text-brand-orange transition-colors" data-testid="social-email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-lg font-bold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/journey" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-journey">Journey Map</Link></li>
              <li><Link href="/letters" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-letters">Travel Letters</Link></li>
              <li><Link href="/gallery" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-gallery">Photo Gallery</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-link-about">About Shashank</Link></li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-playfair text-lg font-bold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-dest-kashmir">Kashmir Valley</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-dest-rajasthan">Rajasthan Desert</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-dest-goa">Goa Beaches</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-dest-kerala">Kerala Backwaters</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-dest-kanyakumari">Kanyakumari</a></li>
            </ul>
          </div>

          {/* Journey Progress */}
          <div>
            <h3 className="font-playfair text-lg font-bold mb-4">Journey Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Days Traveled</span>
                <span className="text-white font-semibold" data-testid="stats-days">78 / 120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">States Covered</span>
                <span className="text-white font-semibold" data-testid="stats-states">9 / 15+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Distance</span>
                <span className="text-white font-semibold" data-testid="stats-distance">1,950 km</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-4">
                <div className="bg-brand-orange h-2 rounded-full" style={{ width: "65%" }} data-testid="progress-bar"></div>
              </div>
              <p className="text-xs text-gray-400" data-testid="progress-text">65% journey complete</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0" data-testid="copyright">
              © 2025 Milesalone. All rights reserved. Built with passion for authentic travel.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-privacy">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-terms">Terms of Use</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" data-testid="footer-contact">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
