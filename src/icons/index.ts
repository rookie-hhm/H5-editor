const req = require.context('./svg', false, /\.svg$/)
const requireAll = (context: __WebpackModuleApi.RequireContext) => context.keys().map(context)
requireAll(req)
