import Logo from "@/components/ui/Logo";
import { siteMetadata } from "@/metadata/site";
import { Heart, Share2 } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Logo width={50} height={50} />
              <div>
                <h4 className="text-lg font-display font-bold text-text-primary">
                  {siteMetadata.company.name}
                </h4>
                <p className="text-text-secondary text-sm">
                  {siteMetadata.footer.tagline}
                </p>
              </div>
            </div>

            <p className="mt-6 text-text-muted text-sm max-w-md">
              {siteMetadata.company.description}
            </p>
          </div>

          <div className="flex-1 flex justify-between">
            <div>
              <h5 className="text-sm font-semibold text-text-primary mb-3">
                Navigation
              </h5>
              <ul className="space-y-2 text-text-secondary">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/properties">Properties</Link>
                </li>
                <li>
                  <Link href="/#services">Services</Link>
                </li>
                <li>
                  <Link href="/#packages">Packages</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-text-primary mb-3">
                Connect
              </h5>
              <div className="flex items-center gap-3 text-text-secondary mb-4">
                <Link
                  href={siteMetadata.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-accent transition-colors">
                  <Share2 className="w-5 h-5" />
                </Link>
                <Link
                  href={siteMetadata.contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-accent transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                <Link
                  href={siteMetadata.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-accent transition-colors">
                  <Share2 className="w-5 h-5" />
                </Link>
              </div>

              <p className="text-text-muted text-sm">
                {siteMetadata.contact.address}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-sm text-text-muted flex items-center justify-between">
          <div>{siteMetadata.footer.copyright}</div>
          <div>
            <Link
              href="https://codewithmyke.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent underline decoration-dotted underline-offset-4 transition-colors">
              Designed with care — Osinachi Michael
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
