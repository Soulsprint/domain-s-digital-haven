import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  { icon: MapPin, label: 'Address', value: '123 Tech Street, Digital City, DC 12345' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: Mail, label: 'Email', value: 'support@domaincomputers.com' },
  { icon: Clock, label: 'Hours', value: 'Mon-Sat: 9AM - 8PM' },
];

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-display text-sm tracking-[0.3em] uppercase">Get In Touch</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions? Need a quote? We're here to help. Reach out to us anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="p-8 rounded-2xl glass">
            <h3 className="font-display text-2xl font-semibold mb-6 text-foreground">
              Send us a Message
            </h3>
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Your Name" />
                <Input type="email" placeholder="Your Email" />
              </div>
              <Input placeholder="Subject" />
              <Textarea placeholder="Your Message" className="min-h-[120px]" />
              <Button variant="glow" className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="p-6 rounded-xl glass hover-glow transition-all duration-300 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
                  <div className="text-foreground font-medium">{info.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
