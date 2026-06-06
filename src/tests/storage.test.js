import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getCheckins, saveCheckin, getUser, saveUser } from '../utils/storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('saves and retrieves user correctly', () => {
    const user = { email: 'test@test.com', name: 'Test' };
    saveUser(user);
    
    const retrieved = getUser('test@test.com');
    expect(retrieved).toEqual(user);
  });

  it('saves and retrieves checkins correctly', () => {
    const email = 'test@test.com';
    const checkin = { mood_score: 8, timestamp: 12345 };
    
    saveCheckin(email, checkin);
    
    const retrieved = getCheckins(email);
    expect(retrieved.length).toBe(1);
    expect(retrieved[0]).toEqual(checkin);
  });
});
