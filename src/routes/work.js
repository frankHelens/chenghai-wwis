import Work from '../containers/Work'

import FlowDefine from '../containers/Work/FlowDefine'
import StepDefine from '../containers/Work/StepDefine'

const workRoutes = {
  path: 'work',
  component: Work,
  children: [
    { path: 'flowDefine', component: FlowDefine },
    { path: 'flowDefine/:id/StepDefine', component: StepDefine }
  ]
}

export default workRoutes
