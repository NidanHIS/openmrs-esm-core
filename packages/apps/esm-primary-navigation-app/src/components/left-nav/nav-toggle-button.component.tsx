import React, { useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from '@carbon/react/icons';
import { useLeftNavStore, setLeftNav } from '@openmrs/esm-framework';
import styles from './nav-toggle-button.module.scss';

// Store user's nav preference in localStorage
const NAV_PREFERENCE_KEY = 'openmrs:leftNavMode';

function getStoredNavMode(): 'normal' | 'collapsed' | null {
  try {
    const stored = localStorage.getItem(NAV_PREFERENCE_KEY);
    if (stored === 'normal' || stored === 'collapsed') {
      return stored;
    }
  } catch (e) {
    console.warn('Failed to read nav preference from localStorage', e);
  }
  return null;
}

function setStoredNavMode(mode: 'normal' | 'collapsed') {
  try {
    localStorage.setItem(NAV_PREFERENCE_KEY, mode);
  } catch (e) {
    console.warn('Failed to save nav preference to localStorage', e);
  }
}

/**
 * Button to toggle between collapsed (icon rail) and expanded (icon + text) modes
 * Only shown in desktop mode when left nav is not hidden
 */
export const NavToggleButton: React.FC = () => {
  const { mode, slotName, basePath, componentContext, state } = useLeftNavStore();

  // Apply stored preference on mount
  useEffect(() => {
    const storedMode = getStoredNavMode();
    if (storedMode && slotName && basePath && mode !== storedMode && mode !== 'hidden') {
      setLeftNav({
        name: slotName,
        basePath: basePath,
        mode: storedMode,
        componentContext,
        state,
      });
    }
  }, [slotName, basePath]); // Only run when nav slot changes

  const toggleNav = useCallback(() => {
    if (!slotName || !basePath) return;
    
    const newMode = mode === 'collapsed' ? 'normal' : 'collapsed';
    
    // Store user preference
    setStoredNavMode(newMode);
    
    // Update the store using setLeftNav
    setLeftNav({
      name: slotName,
      basePath: basePath,
      mode: newMode,
      componentContext,
      state,
    });
  }, [mode, slotName, basePath, componentContext, state]);

  if (mode === 'hidden' || !slotName) {
    return null;
  }

  const isCollapsed = mode === 'collapsed';

  return (
    <button
      className={styles.toggleButton}
      onClick={toggleNav}
      aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
      title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
    >
      {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
    </button>
  );
};
