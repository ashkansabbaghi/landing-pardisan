export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    removeResponseHeader(event, 'x-powered-by')
  })

  nitroApp.hooks.hook('render:response', (response, { event }) => {
    if (response.headers) {
      delete response.headers['x-powered-by']
    }
    removeResponseHeader(event, 'x-powered-by')
  })
})
