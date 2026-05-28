import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import versions from './versions'
/**
* @see \App\Http\Controllers\Admin\ReviewController::index
* @see app/Http/Controllers/Admin/ReviewController.php:18
* @route '/admin/extensions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/extensions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReviewController::index
* @see app/Http/Controllers/Admin/ReviewController.php:18
* @route '/admin/extensions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReviewController::index
* @see app/Http/Controllers/Admin/ReviewController.php:18
* @route '/admin/extensions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::index
* @see app/Http/Controllers/Admin/ReviewController.php:18
* @route '/admin/extensions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::index
* @see app/Http/Controllers/Admin/ReviewController.php:18
* @route '/admin/extensions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::index
* @see app/Http/Controllers/Admin/ReviewController.php:18
* @route '/admin/extensions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::index
* @see app/Http/Controllers/Admin/ReviewController.php:18
* @route '/admin/extensions'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\ReviewController::show
* @see app/Http/Controllers/Admin/ReviewController.php:54
* @route '/admin/extensions/{extension}'
*/
export const show = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/extensions/{extension}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReviewController::show
* @see app/Http/Controllers/Admin/ReviewController.php:54
* @route '/admin/extensions/{extension}'
*/
show.url = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { extension: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { extension: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            extension: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        extension: typeof args.extension === 'object'
        ? args.extension.id
        : args.extension,
    }

    return show.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReviewController::show
* @see app/Http/Controllers/Admin/ReviewController.php:54
* @route '/admin/extensions/{extension}'
*/
show.get = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::show
* @see app/Http/Controllers/Admin/ReviewController.php:54
* @route '/admin/extensions/{extension}'
*/
show.head = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::show
* @see app/Http/Controllers/Admin/ReviewController.php:54
* @route '/admin/extensions/{extension}'
*/
const showForm = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::show
* @see app/Http/Controllers/Admin/ReviewController.php:54
* @route '/admin/extensions/{extension}'
*/
showForm.get = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::show
* @see app/Http/Controllers/Admin/ReviewController.php:54
* @route '/admin/extensions/{extension}'
*/
showForm.head = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const extensions = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    versions: Object.assign(versions, versions),
}

export default extensions