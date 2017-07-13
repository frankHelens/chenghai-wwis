import Demand from '../../containers/Storage/Demand'

import Fill from '../../containers/Storage/Demand/Fill'
import Branched from '../../containers/Storage/Demand/Branched'
import General from '../../containers/Storage/Demand/General'
import Verify from '../../containers/Storage/Demand/Verify'
import Termination from '../../containers/Storage/Demand/Termination'
import DemandEditer from '../../containers/Storage/Demand/DemandEditer'
import DemandViewer from '../../containers/Storage/Demand/DemandViewer'
import End from '../../containers/Storage/Demand/End'

const demandRoutes = {
  path: 'demand',
  component: Demand,
  children: [
    { path: 'fill', component: Fill },
    { path: 'branched', component: Branched },
    { path: 'general', component: General },
    { path: 'verify', component: Verify },
    { path: 'termination', component: Termination },
    { path: 'demandEditer/:id', component: DemandEditer },
    { path: 'demandViewer/:id', component: DemandViewer },
    { path: 'end', component: End }
  ]
}

export default demandRoutes
