/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// users
Route.post('/users', 'UsersController.store')
Route.get('/users', 'UsersController.authenticatedUser').middleware('auth')
Route.patch('/users/:id', 'UsersController.update').middleware('auth')

//auth
Route.post('/auth', 'AuthController.store')
Route.get('/auth/session', 'AuthController.session').middleware('auth')
Route.delete('/auth', 'AuthController.destroy')
Route.get('/auth/github', 'AuthController.redirect')
Route.get('/auth/github/callback', 'AuthController.callback')

// categories
Route.post('/category', 'CategoriesController.store')
Route.get('/category/:id?', 'CategoriesController.index')
Route.put('/category/:id', 'CategoriesController.update')
Route.delete('/category/:id', 'CategoriesController.destroy')

// courses
Route.post('/courses', 'CoursesController.store').middleware('auth')
Route.get('/courses/:id?', 'CoursesController.index')
Route.get('/courses/user/:userId', 'CoursesController.getAllByUserId')
Route.get('/courses/category/:categoryId', 'CoursesController.getAllByCategoryId')
Route.patch('/courses/:id', 'CoursesController.update').middleware('auth')
Route.delete('/courses/:id', 'CoursesController.destroy').middleware('auth')
Route.patch('/courses/:id/publish', 'CoursesController.publish').middleware('auth')

// attachments
Route.post('/courses/:courseId/attachments', 'AttachmentsController.store').middleware('auth')
Route.get('/courses/:courseId/attachments/:id?', 'AttachmentsController.index')
Route.patch('/courses/:courseId/attachments/:id', 'AttachmentsController.update').middleware('auth')
Route.delete('/courses/:courseId/attachments/:id', 'AttachmentsController.destroy').middleware(
  'auth'
)
