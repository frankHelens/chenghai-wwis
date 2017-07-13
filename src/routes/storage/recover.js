import Recover from '../../containers/Storage/Recover'

import Fill from '../../containers/Storage/Recover/Fill'
import Branched from '../../containers/Storage/Recover/Branched'
import General from '../../containers/Storage/Recover/General'
import Print from '../../containers/Storage/Recover/Print'
import Result from '../../containers/Storage/Recover/Result'
import Verify from '../../containers/Storage/Recover/Verify'

const recoverRoutes = {
  path: 'recover',
  component: Recover,
  children: [
    { path: 'fill', component: Fill },
    { path: 'branched', component: Branched },
    { path: 'general', component: General },
    { path: 'print', component: Print },
    { path: 'result', component: Result },
    { path: 'verify', component: Verify }
  ]
}

export default recoverRoutes
