import { COMPANY_NAME } from './brand';

/**
 * Application version, injected at build time from `package.json`.
 * Bump the `version` field there and every display of it follows.
 */
export const APP_VERSION = __APP_VERSION__;

/**
 * Platform name iDevX Space itself is published under. Its release notes page
 * shows only entries matching it, so notes from other platforms' maintenance
 * runs stay out of this product's changelog.
 */
export const IDEVX_SPACE_PLATFORM_NAME = 'iDevX Space';

/**
 * iDevX Space's own row in Platform Management.
 *
 * iDevX Space is the application this runs in, so two of the actions that belong to
 * every other platform cannot apply to it: it may not be put into maintenance
 * from inside itself, and it may not be deactivated from inside itself either.
 * Releasing a new version and publishing its notes still can.
 */
export const IDEVX_SPACE_PLATFORM_ID = 'IDVX-PLT-00000';

/**
 * Who a release is published as.
 *
 * The organisation, never the operator who happened to run the deployment. A
 * release note is read by clients as a statement from the company that ships
 * the product; naming whoever clicked the button makes an internal detail
 * public, and dates the note to a person who may since have left.
 */
export const RELEASE_PUBLISHER = COMPANY_NAME;
