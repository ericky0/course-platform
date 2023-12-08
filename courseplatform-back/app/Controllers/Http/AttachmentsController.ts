import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Attachment from 'App/Models/Attachment'
import Course from 'App/Models/Course'
import CreateAttachmentValidator from 'App/Validators/CreateAttachmentValidator'
import UpdateAttachmentValidator from 'App/Validators/UpdateAttachmentValidator'

export default class AttachmentsController {
  public async index({ request, response }: HttpContextContract) {
    const courseId = request.param('courseId')
    const attachmentId = request.param('id')

    console.log('eaeeee')

    const attachments = await this.filters(courseId, attachmentId)
    return response.ok(attachments)
  }
  public async store({ request, response }: HttpContextContract) {
    const courseId = request.param('courseId')
    const { name, url } = await request.validate(CreateAttachmentValidator)

    const attachment = await Attachment.create({ name, url, courseId })

    await attachment.load('course')

    response.created(attachment)
  }
  public async update({ request, response, bouncer }: HttpContextContract) {
    const courseId = request.param('courseId')
    const attachmentId = request.param('id')
    const { name, url } = await request.validate(UpdateAttachmentValidator)

    const course = await Course.findByOrFail('id', courseId)
    const attachment = await Attachment.findByOrFail('id', attachmentId)

    await bouncer.authorize('updateAttachment', course, attachment)

    if (name) {
      attachment.name = name
    }
    if (url) {
      attachment.url = url
    }

    await attachment.save()

    response.ok(attachment)
  }
  public async destroy({ request, response, bouncer }: HttpContextContract) {
    const courseId = request.param('courseId')
    const attachmentId = request.param('id')

    const course = await Course.findByOrFail('id', courseId)
    const attachment = await Attachment.findByOrFail('id', attachmentId)

    await bouncer.authorize('updateAttachment', course, attachment)

    await attachment.delete()

    return response.ok('Attachment has been deleted succesfully.')
  }

  private async filters(courseId: string, attachmentId: string) {
    if (courseId && attachmentId) {
      return this.getAttachmentById(attachmentId)
    } else if (courseId) {
      return Attachment.query().where('courseId', courseId)
    } else {
      return 'veio nada'
    }
  }

  private async getAttachmentById(attachmentId: string) {
    return Attachment.findByOrFail('id', attachmentId)
  }
}
