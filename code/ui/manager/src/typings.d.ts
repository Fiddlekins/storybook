/* eslint-disable no-underscore-dangle,  @typescript-eslint/naming-convention */
declare module 'chromatic/isChromatic';

declare var DOCS_OPTIONS: any;
declare var CONFIG_TYPE: 'DEVELOPMENT' | 'PRODUCTION';
declare var PREVIEW_URL: any;

declare var __STORYBOOK_ADDONS_MANAGER: any;
declare var RELEASE_NOTES_DATA: any;

declare var FEATURES: import('@storybook/types').StorybookConfig['features'];

declare var REFS: any;
declare var VERSIONCHECK: any;
declare var LOGLEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent' | undefined;

declare var SB_CORE_CONFIG: Pick<
  import('@storybook/types').StorybookConfig['core'],
  'disableWhatsNewNotifications'
>;
