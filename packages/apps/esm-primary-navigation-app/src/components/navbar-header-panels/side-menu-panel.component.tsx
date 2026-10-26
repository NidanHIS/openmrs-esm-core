import React, { useEffect } from 'react';
import { isDesktop, useLayoutType, useLeftNavStore, useOnClickOutside } from '@openmrs/esm-framework';
import { createPortal } from 'react-dom';
import { CustomLeftNav } from '../left-nav/custom-left-nav.component';

interface SideMenuPanelProps {
  expanded: boolean;
  hidePanel: Parameters<typeof useOnClickOutside>[0];
  isNavExpanded?: boolean; // Only used when mode === 'collapsed'
}

/**
 * This is the menu that pops up when clicking on the hamburger button
 * on the top nav. It's also responsible for rendering the left nav
 * in desktop mode (via a react portal).
 * 
 * Mobile/Tablet: Shows slide-out panel on hamburger click (expanded prop controls visibility)
 * Desktop: Always renders nav in portal (isNavExpanded controls icon rail vs full sidebar when mode='collapsed')
 */
const SideMenuPanel: React.FC<SideMenuPanelProps> = ({ expanded, hidePanel, isNavExpanded = false }) => {
  const menuRef = useOnClickOutside(hidePanel, expanded);

  useEffect(() => {
    window.addEventListener('popstate', hidePanel);
    return () => window.removeEventListener('popstate', hidePanel);
  }, [hidePanel]);
  
  const layout = useLayoutType();
  const { mode } = useLeftNavStore();

  const leftNavContainer = window.document.getElementById('omrs-left-nav-container');
  
  return (
    <>
      {/* Mobile/Tablet: Show as slide-out panel ONLY when hamburger is clicked (expanded) */}
      {!isDesktop(layout) && expanded && <CustomLeftNav ref={menuRef} isChildOfHeader isMobilePanel />}
      
      {/* Desktop: Always render in the left nav container */}
      {isDesktop(layout) &&
        mode !== 'hidden' &&
        leftNavContainer &&
        createPortal(<CustomLeftNav ref={menuRef} isChildOfHeader isNavExpanded={isNavExpanded} />, leftNavContainer)}
    </>
  );
};

export default SideMenuPanel;
