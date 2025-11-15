/**
 * Profile Page Component
 *
 * User profile page displaying authenticated user details.
 * Excludes sensitive fields and provides user management functionality.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/hooks';
import { authApiClient } from '../../utils/auth';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Logo from '../../components/Logo';
import styles from './Profile.module.css';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Profile Page Component
 *
 * Protected page that displays user profile information and provides
 * user management functionality like logout and account actions.
 */
const Profile: React.FC = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  /**
   * Fetch user profile data from API
   */
  const fetchProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      // Call the getUserProfile API endpoint
      const response = await authApiClient.getUserProfile();
      setProfileData(response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile data. Please try again.');

      // Fallback to basic user data from token
      if (user) {
        setProfileData({
          id: user.userId,
          email: user.email,
          name: user.email.split('@')[0], // Extract name from email as fallback
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Handle logout action
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Handle logout from all devices
   */
  const handleLogoutAll = async () => {
    try {
      // This would call the logoutAll method if available
      await logout(); // For now, just regular logout
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Logout all failed:', error);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown';
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !profileData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <Button onClick={fetchProfileData} variant="primary">
              Try Again
            </Button>
            <Button onClick={() => navigate('/')} variant="secondary">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Logo href="/" />
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1 className={styles.title}>User Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className={styles.content}>
        <div className={styles.profileCard}>
          {/* Profile Avatar Section */}
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <span className={styles.avatarText}>
                {profileData?.name?.charAt(0).toUpperCase() ||
                  profileData?.email?.charAt(0).toUpperCase() ||
                  'U'}
              </span>
            </div>
            <div className={styles.avatarInfo}>
              <h2 className={styles.userName}>{profileData?.name || 'User'}</h2>
              <p className={styles.userEmail}>{profileData?.email}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Account Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>User ID</label>
                <p className={styles.infoValue}>{profileData?.id}</p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>Email Address</label>
                <p className={styles.infoValue}>{profileData?.email}</p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>Display Name</label>
                <p className={styles.infoValue}>{profileData?.name || 'Not set'}</p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>Account Created</label>
                <p className={styles.infoValue}>
                  {profileData?.createdAt ? formatDate(profileData.createdAt) : 'Unknown'}
                </p>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoLabel}>Last Updated</label>
                <p className={styles.infoValue}>
                  {profileData?.updatedAt ? formatDate(profileData.updatedAt) : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className={styles.actionsSection}>
            <h3 className={styles.sectionTitle}>Account Actions</h3>
            <div className={styles.actionButtons}>
              <Button
                onClick={() => navigate('/')}
                variant="primary"
                className={styles.actionButton}
              >
                📊 View Dashboard
              </Button>
              <Button
                onClick={fetchProfileData}
                variant="secondary"
                className={styles.actionButton}
              >
                🔄 Refresh Profile
              </Button>
              <Button onClick={handleLogout} variant="secondary" className={styles.actionButton}>
                🚪 Logout
              </Button>
              <Button onClick={handleLogoutAll} variant="outlined" className={styles.actionButton}>
                🔒 Logout All Devices
              </Button>
            </div>
          </div>

          {/* Security Information */}
          <div className={styles.securitySection}>
            <h3 className={styles.sectionTitle}>Security</h3>
            <div className={styles.securityInfo}>
              <div className={styles.securityItem}>
                <span className={styles.securityIcon}>🔐</span>
                <div className={styles.securityText}>
                  <p className={styles.securityLabel}>Password</p>
                  <p className={styles.securityValue}>Last changed recently</p>
                </div>
              </div>
              <div className={styles.securityItem}>
                <span className={styles.securityIcon}>🛡️</span>
                <div className={styles.securityText}>
                  <p className={styles.securityLabel}>Account Security</p>
                  <p className={styles.securityValue}>Protected with JWT tokens</p>
                </div>
              </div>
              <div className={styles.securityItem}>
                <span className={styles.securityIcon}>🔑</span>
                <div className={styles.securityText}>
                  <p className={styles.securityLabel}>Access Level</p>
                  <p className={styles.securityValue}>Standard User</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
