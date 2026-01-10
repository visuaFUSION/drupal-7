/**
 * @file
 * Admin Toolbar dropdown menu behavior.
 *
 * Enhances the core toolbar with dropdown menus via JavaScript.
 * Works with any theme, including those that override toolbar.tpl.php.
 */

(function ($) {

  'use strict';

  /**
   * Cache for the menu tree data.
   */
  var menuTreeCache = null;

  /**
   * Hover timeout handles.
   */
  var hoverTimeouts = {};

  /**
   * Get hover delay from settings.
   */
  function getHoverDelay() {
    return Drupal.settings.adminToolbar && Drupal.settings.adminToolbar.hoverDelay || 200;
  }

  /**
   * Builds a dropdown menu from an array of items.
   *
   * @param {Array} items
   *   Array of menu items.
   * @param {number} depth
   *   Current depth level.
   *
   * @return {jQuery}
   *   The dropdown UL element.
   */
  function buildDropdown(items, depth) {
    if (!items || !items.length) {
      return null;
    }

    var $ul = $('<ul class="admin-toolbar-dropdown"></ul>');
    $ul.attr('data-depth', depth);

    $.each(items, function (i, item) {
      var $li = $('<li></li>');
      var $a = $('<a></a>')
        .attr('href', item.href)
        .text(item.title);

      if (item.description) {
        $a.attr('title', item.description);
      }

      $li.append($a);

      // Add children if present.
      if (item.children && item.children.length) {
        $li.addClass('has-children');
        $li.css('position', 'relative');
        var $submenu = buildDropdown(item.children, depth + 1);
        if ($submenu) {
          $li.append($submenu);
          // Attach hover behavior to nested items too.
          attachDropdownBehavior($li, $submenu);
        }
      }

      $ul.append($li);
    });

    return $ul;
  }

  /**
   * Attaches dropdown behavior to a menu item.
   *
   * @param {jQuery} $item
   *   The menu item LI element.
   * @param {jQuery} $dropdown
   *   The dropdown UL element.
   */
  function attachDropdownBehavior($item, $dropdown) {
    var itemId = $item.attr('id') || 'item-' + Math.random();
    var delay = getHoverDelay();

    $item.bind('mouseenter', function () {
      // Clear any pending close timeout.
      if (hoverTimeouts[itemId]) {
        clearTimeout(hoverTimeouts[itemId]);
        hoverTimeouts[itemId] = null;
      }

      // Close sibling dropdowns.
      $item.siblings().find('.admin-toolbar-dropdown.open').removeClass('open');

      // Open this dropdown after delay.
      hoverTimeouts[itemId] = setTimeout(function () {
        $dropdown.addClass('open');
      }, delay);
    });

    $item.bind('mouseleave', function () {
      // Clear any pending open timeout.
      if (hoverTimeouts[itemId]) {
        clearTimeout(hoverTimeouts[itemId]);
        hoverTimeouts[itemId] = null;
      }

      // Close dropdown after delay.
      hoverTimeouts[itemId] = setTimeout(function () {
        $dropdown.removeClass('open');
      }, delay);
    });

    // Keep dropdown open when hovering over it.
    $dropdown.bind('mouseenter', function () {
      if (hoverTimeouts[itemId]) {
        clearTimeout(hoverTimeouts[itemId]);
        hoverTimeouts[itemId] = null;
      }
      $dropdown.addClass('open');
    });

    $dropdown.bind('mouseleave', function () {
      hoverTimeouts[itemId] = setTimeout(function () {
        $dropdown.removeClass('open');
      }, delay);
    });
  }

  /**
   * Creates the Drupal icon dropdown menu.
   */
  function createDrupalIconDropdown() {
    var settings = Drupal.settings.adminToolbar;
    if (!settings || !settings.drupalMenu || !settings.drupalMenu.length) {
      return;
    }

    // Find the home link container - could be #toolbar-home or the li inside it.
    var $home = $('#toolbar-home');
    if (!$home.length) {
      return;
    }

    // Check if dropdown already exists.
    if ($('#admin-toolbar-drupal-menu').length) {
      return;
    }

    // Find the actual li element to attach to (for valid HTML).
    var $homeLi = $home.find('li').first();
    if (!$homeLi.length) {
      // If toolbar-home is itself the container, use it.
      $homeLi = $home;
    }

    // Build the dropdown.
    var $dropdown = $('<ul id="admin-toolbar-drupal-menu" class="admin-toolbar-dropdown"></ul>');

    $.each(settings.drupalMenu, function (i, item) {
      var $li = $('<li></li>');
      var $a = $('<a></a>')
        .attr('href', item.href)
        .text(item.title);
      $li.append($a);
      $dropdown.append($li);
    });

    // Append to the li for valid HTML structure.
    $homeLi.append($dropdown);
    $homeLi.css('position', 'relative');
    attachDropdownBehavior($homeLi, $dropdown);
  }

  /**
   * Fetches the menu tree and creates dropdowns for toolbar items.
   */
  function createMenuDropdowns() {
    var settings = Drupal.settings.adminToolbar;
    if (!settings || !settings.menuTreeUrl) {
      return;
    }

    // Find toolbar menu items - try multiple selectors for different themes.
    var $menuItems = $('#toolbar-menu > li');
    if (!$menuItems.length) {
      $menuItems = $('#toolbar #toolbar-menu > li');
    }
    if (!$menuItems.length) {
      $menuItems = $('#toolbar ul#toolbar-menu > li');
    }
    if (!$menuItems.length) {
      // Last resort - find any links in toolbar-menu.
      $menuItems = $('#toolbar-menu li');
    }
    if (!$menuItems.length) {
      return;
    }

    // Fetch menu tree if not cached.
    if (menuTreeCache) {
      processMenuTree(menuTreeCache, $menuItems);
    } else {
      $.ajax({
        url: settings.menuTreeUrl,
        dataType: 'json',
        success: function (data) {
          menuTreeCache = data;
          processMenuTree(data, $menuItems);
        }
      });
    }
  }

  /**
   * Processes the menu tree and attaches dropdowns to toolbar items.
   *
   * @param {Array} tree
   *   The menu tree data.
   * @param {jQuery} $menuItems
   *   The toolbar menu items.
   */
  function processMenuTree(tree, $menuItems) {
    if (!tree || !tree.length) {
      return;
    }

    // Create a map of path to tree item.
    var treeMap = {};
    $.each(tree, function (i, item) {
      treeMap[item.path] = item;
    });

    // Process each toolbar menu item.
    $menuItems.each(function () {
      var $item = $(this);
      var $link = $item.find('> a').first();
      if (!$link.length) {
        return;
      }

      // Extract the path from the link href.
      var href = $link.attr('href');
      var path = extractPath(href);

      // Find matching tree item.
      var treeItem = treeMap[path];
      if (treeItem && treeItem.children && treeItem.children.length) {
        // Check if dropdown already exists.
        if ($item.find('> .admin-toolbar-dropdown').length) {
          return;
        }

        // Build and attach dropdown.
        var $dropdown = buildDropdown(treeItem.children, 1);
        if ($dropdown) {
          $item.append($dropdown);
          $item.css('position', 'relative');
          attachDropdownBehavior($item, $dropdown);
        }
      }
    });
  }

  /**
   * Extracts the Drupal path from a full URL.
   *
   * @param {string} href
   *   The full URL.
   *
   * @return {string}
   *   The Drupal path.
   */
  function extractPath(href) {
    if (!href) {
      return '';
    }

    // Remove base path.
    var basePath = Drupal.settings.basePath || '/';
    var path = href;

    // Handle relative URLs.
    if (path.indexOf(basePath) === 0) {
      path = path.substring(basePath.length);
    }

    // Handle absolute URLs.
    if (path.indexOf('://') !== -1) {
      var parts = path.split('://');
      if (parts.length > 1) {
        var pathPart = parts[1].split('/');
        pathPart.shift(); // Remove domain.
        path = pathPart.join('/');
      }
    }

    // Remove query string and hash.
    path = path.split('?')[0].split('#')[0];

    // Remove language prefix if present (common patterns).
    path = path.replace(/^[a-z]{2}\//, '');
    path = path.replace(/^[a-z]{2}-[a-z]{2}\//, '');

    return path;
  }

  /**
   * Track if we've initialized.
   */
  var initialized = false;

  /**
   * Initialize the admin toolbar.
   */
  function init() {
    if (initialized) {
      return;
    }

    var $toolbar = $('#toolbar');
    if (!$toolbar.length) {
      return;
    }

    initialized = true;

    // Create Drupal icon dropdown.
    createDrupalIconDropdown();

    // Create menu dropdowns.
    createMenuDropdowns();
  }

  /**
   * Drupal behavior for admin toolbar.
   */
  Drupal.behaviors.adminToolbar = {
    attach: function (context, settings) {
      init();
    }
  };

  /**
   * Fallback: also run on document ready in case behaviors don't fire.
   */
  $(document).ready(function () {
    // Small delay to ensure toolbar is rendered.
    setTimeout(init, 100);
  });

})(jQuery);
