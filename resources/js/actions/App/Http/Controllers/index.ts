import RouterController from './RouterController'
import PPPController from './PPPController'
import FirewallController from './FirewallController'
import Settings from './Settings'
const Controllers = {
    RouterController: Object.assign(RouterController, RouterController),
PPPController: Object.assign(PPPController, PPPController),
FirewallController: Object.assign(FirewallController, FirewallController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers