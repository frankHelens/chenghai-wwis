
import Datacenter from '../containers/Datacenter'
import Overview from '../containers/Datacenter/Overview'
import Produce from '../containers/Datacenter/Produce'
import Sale from '../containers/Datacenter/Sale'

const datacenterRoutes = {
  path: 'datacenter',
  component: Datacenter,
  children: [
    { path: 'overview', component: Overview },
    { path: 'produce', component: Produce },
    { path: 'sale', component: Sale }
  ]
}

export default datacenterRoutes
