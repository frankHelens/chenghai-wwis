import Print from '../containers/Print'

import Approve from '../containers/Print/Approve'
import Material from '../containers/Print/Material'
import Receipt from '../containers/Print/Receipt'
import Budget from '../containers/Print/Budget'
import Account from '../containers/Print/Account'
import Work from '../containers/Print/Work'
import Declare from '../containers/Print/Declare'
import Card from '../containers/Print/Card'

const printRoutes = {
  path: 'print',
  component: Print,
  children: [
    { path: 'approve/:id', component: Approve },
    { path: 'material/:id', component: Material },
    { path: 'receipt/:id', component: Receipt },
    { path: 'budget/:id', component: Budget },
    { path: 'work', component: Work },
    { path: 'declare/:id', component: Declare },
    { path: 'account/:id', component: Account },
    { path: 'card/:id', component: Card }
  ]
}

export default printRoutes
