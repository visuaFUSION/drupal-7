# Directional Decisions

This document tracks major architectural and directional decisions for Drupal 7 LTSR (Long Term Support Release). It serves as a reference to avoid re-hashing decisions and to document the reasoning behind them.

---

## Branding & Naming

### Decision: "Drupal 7 LTSR" Branding
**Date:** January 2025
**Decision Maker:** bahusafoo

**Decision:** Brand this distribution as "Drupal 7 LTSR" (Long Term Support Release), with Extended Security Updates (ESU) as a key component.

**Rationale:**
- "LTSR" implies long-term stability and ongoing support (similar to Ubuntu LTS)
- Broader than just "ESU" - allows for modernization and new features
- "ESU" describes the security update component specifically
- Familiar terminology for enterprise users

**Scope of LTSR:**
- Extended Security Updates (ESU) beyond official EOL (January 5, 2025)
- PHP 8.x compatibility maintenance
- Modernization improvements (UI enhancements, core module integrations)
- New features that bridge the gap between D7 and D10/11

---

## Project Scope & Vision

### Decision: Modernization Is In Scope
**Date:** January 2025
**Decision Maker:** bahusafoo

**Decision:** LTSR is not limited to security patches. Modernization efforts and new features are welcome, with the goal of bridging the UI/UX gap between Drupal 7 and Drupal 10/11 while maintaining D7's lightweight nature.

**Potential Modernization Targets:**
- **Chaos Tools (ctools):** Consider integrating into core, as D8+ absorbed much of this functionality
- **UI/UX improvements:** Modernize admin interface while keeping lightweight
- **Core module integrations:** Absorb commonly-used contrib modules where appropriate

**Guiding Principles:**
- Maintain backwards compatibility where possible
- Keep Drupal 7's lightweight footprint
- Don't break existing contrib module ecosystem
- Security always takes priority

---

## JavaScript Libraries

### Decision: Keep jQuery 1.4.4 with Security Backports (For Now)
**Date:** January 2025
**Decision Maker:** bahusafoo

**Decision:** Retain the current jQuery 1.4.4 with security backports rather than upgrading to jQuery 3.7.x immediately.

**Current State:**
- jQuery 1.4.4 (released 2010) with security patches backported from 3.4.0 and 3.5.0
- jQuery UI 1.8.7 with security patches

**Rationale:**
- A full jQuery upgrade (1.4.4 → 3.7.x) would require testing every contributed module that users of this fork may have installed
- Many Drupal 7 contrib modules rely on jQuery 1.x APIs (`.live()`, `.bind()`, etc.)
- The existing security backports address critical vulnerabilities without breaking compatibility
- Primary focus for initial release is security vulnerability hardening

**Future Plan:**
- Long-term: Perform full jQuery upgrade to 3.7.x (or latest)
- Implement backwards compatibility shims via jQuery Migrate or custom contribution
- This will be a major effort requiring extensive testing

**Related Files:**
- `misc/jquery.js` - Core jQuery 1.4.4
- `misc/jquery-extend-3.4.0.js` - Security backport
- `misc/jquery-html-prefilter-3.5.0-backport.js` - Security backport
- `misc/ui/jquery.ui.core.js` - jQuery UI 1.8.7

---

## Update System

### Decision: Self-Hosted Release History via GitHub
**Date:** January 2025
**Decision Maker:** bahusafoo

**Decision:** Host release history XML files in a separate GitHub repository (`visuaFUSION/releases`) rather than drupal.org or embedding in the main repo.

**Rationale:**
- Product-neutral repository allows hosting release info for multiple projects
- Release metadata is separate from code (cleaner separation of concerns)
- Updates to release history don't clutter the main repo's commit history
- GitHub raw URLs provide reliable, free hosting

**Implementation:**
- `DRUPAL_FORK_UPDATE_URL` points to `https://raw.githubusercontent.com/visuafusion/releases/refs/heads/main`
- Release history file: `drupal/7.x` (standard Drupal convention, no extension)
- EOL warnings from drupal.org suppressed for core via `DRUPAL_FORK_SUPPRESS_EOL_WARNINGS`

