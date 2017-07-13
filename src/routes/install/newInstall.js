// import { getMenus } from '../../auth'
// import { fetchCreate } from '../../utils/api'

import NewInstall from '../../containers/Install/NewInstall'

import Agreement from '../../containers/Install/NewInstall/Agreement'
import Apply from '../../containers/Install/NewInstall/Apply'
import Archive from '../../containers/Install/NewInstall/Archive'
import Budget from '../../containers/Install/NewInstall/Budget'
import BudgetEditer from '../../containers/Install/NewInstall/BudgetEditer'
import Charge from '../../containers/Install/NewInstall/Charge'
import Survey from '../../containers/Install/NewInstall/Survey'
import SurveyAssign from '../../containers/Install/NewInstall/SurveyAssign'
import Verify from '../../containers/Install/NewInstall/Verify'
import Material from '../../containers/Install/NewInstall/Material'
import MaterialEditer from '../../containers/Install/NewInstall/MaterialEditer'
import Pigeonhole from '../../containers/Install/NewInstall/Pigeonhole'
import Construction from '../../containers/Install/NewInstall/Construction'
import Result from '../../containers/Install/NewInstall/Result'
import Branched from '../../containers/Install/NewInstall/Branched'
import General from '../../containers/Install/NewInstall/General'
import Record from '../../containers/Install/NewInstall/Record'
import Balance from '../../containers/Install/NewInstall/Balance'
import Commitment from '../../containers/Install/NewInstall/Commitment'
import Engineering from '../../containers/Install/NewInstall/Engineering'
import MaterialViewer from '../../containers/Install/NewInstall/MaterialViewer'
import BudgetViewer from '../../containers/Install/NewInstall/BudgetViewer'
import Business from '../../containers/Install/NewInstall/Business'
import InstallUnite from '../../containers/Install/NewInstall/InstallUnite'
import Assign from '../../containers/Install/NewInstall/Assign'
import Print from '../../containers/Install/NewInstall/Print'
import ChBudgetEditer from '../../containers/Install/NewInstall/ChBudgetEditer'
import ChBudgetViewer from '../../containers/Install/NewInstall/ChBudgetViewer'
import Query from '../../containers/Install/NewInstall/Query'

const newInstallRoutes = {
  path: 'newInstall',
  component: NewInstall,
  children: [
    { path: 'agreement', component: Agreement },
    { path: 'apply', component: Apply },
    // { path: 'apply',
    //   beforeEnter (to, from, next) {
    //     const menu = getMenus().find(item => item.menuurl === '/install/newInstall/apply')
    //     fetchCreate({
    //       resource: 'flow/start?flowDefineId=' + menu.flowid
    //     })
    //     .then(data => {
    //       if (String(data) === 'undefined') {
    //         this.$message({
    //           showClose: true,
    //           message: '没有权限,无法操作',
    //           type: 'error'
    //         })
    //         return false
    //       } else {
    //         next('/base/task/' + data)
    //       }
    //     })
    //   }
    // },
    { path: 'archive', component: Archive },
    { path: 'material', component: Material },
    { path: 'materialEditer/:id', component: MaterialEditer },
    { path: 'materialViewer/:id', component: MaterialViewer },
    { path: 'budget', component: Budget },
    { path: 'budgetEditer/:id', component: BudgetEditer },
    { path: 'budgetViewer/:id', component: BudgetViewer },
    { path: 'charge', component: Charge },
    { path: 'survey', component: Survey },
    { path: 'verify', component: Verify },
    { path: 'construction', component: Construction },
    { path: 'result', component: Result },
    { path: 'pigeonhole', component: Pigeonhole },
    { path: 'branched', component: Branched },
    { path: 'general', component: General },
    { path: 'balance', component: Balance },
    { path: 'record', component: Record },
    { path: 'commitment', component: Commitment },
    { path: 'engineering', component: Engineering },
    { path: 'surveyAssign', component: SurveyAssign },
    { path: 'business', component: Business },
    { path: 'installUnite', component: InstallUnite },
    { path: 'assign', component: Assign },
    { path: 'print', component: Print },
    { path: 'query', component: Query },
    { path: 'chBudgetEditer/:id', component: ChBudgetEditer },
    { path: 'chBudgetViewer/:id', component: ChBudgetViewer }
  ]
}

export default newInstallRoutes
