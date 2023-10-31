import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  beforeCreate,
  belongsTo,
  column,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import Attachment from './Attachment'
import User from './User'
import Category from './Category'

export default class Course extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'user_id' })
  public userId: string

  @column({ columnName: 'category_id' })
  public categoryId: string

  @column()
  public title: string

  @column()
  public description: string

  @column({ columnName: 'image_url' })
  public imageUrl: string

  @column()
  public price: number

  @column({ columnName: 'is_published' })
  public isPublished: boolean

  @hasMany(() => Attachment, {
    foreignKey: 'courseId',
  })
  public attachments: HasMany<typeof Attachment>

  @belongsTo(() => Category, {
    foreignKey: 'categoryId',
  })
  public category: BelongsTo<typeof Category>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(course: Course) {
    course.id = uuid()
  }
}
