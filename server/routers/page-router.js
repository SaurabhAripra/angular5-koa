import Router from 'koa-router'


const pageRouter = new Router()

pageRouter.get("/", (ctx) => {
    return ctx.render("index", {})
})


pageRouter.get('/logout', function (ctx) {
    ctx.logout()
    ctx.redirect('/')
})

pageRouter.use(function (ctx, next) {
    if (ctx.isAuthenticated()) {
        return next()
    } else {
        ctx.redirect('/')
    }
})

export default pageRouter