---

## PHP Compatibility

### Decision: Target PHP 8.0, 8.1, 8.2, 8.3
**Date:** January 2025
**Decision Maker:** bahusafoo

**Decision:** Set minimum PHP version to 8.0.0 and target all PHP 8.x versions through 8.3.

**Rationale:**
- PHP 7.x is EOL (security support ended)
- Medical/enterprise clients need supported PHP versions
- Drupal 7.103 already includes PHP 8.0-8.3 compatibility fixes
- No additional code changes required; compatibility already verified

**Implementation:**
- `DRUPAL_MINIMUM_PHP` set to `8.0.0` in `includes/bootstrap.inc`

---

## Release Strategy

### Decision: Focus Areas for Initial LTSR Release
**Date:** January 2025
**Decision Maker:** bahusafoo

**Decision:** The first LTSR release (7.200) will focus on:
1. Update check handling (point to LTSR release channel)
2. LTSR branding throughout
3. Patching any security vulnerabilities since 7.103 (last official release)

**Rationale:**
- Establishes the LTSR channel infrastructure
- Addresses immediate security concerns post-EOL
- Provides foundation for future modernization work

**Future Releases May Include:**
- jQuery modernization (with backwards compat shims)
- Chaos Tools integration
- UI/admin improvements
- Additional security hardening

---

## Security Analysis

### Analysis: SA-CORE-2025 Advisories Impact on Drupal 7
**Date:** January 2025

**Summary:** Following Drupal 7's official EOL (January 5, 2025), the Drupal Security Team no longer evaluates D7 for new advisories. This analysis examined whether SA-CORE-2025 vulnerabilities affect Drupal 7.

#### SA-CORE-2025-001 (XSS)
**Status:** Not affected
**Notes:** The official advisory explicitly states "Drupal 7 is not affected."

#### SA-CORE-2025-002 (Access Bypass in Bulk Actions)
**Status:** D7 Core not directly affected; VBO contrib may be affected
**Analysis:**
- This vulnerability relates to the Views Bulk Operations system in D8+
- D7 core does not have built-in bulk action permissions
- The contrib module "Views Bulk Operations" (VBO) for D7 includes an `actions_permissions` sub-module that may share this vulnerability
- D7's core `includes/actions.inc` uses action hashing via `drupal_hash_base64()` to prevent function name exposure in forms

**Recommendation:** Sites using VBO should evaluate their exposure. Core D7 is not vulnerable.

#### SA-CORE-2025-003 (Gadget Chain)
**Status:** Similar patterns exist in D7 but require separate exploit
**Analysis:**
This vulnerability describes a gadget chain (exploitable magic methods) that could enable arbitrary file inclusion if combined with a separate unserialize vulnerability. D7 contains similar patterns:

- `modules/system/system.tar.inc:279` - `__destruct()` calls `drupal_unlink()` (mitigated by regex validation)
- `includes/database/query.inc:352` - `__wakeup()` reconnects to database
- `includes/database/database.inc:2017` - `__destruct()` pops transaction
- `includes/bootstrap.inc:505` - `__destruct()` writes to cache

**Mitigation:** Per Drupal's advisory, "There are no such known exploits in Drupal core" that allow passing unsafe input to `unserialize()`. D7 uses `unserialize()` on database-stored data (actions, menu items, cache entries), which are not directly user-controllable.

**Recommendation:** Monitor for any discovered unserialize entry points. The gadget chains themselves are not exploitable without a separate vulnerability.

**Related Files:**
- `includes/actions.inc` - Core actions system
- `modules/system/system.tar.inc` - Archive handling with __destruct
- `includes/database/query.inc` - Database query abstraction
- `misc/brumann/polyfill-unserialize/` - Safe unserialize polyfill (available but not used by default)

---

## HTTP Client Modernization

### Decision: Use cURL for HTTP Requests When Available
**Date:** January 2026
**Decision Maker:** bahusafoo

**Decision:** Modernize `drupal_http_request()` to use PHP's cURL extension when available, falling back to the legacy socket-based implementation if cURL is unavailable.

