import Link from 'next/link';


export default function Footer() {
  return (
    <footer className="bg-aq-on-surface text-white mt-auto" id="main-footer">
      {/* Wave separator */}
      <div className="relative h-12 bg-aq-surface overflow-hidden">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48h1440V16c-120 10-240 20-360 16S840 8 720 12 480 32 360 32 120 22 0 16v32z"
            fill="#181c20"
          />
        </svg>
      </div>

      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight">AquaCart</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Premium sustainable seafood, sourced daily from local fishermen and delivered fresh to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/shop', label: 'Shop All' },
                { href: '/account', label: 'My Account' },
                { href: '/cart', label: 'Shopping Cart' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-aq-tertiary-fixed transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">
              About
            </h3>
            <ul className="space-y-3">
              {['Our Story', 'Sustainability', 'Quality Promise'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-white/60 hover:text-aq-tertiary-fixed transition-colors duration-200 cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li className="text-sm text-white/60">hello@aquacart.com</li>
              <li className="text-sm text-white/60">+1 (555) 123-4567</li>
            </ul>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {['twitter', 'instagram', 'facebook'].map((social) => (
                <span
                  key={social}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-aq-primary-container transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-xs font-bold text-white/80 uppercase">
                    {social.charAt(0)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} AquaCart. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Crafted with 🌊 for seafood lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
