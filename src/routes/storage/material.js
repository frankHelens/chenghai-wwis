import Material from '../../containers/Storage/Material'

import Base from '../../containers/Storage/Material/Base'
import Repertory from '../../containers/Storage/Material/Repertory'
import Batch from '../../containers/Storage/Material/Batch'
import Out from '../../containers/Storage/Material/Out'
import In from '../../containers/Storage/Material/In'

const materialRoutes = {
  path: 'material',
  component: Material,
  children: [
    { path: 'base', component: Base },
    { path: 'repertory', component: Repertory },
    { path: 'batch', component: Batch },
    { path: 'out', component: Out },
    { path: 'in', component: In }
  ]
}

export default materialRoutes
