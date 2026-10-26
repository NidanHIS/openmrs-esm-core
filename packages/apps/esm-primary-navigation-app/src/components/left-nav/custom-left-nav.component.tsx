import React, { useEffect } from 'react';
import classNames from 'classnames';
import {
  ExtensionSlot,
  useAssignedExtensions,
  useLeftNavStore,
} from '@openmrs/esm-framework';
import {
  ComponentContext,
  RenderIfValueIsTruthy,
} from '@openmrs/esm-react-utils';
import styles from './custom-left-nav.module.scss';

interface CustomLeftNavProps {
  isChildOfHeader?: boolean;
  isNavExpanded?: boolean; // Only used when mode === 'collapsed' on desktop
  isMobilePanel?: boolean; // When true, this is the mobile slide-out panel
}

/**
 * Custom Left Navigation Component
 * 
 * Desktop:
 * - mode === 'normal': Full sidebar (256px) always visible
 * - mode === 'collapsed':
 *   - isNavExpanded === false: Icon rail (48px)
 *   - isNavExpanded === true: Full sidebar (256px)
 * 
 * Mobile/Tablet:
 * - Always renders as full sidebar (256px) slide-out panel
 * - Only shown when hamburger is clicked
 */
export const CustomLeftNav = React.forwardRef<HTMLElement, CustomLeftNavProps>((props, ref) => {
  const { slotName, basePath, componentContext, state, mode } = useLeftNavStore();
  const currentPath = window.location ?? { pathname: '' };
  const navMenuItems = useAssignedExtensions(slotName ?? '');
  const navRef = React.useRef<HTMLElement>(null);

  // Sync the forwarded ref with our local ref
  React.useImperativeHandle(ref, () => navRef.current!);

  // Set title attributes on nav links that don't have one,
  // reading from the hidden text span inside each link
  useEffect(() => {
    const isCollapsed = mode === 'collapsed' && !props.isNavExpanded;
    if (!isCollapsed || !navRef.current) return;

    const setTitles = () => {
      const links = navRef.current?.querySelectorAll<HTMLAnchorElement>('a.cds--side-nav__link');
      links?.forEach((link) => {
        if (!link.dataset.tooltip) {
          const spans = link.querySelectorAll('span');
          spans.forEach((span) => {
            if (!span.children.length && span.textContent?.trim()) {
              link.dataset.tooltip = span.textContent.trim();
            }
          });
        }
        // Always remove native title to suppress browser tooltip
        link.removeAttribute('title');
      });
    };

    // Run immediately and also after a short delay for async-rendered extensions
    setTitles();
    const timer = setTimeout(setTitles, 500);
    return () => clearTimeout(timer);
  }, [mode, props.isNavExpanded, navMenuItems]);

  useEffect(() => {
    // Don't adjust body classes for mobile panel (it's overlay, not affecting layout)
    if (props.isMobilePanel) {
      return;
    }

    // Add class to body for CSS adjustments based on actual display state (desktop only)
    let className: string;
    
    if (mode === 'normal') {
      // Always expanded in normal mode
      className = 'omrs-left-nav-expanded';
    } else if (mode === 'collapsed') {
      // In collapsed mode, check isNavExpanded state
      className = props.isNavExpanded ? 'omrs-left-nav-expanded' : 'omrs-left-nav-collapsed';
    } else {
      className = '';
    }
    
    document.body.classList.remove('omrs-left-nav-collapsed', 'omrs-left-nav-expanded');
    
    if (className) {
      document.body.classList.add(className);
    }
    
    return () => {
      document.body.classList.remove('omrs-left-nav-collapsed', 'omrs-left-nav-expanded');
    };
  }, [mode, props.isNavExpanded, props.isMobilePanel]);

  if (!props.isChildOfHeader || !slotName || navMenuItems.length === 0 || mode === 'hidden') {
    return null;
  }

  // Determine visual state
  // Mobile: Always show as expanded (full sidebar)
  // Desktop:
  //   - mode === 'normal': always show full sidebar
  //   - mode === 'collapsed' && isNavExpanded: show full sidebar
  //   - mode === 'collapsed' && !isNavExpanded: show icon rail
  const showAsExpanded = props.isMobilePanel || mode === 'normal' || (mode === 'collapsed' && props.isNavExpanded);

  return (
    <nav
      ref={navRef}
      className={classNames(styles.customLeftNav, {
        [styles.collapsed]: !showAsExpanded,
        [styles.expanded]: showAsExpanded,
        [styles.mobilePanel]: props.isMobilePanel,
      })}
      aria-label="Left navigation"
    >
      <div className={styles.navContent}>
        <ExtensionSlot name="global-nav-menu-slot" />
        {slotName ? (
          <RenderIfValueIsTruthy
            value={componentContext}
            fallback={<ExtensionSlot name={slotName} state={{ basePath, currentPath, ...state }} />}
          >
            <ComponentContext.Provider value={componentContext!}>
              <ExtensionSlot name={slotName} state={{ basePath, currentPath, ...state }} />
            </ComponentContext.Provider>
          </RenderIfValueIsTruthy>
        ) : null}
      </div>
    </nav>
  );
});

CustomLeftNav.displayName = 'CustomLeftNav';
