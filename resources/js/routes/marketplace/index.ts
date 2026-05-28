import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MarketplaceController::show
* @see app/Http/Controllers/MarketplaceController.php:51
* @route '/extensions/{slug}'
*/
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/extensions/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::show
* @see app/Http/Controllers/MarketplaceController.php:51
* @route '/extensions/{slug}'
*/
show.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    if (Array.isArray(args)) {
        args = {
            slug: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
    }

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::show
* @see app/Http/Controllers/MarketplaceController.php:51
* @route '/extensions/{slug}'
*/
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::show
* @see app/Http/Controllers/MarketplaceController.php:51
* @route '/extensions/{slug}'
*/
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MarketplaceController::show
* @see app/Http/Controllers/MarketplaceController.php:51
* @route '/extensions/{slug}'
*/
const showForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::show
* @see app/Http/Controllers/MarketplaceController.php:51
* @route '/extensions/{slug}'
*/
showForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::show
* @see app/Http/Controllers/MarketplaceController.php:51
* @route '/extensions/{slug}'
*/
showForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MarketplaceController::download
* @see app/Http/Controllers/MarketplaceController.php:77
* @route '/extensions/{slug}/download'
*/
export const download = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/extensions/{slug}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketplaceController::download
* @see app/Http/Controllers/MarketplaceController.php:77
* @route '/extensions/{slug}/download'
*/
download.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    if (Array.isArray(args)) {
        args = {
            slug: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
    }

    return download.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketplaceController::download
* @see app/Http/Controllers/MarketplaceController.php:77
* @route '/extensions/{slug}/download'
*/
download.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::download
* @see app/Http/Controllers/MarketplaceController.php:77
* @route '/extensions/{slug}/download'
*/
download.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MarketplaceController::download
* @see app/Http/Controllers/MarketplaceController.php:77
* @route '/extensions/{slug}/download'
*/
const downloadForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::download
* @see app/Http/Controllers/MarketplaceController.php:77
* @route '/extensions/{slug}/download'
*/
downloadForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MarketplaceController::download
* @see app/Http/Controllers/MarketplaceController.php:77
* @route '/extensions/{slug}/download'
*/
downloadForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const marketplace = {
    show: Object.assign(show, show),
    download: Object.assign(download, download),
}

export default marketplace