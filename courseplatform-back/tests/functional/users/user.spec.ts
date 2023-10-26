import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('User', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an user', async ({ client, assert }) => {
    const userPayload = {
      name: 'erickhogarth',
      email: 'erickhogarth@gmail.com',
      password: '123456',
    }

    const response = await client.post('/users').json(userPayload)
    const { password, ...rest } = userPayload

    response.assertStatus(201)
    response.assertBodyContains(rest)
    const users = await Database.query().select('*').from('users')
    assert.isTrue(users[0].id === response.body().id)
  })

  test('it should return 409 when email is already in use', async ({ client }) => {
    const { email } = await UserFactory.create()

    const response = await client.post('/users').json({
      email,
      name: 'testing',
      password: 'testing',
    })

    response.assertStatus(409)
  })

  test('it should return 409 when name is already in use', async ({ client }) => {
    const { name } = await UserFactory.create()

    const response = await client.post('/users').json({
      email: 'testing@example.com',
      name,
      password: 'testing',
    })

    response.assertStatus(409)
  })

  test('it should return 422 when required data is not provided', async ({ client }) => {
    const response = await client.post('users').json({})
    response.assertStatus(422)
  })

  test('it should return 422 when provided email is invalid', async ({ client }) => {
    const userPayload = {
      name: 'erickhogarth',
      email: 'erickhogarth@gmail',
      password: '123456',
    }

    const response = await client.post('/users').json(userPayload)
    response.assertStatus(422)
  })

  test('it should return 422 when provided name have less than 3 characters', async ({
    client,
  }) => {
    const userPayload = {
      name: '12',
      email: 'erickhogarth@gmail.com',
      password: '123456',
    }

    const response = await client.post('/users').json(userPayload)
    response.assertStatus(422)
  })

  test('it should return 422 when provided password have less than 6 characters', async ({
    client,
  }) => {
    const userPayload = {
      name: 'erickhogarth',
      email: 'erickhogarth@gmail.com',
      password: '12345',
    }

    const response = await client.post('/users').json(userPayload)
    response.assertStatus(422)
  })

  test('it should update an user', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const updatedEmail = 'test@example.com'
    const avatar = 'http://randmurl.com'
    const updatedPassword = '123456'

    const response = await client
      .patch(`/users/${user.id}`)
      .json({ password: updatedPassword, avatar, email: updatedEmail })
      .loginAs(user)

    await user.refresh()
    response.assertStatus(200)
    response.assertBodyContains({
      id: user.id,
      email: updatedEmail,
      avatar,
    })

    assert.isTrue(await Hash.verify(user.password, updatedPassword))
  })
})
