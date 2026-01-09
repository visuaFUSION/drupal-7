# Update Server Documentation

This document describes the XML format used by Drupal 7's update module to check for available releases.

## Overview

Drupal 7 LTSR (Long Term Support Release) uses a custom update server hosted on GitHub. The update module fetches release information using HTTP GET requests. The default URL is configured in `includes/bootstrap.inc` via `DRUPAL_FORK_UPDATE_URL`.

The URL format is:
```
{base_url}/{project_name}/{core_compatibility}
```

For example:
```
https://raw.githubusercontent.com/visuafusion/releases/refs/heads/main/drupal/7.x
```

## XML Format

The update server must return XML in the following format:

```xml
<?xml version="1.0" encoding="utf-8"?>
<project xmlns:dc="http://purl.org/dc/elements/1.1/">
  <title>Drupal 7 LTSR</title>
  <short_name>drupal</short_name>
  <dc:creator>visuaFUSION</dc:creator>
  <link>https://github.com/visuafusion/drupal-7</link>
  <api_version>7.x</api_version>
  <recommended_major>7</recommended_major>
  <supported_majors>7</supported_majors>
  <default_major>7</default_major>
  <project_status>published</project_status>
  <releases>
    <release>
      <name>drupal 7.103</name>
      <version>7.103</version>
      <tag>7.103</tag>
      <version_major>7</version_major>
      <version_patch>103</version_patch>
      <status>published</status>
      <release_link>https://github.com/visuafusion/drupal-7/releases/tag/7.103</release_link>
      <download_link>https://github.com/visuafusion/drupal-7/archive/refs/tags/7.103.tar.gz</download_link>
      <date>1704412800</date>
      <terms>
        <term>
          <name>Release type</name>
          <value>Security update</value>
        </term>
      </terms>
    </release>
  </releases>
</project>
```

## Key Elements

### Project-Level Elements

| Element | Description |
|---------|-------------|
| `title` | Human-readable project name |
| `short_name` | Machine name of the project (e.g., "drupal" for core) |
| `link` | URL to project homepage |
| `api_version` | Core compatibility (e.g., "7.x") |
| `recommended_major` | The recommended major version |
| `supported_majors` | Comma-separated list of supported major versions |
| `default_major` | Default major version for new installations |
| `project_status` | Project status (see below) |

### Project Status Values

| Status | Description |
|--------|-------------|
| `published` | Project is active and supported |
| `unsupported` | Project is no longer supported (triggers EOL warning) |
| `insecure` | Project has known security vulnerabilities |
| `revoked` | Project has been revoked/unpublished |

**Note:** This fork suppresses `unsupported` status for Drupal core when `DRUPAL_FORK_SUPPRESS_EOL_WARNINGS` is `TRUE`.

### Release-Level Elements

| Element | Description |
|---------|-------------|
| `name` | Full release name (e.g., "drupal 7.103") |
| `version` | Version string |
| `tag` | Git tag or CVS tag |
| `version_major` | Major version number |
| `version_patch` | Patch version number |
| `version_extra` | Extra version info (e.g., "beta1", "dev") |
| `status` | Release status ("published" or "unpublished") |
| `release_link` | URL to release notes |
| `download_link` | URL to download the release |
| `date` | Unix timestamp of release date |
| `terms` | Release type terms (see below) |

### Release Type Terms

Release types are specified in the `terms` element:

```xml
<terms>
  <term>
    <name>Release type</name>
    <value>Security update</value>
  </term>
</terms>
```

Common values:
- `Security update` - Contains security fixes
- `Bug fixes` - Contains bug fixes
- `New features` - Contains new features
- `Insecure` - Release has known vulnerabilities
- `Unsupported` - Release is no longer supported

## Hosting Your Own Update Server

### Option 1: Static Files on GitHub

You can host static XML files directly on GitHub by placing them in a `release-history` directory:

```
release-history/
  drupal/
    7.x          # XML file for Drupal core
  views/
    7.x          # XML file for Views module (if forked)
```

Then use the raw GitHub URL as your update server.

### Option 2: PHP Script

Create a PHP script that generates XML dynamically:

```php
<?php
// release-history.php

$project = $_GET['project'] ?? 'drupal';
$core = $_GET['core'] ?? '7.x';

header('Content-Type: application/xml');

// Fetch latest release info from GitHub API
$releases = fetch_github_releases('visuafusion', 'drupal-7');

// Generate XML
echo generate_release_xml($project, $core, $releases);
```

## Configuration

To use a custom update server, add to `settings.php`:

```php
$conf['update_fetch_url'] = 'https://your-server.com/release-history';
```

Or modify `DRUPAL_FORK_UPDATE_URL` in `includes/bootstrap.inc`.

## Contributed Modules

Contributed modules can specify their own update server in their `.info` file:

```ini
project status url = https://updates.drupal.org/release-history
```

This allows contributed modules to continue checking drupal.org for updates while core uses the fork's update server.
