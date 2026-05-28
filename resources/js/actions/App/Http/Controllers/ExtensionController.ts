import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\ExtensionController::uploadVersion
* @see app/Http/Controllers/ExtensionController.php:123
* @route '/my/extensions/{extension}/versions'
*/
export const uploadVersion = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadVersion.url(args, options),
    method: 'post',
})

uploadVersion.definition = {
    methods: ["post"],
    url: '/my/extensions/{extension}/versions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ExtensionController::uploadVersion
* @see app/Http/Controllers/ExtensionController.php:123
* @route '/my/extensions/{extension}/versions'
*/
uploadVersion.url = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return uploadVersion.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExtensionController::uploadVersion
* @see app/Http/Controllers/ExtensionController.php:123
* @route '/my/extensions/{extension}/versions'
*/
uploadVersion.post = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadVersion.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::uploadVersion
* @see app/Http/Controllers/ExtensionController.php:123
* @route '/my/extensions/{extension}/versions'
*/
const uploadVersionForm = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadVersion.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::uploadVersion
* @see app/Http/Controllers/ExtensionController.php:123
* @route '/my/extensions/{extension}/versions'
*/
uploadVersionForm.post = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadVersion.url(args, options),
    method: 'post',
})

uploadVersion.form = uploadVersionForm

/**
* @see \App\Http\Controllers\ExtensionController::uploadMedia
* @see app/Http/Controllers/ExtensionController.php:137
* @route '/my/extensions/{extension}/media'
*/
export const uploadMedia = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMedia.url(args, options),
    method: 'post',
})

uploadMedia.definition = {
    methods: ["post"],
    url: '/my/extensions/{extension}/media',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ExtensionController::uploadMedia
* @see app/Http/Controllers/ExtensionController.php:137
* @route '/my/extensions/{extension}/media'
*/
uploadMedia.url = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return uploadMedia.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExtensionController::uploadMedia
* @see app/Http/Controllers/ExtensionController.php:137
* @route '/my/extensions/{extension}/media'
*/
uploadMedia.post = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMedia.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::uploadMedia
* @see app/Http/Controllers/ExtensionController.php:137
* @route '/my/extensions/{extension}/media'
*/
const uploadMediaForm = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadMedia.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::uploadMedia
* @see app/Http/Controllers/ExtensionController.php:137
* @route '/my/extensions/{extension}/media'
*/
uploadMediaForm.post = (args: { extension: number | { id: number } } | [extension: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadMedia.url(args, options),
    method: 'post',
})

uploadMedia.form = uploadMediaForm

/**
* @see \App\Http\Controllers\ExtensionController::destroyMedia
* @see app/Http/Controllers/ExtensionController.php:162
* @route '/my/extensions/{extension}/media/{media}'
*/
export const destroyMedia = (args: { extension: number | { id: number }, media: number | { id: number } } | [extension: number | { id: number }, media: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMedia.url(args, options),
    method: 'delete',
})

destroyMedia.definition = {
    methods: ["delete"],
    url: '/my/extensions/{extension}/media/{media}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ExtensionController::destroyMedia
* @see app/Http/Controllers/ExtensionController.php:162
* @route '/my/extensions/{extension}/media/{media}'
*/
destroyMedia.url = (args: { extension: number | { id: number }, media: number | { id: number } } | [extension: number | { id: number }, media: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return destroyMedia.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace('{media}', parsedArgs.media.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExtensionController::destroyMedia
* @see app/Http/Controllers/ExtensionController.php:162
* @route '/my/extensions/{extension}/media/{media}'
*/
destroyMedia.delete = (args: { extension: number | { id: number }, media: number | { id: number } } | [extension: number | { id: number }, media: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMedia.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ExtensionController::destroyMedia
* @see app/Http/Controllers/ExtensionController.php:162
* @route '/my/extensions/{extension}/media/{media}'
*/
const destroyMediaForm = (args: { extension: number | { id: number }, media: number | { id: number } } | [extension: number | { id: number }, media: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyMedia.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ExtensionController::destroyMedia
* @see app/Http/Controllers/ExtensionController.php:162
* @route '/my/extensions/{extension}/media/{media}'
*/
destroyMediaForm.delete = (args: { extension: number | { id: number }, media: number | { id: number } } | [extension: number | { id: number }, media: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyMedia.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyMedia.form = destroyMediaForm

const ExtensionController = { index, create, store, show, update, destroy, uploadVersion, uploadMedia, destroyMedia }

export default ExtensionController