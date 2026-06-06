import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import MoodSlider from '../components/MoodSlider';

describe('MoodSlider Component', () => {
  it('renders slider and value correctly', () => {
    render(<MoodSlider value={5} onChange={() => {}} />);
    
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByText('5 / 10')).toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    const onChangeSpy = vi.fn();
    render(<MoodSlider value={5} onChange={onChangeSpy} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '8' } });
    
    expect(onChangeSpy).toHaveBeenCalledWith(8);
  });
});
