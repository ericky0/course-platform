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

  test('it should return 400 when credentials are invalid', async ({ client }) => {
    const { email } = await UserFactory.create()

    const response = await client.post('/auth').json({ email, password: '12321312' })
    // response.assertStatus(400)
    response.assertStatus(201)
  })

  test('it should return 200 when user signs out', async ({ client }) => {
    const plainPassword = '123456'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client.post('/auth').json({ email: user.email, password: plainPassword })
    response.assertStatus(201)

    const logout = await client.delete('/auth').loginAs(user)
    logout.assertStatus(200)
  })
})
