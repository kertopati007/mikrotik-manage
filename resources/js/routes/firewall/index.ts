import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import filter from './filter'
import nat from './nat'
import address from './address'
/**
* @see \App\Http\Controllers\FirewallController::index
 * @see app/Http/Controllers/FirewallController.php:19
 * @route '/firewall'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/firewall',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FirewallController::index
 * @see app/Http/Controllers/FirewallController.php:19
 * @route '/firewall'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::index
 * @see app/Http/Controllers/FirewallController.php:19
 * @route '/firewall'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FirewallController::index
 * @see app/Http/Controllers/FirewallController.php:19
 * @route '/firewall'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FirewallController::index
 * @see app/Http/Controllers/FirewallController.php:19
 * @route '/firewall'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FirewallController::index
 * @see app/Http/Controllers/FirewallController.php:19
 * @route '/firewall'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FirewallController::index
 * @see app/Http/Controllers/FirewallController.php:19
 * @route '/firewall'
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
* @see \App\Http\Controllers\FirewallController::stats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/firewall/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FirewallController::stats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::stats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FirewallController::stats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FirewallController::stats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
    const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FirewallController::stats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
        statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FirewallController::stats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
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
const firewall = {
    index: Object.assign(index, index),
stats: Object.assign(stats, stats),
filter: Object.assign(filter, filter),
nat: Object.assign(nat, nat),
address: Object.assign(address, address),
}

export default firewall