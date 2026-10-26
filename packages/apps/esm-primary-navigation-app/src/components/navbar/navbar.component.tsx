import { Header, HeaderContainer, HeaderGlobalBar, HeaderMenuButton } from '@carbon/react';
import {
  ConfigurableLink,
  ExtensionSlot,
  useAssignedExtensions,
  useConfig,
  useLayoutType,
  useLeftNavStore,
  useSession,
} from '@openmrs/esm-framework';
import React, { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isDesktop } from '../../utils';
import Logo from '../logo/logo.component';
import NotificationsMenuPanel from '../navbar-header-panels/notifications-menu-panel.component';
import SideMenuPanel from '../navbar-header-panels/side-menu-panel.component';
import styles from './navbar.scss';

const HeaderItems: React.FC = () => {
  const config = useConfig();
  const [activeHeaderPanel, setActiveHeaderPanel] = useState<string>(null);
  const layout = useLayoutType();
  const { slotName, mode } = useLeftNavStore();
  const navMenuItems = useAssignedExtensions(slotName);
  const isActivePanel = useCallback((panelName: string) => activeHeaderPanel === panelName, [activeHeaderPanel]);

  // Track whether the collapsible nav is expanded (only used when mode === 'collapsed')
  const [isNavExpanded, setIsNavExpanded] = useState(() => {
    try {
      return localStorage.getItem('openmrs:leftNavExpanded') === 'true';
    } catch {
      return false;
    }
  });

  const togglePanel = useCallback(
    (panelName: string) => {
      setActiveHeaderPanel((activeHeaderPanel) => (activeHeaderPanel === panelName ? null : panelName));
    },
    [],
  );

  const hidePanel = useCallback(
    (panelName: string) => () => {
      setActiveHeaderPanel((activeHeaderPanel) => (activeHeaderPanel === panelName ? null : activeHeaderPanel));
    },
    [],
  );

  const toggleNavExpanded = useCallback(() => {
    setIsNavExpanded((prev) => {
      const newValue = !prev;
      try {
        localStorage.setItem('openmrs:leftNavExpanded', String(newValue));
      } catch (e) {
        console.warn('Failed to save nav expanded state', e);
      }
      return newValue;
    });
  }, []);

  // Show hamburger:
  // - On mobile/tablet: always (when nav exists)
  // - On desktop: only when mode is 'collapsed'
  const showHamburger = useMemo(
    () => navMenuItems.length > 0 && (
      !isDesktop(layout) || mode === 'collapsed'
    ),
    [navMenuItems.length, layout, mode],
  );

  return (
    <>
      <Header aria-label="OpenMRS" className={styles.topNavHeader}>
        {showHamburger && (
          <HeaderMenuButton
            aria-label={
              !isDesktop(layout) 
                ? (isActivePanel('sideMenu') ? 'Close menu' : 'Open menu')
                : (isNavExpanded ? 'Collapse navigation' : 'Expand navigation')
            }
            isCollapsible
            className={styles.headerMenuButton}
            onClick={() => {
              if (!isDesktop(layout)) {
                // Mobile/Tablet: Toggle the slide-out panel
                togglePanel('sideMenu');
              } else {
                // Desktop in collapsed mode: Toggle expanded state
                toggleNavExpanded();
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            isActive={!isDesktop(layout) ? isActivePanel('sideMenu') : isNavExpanded}
          />
        )}
        <ConfigurableLink to={config.logo.link}>
          <div className={showHamburger ? '' : styles.spacedLogo}>
            <Logo />
          </div>
        </ConfigurableLink>
        <div className={styles.divider} />
        <ExtensionSlot name="top-nav-info-slot" className={styles.topNavInfoSlot} />
        <HeaderGlobalBar className={styles.headerGlobalBar}>
          <ExtensionSlot
            name="top-nav-actions-slot"
            state={{ isActivePanel, togglePanel, hidePanel }}
            className={styles.topNavActionsSlot}
          />
          <ExtensionSlot
            name="notifications-menu-button-slot"
            state={{
              isActivePanel: isActivePanel,
              togglePanel: togglePanel,
            }}
          />
          <ExtensionSlot
            name="top-nav-app-menu-slot"
            state={{ isActivePanel, togglePanel, hidePanel }}
            className={styles.topNavActionsSlot}
          />
          <SideMenuPanel 
            hidePanel={hidePanel('sideMenu')} 
            expanded={isActivePanel('sideMenu')} 
            isNavExpanded={isNavExpanded}
          />
          <NotificationsMenuPanel expanded={isActivePanel('notificationsMenu')} />
        </HeaderGlobalBar>
      </Header>
    </>
  );
};

const Navbar: React.FC = () => {
  const session = useSession();
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  if (session?.user?.person) {
    return session.sessionLocation ? (
      <HeaderContainer render={HeaderItems}></HeaderContainer>
    ) : (
      <Navigate
        to={`/login/location`}
        state={{
          referrer: window.location.pathname.slice(
            window.location.pathname.indexOf(openmrsSpaBase) + openmrsSpaBase.length - 1,
          ),
        }}
      />
    );
  }

  return (
    <Navigate
      to={`/login`}
      state={{
        referrer: window.location.pathname.slice(
          window.location.pathname.indexOf(openmrsSpaBase) + openmrsSpaBase.length - 1,
        ),
      }}
    />
  );
};

export default Navbar;
