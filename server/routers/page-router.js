import Router from 'koa-router'


const pageRouter = new Router()

pageRouter.get('/logout', function (ctx) {
  ctx.logout()
  ctx.redirect('/')
})

pageRouter.get("/*", (ctx) => {
    return ctx.render("index", {})
})



pageRouter.use(function (ctx, next) {
    if (ctx.isAuthenticated()) {
        return next()
    } else {
        ctx.redirect('/')
    }
})

export default pageRouter
