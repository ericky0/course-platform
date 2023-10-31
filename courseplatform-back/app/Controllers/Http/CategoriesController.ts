import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoriesController {
  public async index({ request, response }: HttpContextContract) {
    const id = request.param('id')

    // it will be a single category if you inform ID
    const categories = await this.filters(id)

    return response.ok(categories)
  }

  public async store({ request, response }: HttpContextContract) {
    const { name } = request.only(['name'])

    const category = await Category.create({ name })
    await category.load('courses')

    return response.created(category)
  }

  public async update({ request, response }: HttpContextContract) {
    const { name } = request.only(['name'])
    const id = request.param('id')

    const category = await Category.findByOrFail('id', id)

    category.name = name
    await category.save()

    return response.ok(category)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const category = await Category.findByOrFail('id', id)

    await category.delete()

    return response.ok('category has been deleted.')
  }

  private async filters(id: string) {
    if (id) {
      return this.filterById(id)
    } else {
      return Category.query()
    }
  }

  private async filterById(id: string) {
    return Category.findByOrFail('id', id)
  }
}
