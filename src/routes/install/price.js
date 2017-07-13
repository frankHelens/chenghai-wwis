import Price from '../../containers/Install/Price'

import Apply from '../../containers/Install/Price/Apply'
import Review from '../../containers/Install/Price/Review'
import Audit from '../../containers/Install/Price/Audit'
import Pigeonhole from '../../containers/Install/Price/Pigeonhole'

const priceRoutes = {
  path: 'price',
  component: Price,
  children: [
    {path: 'apply', component: Apply},
    {path: 'review', component: Review},
    {path: 'audit', component: Audit},
    {path: 'pigeonhole', component: Pigeonhole}
  ]
}

export default priceRoutes

