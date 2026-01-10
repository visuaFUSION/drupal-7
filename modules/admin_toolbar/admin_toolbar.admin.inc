<?php

/**
 * @file
 * Admin settings form for Admin Toolbar module.
 */

/**
 * Admin settings form.
 */
function admin_toolbar_settings_form($form, &$form_state) {
  $form['admin_toolbar_depth'] = array(
    '#type' => 'select',
    '#title' => t('Menu depth'),
    '#description' => t('How many levels of menu items to show in dropdowns.'),
    '#options' => array(
      2 => t('2 levels'),
      3 => t('3 levels'),
      4 => t('4 levels (default)'),
      5 => t('5 levels'),
    ),
    '#default_value' => variable_get('admin_toolbar_depth', 4),
  );

  $form['admin_toolbar_drupal_menu'] = array(
    '#type' => 'checkbox',
    '#title' => t('Show Drupal icon dropdown'),
    '#description' => t('Show the dropdown menu under the Drupal icon with quick admin tools (flush cache, run cron, etc.).'),
    '#default_value' => variable_get('admin_toolbar_drupal_menu', TRUE),
  );

  $form['admin_toolbar_hover_delay'] = array(
    '#type' => 'select',
    '#title' => t('Hover delay'),
    '#description' => t('Delay before showing dropdown menus (helps prevent accidental triggers).'),
    '#options' => array(
      0 => t('No delay'),
      100 => t('100ms'),
      200 => t('200ms (default)'),
      300 => t('300ms'),
      500 => t('500ms'),
    ),
    '#default_value' => variable_get('admin_toolbar_hover_delay', 200),
  );

  return system_settings_form($form);
}
