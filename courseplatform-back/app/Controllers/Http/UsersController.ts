import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async authenticatedUser({ response, auth }: HttpContextContract) {
    const user = auth.user

    if (!user) {
      throw new BadRequestException('User is not logged in, please login first.', 401)
    }

    return response.ok(user)
  }

  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator)
    const emailAlreadyExists = await User.findBy('email', userPayload.email)

    if (emailAlreadyExists) {
      throw new BadRequestException('e-mail already exists', 409)
    }

    const user = await User.create(userPayload)
    return response.created(user)
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const { email, password, avatar } = await request.validate(UpdateUserValidator)
    const userId = request.param('id')

    const user = await User.findByOrFail('id', userId)

    await bouncer.authorize('updateUser', user)

    if (email) {
      user.email = email
    }

    if (password) {
      user.password = password
    }

    if (avatar) {
      user.avatar = avatar
    }

    await user.save()

    response.ok(user)
  }
}
