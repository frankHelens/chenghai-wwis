import Statistics from '../../containers/Install/Statistics'

import Service from '../../containers/Install/Statistics/Service'
import Detail from '../../containers/Install/Statistics/Detail'
import Acceptance from '../../containers/Install/Statistics/Acceptance'

const statisticsRoutes = {
  path: 'statistics',
  component: Statistics,
  children: [
    { path: 'service', component: Service },
    { path: 'detail', component: Detail },
    { path: 'acceptance', component: Acceptance }
  ]
}

export default statisticsRoutes
