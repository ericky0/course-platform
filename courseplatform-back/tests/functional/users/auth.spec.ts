import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Auth', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should authenticate an user', async ({ client }) => {
    const plainPassword = '123456'
    const { email, id } = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client.post('/auth').json({ email, password: plainPassword })
    response.assertBodyContains({
      user: {
        id,
        email,
      },
    })
    response.assertStatus(201)
  })

  test('it should return an api_token when an session(auth) is created', async ({ client }) => {
    const plainPassword = '123456'
    const { email } = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client.post('/auth').json({ email, password: plainPassword })
    response.assertStatus(201)
    response.assertBodyContains({ token: {} })
  })

  test('it should return 400 when credentials are invalid', async ({ client }) => {
    const { email } = await UserFactory.create()

    const response = await client.post('/auth').json({ email, password: '12321312' })
    response.assertStatus(400)
  })

  test('it should return 200 when user signs out', async ({ client }) => {
    const plainPassword = '123456'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client.post('/auth').json({ email: user.email, password: plainPassword })
    response.assertStatus(201)

    const logout = await client.delete('/auth').loginAs(user)
    logout.assertStatus(200)
  })

  test('it should revoke token when user signs out', async ({ client, assert }) => {
    const plainPassword = '123456'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    const login = await client.post('/auth').json({ email: user.email, password: plainPassword })
    const bearerToken = login.body().token.token
    login.assertStatus(201)

    const logout = await client.delete('/auth').bearerToken(bearerToken)
    logout.assertStatus(200)

    const token = await Database.query().select('*').from('api_tokens')

    assert.isEmpty(token)
  })
})
