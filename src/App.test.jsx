import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import * as firebaseUtils from './utilities/firebase';
import '@testing-library/jest-dom';


// Partially mock the firebase.js module
vi.mock('./utilities/firebase', async () => {
  const actual = await vi.importActual('./utilities/firebase'); // Import the actual module
  return {
    ...actual, // Keep all the original exports
    useAuthState: vi.fn(), // Mock only useAuthState
  };
});

describe('App and Header tests', () => {

  test('shows Sign In if not logged in', () => {
    // Mock useAuthState to return null user
    firebaseUtils.useAuthState.mockReturnValue([null]);

    render(<App />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('shows POST OPPORTUNITIES button when logged in', () => {
    // Mock useAuthState to return a dummy user object
    firebaseUtils.useAuthState.mockReturnValue([{ displayName: 'Joe', photoURL: 'url_to_dummy_profile_pic.png' }]);

    render(<App />);
    const postOpportunitiesButton = screen.getByText('POST OPPORTUNITIES');
    expect(postOpportunitiesButton).toBeInTheDocument();
  });

});
