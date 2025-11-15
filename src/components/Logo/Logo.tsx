import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/hooks';
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
 * Also includes a profile icon when user is authenticated.
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

  const { user } = useAuth();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        padding: '0 24px',
        backgroundColor: '#2E2A8A',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
      role="banner"
      aria-label="Site header with logo"
    >
      <div>
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

      {user && (
        <Link
          to="/profile"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="View Profile"
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'white',
                textTransform: 'uppercase',
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Logo;
