import MarketplaceController from './MarketplaceController'
import ExtensionController from './ExtensionController'
import Admin from './Admin'
import Settings from './Settings'

const Controllers = {
    MarketplaceController: Object.assign(MarketplaceController, MarketplaceController),
    ExtensionController: Object.assign(ExtensionController, ExtensionController),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers