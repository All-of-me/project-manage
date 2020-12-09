const getters = {
  projectList: state => state.project.projectList,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  userName: state => state.user.userName,
  routes: state => state.router.routes
}
export default getters
