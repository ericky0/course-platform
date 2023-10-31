import Factory from '@ioc:Adonis/Lucid/Factory'
import Attachment from 'App/Models/Attachment'
import Category from 'App/Models/Category'
import Course from 'App/Models/Course'

import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    avatar: faker.internet.url(),
  }
})
  .relation('courses', () => CourseFactory)
  .build()

export const CategoryFactory = Factory.define(Category, ({ faker }) => {
  return {
    name: faker.person.firstName(),
  }
}).build()

export const CourseFactory = Factory.define(Course, async ({ faker }) => {
  return {
    title: faker.person.firstName(),
    description: faker.person.firstName(),
    imageUrl: faker.internet.url(),
    price: faker.number.int({ min: 1, max: 10 }),
  }
})
  .relation('user', () => UserFactory)
  .relation('category', () => CategoryFactory)
  .relation('attachments', () => AttachmentFactory)
  .build()

export const AttachmentFactory = Factory.define(Attachment, async ({ faker }) => {
  return {
    name: faker.internet.userName(),
    url: faker.internet.url(),
  }
})
  .relation('course', () => CourseFactory)
  .build()