**Rationale:**
- cURL provides better SSL/TLS handling than raw PHP sockets
- Significantly more reliable on Windows/IIS environments
- Better handling of redirects, timeouts, and HTTP features
- cURL is available in all modern PHP installations (required for many hosting environments)
- Legacy socket implementation retained as fallback for edge cases

**Implementation:**
- New `_drupal_http_request_curl()` function in `includes/common.inc`
- Auto-detects loopback connections (localhost, server hostname) and skips SSL verification for self-connections
- Can be disabled via `$conf['drupal_http_request_use_curl'] = FALSE;`
- SSL verification skip can be forced via `$conf['drupal_http_request_skip_ssl_verify'] = TRUE;`

**Related Files:**
- `includes/common.inc` - HTTP request functions

---

## UI/UX Modernization

### Decision: Add Loading Indicator to Overlay Module
**Date:** January 2026
**Decision Maker:** bahusafoo

**Decision:** Add a modern loading indicator to the overlay module that displays during page loads and form submissions, featuring the site's logo and an animated dot wave effect.

**Rationale:**
- Drupal 7's overlay previously had no visual loading feedback
- Users clicking admin links would see a dimmed screen with no indication of progress
- Modern web applications provide clear loading states for better UX
- Branded loading screen (with site logo) provides professional feel

**Implementation:**
- 5-dot wave animation with staggered pulse effect
- Site logo displayed above dots (pulled from default theme settings)
- Modern card design with rounded corners and shadow
- Shows immediately when overlay opens or forms are submitted
- jQuery 1.4.4 compatible (uses `.bind()` instead of `.on()`)

**Design Details:**
- Card: white background, 16px border radius, subtle shadow
- Dots: 18px diameter, gray → Drupal blue pulse animation
- Logo: max 60px height, 180px width, centered above dots

**Related Files:**
- `modules/overlay/overlay-parent.js` - Theme function and loading state
- `modules/overlay/overlay-parent.css` - Loading indicator styles
- `modules/overlay/overlay-child.js` - Form submission loading trigger
- `modules/overlay/overlay.module` - Logo URL passed to JavaScript

---

### Decision: Favicon Fallback for Admin Theme
**Date:** January 2026
**Decision Maker:** bahusafoo

**Decision:** When the admin theme doesn't have a favicon configured, fall back to the default theme's favicon instead of showing no favicon.

**Rationale:**
- Admin overlay would show browser default favicon (globe) when admin theme had no favicon
- Inconsistent branding experience between front-end and admin
- Simple fix that improves visual consistency

**Implementation:**
- Modified `template_preprocess_html()` and `template_preprocess_maintenance_page()` in `includes/theme.inc`
- Checks current theme for favicon; if empty, falls back to default theme's favicon

**Related Files:**
- `includes/theme.inc` - Theme preprocessing functions

---

## Announcements System

### Decision: Support LTSR Feed Format in Announcements Module
**Date:** January 2026
**Decision Maker:** bahusafoo

**Decision:** Modify the announcements_feed module to support both drupal.org's feed format (`_drupalorg` property) and LTSR's feed format (`_drupal` property), and allow GitHub URLs in addition to drupal.org URLs.

**Rationale:**
- LTSR announcements are hosted on GitHub, not drupal.org
- Original module only allowed drupal.org URLs
- Feed property naming differs between D.O. and LTSR formats
- Version matching regex needed to support LTSR version format (7.2026.01)

**Implementation:**
- `announcements_feed_validate_url()` now accepts github.com URLs
- Property checking supports both `_drupalorg` and `_drupal`
- Version regex updated to handle `YYYY.MM` format
- Missing URL field handled gracefully (LTSR feeds may not have individual URLs)

**Related Files:**
- `modules/announcements_feed/announcements_feed.inc` - Feed parsing and validation

---

## Contributing

When making significant decisions about the direction of this project, please:
1. Document the decision in this file
2. Include the date and decision maker
3. Provide clear rationale
4. Note any future plans or related files
