import Receive from '../../containers/Storage/Receive'
import Print from '../../containers/Storage/Receive/Print'
import Verify from '../../containers/Storage/Receive/Verify'
import ReceiveViewer from '../../containers/Storage/Receive/ReceiveViewer'
import End from '../../containers/Storage/Receive/End'

const receiveRoutes = {
  path: 'receive',
  component: Receive,
  children: [
    { path: 'print', component: Print },
    { path: 'verify', component: Verify },
    { path: 'end', component: End },
    { path: 'receiveViewer/:id', component: ReceiveViewer }
  ]
}

export default receiveRoutes
