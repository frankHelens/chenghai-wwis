import Scattered from '../../containers/Meter/Scattered'

import Common from '../../containers/Meter/Scattered/Common'

const scatteredRoutes = {
  path: 'scattered',
  component: Scattered,
  children: [
    { path: 'apply', component: Common }
  ]
}

export default scatteredRoutes
