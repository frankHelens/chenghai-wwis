import Excel from '../containers/Excel'

import CommitViewer from '../containers/Excel/CommitViewer'
import CommitEditer from '../containers/Excel/CommitEditer'

const excelRoutes = {
  path: 'excel',
  component: Excel,
  children: [
    { path: 'materialEditer/:id', component: CommitEditer },
    { path: 'materialViewer/:id', component: CommitViewer },
    { path: 'surveyEditer/:id', component: CommitEditer },
    { path: 'surveyViewer/:id', component: CommitViewer },
    { path: 'budgetEditer/:id', component: CommitEditer },
    { path: 'budgetViewer/:id', component: CommitViewer },
    { path: 'settleEditer/:id', component: CommitEditer },
    { path: 'settleViewer/:id', component: CommitViewer }
  ]
}

export default excelRoutes
