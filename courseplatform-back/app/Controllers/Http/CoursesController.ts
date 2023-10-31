import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'
import CreateCourseValidator from 'App/Validators/CreateCourseValidator'
import UpdateCourseValidator from 'App/Validators/UpdateCourseValidator'

export default class CoursesController {
  public async index({ request, response }: HttpContextContract) {
    const id = request.param('id')

    // it can be a single course if id is provided.
    const courses = await this.filters(id)

    return response.ok(courses)
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const { title, description, imageUrl, price, categoryId } =
      await request.validate(CreateCourseValidator)

    const userId = auth.user!.id

    const course = await Course.create({
      title,
      description,
      imageUrl,
      price,
      categoryId,
      userId,
    })

    await course.load('user')
    if (categoryId) {
      await course.load('category')
    }

    return response.created(course)
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const { categoryId, description, imageUrl, isPublished, price, title } =
      await request.validate(UpdateCourseValidator)
    const id = request.param('id')

    const course = await Course.findByOrFail('id', id)
    await bouncer.authorize('updateCourse', course)

    if (title) {
      course.title = title
    }
    if (description) {
      course.description = description
    }
    if (imageUrl) {
      course.imageUrl = imageUrl
    }
    if (price) {
      course.price = price
    }
    if (isPublished) {
      course.isPublished = isPublished
    }
    if (categoryId) {
      course.categoryId = categoryId
    }

    await course.save()

    return response.ok(course)
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('id')

    const course = await Course.findByOrFail('id', id)
    await bouncer.authorize('destroyCourse', course)
    await course.delete()

    return response.ok('Course has been deleted succesfully.')
  }

  public async publish({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('id')

    const course = await Course.findByOrFail('id', id)
    await bouncer.authorize('publishCourse', course)

    course.isPublished = true
    await course.save()

    return response.ok(course)
  }

  public async getAllByUserId({ request, response }: HttpContextContract) {
    const userId = request.param('userId')
    const courses = await Course.query().where('userId', userId)
    return response.ok(courses)
  }

  public async getAllByCategoryId({ request, response }: HttpContextContract) {
    const categoryId = request.param('categoryId')
    const courses = await Course.query().where('categoryId', categoryId)
    return response.ok(courses)
  }

  private async filters(id: string) {
    if (id) {
      return this.filterById(id)
    } else {
      return Course.query()
    }
  }

  private async filterById(id: string) {
    return Course.findByOrFail('id', id)
  }
}
