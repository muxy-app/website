import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ReviewController::approve
* @see app/Http/Controllers/Admin/ReviewController.php:90
* @route '/admin/extensions/{extension}/versions/{version}/approve'
*/
export const approve = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/extensions/{extension}/versions/{version}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ReviewController::approve
* @see app/Http/Controllers/Admin/ReviewController.php:90
* @route '/admin/extensions/{extension}/versions/{version}/approve'
*/
approve.url = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            extension: args[0],
            version: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        extension: typeof args.extension === 'object'
        ? args.extension.id
        : args.extension,
        version: typeof args.version === 'object'
        ? args.version.id
        : args.version,
    }

    return approve.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReviewController::approve
* @see app/Http/Controllers/Admin/ReviewController.php:90
* @route '/admin/extensions/{extension}/versions/{version}/approve'
*/
approve.post = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::approve
* @see app/Http/Controllers/Admin/ReviewController.php:90
* @route '/admin/extensions/{extension}/versions/{version}/approve'
*/
const approveForm = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::approve
* @see app/Http/Controllers/Admin/ReviewController.php:90
* @route '/admin/extensions/{extension}/versions/{version}/approve'
*/
approveForm.post = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\Admin\ReviewController::reject
* @see app/Http/Controllers/Admin/ReviewController.php:114
* @route '/admin/extensions/{extension}/versions/{version}/reject'
*/
export const reject = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/extensions/{extension}/versions/{version}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ReviewController::reject
* @see app/Http/Controllers/Admin/ReviewController.php:114
* @route '/admin/extensions/{extension}/versions/{version}/reject'
*/
reject.url = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            extension: args[0],
            version: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        extension: typeof args.extension === 'object'
        ? args.extension.id
        : args.extension,
        version: typeof args.version === 'object'
        ? args.version.id
        : args.version,
    }

    return reject.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReviewController::reject
* @see app/Http/Controllers/Admin/ReviewController.php:114
* @route '/admin/extensions/{extension}/versions/{version}/reject'
*/
reject.post = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::reject
* @see app/Http/Controllers/Admin/ReviewController.php:114
* @route '/admin/extensions/{extension}/versions/{version}/reject'
*/
const rejectForm = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::reject
* @see app/Http/Controllers/Admin/ReviewController.php:114
* @route '/admin/extensions/{extension}/versions/{version}/reject'
*/
rejectForm.post = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\Admin\ReviewController::zip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
export const zip = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: zip.url(args, options),
    method: 'get',
})

zip.definition = {
    methods: ["get","head"],
    url: '/admin/extensions/{extension}/versions/{version}/zip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReviewController::zip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
zip.url = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            extension: args[0],
            version: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        extension: typeof args.extension === 'object'
        ? args.extension.id
        : args.extension,
        version: typeof args.version === 'object'
        ? args.version.id
        : args.version,
    }

    return zip.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReviewController::zip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
zip.get = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: zip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::zip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
zip.head = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: zip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::zip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
const zipForm = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: zip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::zip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
zipForm.get = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: zip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::zip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
zipForm.head = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: zip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

zip.form = zipForm

const versions = {
    approve: Object.assign(approve, approve),
    reject: Object.assign(reject, reject),
    zip: Object.assign(zip, zip),
}

export default versions