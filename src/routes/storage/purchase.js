import Purchase from '../../containers/Storage/Purchase'

import Apply from '../../containers/Storage/Purchase/Apply'
import Result from '../../containers/Storage/Purchase/Result'
import Audit from '../../containers/Storage/Purchase/Audit'
import General from '../../containers/Storage/Purchase/General'
import Print from '../../containers/Storage/Purchase/Print'
import Charge from '../../containers/Storage/Purchase/Charge'
import Verify from '../../containers/Storage/Purchase/Verify'
import Termination from '../../containers/Storage/Purchase/Termination'
import PurchaseEditer from '../../containers/Storage/Purchase/PurchaseEditer'
import PurchaseViewer from '../../containers/Storage/Purchase/PurchaseViewer'
import PriceEditer from '../../containers/Storage/Purchase/PriceEditer'
import PriceViewer from '../../containers/Storage/Purchase/PriceViewer'
import VerifyEditer from '../../containers/Storage/Purchase/VerifyEditer'
import End from '../../containers/Storage/Purchase/End'

const purchaseRoutes = {
  path: 'purchase',
  component: Purchase,
  children: [
    { path: 'apply', component: Apply },
    { path: 'result', component: Result },
    { path: 'audit', component: Audit },
    { path: 'general', component: General },
    { path: 'print', component: Print },
    { path: 'charge', component: Charge },
    { path: 'verify', component: Verify },
    { path: 'end', component: End },
    { path: 'VerifyEditer/:id', component: VerifyEditer },
    { path: 'termination', component: Termination },
    { path: 'purchaseEditer/:id', component: PurchaseEditer },
    { path: 'priceEditer/:id', component: PriceEditer },
    { path: 'priceViewer/:id', component: PriceViewer },
    { path: 'purchaseViewer/:id', component: PurchaseViewer }
  ]
}

export default purchaseRoutes

