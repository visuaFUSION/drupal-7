# Drupal 7 LTSR 7.2026.01 Release Notes

**Release Date:** January 2026
**License:** GPL-2.0-or-later

## Overview

Drupal 7 LTSR (Long Term Support Release) 7.2026.01 is the first release of the community-maintained fork of Drupal 7, providing extended security support beyond the official end-of-life date of January 5, 2025.

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

### Self-Hosted Update System
- Update checks now use the LTSR release server
- No more "unsupported" warnings from drupal.org
- Announcements feed redirected to LTSR channel

### New Constants
```php
DRUPAL_FORK_NAME = 'Drupal 7 LTSR'
DRUPAL_FORK_UPDATE_URL = 'https://raw.githubusercontent.com/visuafusion/releases/refs/heads/main'
DRUPAL_FORK_PROJECT_URL = 'https://github.com/visuafusion/drupal-7'
DRUPAL_FORK_ANNOUNCEMENTS_URL = '...'
DRUPAL_FORK_SUPPRESS_EOL_WARNINGS = TRUE
```

## Upgrading

### From Drupal 7.103 (or earlier)
1. Back up your database and files
2. Replace core files with LTSR 7.2026.01
3. Run `update.php`
4. Clear caches

### Configuration
The update server URL can be overridden in `settings.php`:
```php
$conf['update_fetch_url'] = 'https://your-server.com/release-history';
```

## Supported Contrib Modules

20 contrib modules are maintained under LTSR with version 7.x-2026.01:
- Views, CTools, Token, Entity API, Date
- Webform, Panels, Display Suite, Libraries, LDAP
- Calendar, Auto Nodetitle, Content Access, Analytics
- Smart Trim, Timefield, Video, Wysiwyg
- Webserver Auth, Permissions per Webform

## Resources

- **Repository:** https://github.com/visuafusion/drupal-7
- **Modules:** https://github.com/visuaFUSION/drupal-7-modules
- **Release History:** https://github.com/visuafusion/releases

## Credits

All the credit goes to the amazing folks who created, contributed, and/or maintained Drupal 7 for all those years. Drupal 7 LTSR is maintained by visuaFUSION for organizations requiring extended Drupal 7 support.
