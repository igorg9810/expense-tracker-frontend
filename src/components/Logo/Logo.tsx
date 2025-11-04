import React from 'react';
import logoImage from '../../assets/LogoLight.svg';

interface LogoProps {
  /** Optional width for the logo image (defaults to 120px) */
  width?: number;
  /** Alternative text for accessibility */
  alt?: string;
  /** Optional href for navigation (can be internal or external link) */
  href?: string;
  /** Click handler for custom navigation logic */
  onClick?: () => void;
}

/**
 * A reusable Logo component that displays the YAET logo and can act as a link.
 * Accessible, semantic, and styled to match the Figma header design.
 */
const Logo: React.FC<LogoProps> = ({ width = 120, alt = 'YAET logo', href, onClick }) => {
  const content = (
    <img
      src={logoImage}
      alt={alt}
      width={width}
      height="auto"
      style={{
        objectFit: 'contain',
      }}
      loading="lazy"
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '64px',
        padding: '0 24px',
        backgroundColor: '#2E2A8A',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
      role="banner"
      aria-label="Site header with logo"
    >
      {href || onClick ? (
        <a
          href={href}
          onClick={onClick}
          style={{
            outline: 'none',
            borderRadius: '4px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          onFocus={(e: React.FocusEvent<HTMLAnchorElement>) => {
            e.target.style.outline = '2px solid white';
          }}
          onBlur={(e: React.FocusEvent<HTMLAnchorElement>) => {
            e.target.style.outline = 'none';
          }}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};

export default Logo;
