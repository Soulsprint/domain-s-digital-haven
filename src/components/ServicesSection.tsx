import { Monitor, Wrench, Headphones, Laptop, Smartphone, Cpu, Shield, Clock } from 'lucide-react';

const services = [
  {
    icon: Monitor,
    title: 'Electronics Sales',
    description: 'Premium laptops, desktops, smartphones, and accessories from top brands at competitive prices.',
  },
  {
    icon: Wrench,
    title: 'Expert Repairs',
    description: 'Professional repair services for all devices. Screen replacements, battery upgrades, and more.',
  },
  {
    icon: Headphones,
    title: 'Technical Support',
    description: '24/7 technical assistance for software issues, network setup, and device troubleshooting.',
  },
  {
    icon: Shield,
    title: 'Data Recovery',
    description: 'Advanced data recovery solutions for damaged drives, corrupted files, and lost data.',
  },
];

const features = [
  { icon: Clock, text: 'Same-Day Service' },
  { icon: Shield, text: 'Warranty Guaranteed' },
  { icon: Cpu, text: 'Genuine Parts' },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-display text-sm tracking-[0.3em] uppercase">What We Offer</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From cutting-edge electronics to expert repairs, we provide comprehensive solutions for all your technology needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group p-8 rounded-2xl glass hover-glow cursor-pointer transition-all duration-500 hover:border-primary/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Features Bar */}
        <div className="flex flex-wrap justify-center gap-8 p-6 rounded-2xl glass">
          {features.map((feature) => (
            <div key={feature.text} className="flex items-center gap-3">
              <feature.icon className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
