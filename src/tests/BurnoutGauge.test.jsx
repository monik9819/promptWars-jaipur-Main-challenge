import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BurnoutGauge from '../components/BurnoutGauge';

describe('BurnoutGauge Component', () => {
  it('renders correct score and zone', () => {
    render(<BurnoutGauge score={35} zone="Thriving" />);
    
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('Thriving')).toBeInTheDocument();
  });
  
  it('has accessible aria-label', () => {
    render(<BurnoutGauge score={90} zone="Crisis" />);
    
    const container = screen.getByLabelText(/Current score: 90/i);
    expect(container).toBeInTheDocument();
  });
});
