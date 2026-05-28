import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import versions from './versions'
import media from './media'
/**
* @see \App\Http\Controllers\ExtensionController::index
* @see app/Http/Controllers/ExtensionController.php:22
* @route '/my/extensions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/my/extensions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExtensionController::index
* @see app/Http/Controllers/ExtensionController.php:22
* @route '/my/extensions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExtensionController::index
* @see app/Http/Controllers/ExtensionController.php:22
* @route '/my/extensions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ExtensionController::index
* @see app/Http/Controllers/ExtensionController.php:22
* @route '/my/extensions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ExtensionController::index
* @see app/Http/Controllers/ExtensionController.php:22
* @route '/my/extensions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ExtensionController::index
* @see app/Http/Controllers/ExtensionController.php:22
* @route '/my/extensions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ExtensionController::index
* @see app/Http/Controllers/ExtensionController.php:22
* @route '/my/extensions'
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
* @see \App\Http\Controllers\ExtensionController::create
* @see app/Http/Controllers/ExtensionController.php:35
* @route '/my/extensions/new'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/my/extensions/new',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExtensionController::create
* @see app/Http/Controllers/ExtensionController.php:35
* @route '/my/extensions/new'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExtensionController::create
* @see app/Http/Controllers/ExtensionController.php:35
* @route '/my/extensions/new'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ExtensionController::create
* @see app/Http/Controllers/ExtensionController.php:35
* @route '/my/extensions/new'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ExtensionController::create
* @see app/Http/Controllers/ExtensionController.php:35
* @route '/my/extensions/new'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ExtensionController::create
* @see app/Http/Controllers/ExtensionController.php:35
* @route '/my/extensions/new'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ExtensionController::create
* @see app/Http/Controllers/ExtensionController.php:35
* @route '/my/extensions/new'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:42
* @route '/my/extensions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/my/extensions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:42
* @route '/my/extensions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:42
* @route '/my/extensions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:42
* @route '/my/extensions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::store
* @see app/Http/Controllers/ExtensionController.php:42
* @route '/my/extensions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ExtensionController::show
* @see app/Http/Controllers/ExtensionController.php:79
* @route '/my/extensions/{extension}'
*/
export const show = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/my/extensions/{extension}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExtensionController::show
* @see app/Http/Controllers/ExtensionController.php:79
* @route '/my/extensions/{extension}'
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
* @see \App\Http\Controllers\ExtensionController::show
* @see app/Http/Controllers/ExtensionController.php:79
* @route '/my/extensions/{extension}'
*/
show.get = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ExtensionController::show
* @see app/Http/Controllers/ExtensionController.php:79
* @route '/my/extensions/{extension}'
*/
show.head = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ExtensionController::show
* @see app/Http/Controllers/ExtensionController.php:79
* @route '/my/extensions/{extension}'
*/
const showForm = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ExtensionController::show
* @see app/Http/Controllers/ExtensionController.php:79
* @route '/my/extensions/{extension}'
*/
showForm.get = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ExtensionController::show
* @see app/Http/Controllers/ExtensionController.php:79
* @route '/my/extensions/{extension}'
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

/**
* @see \App\Http\Controllers\ExtensionController::update
* @see app/Http/Controllers/ExtensionController.php:91
* @route '/my/extensions/{extension}'
*/
export const update = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/my/extensions/{extension}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ExtensionController::update
* @see app/Http/Controllers/ExtensionController.php:91
* @route '/my/extensions/{extension}'
*/
update.url = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExtensionController::update
* @see app/Http/Controllers/ExtensionController.php:91
* @route '/my/extensions/{extension}'
*/
update.patch = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ExtensionController::update
* @see app/Http/Controllers/ExtensionController.php:91
* @route '/my/extensions/{extension}'
*/
const updateForm = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::update
* @see app/Http/Controllers/ExtensionController.php:91
* @route '/my/extensions/{extension}'
*/
updateForm.patch = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\ExtensionController::destroy
* @see app/Http/Controllers/ExtensionController.php:111
* @route '/my/extensions/{extension}'
*/
export const destroy = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/my/extensions/{extension}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ExtensionController::destroy
* @see app/Http/Controllers/ExtensionController.php:111
* @route '/my/extensions/{extension}'
*/
destroy.url = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExtensionController::destroy
* @see app/Http/Controllers/ExtensionController.php:111
* @route '/my/extensions/{extension}'
*/
destroy.delete = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ExtensionController::destroy
* @see app/Http/Controllers/ExtensionController.php:111
* @route '/my/extensions/{extension}'
*/
const destroyForm = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/ExtensionController.php:111
* @route '/my/extensions/{extension}'
*/
destroyForm.delete = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const extensions = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    versions: Object.assign(versions, versions),
    media: Object.assign(media, media),
}

export default extensions