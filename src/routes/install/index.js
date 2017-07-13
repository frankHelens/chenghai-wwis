
// import { getMenus } from '../../auth'
// import { fetchCreate } from '../../utils/api'
import Install from '../../containers/Install'
import Query from '../../containers/Install/Query'

import newInstallRoutes from './newInstall'
import ownershipRoutes from './ownership'
import stopInstallRoutes from './stopInstall'
import repeatedRoutes from './repeated'
import sprinkRoutes from './sprink'
import priceRoutes from './price'
import statisticsRoutes from './statistics'

const installRoutes = {
  path: 'install',
  component: Install,
  children: [
    { path: 'query', component: Query },
    newInstallRoutes,
    ownershipRoutes,
    stopInstallRoutes,
    repeatedRoutes,
    sprinkRoutes,
    priceRoutes,
    statisticsRoutes
  ]
}

export default installRoutes
