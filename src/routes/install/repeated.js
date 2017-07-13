import Repeated from '../../containers/Install/Repeated'

import Apply from '../../containers/Install/Repeated/Apply'
import Agreement from '../../containers/Install/Repeated/Agreement'
import Assign from '../../containers/Install/Repeated/Assign'
import Register from '../../containers/Install/Repeated/Register'

const repeatedRoutes = {
  path: 'repeated',
  component: Repeated,
  children: [
    { path: 'apply', component: Apply },
    { path: 'agreement', component: Agreement },
    { path: 'assign', component: Assign },
    { path: 'register', component: Register }
  ]
}

export default repeatedRoutes
