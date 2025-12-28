import { Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <Cpu className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-wider text-foreground">
                DOMAIN
              </span>
              <span className="font-display text-[10px] tracking-[0.3em] text-primary">
                COMPUTERS
              </span>
            </div>
          </a>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#products" className="hover:text-primary transition-colors">Products</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © 2024 Domain Computers. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
