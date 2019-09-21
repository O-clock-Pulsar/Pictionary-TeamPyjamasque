export default {
  sessionName: 'flash',
  utilityName: 'flash',
  localsName: 'flash',
  viewName: 'includes/flash',
  beforeSingleRender(item, callback) {
    callback(null, item);
  },
  afterAllRender(htmlFragments, callback) {
    callback(null, htmlFragments.join('\n'));
  }
};
