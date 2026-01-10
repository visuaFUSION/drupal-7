# Drupal 7 LTSR Release Notes

**Current Version:** 7.2026.02
**Release Date:** January 2026
**License:** GPL-2.0-or-later

---

## Overview

Drupal 7 LTSR (Long Term Support Release) is a community-maintained fork of Drupal 7, providing extended security support beyond the official end-of-life date of January 5, 2025.

---

## What's New

### PHP 8.x Support
- **Minimum PHP version:** 8.0.0
- **Supported versions:** PHP 8.0, 8.1, 8.2, 8.3

### Security Hardening

**Gadget Chain Mitigation (SA-CORE-2025-003):**
Added defensive `__wakeup()` methods to prevent PHP Object Injection attacks:
- `Archive_Tar` class (modules/system/system.tar.inc)
- `Query` class (includes/database/query.inc)
- `DatabaseTransaction` class (includes/database/database.inc)
- `DrupalCacheArray` class (includes/bootstrap.inc)

**Security Analysis:**
- SA-CORE-2025-001 (XSS): Not affected
- SA-CORE-2025-002 (Access Bypass): D7 core not affected
- SA-CORE-2025-003 (Gadget Chain): Mitigated

### HTTP Client Modernization

**cURL Support for HTTP Requests:**
- `drupal_http_request()` now uses PHP's cURL extension when available
- Significantly more reliable on Windows/IIS environments
- Better SSL/TLS handling than raw PHP sockets
- Auto-detects loopback connections and handles SSL verification appropriately
- Legacy socket-based implementation retained as fallback

**Configuration Options:**
```php
// Disable cURL (use legacy sockets)
$conf['drupal_http_request_use_curl'] = FALSE;

// Force skip SSL verification (not recommended for production)
$conf['drupal_http_request_skip_ssl_verify'] = TRUE;
```

### Self-Hosted Update System
- Update checks now use the LTSR release server
- No more "unsupported" warnings from drupal.org
- Announcements feed redirected to LTSR channel

**New Constants:**
```php
DRUPAL_FORK_NAME = 'Drupal 7 LTSR'
DRUPAL_FORK_UPDATE_URL = 'https://raw.githubusercontent.com/visuafusion/releases/refs/heads/main'
DRUPAL_FORK_PROJECT_URL = 'https://github.com/visuafusion/drupal-7'
DRUPAL_FORK_ANNOUNCEMENTS_URL = '...'
DRUPAL_FORK_SUPPRESS_EOL_WARNINGS = TRUE
```

### Overlay Loading Indicator

**New Visual Loading Feedback:**
- Modern 5-dot wave animation with Drupal blue pulse effect
- Site logo displayed above the loading dots
- Appears immediately when overlay opens
- Shows during form submissions for visual feedback
- Modern card design with rounded corners and subtle shadow

### Favicon Fallback

**Consistent Branding in Admin:**
- When admin theme doesn't have a favicon configured, falls back to the default theme's favicon
- Eliminates browser default favicon (globe) in admin overlay
- Provides consistent branding experience across front-end and admin

### Announcements Feed Improvements

**LTSR Feed Format Support:**
- Announcements module now supports GitHub-hosted feeds
- Compatible with both drupal.org (`_drupalorg`) and LTSR (`_drupal`) feed formats
- Version matching updated to support LTSR versioning (7.YYYY.MM)
- Graceful handling of missing URL fields in feed items

---

## Files Changed

### Core
- `includes/bootstrap.inc` - Version, constants, DrupalCacheArray security
- `includes/common.inc` - cURL HTTP implementation
- `includes/theme.inc` - Favicon fallback logic
- `includes/database/database.inc` - DatabaseTransaction security
- `includes/database/query.inc` - Query class security

### Overlay Module
- `modules/overlay/overlay-parent.js` - Loading indicator theme function
- `modules/overlay/overlay-parent.css` - Loading indicator styles
- `modules/overlay/overlay-child.js` - Form submission loading trigger
- `modules/overlay/overlay.module` - Logo URL passed to JavaScript

### Update Module
- `modules/update/update.compare.inc` - LTSR update server support
- `modules/update/update.fetch.inc` - LTSR update fetching
- `modules/update/update.module` - EOL warning suppression

### Announcements Feed Module
- `modules/announcements_feed/announcements_feed.inc` - LTSR feed support

### System Module
- `modules/system/system.tar.inc` - Archive_Tar security

---

## Upgrading

### From Drupal 7.103 (or earlier)
1. Back up your database and files
2. Replace core files with LTSR 7.2026.02
3. Run `update.php`
4. Clear caches

### Configuration
The update server URL can be overridden in `settings.php`:
```php
$conf['update_fetch_url'] = 'https://your-server.com/release-history';
```

---

## Supported Contrib Modules

20 contrib modules are maintained under LTSR with version 7.x-2026.01:
- Views, CTools, Token, Entity API, Date
- Webform, Panels, Display Suite, Libraries, LDAP
- Calendar, Auto Nodetitle, Content Access, Analytics
- Smart Trim, Timefield, Video, Wysiwyg
- Webserver Auth, Permissions per Webform

---

## Version History

### 7.2026.02 (January 2026)
- HTTP client modernization (cURL support)
- Overlay loading indicator with site logo
- Favicon fallback for admin theme
- Announcements feed LTSR format support

### 7.2026.01 (January 2026)
- Initial LTSR release
- PHP 8.x support (8.0-8.3)
- Security hardening (SA-CORE-2025-003)
- Self-hosted update system
- EOL warning suppression

---

## Resources

- **Repository:** https://github.com/visuafusion/drupal-7
- **Modules:** https://github.com/visuaFUSION/drupal-7-modules
- **Release History:** https://github.com/visuafusion/releases

## Credits

All the credit goes to the amazing folks who created, contributed, and maintained Drupal 7 for all those years. Drupal 7 LTSR is maintained by visuaFUSION for organizations requiring extended Drupal 7 support.
