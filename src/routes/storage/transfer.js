import Transfer from '../../containers/Storage/Transfer'

import Fill from '../../containers/Storage/Transfer/Fill'
import Branched from '../../containers/Storage/Transfer/Branched'
import General from '../../containers/Storage/Transfer/General'
import Print from '../../containers/Storage/Transfer/Print'
import Result from '../../containers/Storage/Transfer/Result'
import Verify from '../../containers/Storage/Transfer/Verify'
import BackEditer from '../../containers/Storage/Transfer/BackEditer'
import End from '../../containers/Storage/Transfer/End'

const transferRoutes = {
  path: 'transfer',
  component: Transfer,
  children: [
    { path: 'fill', component: Fill },
    { path: 'branched', component: Branched },
    { path: 'general', component: General },
    { path: 'print', component: Print },
    { path: 'result', component: Result },
    { path: 'verify', component: Verify },
    { path: 'end', component: End },
    { path: 'backEditer/:id', component: BackEditer }
  ]
}

export default transferRoutes
