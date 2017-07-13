import Storage from '../../containers/Storage'

// import Demand from '../../containers/Storage/Demand'
// import Purchase from '../../containers/Storage/Purchase'
// import Receive from '../../containers/Storage/Receive'
// import Recover from '../../containers/Storage/Recover'
// import Transfer from '../../containers/Storage/Transfer'
// import Repertory from '../../containers/Storage/Repertory'
// import Material from '../../containers/Storage/Material'
// import Materialout from '../../containers/Storage/Materialout'
// import Materialin from '../../containers/Storage/Materialin'
import Statistics from '../../containers/Storage/Statistics'

import materialRoutes from './material'
import purchaseRoutes from './purchase'
import demandRoutes from './demand'
import receiveRoutes from './receive'
import transferRoutes from './transfer'

const storageRoutes = {
  path: 'storage',
  component: Storage,
  children: [
    // { path: 'demand', component: Demand },
    // { path: 'purchase', component: Purchase },
    // { path: 'receive', component: Receive },
    // { path: 'recover', component: Recover },
    // { path: 'transfer', component: Transfer },
    // { path: 'repertory', component: Repertory },
    // { path: 'material', component: Material },
    // { path: 'materialout', component: Materialout },
    // { path: 'materialin', component: Materialin },
    { path: 'statistics', component: Statistics },
    materialRoutes,
    purchaseRoutes,
    demandRoutes,
    receiveRoutes,
    transferRoutes
  ]
}

export default storageRoutes
