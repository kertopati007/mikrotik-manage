import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\FirewallController::getStats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
export const getStats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(options),
    method: 'get',
})

getStats.definition = {
    methods: ["get","head"],
    url: '/firewall/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FirewallController::getStats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
getStats.url = (options?: RouteQueryOptions) => {
    return getStats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::getStats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
getStats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FirewallController::getStats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
getStats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FirewallController::getStats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
    const getStatsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getStats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FirewallController::getStats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
        getStatsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FirewallController::getStats
 * @see app/Http/Controllers/FirewallController.php:87
 * @route '/firewall/stats'
 */
        getStatsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getStats.form = getStatsForm
/**
* @see \App\Http\Controllers\FirewallController::storeFilter
 * @see app/Http/Controllers/FirewallController.php:111
 * @route '/firewall/filter'
 */
export const storeFilter = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeFilter.url(options),
    method: 'post',
})

storeFilter.definition = {
    methods: ["post"],
    url: '/firewall/filter',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FirewallController::storeFilter
 * @see app/Http/Controllers/FirewallController.php:111
 * @route '/firewall/filter'
 */
storeFilter.url = (options?: RouteQueryOptions) => {
    return storeFilter.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::storeFilter
 * @see app/Http/Controllers/FirewallController.php:111
 * @route '/firewall/filter'
 */
storeFilter.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeFilter.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FirewallController::storeFilter
 * @see app/Http/Controllers/FirewallController.php:111
 * @route '/firewall/filter'
 */
    const storeFilterForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeFilter.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::storeFilter
 * @see app/Http/Controllers/FirewallController.php:111
 * @route '/firewall/filter'
 */
        storeFilterForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeFilter.url(options),
            method: 'post',
        })
    
    storeFilter.form = storeFilterForm
/**
* @see \App\Http\Controllers\FirewallController::updateFilter
 * @see app/Http/Controllers/FirewallController.php:166
 * @route '/firewall/filter/{id}'
 */
export const updateFilter = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFilter.url(args, options),
    method: 'put',
})

updateFilter.definition = {
    methods: ["put"],
    url: '/firewall/filter/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FirewallController::updateFilter
 * @see app/Http/Controllers/FirewallController.php:166
 * @route '/firewall/filter/{id}'
 */
updateFilter.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return updateFilter.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::updateFilter
 * @see app/Http/Controllers/FirewallController.php:166
 * @route '/firewall/filter/{id}'
 */
updateFilter.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateFilter.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\FirewallController::updateFilter
 * @see app/Http/Controllers/FirewallController.php:166
 * @route '/firewall/filter/{id}'
 */
    const updateFilterForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateFilter.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::updateFilter
 * @see app/Http/Controllers/FirewallController.php:166
 * @route '/firewall/filter/{id}'
 */
        updateFilterForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateFilter.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateFilter.form = updateFilterForm
/**
* @see \App\Http\Controllers\FirewallController::deleteFilter
 * @see app/Http/Controllers/FirewallController.php:224
 * @route '/firewall/filter/{id}'
 */
export const deleteFilter = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteFilter.url(args, options),
    method: 'delete',
})

deleteFilter.definition = {
    methods: ["delete"],
    url: '/firewall/filter/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FirewallController::deleteFilter
 * @see app/Http/Controllers/FirewallController.php:224
 * @route '/firewall/filter/{id}'
 */
deleteFilter.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return deleteFilter.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::deleteFilter
 * @see app/Http/Controllers/FirewallController.php:224
 * @route '/firewall/filter/{id}'
 */
deleteFilter.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteFilter.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\FirewallController::deleteFilter
 * @see app/Http/Controllers/FirewallController.php:224
 * @route '/firewall/filter/{id}'
 */
    const deleteFilterForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteFilter.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::deleteFilter
 * @see app/Http/Controllers/FirewallController.php:224
 * @route '/firewall/filter/{id}'
 */
        deleteFilterForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteFilter.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteFilter.form = deleteFilterForm
/**
* @see \App\Http\Controllers\FirewallController::toggleFilter
 * @see app/Http/Controllers/FirewallController.php:242
 * @route '/firewall/filter/{id}/toggle'
 */
export const toggleFilter = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleFilter.url(args, options),
    method: 'post',
})

toggleFilter.definition = {
    methods: ["post"],
    url: '/firewall/filter/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FirewallController::toggleFilter
 * @see app/Http/Controllers/FirewallController.php:242
 * @route '/firewall/filter/{id}/toggle'
 */
toggleFilter.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return toggleFilter.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::toggleFilter
 * @see app/Http/Controllers/FirewallController.php:242
 * @route '/firewall/filter/{id}/toggle'
 */
toggleFilter.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleFilter.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FirewallController::toggleFilter
 * @see app/Http/Controllers/FirewallController.php:242
 * @route '/firewall/filter/{id}/toggle'
 */
    const toggleFilterForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleFilter.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::toggleFilter
 * @see app/Http/Controllers/FirewallController.php:242
 * @route '/firewall/filter/{id}/toggle'
 */
        toggleFilterForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleFilter.url(args, options),
            method: 'post',
        })
    
    toggleFilter.form = toggleFilterForm
