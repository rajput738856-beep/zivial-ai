import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import ZivialLogo from "../common/ZivialLogo";

const quickLinks = [
  { name: "Home", href: "/#home" },
  { name: "Features", href: "/#features" },
  { name: "Workflow", href: "/#solutions" },
  { name: "Contact", href: "/#contact" },
];

const resources = [
  "Documentation",
  "API Specifications",
  "Support Desk",
  "Privacy Policy",
  "Terms of Service",
];

const socialLinks = [
  {
    icon: Mail,
    href: "mailto:support@zivial.com",
  },
  {
    icon: Phone,
    href: "tel:+918384082626",
  },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-[#030712] text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 lg:grid-cols-4 text-left">

          {/* Company */}
          <div className="space-y-6">
            <ZivialLogo />
            <p className="leading-7 text-gray-400">
              Generate industrial climate controller recipes dynamically using the 
              Zivial Setting Engine (ZSE) for advanced poultry operations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">
              Quick Links
            </h3>

            <div className="space-y-4">
              {quickLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-400 transition hover:text-brand"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">
              Resources
            </h3>

            <div className="space-y-4">
              {resources.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-400 transition hover:text-brand"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">
              Contact
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} />
                support@zivial.com
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} />
                +91 83840 82626
              </div>

              <div className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} />
                Gurgaon, Haryana, India
              </div>
            </div>

            {/* Social */}
            <div className="mt-8 flex gap-4">
              {socialLinks.map((item, index) => {
                const Icon = item.icon;

                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-brand hover:bg-brand/10 text-zinc-400 hover:text-brand"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-center text-gray-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} Zivial Setting Engine. All Rights Reserved.
          </p>

          <p>
            Built with ❤️ for Modern Agriculture
          </p>
        </div>

      </div>
    </footer>
  );
}