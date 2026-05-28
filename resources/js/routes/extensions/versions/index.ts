import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:123
* @route '/my/extensions/{extension}/versions'
*/
export const store = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/my/extensions/{extension}/versions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:123
* @route '/my/extensions/{extension}/versions'
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
* @see app/Http/Controllers/ExtensionController.php:123
* @route '/my/extensions/{extension}/versions'
*/
store.post = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:123
* @route '/my/extensions/{extension}/versions'
*/
const storeForm = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:123
* @route '/my/extensions/{extension}/versions'
*/
storeForm.post = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const versions = {
    store: Object.assign(store, store),
}

export default versions