/**
* @see \App\Http\Controllers\FirewallController::storeNat
 * @see app/Http/Controllers/FirewallController.php:267
 * @route '/firewall/nat'
 */
export const storeNat = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeNat.url(options),
    method: 'post',
})

storeNat.definition = {
    methods: ["post"],
    url: '/firewall/nat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FirewallController::storeNat
 * @see app/Http/Controllers/FirewallController.php:267
 * @route '/firewall/nat'
 */
storeNat.url = (options?: RouteQueryOptions) => {
    return storeNat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::storeNat
 * @see app/Http/Controllers/FirewallController.php:267
 * @route '/firewall/nat'
 */
storeNat.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeNat.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FirewallController::storeNat
 * @see app/Http/Controllers/FirewallController.php:267
 * @route '/firewall/nat'
 */
    const storeNatForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeNat.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::storeNat
 * @see app/Http/Controllers/FirewallController.php:267
 * @route '/firewall/nat'
 */
        storeNatForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeNat.url(options),
            method: 'post',
        })
    
    storeNat.form = storeNatForm
/**
* @see \App\Http\Controllers\FirewallController::updateNat
 * @see app/Http/Controllers/FirewallController.php:318
 * @route '/firewall/nat/{id}'
 */
export const updateNat = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateNat.url(args, options),
    method: 'put',
})

updateNat.definition = {
    methods: ["put"],
    url: '/firewall/nat/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FirewallController::updateNat
 * @see app/Http/Controllers/FirewallController.php:318
 * @route '/firewall/nat/{id}'
 */
updateNat.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return updateNat.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::updateNat
 * @see app/Http/Controllers/FirewallController.php:318
 * @route '/firewall/nat/{id}'
 */
updateNat.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateNat.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\FirewallController::updateNat
 * @see app/Http/Controllers/FirewallController.php:318
 * @route '/firewall/nat/{id}'
 */
    const updateNatForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateNat.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::updateNat
 * @see app/Http/Controllers/FirewallController.php:318
 * @route '/firewall/nat/{id}'
 */
        updateNatForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateNat.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateNat.form = updateNatForm
/**
* @see \App\Http\Controllers\FirewallController::deleteNat
 * @see app/Http/Controllers/FirewallController.php:373
 * @route '/firewall/nat/{id}'
 */
export const deleteNat = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteNat.url(args, options),
    method: 'delete',
})

deleteNat.definition = {
    methods: ["delete"],
    url: '/firewall/nat/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FirewallController::deleteNat
 * @see app/Http/Controllers/FirewallController.php:373
 * @route '/firewall/nat/{id}'
 */
deleteNat.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return deleteNat.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::deleteNat
 * @see app/Http/Controllers/FirewallController.php:373
 * @route '/firewall/nat/{id}'
 */
deleteNat.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteNat.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\FirewallController::deleteNat
 * @see app/Http/Controllers/FirewallController.php:373
 * @route '/firewall/nat/{id}'
 */
    const deleteNatForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteNat.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::deleteNat
 * @see app/Http/Controllers/FirewallController.php:373
 * @route '/firewall/nat/{id}'
 */
        deleteNatForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteNat.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteNat.form = deleteNatForm
/**
* @see \App\Http\Controllers\FirewallController::toggleNat
 * @see app/Http/Controllers/FirewallController.php:391
 * @route '/firewall/nat/{id}/toggle'
 */
export const toggleNat = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleNat.url(args, options),
    method: 'post',
})

toggleNat.definition = {
    methods: ["post"],
    url: '/firewall/nat/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FirewallController::toggleNat
 * @see app/Http/Controllers/FirewallController.php:391
 * @route '/firewall/nat/{id}/toggle'
 */
toggleNat.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return toggleNat.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::toggleNat
 * @see app/Http/Controllers/FirewallController.php:391
 * @route '/firewall/nat/{id}/toggle'
 */
toggleNat.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleNat.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FirewallController::toggleNat
 * @see app/Http/Controllers/FirewallController.php:391
 * @route '/firewall/nat/{id}/toggle'
 */
    const toggleNatForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleNat.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::toggleNat
 * @see app/Http/Controllers/FirewallController.php:391
 * @route '/firewall/nat/{id}/toggle'
 */
        toggleNatForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleNat.url(args, options),
            method: 'post',
        })
    
    toggleNat.form = toggleNatForm
