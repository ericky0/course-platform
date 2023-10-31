import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { CategoryFactory, CourseFactory, UserFactory } from 'Database/factories'

test.group('Courses', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a course without category id - if youre authenticated.', async ({
    client,
  }) => {
    const user = await UserFactory.create()
    const course = {
      title: 'Course Title',
      description: 'Course description',
      imageUrl: 'http://test.com/',
      price: 299.2,
    }

    const withoutCategoryId = await client.post('/courses').json(course).loginAs(user)
    withoutCategoryId.assertStatus(201)
    withoutCategoryId.assertBodyContains({
      title: 'Course Title',
      description: 'Course description',
    })
  })
  test('it should create a course with category id - if youre authenticated.', async ({
    client,
  }) => {
    const category = await CategoryFactory.create()
    const user = await UserFactory.create()
    const course = {
      title: 'Course Title',
      description: 'Course description',
      imageUrl: 'http://test.com/',
      price: 299.2,
      categoryId: category.id,
    }

    const withCategoryId = await client.post('/courses').json(course).loginAs(user)
    withCategoryId.assertStatus(201)
    withCategoryId.assertBodyContains({ category_id: category.id, title: 'Course Title' })
  })
  test('it should not create a course if youre not authenticated', async ({ client }) => {
    const course = {
      title: 'Course Title',
      description: 'Course description',
      imageUrl: 'http://test.com/',
      price: 299.2,
    }
    const response = await client.post('/courses').json(course)

    response.assertStatus(401)
  })
  test('it should be able to get a course by id', async ({ client }) => {
    const course = await CourseFactory.with('user').create()

    const response = await client.get(`/courses/${course.id}`)

    response.assertStatus(200)
    response.assertBodyContains({ id: course.id })
  })
  test('it should be able to get all courses', async ({ client }) => {
    const firstCourse = await CourseFactory.with('user').create()
    const secondCourse = await CourseFactory.with('user').create()

    const response = await client.get('/courses')

    response.assertStatus(200)
    response.assertBodyContains([{ id: firstCourse.id }, { id: secondCourse.id }])
  })
  test('it should be able to get all courses by user id', async ({ client }) => {
    const user = await UserFactory.create()
    const course = {
      title: 'Course Title',
      description: 'Course description',
      imageUrl: 'http://test.com/',
      price: 299.2,
    }
    const firstCourse = await client.post('/courses').json(course).loginAs(user)
    const firstCourseId = firstCourse.body().id
    const secondCourse = await client.post('/courses').json(course).loginAs(user)
    const secondCourseId = secondCourse.body().id

    const response = await client.get(`/courses/user/${user.id}`)
    response.assertStatus(200)

    response.assertBodyContains([{ id: firstCourseId }, { id: secondCourseId }])
  })
  test('it should be able to get all courses by category id', async ({ client }) => {
    const category = await CategoryFactory.create()
    const firstCourse = await CourseFactory.with('user').merge({ categoryId: category.id }).create()
    const secondCourse = await CourseFactory.with('user')
      .merge({ categoryId: category.id })
      .create()

    const response = await client.get(`/courses/category/${category.id}`)

    response.assertStatus(200)
    response.assertBodyContains([{ id: firstCourse.id }, { id: secondCourse.id }])
  })
  test('it should be able to update a course if youre allowed', async ({ client }) => {
    const user = await UserFactory.create()
    const course = await CourseFactory.merge({ userId: user.id }).create()

    let modifiedTitle = 'modified course'

    const response = await client
      .patch(`/courses/${course.id}`)
      .json({ title: modifiedTitle })
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ id: course.id, title: modifiedTitle })
  })
  test('it should be able to delete a course if youre allowed', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const course = await CourseFactory.merge({ userId: user.id }).create()

    const response = await client.delete(`/courses/${course.id}`).loginAs(user)
    response.assertStatus(200)

    const anyCourseExists = await Database.query().select('*').from('courses')

    assert.isEmpty(anyCourseExists)
  })
  test('it should be able to publish a course', async ({ client }) => {
    const user = await UserFactory.create()
    const course = await CourseFactory.merge({ userId: user.id }).create()

    const response = await client.patch(`/courses/${course.id}/publish`).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ is_published: true })
  })
})
