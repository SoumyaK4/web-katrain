export const APP_INFO = {
  name: 'web-KaTrain',
  version: __APP_VERSION__,
  commit: __APP_COMMIT__,
  commitDate: __APP_COMMIT_DATE__,
};

export const APP_BUILD_LABEL = `v${APP_INFO.version} · ${APP_INFO.commit}${
  APP_INFO.commitDate ? ` · ${APP_INFO.commitDate}` : ''
}`;
