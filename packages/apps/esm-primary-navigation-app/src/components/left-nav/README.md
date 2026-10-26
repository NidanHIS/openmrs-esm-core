# Custom Left Navigation

This directory contains a custom left navigation implementation that replaces the Carbon Design System's SideNav with a more flexible solution.

## Features

### Icon Rail (Collapsed Mode)
- Displays only icons in a narrow 48px rail
- Icons are centered and clearly visible
- Shows a visual indicator for the active page
- Hover tooltips display the full title
- Toggle using the hamburger menu to expand

### Full Navigation (Normal Mode)
- Displays icons with titles in a 256px wide panel
- Clear visual hierarchy with proper spacing
- Active page indicated with colored border and background
- Toggle using the hamburger menu to collapse

### Hidden Mode
- Navigation is completely hidden
- No space is reserved for navigation
- Content spans full width

## Components

### `CustomLeftNav`
The main navigation component that:
- Reads state from `useLeftNavStore()` hook
- Renders extension slots for navigation items
- Adapts its appearance based on collapsed/expanded/hidden mode
- Adds body classes for CSS coordination

### Hamburger Menu Integration
The top navigation hamburger button:
- Toggles between collapsed (icon rail) and expanded (full nav) modes
- Saves user preference to localStorage
- Restores preference on page load
- Shows active state when nav is expanded

## Styling

### `custom-left-nav.module.scss`
- Defines the navigation panel layout and transitions
- Handles icon-only and icon+text layouts
- Provides hover states and active indicators
- Includes responsive behavior for mobile/tablet

### `left-nav-global.scss`
- Adjusts main content area margin when nav is visible
- Ensures smooth transitions when toggling
- Handles responsive behavior

## Usage

The navigation is automatically rendered by the `SideMenuPanel` component. Page components control the navigation by using the `useLeftNav` hook:

```tsx
import { useLeftNav } from '@openmrs/esm-framework';

function MyPageComponent() {
  useLeftNav({ 
    name: 'my-nav-slot', 
    basePath: '/my-app',
    mode: 'normal' // optional: 'normal', 'collapsed', or 'hidden'
  });
  
  return <div>My Page Content</div>;
}
```

## User Interaction

### Desktop View

#### When `useLeftNav({ mode: 'normal' })`
- Full sidebar (256px) is **always visible**
- **No hamburger menu** button in top nav
- User **cannot collapse** it
- Perfect for apps that always need the full navigation visible

#### When `useLeftNav({ mode: 'collapsed' })`
- **Hamburger menu** button visible in top nav
- User can toggle between two states:
  - **Closed (default)**: Icon rail (48px) visible
  - **Opened**: Full sidebar (256px) visible
- User preference saved to localStorage as `openmrs:leftNavExpanded`
- Perfect for apps that want user-controlled navigation

### Mobile/Tablet View

- **Always shows hamburger menu** (regardless of mode)
- **No icon rail** - navigation starts hidden
- Click hamburger → Full sidebar (256px) slides out as an overlay panel
- Click outside or navigate → Panel closes
- Same behavior for both `mode: 'normal'` and `mode: 'collapsed'`

## Mode Behavior

| Mode | Desktop | Mobile/Tablet |
|------|---------|---------------|
| `normal` | Full sidebar (256px) always visible, no hamburger | Hamburger shows/hides slide-out panel |
| `collapsed` | Icon rail (48px) by default, hamburger toggles to full sidebar | Hamburger shows/hides slide-out panel |
| `hidden` | Not shown | Not shown |

## Customization

The navigation inherits theme colors from the OpenMRS styleguide variables:
- `$ui-01` - Background color
- `$ui-03` - Active background
- `$text-02` - Text color
- `$ui-05` - Active text color
- `--brand-01` - Active indicator color

To customize colors, update these variables in your theme configuration.

## Implementation Notes

- Does not use Carbon's `SideNav` component to avoid constraints
- Directly styles `.cds--side-nav__link` classes for compatibility with existing dashboard extensions
- Uses React Portals to render into `#omrs-left-nav-container`
- Updates body classes for global CSS coordination
- Maintains state in the framework's `leftNavStore`
- User preference stored in `localStorage` with key `openmrs:leftNavMode`
