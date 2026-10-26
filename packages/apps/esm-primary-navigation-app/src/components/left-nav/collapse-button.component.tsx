import React, { useCallback } from 'react';
import { ChevronLeft } from '@carbon/react/icons';
import { useLeftNavStore, setLeftNav } from '@openmrs/esm-framework';
import styles from './collapse-button.module.scss';

/**
 * Button shown in normal (expanded) mode to collapse back to icon rail
 */
export const CollapseButton: React.FC = () => {
  const { mode, slotName, basePath, componentContext, state } = useLeftNavStore();

  const collapseNav = useCallback(() => {
    if (!slotName || !basePath) return;
    
    // Store preference in localStorage
    try {
      localStorage.setItem('openmrs:leftNavMode', 'collapsed');
    } catch (e) {
      console.warn('Failed to save nav preference', e);
    }
    
    setLeftNav({
      name: slotName,
      basePath: basePath,
      mode: 'collapsed',
      componentContext,
      state,
    });
  }, [slotName, basePath, componentContext, state]);

  // Only show in normal (expanded) mode
  if (mode !== 'normal') {
    return null;
  }

  return (
    <button
      className={styles.collapseButton}
      onClick={collapseNav}
      aria-label="Collapse navigation"
      title="Collapse navigation"
    >
      <ChevronLeft size={20} />
    </button>
  );
};
