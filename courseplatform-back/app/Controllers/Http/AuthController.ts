import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      await auth.use('web').attempt(email, password)
    } catch (error) {
      return response.badRequest('Invalid credentials')
    }
    return response.created({ user: auth.user })
  }

  public async session({ auth }: HttpContextContract) {
    return auth.user
  }

  public async destroy({ response, auth }: HttpContextContract) {
    await auth.use('web').logout()

    return response.ok({})
  }

  public async redirect({ ally }: HttpContextContract) {
    return ally.use('github').redirect()
  }

  // public async callback({ ally, auth, response }: HttpContextContract) {
  //   //   const github = ally.use('github')
  //   //   if (github.accessDenied()) {
  //   //     return 'Access was denied'
  //   //   }
  //   //   if (github.stateMisMatch()) {
  //   //     return 'Request expired. Retry again'
  //   //   }
  //   //   if (github.hasError()) {
  //   //     return github.getError()
  //   //   }
  //   //   const githubUser = await github.user()
  //   //   if (githubUser) {
  //   //     const user = await User.firstOrCreate({
  //   //       email: githubUser.email!,
  //   //       name: githubUser.name!,
  //   //     })
  //   //     const token = await auth.use('api').login(user)
  //   //     return response.redirect(`${process.env.FRONTEND_CALLBACK_REDIRECT}?token=${token.token}`)
  //   //   }
  //   // }
  // }
}
