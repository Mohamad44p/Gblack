import React from 'react'

interface SocialLink {
  id: number;
  name: string;
  url: string;
  platform: string;
}

interface FooterProps {
  socialLinks: SocialLink[];
}

export default function Footer({ socialLinks }: FooterProps) {
  return (
    <div className="flex justify-between text-sm">
      {socialLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neutral-300 transition-colors"
        >
          {link.name}
        </a>
      ))}
    </div>
  )
}