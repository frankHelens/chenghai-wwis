import StopInstall from '../../containers/Install/StopInstall'

import Apply from '../../containers/Install/StopInstall/Apply'
import Agreement from '../../containers/Install/StopInstall/Agreement'
import Assign from '../../containers/Install/StopInstall/Assign'
import Register from '../../containers/Install/StopInstall/Register'

const stopInstallRoutes = {
  path: 'stopInstall',
  component: StopInstall,
  children: [
    { path: 'apply', component: Apply },
    { path: 'agreement', component: Agreement },
    { path: 'assign', component: Assign },
    { path: 'register', component: Register }

  ]
}

export default stopInstallRoutes
