import Sprink from '../../containers/Install/Sprink'

import Apply from '../../containers/Install/Sprink/Apply'
import Audit from '../../containers/Install/Sprink/Audit'
import Register from '../../containers/Install/Sprink/Register'

const sprinkRoutes = {
  path: 'sprink',
  component: Sprink,
  children: [
    {path: 'apply', component: Apply},
    {path: 'audit', component: Audit},
    {path: 'register', component: Register}
  ]
}

export default sprinkRoutes
