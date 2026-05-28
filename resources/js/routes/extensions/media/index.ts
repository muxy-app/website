import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:137
* @route '/my/extensions/{extension}/media'
*/
export const store = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/my/extensions/{extension}/media',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:137
* @route '/my/extensions/{extension}/media'
*/
store.url = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:137
* @route '/my/extensions/{extension}/media'
*/
store.post = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:137
* @route '/my/extensions/{extension}/media'
*/
const storeForm = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:137
* @route '/my/extensions/{extension}/media'
*/
storeForm.post = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ExtensionController::destroy
* @see app/Http/Controllers/ExtensionController.php:162
* @route '/my/extensions/{extension}/media/{media}'
*/
export const destroy = (args: { extension: number | { id: number }, media: number | { id: number } } | [extension: number | { id: number }, media: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/my/extensions/{extension}/media/{media}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ExtensionController::destroy
* @see app/Http/Controllers/ExtensionController.php:162
* @route '/my/extensions/{extension}/media/{media}'
*/
destroy.url = (args: { extension: number | { id: number }, media: number | { id: number } } | [extension: number | { id: number }, media: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            extension: args[0],
            media: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        extension: typeof args.extension === 'object'
        ? args.extension.id
        : args.extension,
        media: typeof args.media === 'object'
        ? args.media.id
        : args.media,
    }

    return destroy.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace('{media}', parsedArgs.media.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExtensionController::destroy
* @see app/Http/Controllers/ExtensionController.php:162
* @route '/my/extensions/{extension}/media/{media}'
*/
destroy.delete = (args: { extension: number | { id: number }, media: number | { id: number } } | [extension: number | { id: number }, media: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ExtensionController::destroy
* @see app/Http/Controllers/ExtensionController.php:162
* @route '/my/extensions/{extension}/media/{media}'
*/
const destroyForm = (args: { extension: number | { id: number }, media: number | { id: number } } | [extension: number | { id: number }, media: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::destroy
* @see app/Http/Controllers/ExtensionController.php:162
* @route '/my/extensions/{extension}/media/{media}'
*/
destroyForm.delete = (args: { extension: number | { id: number }, media: number | { id: number } } | [extension: number | { id: number }, media: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const media = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default media