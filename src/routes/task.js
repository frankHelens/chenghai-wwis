
import Install from '../containers/Install'

import Agreement from '../containers/Install/Agreement'
import Apply from '../containers/Install/Apply'
import Archive from '../containers/Install/Archive'
import Budget from '../containers/Install/Budget'
import Charge from '../containers/Install/Charge'
import Statistics from '../containers/Install/Statistics'
import Survey from '../containers/Install/Survey'
import Verify from '../containers/Install/Verify'

const installRoutes = {
  path: 'install',
  component: Install,
  children: [
    { path: 'agreement', component: Agreement },
    { path: 'apply', component: Apply },
    { path: 'archive', component: Archive },
    { path: 'budget', component: Budget },
    { path: 'charge', component: Charge },
    { path: 'statistics', component: Statistics },
    { path: 'survey', component: Survey },
    { path: 'verify', component: Verify }
  ]
}

export default installRoutes
