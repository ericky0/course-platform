import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { AttachmentFactory, CourseFactory, UserFactory } from 'Database/factories'

test.group('Attachments', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should be able to create an attachment', async ({ client }) => {
    const user = await UserFactory.with('courses').create()
    const courseId = user.courses[0].id
    const attachment = {
      name: 'testing',
      url: 'http://testurl.com',
    }
    const response = await client
      .post(`/courses/${courseId}/attachments`)
      .json(attachment)
      .loginAs(user)
    response.assertStatus(201)
    response.assertBodyContains({ name: 'testing', course_id: courseId })
  })
  test('it should get an attachment', async ({ client }) => {
    const attachment = await AttachmentFactory.with('course', 1, (course) =>
      course.with('user')
    ).create()
    const response = await client.get(
      `/courses/${attachment.courseId}/attachments/${attachment.id}`
    )

    response.assertStatus(200)
    response.assertBodyContains({ id: attachment.id })
  })
  test('it should get all attachments', async ({ client, assert }) => {
    const course = await CourseFactory.with('user').with('attachments', 2).create()

    const response = await client.get(`/courses/${course.id}/attachments`)
    const array = response.body()
    response.assertStatus(200)
    assert.isTrue(array.length === 2)
  })
  test('it should be able to update an attachment', async ({ client }) => {
    const attachment = await AttachmentFactory.with('course', 1, (course) =>
      course.with('user')
    ).create()

    const response = await client
      .patch(`/courses/${attachment.courseId}/attachments/${attachment.id}`)
      .json({ name: 'new name' })
      .loginAs(attachment.course.user)

    response.assertStatus(200)
    response.assertBodyContains({ name: 'new name', id: attachment.id })
  })
  test('it should be able to delete an attachment', async ({ client, assert }) => {
    const attachment = await AttachmentFactory.with('course', 1, (course) =>
      course.with('user')
    ).create()

    const response = await client
      .delete(`/courses/${attachment.courseId}/attachments/${attachment.id}`)
      .loginAs(attachment.course.user)

    response.assertStatus(200)

    const anyAttachmentExists = await Database.query().select('*').from('attachments')

    assert.isEmpty(anyAttachmentExists)
  })
})
