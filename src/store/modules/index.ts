interface modulesProps {
  [key: string]: any
}
const modules: modulesProps = {}
const context = require.context('./', true, /\.ts$/)

for (const key of context.keys()) {
  if (key === './index.ts') continue
  const keyArr = key.split('/')
  keyArr.shift()
  const newKey = keyArr[0].replace(/\.(js|ts)/ig, '')
  modules[newKey] = context(key).default
}

export default modules