/**
* @see \App\Http\Controllers\FirewallController::storeAddress
 * @see app/Http/Controllers/FirewallController.php:416
 * @route '/firewall/address-list'
 */
export const storeAddress = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAddress.url(options),
    method: 'post',
})

storeAddress.definition = {
    methods: ["post"],
    url: '/firewall/address-list',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FirewallController::storeAddress
 * @see app/Http/Controllers/FirewallController.php:416
 * @route '/firewall/address-list'
 */
storeAddress.url = (options?: RouteQueryOptions) => {
    return storeAddress.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::storeAddress
 * @see app/Http/Controllers/FirewallController.php:416
 * @route '/firewall/address-list'
 */
storeAddress.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAddress.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FirewallController::storeAddress
 * @see app/Http/Controllers/FirewallController.php:416
 * @route '/firewall/address-list'
 */
    const storeAddressForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeAddress.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::storeAddress
 * @see app/Http/Controllers/FirewallController.php:416
 * @route '/firewall/address-list'
 */
        storeAddressForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeAddress.url(options),
            method: 'post',
        })
    
    storeAddress.form = storeAddressForm
/**
* @see \App\Http\Controllers\FirewallController::updateAddress
 * @see app/Http/Controllers/FirewallController.php:451
 * @route '/firewall/address-list/{id}'
 */
export const updateAddress = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAddress.url(args, options),
    method: 'put',
})

updateAddress.definition = {
    methods: ["put"],
    url: '/firewall/address-list/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FirewallController::updateAddress
 * @see app/Http/Controllers/FirewallController.php:451
 * @route '/firewall/address-list/{id}'
 */
updateAddress.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return updateAddress.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::updateAddress
 * @see app/Http/Controllers/FirewallController.php:451
 * @route '/firewall/address-list/{id}'
 */
updateAddress.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAddress.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\FirewallController::updateAddress
 * @see app/Http/Controllers/FirewallController.php:451
 * @route '/firewall/address-list/{id}'
 */
    const updateAddressForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateAddress.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::updateAddress
 * @see app/Http/Controllers/FirewallController.php:451
 * @route '/firewall/address-list/{id}'
 */
        updateAddressForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateAddress.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateAddress.form = updateAddressForm
/**
* @see \App\Http\Controllers\FirewallController::deleteAddress
 * @see app/Http/Controllers/FirewallController.php:490
 * @route '/firewall/address-list/{id}'
 */
export const deleteAddress = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteAddress.url(args, options),
    method: 'delete',
})

deleteAddress.definition = {
    methods: ["delete"],
    url: '/firewall/address-list/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FirewallController::deleteAddress
 * @see app/Http/Controllers/FirewallController.php:490
 * @route '/firewall/address-list/{id}'
 */
deleteAddress.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return deleteAddress.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::deleteAddress
 * @see app/Http/Controllers/FirewallController.php:490
 * @route '/firewall/address-list/{id}'
 */
deleteAddress.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteAddress.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\FirewallController::deleteAddress
 * @see app/Http/Controllers/FirewallController.php:490
 * @route '/firewall/address-list/{id}'
 */
    const deleteAddressForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteAddress.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::deleteAddress
 * @see app/Http/Controllers/FirewallController.php:490
 * @route '/firewall/address-list/{id}'
 */
        deleteAddressForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteAddress.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteAddress.form = deleteAddressForm
/**
* @see \App\Http\Controllers\FirewallController::toggleAddress
 * @see app/Http/Controllers/FirewallController.php:508
 * @route '/firewall/address-list/{id}/toggle'
 */
export const toggleAddress = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleAddress.url(args, options),
    method: 'post',
})

toggleAddress.definition = {
    methods: ["post"],
    url: '/firewall/address-list/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FirewallController::toggleAddress
 * @see app/Http/Controllers/FirewallController.php:508
 * @route '/firewall/address-list/{id}/toggle'
 */
toggleAddress.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return toggleAddress.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FirewallController::toggleAddress
 * @see app/Http/Controllers/FirewallController.php:508
 * @route '/firewall/address-list/{id}/toggle'
 */
toggleAddress.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleAddress.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FirewallController::toggleAddress
 * @see app/Http/Controllers/FirewallController.php:508
 * @route '/firewall/address-list/{id}/toggle'
 */
    const toggleAddressForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleAddress.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FirewallController::toggleAddress
 * @see app/Http/Controllers/FirewallController.php:508
 * @route '/firewall/address-list/{id}/toggle'
 */
        toggleAddressForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleAddress.url(args, options),
            method: 'post',
        })
    
    toggleAddress.form = toggleAddressForm
const FirewallController = { index, getStats, storeFilter, updateFilter, deleteFilter, toggleFilter, storeNat, updateNat, deleteNat, toggleNat, storeAddress, updateAddress, deleteAddress, toggleAddress }

export default FirewallController