import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Admin\ReviewController::downloadZip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
export const downloadZip = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadZip.url(args, options),
    method: 'get',
})

downloadZip.definition = {
    methods: ["get","head"],
    url: '/admin/extensions/{extension}/versions/{version}/zip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReviewController::downloadZip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
downloadZip.url = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return downloadZip.definition.url
            .replace('{extension}', parsedArgs.extension.toString())
            .replace('{version}', parsedArgs.version.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReviewController::downloadZip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
downloadZip.get = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadZip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::downloadZip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
downloadZip.head = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadZip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::downloadZip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
const downloadZipForm = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadZip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::downloadZip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
downloadZipForm.get = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadZip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReviewController::downloadZip
* @see app/Http/Controllers/Admin/ReviewController.php:142
* @route '/admin/extensions/{extension}/versions/{version}/zip'
*/
downloadZipForm.head = (args: { extension: number | { id: number }, version: number | { id: number } } | [extension: number | { id: number }, version: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadZip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadZip.form = downloadZipForm

const ReviewController = { index, show, approve, reject, downloadZip }

export default ReviewController