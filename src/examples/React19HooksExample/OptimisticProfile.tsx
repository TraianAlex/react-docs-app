import { useState, useOptimistic } from 'react';
import { profileAPI } from '../shared/api/profileAPI';
import type { Profile } from '../shared/types';

const initialProfile: Profile = {
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'React developer',
};

export default function OptimisticProfile() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [optimisticProfile, updateOptimisticProfile] = useOptimistic(
    profile,
    (state, updates: Partial<Profile>) => ({ ...state, ...updates })
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (field: keyof Profile, value: string) => {
    updateOptimisticProfile({ [field]: value });
    setError(null);
    setSaving(true);

    try {
      await profileAPI.update({ [field]: value });
      setProfile({ ...profile, [field]: value });
    } catch (err) {
      console.error('Failed to update profile', err);
      setError(`Failed to update ${field}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Optimistic Profile Updates</h3>
        <p className="text-muted mb-0">
          Changes are applied immediately while saving. Watch for the saving indicator.
        </p>
      </div>
      <div className="card-body">
        {saving && (
          <div className="alert alert-info">
            <span className="spinner-border spinner-border-sm me-2" />
            Saving changes...
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="profile-name" className="form-label">Name</label>
          <input
            id="profile-name"
            type="text"
            className="form-control"
            value={optimisticProfile.name}
            onChange={(e) => handleUpdate('name', e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="profile-email" className="form-label">Email</label>
          <input
            id="profile-email"
            type="email"
            className="form-control"
            value={optimisticProfile.email}
            onChange={(e) => handleUpdate('email', e.target.value)}
            placeholder="Your email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="profile-bio" className="form-label">Bio</label>
          <textarea
            id="profile-bio"
            className="form-control"
            value={optimisticProfile.bio}
            onChange={(e) => handleUpdate('bio', e.target.value)}
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>

        <div className="card mt-4">
          <div className="card-header">
            <strong>Current Profile</strong>
          </div>
          <div className="card-body">
            <p>
              <strong>Name:</strong> {optimisticProfile.name}
            </p>
            <p>
              <strong>Email:</strong> {optimisticProfile.email}
            </p>
            <p>
              <strong>Bio:</strong> {optimisticProfile.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
