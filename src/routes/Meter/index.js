import Meter from '../../containers/Meter'

import Manage from '../../containers/Meter/Manage'
import Setting from '../../containers/Meter/Setting/'

import scatteredRoutes from './scattered'

const meterRoutes = {
  path: 'meter',
  component: Meter,
  children: [
    {path: 'manage', component: Manage},
    {path: 'setting', component: Setting},
    scatteredRoutes
  ]
}

export default meterRoutes
