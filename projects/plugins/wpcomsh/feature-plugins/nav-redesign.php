<?php
/**
 * Features related to the WordPress.com nav redesign.
 *
 * @package wpcomsh
 */

/**
 * Whether to enable the nav redesign.
 *
 * @return bool True if the nav redesign is enabled, false otherwise.
 */
function wpcom_is_nav_redesign_enabled() {
	$uses_wp_admin_interface      = get_option( 'wpcom_admin_interface' ) === 'wp-admin';
	$is_included_in_early_release = ! empty( get_option( 'wpcom_classic_early_release' ) );

	return $uses_wp_admin_interface && $is_included_in_early_release;
}

/**
 * Returns whether the current request is coming from the a8c proxy.
 */
function is_proxied() {
	return isset( $_SERVER['A8C_PROXIED_REQUEST'] )
		? sanitize_text_field( wp_unslash( $_SERVER['A8C_PROXIED_REQUEST'] ) )
		: defined( 'A8C_PROXIED_REQUEST' ) && A8C_PROXIED_REQUEST;
}

/**
 * Adds Hosting -> Overview menu for proxied a12s.
 *
 * This logic should be moved to jetpack-mu-wpcom once nav redesign is fully launched.
 */
function add_hosting_overview_menu() {
	if ( ! wpcom_is_nav_redesign_enabled() || ! is_proxied() ) {
		return;
	}

	$domain = preg_replace( '#^https?://#', '', network_site_url() );

	add_submenu_page(
		'wpcom-hosting-menu',
		esc_attr__( 'Overview', 'wpcomsh' ),
		esc_attr__( 'Overview', 'wpcomsh' ) . ' <span class="dashicons dashicons-external"></span>',
		'manage_options',
		esc_url( "https://wordpress.com/hosting/$domain" ),
		'',
		1
	);
}
add_action( 'admin_menu', 'add_hosting_overview_menu', 999999 );

/**
 * Temporarily override the All Sites menu to point to horizon.wordpress.com,
 * which enables the nav redesign by default.
 */
function temporarily_override_all_sites_menus_to_horizon() {
	global $wp_admin_bar;

	if ( ! wpcom_is_nav_redesign_enabled() || ! is_proxied() ) {
		return;
	}

	$node = $wp_admin_bar->get_node( 'all-sites' );
	if ( $node ) {
		$wp_admin_bar->remove_node( $node->id );

		$args         = (array) $node;
		$args['href'] = str_replace( 'https://wordpress.com/', 'https://horizon.wordpress.com/', $args['href'] );

		$wp_admin_bar->add_node( $args );
	}
}
add_action( 'admin_bar_menu', 'temporarily_override_all_sites_menus_to_horizon', 16 );

/**
 * Temporarily hides the Hosting menus that are already in GSV.
 */
function temporarily_hide_hosting_menus_already_in_global_site_view() {
	global $submenu;

	if ( ! wpcom_is_nav_redesign_enabled() || ! is_proxied() ) {
		return;
	}

	$items_to_hide = array( 'hosting-config', 'site-monitoring' );

	foreach ( $submenu['wpcom-hosting-menu'] as &$menu_item ) {
		foreach ( $items_to_hide  as $item_to_hide ) {
			if ( str_starts_with( $menu_item[2], 'https://wordpress.com/' . $item_to_hide ) ) {
				remove_submenu_page( 'wpcom-hosting-menu', $menu_item[2] );
				break;
			}
		}
	}
}
add_action( 'admin_menu', 'temporarily_hide_hosting_menus_already_in_global_site_view', PHP_INT_MAX );

/**
 * Temporarily override the Hosting menus to point to horizon.wordpress.com,
 * which enables the nav redesign by default.
 */
function temporarily_override_hosting_menus_to_horizon() {
	global $submenu;

	if ( ! wpcom_is_nav_redesign_enabled() || ! is_proxied() ) {
		return;
	}

	foreach ( $submenu['wpcom-hosting-menu'] as &$menu_item ) {
		$menu_item[2] = str_replace( 'https://wordpress.com/', 'https://horizon.wordpress.com/', $menu_item[2] );
	}
}
add_action( 'admin_menu', 'temporarily_override_hosting_menus_to_horizon', PHP_INT_MAX );
