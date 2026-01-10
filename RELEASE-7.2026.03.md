# Drupal 7.2026.03 LTSR Release Notes

**Release Date:** January 2026
**Type:** Long Term Support Release (LTSR)

---

## Overview

Drupal 7.2026.03 is a modernization release focused on updating the visual appearance of core themes while maintaining full backwards compatibility with existing Drupal 7 sites.

---

## What's New

### Admin Toolbar Module (NEW)

A new contributed module backported from Drupal 8/9/10/11 that enhances the core Toolbar:

- **Dropdown menus on hover** for all admin menu items
- **Drupal icon dropdown** with quick admin tools:
  - Flush all caches
  - Run cron manually
  - Rebuild theme registry
- **Nested submenu support** for deep menu hierarchies
- **Backwards compatible** - works with custom themes that don't override toolbar templates

Enable at: `admin/modules` → Administration → Admin Toolbar

### Seven Admin Theme (Modernized)

The Seven admin theme has been updated with a contemporary 2026 look:

- **Modern buttons** - Solid blue color (#0074bd), 6px radius, subtle shadows
- **Improved form inputs** - Rounded corners, blue focus rings
- **Updated tables** - 8px rounded corners, row hover effects, subtle shadows
- **Modern tabs** - Underline style instead of folder tabs
- **Cleaner fieldsets** - Rounded corners, lighter styling
- **Overlay modal** - Rounded corners, dark titlebar, modern tab styling

### Bartik Theme (Modernized)

The Bartik front-end theme has been refreshed while keeping its familiar character:

- **Flat modern tabs** - Main menu keeps the tab metaphor but with a flat, modern appearance (top-radius only, no 3D effects)
- **Modern system tabs** - Underline-style primary tabs with blue accent
- **Updated buttons** - Solid blue color with hover/active states
- **Improved tables** - Rounded corners, cleaner row styling, hover effects
- **Better form inputs** - Rounded corners, focus rings
- **Cleaner fieldsets** - Modern legend styling

---

## Version Numbers

| Component | Version |
|-----------|---------|
| Drupal Core | 7.2026.03 |
| Seven Theme | 7.x-2026.03 |
| Bartik Theme | 7.x-2026.03 |
| Admin Toolbar | 7.x-2026.03 |

---

## Upgrade Path

### From Drupal 7.x

1. Backup your database and files
2. Replace core files with 7.2026.03
3. Run `update.php`
4. Clear all caches
5. (Optional) Enable Admin Toolbar module at `admin/modules`

### Theme Compatibility

- **Custom themes based on Bartik**: Review your CSS overrides for the main menu and tabs - the class structure remains the same but styling has changed
- **Custom admin themes based on Seven**: Similar review recommended for button and form styling
- **Standalone custom themes**: No changes required - Admin Toolbar works independently of theme templates

---

## Technical Details

### CSS Changes

The following CSS properties have been modernized across themes:

- `border-radius` increased from 4px to 6-8px on most elements
- `box-shadow` added for subtle depth
- `transition` properties added for smooth hover effects
- Removed legacy `-khtml-` prefixes (kept `-moz-` and `-webkit-` for compatibility)
- Colors updated to use modern blue (#0074bd) as accent

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge): Full support
- IE11: Basic functionality (no transitions/shadows)

---

## Credits

- Drupal 7 LTSR maintained by visuaFUSION Systems Solutions
- Admin Toolbar backport based on the Drupal 8+ module by Mohamed Anis Taktak (matio89)
- Theme modernization inspired by contemporary web design standards

---

## Changelog

### 7.2026.03 (January 2026)
- Modernized Bartik theme with flat modern tabs
- Modernized Seven admin theme
- Updated overlay modal styling
- Added Admin Toolbar module
- Updated all component versions to 7.2026.03

### 7.2026.02
- Initial theme modernization work
- Seven theme updates
- Overlay improvements

### 7.2026.01
- Security updates
- PHP 8.x compatibility improvements
