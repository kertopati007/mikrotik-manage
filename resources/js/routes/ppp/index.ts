import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import secret from './secret'
import active from './active'
import profile from './profile'
/**
* @see \App\Http\Controllers\PPPController::index
 * @see app/Http/Controllers/PPPController.php:42
 * @route '/ppp'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/ppp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PPPController::index
 * @see app/Http/Controllers/PPPController.php:42
 * @route '/ppp'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::index
 * @see app/Http/Controllers/PPPController.php:42
 * @route '/ppp'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PPPController::index
 * @see app/Http/Controllers/PPPController.php:42
 * @route '/ppp'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PPPController::index
 * @see app/Http/Controllers/PPPController.php:42
 * @route '/ppp'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PPPController::index
 * @see app/Http/Controllers/PPPController.php:42
 * @route '/ppp'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PPPController::index
 * @see app/Http/Controllers/PPPController.php:42
 * @route '/ppp'
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
* @see \App\Http\Controllers\PPPController::stats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/ppp/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PPPController::stats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::stats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PPPController::stats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PPPController::stats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
    const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PPPController::stats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
        statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PPPController::stats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
        statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stats.form = statsForm
/**
* @see \App\Http\Controllers\PPPController::traffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
export const traffic = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: traffic.url(options),
    method: 'get',
})

traffic.definition = {
    methods: ["get","head"],
    url: '/ppp/traffic',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PPPController::traffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
traffic.url = (options?: RouteQueryOptions) => {
    return traffic.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::traffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
traffic.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: traffic.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PPPController::traffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
traffic.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: traffic.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PPPController::traffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
    const trafficForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: traffic.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PPPController::traffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
        trafficForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: traffic.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PPPController::traffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
        trafficForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: traffic.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    traffic.form = trafficForm
const ppp = {
    index: Object.assign(index, index),
stats: Object.assign(stats, stats),
secret: Object.assign(secret, secret),
active: Object.assign(active, active),
profile: Object.assign(profile, profile),
traffic: Object.assign(traffic, traffic),
}

export default ppp