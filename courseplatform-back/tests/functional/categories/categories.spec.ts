import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { CategoryFactory } from 'Database/factories'

test.group('Categories', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a category', async ({ client }) => {
    const category = {
      name: 'test',
    }

    const response = await client.post('/category').json({ name: category.name })

    response.assertStatus(201)
    response.assertBodyContains({ name: 'test' })
  })
  test('it should be able to get all categories', async ({ client }) => {
    const category1 = await CategoryFactory.create()
    const category2 = await CategoryFactory.create()

    const response = await client.get('/category')

    response.assertStatus(200)
    response.assertBodyContains([{ name: category1.name }, { name: category2.name }])
  })
  test('it should be able to get one category by id', async ({ client }) => {
    const category1 = await CategoryFactory.create()
    await CategoryFactory.create()

    const response = await client.get(`/category/${category1.id}`)

    response.assertStatus(200)
    response.assertBodyContains({ name: category1.name })
  })
  test('it should be able to delete a category', async ({ client, assert }) => {
    const category = await CategoryFactory.create()
    const beforeDelete = await Database.query().select('*').from('categories')
    assert.isNotEmpty(beforeDelete)

    const response = await client.delete(`/category/${category.id}`)

    const afterDelete = await Database.query().select('*').from('categories')
    assert.isEmpty(afterDelete)

    response.assertStatus(200)
  })
  test('it should be able to update a category', async ({ client }) => {
    const category = await CategoryFactory.create()

    const response = await client.put(`/category/${category.id}`).json({ name: 'different name' })

    response.assertStatus(200)
    response.assertBodyContains({ name: 'different name' })
  })
})
