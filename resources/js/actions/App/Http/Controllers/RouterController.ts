import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RouterController::dashboard
 * @see app/Http/Controllers/RouterController.php:19
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RouterController::dashboard
 * @see app/Http/Controllers/RouterController.php:19
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::dashboard
 * @see app/Http/Controllers/RouterController.php:19
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RouterController::dashboard
 * @see app/Http/Controllers/RouterController.php:19
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RouterController::dashboard
 * @see app/Http/Controllers/RouterController.php:19
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RouterController::dashboard
 * @see app/Http/Controllers/RouterController.php:19
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RouterController::dashboard
 * @see app/Http/Controllers/RouterController.php:19
 * @route '/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\RouterController::index
 * @see app/Http/Controllers/RouterController.php:101
 * @route '/routers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/routers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RouterController::index
 * @see app/Http/Controllers/RouterController.php:101
 * @route '/routers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::index
 * @see app/Http/Controllers/RouterController.php:101
 * @route '/routers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RouterController::index
 * @see app/Http/Controllers/RouterController.php:101
 * @route '/routers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RouterController::index
 * @see app/Http/Controllers/RouterController.php:101
 * @route '/routers'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RouterController::index
 * @see app/Http/Controllers/RouterController.php:101
 * @route '/routers'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RouterController::index
 * @see app/Http/Controllers/RouterController.php:101
 * @route '/routers'
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
* @see \App\Http\Controllers\RouterController::store
 * @see app/Http/Controllers/RouterController.php:125
 * @route '/routers'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/routers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RouterController::store
 * @see app/Http/Controllers/RouterController.php:125
 * @route '/routers'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::store
 * @see app/Http/Controllers/RouterController.php:125
 * @route '/routers'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RouterController::store
 * @see app/Http/Controllers/RouterController.php:125
 * @route '/routers'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RouterController::store
 * @see app/Http/Controllers/RouterController.php:125
 * @route '/routers'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\RouterController::update
 * @see app/Http/Controllers/RouterController.php:167
 * @route '/routers/{router}'
 */
export const update = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/routers/{router}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\RouterController::update
 * @see app/Http/Controllers/RouterController.php:167
 * @route '/routers/{router}'
 */
update.url = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { router: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { router: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    router: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        router: typeof args.router === 'object'
                ? args.router.id
                : args.router,
                }

    return update.definition.url
            .replace('{router}', parsedArgs.router.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::update
 * @see app/Http/Controllers/RouterController.php:167
 * @route '/routers/{router}'
 */
update.put = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\RouterController::update
 * @see app/Http/Controllers/RouterController.php:167
 * @route '/routers/{router}'
 */
    const updateForm = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RouterController::update
 * @see app/Http/Controllers/RouterController.php:167
 * @route '/routers/{router}'
 */
        updateForm.put = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\RouterController::destroy
 * @see app/Http/Controllers/RouterController.php:200
 * @route '/routers/{router}'
 */
export const destroy = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/routers/{router}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RouterController::destroy
 * @see app/Http/Controllers/RouterController.php:200
 * @route '/routers/{router}'
 */
destroy.url = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { router: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { router: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    router: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        router: typeof args.router === 'object'
                ? args.router.id
                : args.router,
                }

    return destroy.definition.url
            .replace('{router}', parsedArgs.router.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::destroy
 * @see app/Http/Controllers/RouterController.php:200
 * @route '/routers/{router}'
 */
destroy.delete = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\RouterController::destroy
 * @see app/Http/Controllers/RouterController.php:200
 * @route '/routers/{router}'
 */
    const destroyForm = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RouterController::destroy
 * @see app/Http/Controllers/RouterController.php:200
 * @route '/routers/{router}'
 */
        destroyForm.delete = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\RouterController::connect
 * @see app/Http/Controllers/RouterController.php:224
 * @route '/routers/{router}/connect'
 */
export const connect = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: connect.url(args, options),
    method: 'post',
})

connect.definition = {
    methods: ["post"],
    url: '/routers/{router}/connect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RouterController::connect
 * @see app/Http/Controllers/RouterController.php:224
 * @route '/routers/{router}/connect'
 */
connect.url = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { router: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { router: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    router: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        router: typeof args.router === 'object'
                ? args.router.id
                : args.router,
                }

    return connect.definition.url
            .replace('{router}', parsedArgs.router.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::connect
 * @see app/Http/Controllers/RouterController.php:224
 * @route '/routers/{router}/connect'
 */
connect.post = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: connect.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RouterController::connect
 * @see app/Http/Controllers/RouterController.php:224
 * @route '/routers/{router}/connect'
 */
    const connectForm = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: connect.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RouterController::connect
 * @see app/Http/Controllers/RouterController.php:224
 * @route '/routers/{router}/connect'
 */
        connectForm.post = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: connect.url(args, options),
            method: 'post',
        })
    
    connect.form = connectForm
/**
* @see \App\Http\Controllers\RouterController::disconnect
 * @see app/Http/Controllers/RouterController.php:246
 * @route '/routers/{router}/disconnect'
 */
export const disconnect = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disconnect.url(args, options),
    method: 'post',
})

disconnect.definition = {
    methods: ["post"],
    url: '/routers/{router}/disconnect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RouterController::disconnect
 * @see app/Http/Controllers/RouterController.php:246
 * @route '/routers/{router}/disconnect'
 */
disconnect.url = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { router: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { router: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    router: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        router: typeof args.router === 'object'
                ? args.router.id
                : args.router,
                }

    return disconnect.definition.url
            .replace('{router}', parsedArgs.router.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::disconnect
 * @see app/Http/Controllers/RouterController.php:246
 * @route '/routers/{router}/disconnect'
 */
disconnect.post = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disconnect.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RouterController::disconnect
 * @see app/Http/Controllers/RouterController.php:246
 * @route '/routers/{router}/disconnect'
 */
    const disconnectForm = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: disconnect.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RouterController::disconnect
 * @see app/Http/Controllers/RouterController.php:246
 * @route '/routers/{router}/disconnect'
 */
        disconnectForm.post = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: disconnect.url(args, options),
            method: 'post',
        })
    
    disconnect.form = disconnectForm
/**
* @see \App\Http\Controllers\RouterController::reboot
 * @see app/Http/Controllers/RouterController.php:381
 * @route '/routers/{router}/reboot'
 */
export const reboot = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reboot.url(args, options),
    method: 'post',
})

reboot.definition = {
    methods: ["post"],
    url: '/routers/{router}/reboot',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RouterController::reboot
 * @see app/Http/Controllers/RouterController.php:381
 * @route '/routers/{router}/reboot'
 */
reboot.url = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { router: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { router: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    router: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        router: typeof args.router === 'object'
                ? args.router.id
                : args.router,
                }

    return reboot.definition.url
            .replace('{router}', parsedArgs.router.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::reboot
 * @see app/Http/Controllers/RouterController.php:381
 * @route '/routers/{router}/reboot'
 */
reboot.post = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reboot.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RouterController::reboot
 * @see app/Http/Controllers/RouterController.php:381
 * @route '/routers/{router}/reboot'
 */
    const rebootForm = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reboot.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RouterController::reboot
 * @see app/Http/Controllers/RouterController.php:381
 * @route '/routers/{router}/reboot'
 */
        rebootForm.post = (args: { router: number | { id: number } } | [router: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reboot.url(args, options),
            method: 'post',
        })
    
    reboot.form = rebootForm
/**
* @see \App\Http\Controllers\RouterController::quickConnect
 * @see app/Http/Controllers/RouterController.php:263
 * @route '/routers/quick-connect'
 */
export const quickConnect = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickConnect.url(options),
    method: 'post',
})

quickConnect.definition = {
    methods: ["post"],
    url: '/routers/quick-connect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RouterController::quickConnect
 * @see app/Http/Controllers/RouterController.php:263
 * @route '/routers/quick-connect'
 */
quickConnect.url = (options?: RouteQueryOptions) => {
    return quickConnect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::quickConnect
 * @see app/Http/Controllers/RouterController.php:263
 * @route '/routers/quick-connect'
 */
quickConnect.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: quickConnect.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RouterController::quickConnect
 * @see app/Http/Controllers/RouterController.php:263
 * @route '/routers/quick-connect'
 */
    const quickConnectForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: quickConnect.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RouterController::quickConnect
 * @see app/Http/Controllers/RouterController.php:263
 * @route '/routers/quick-connect'
 */
        quickConnectForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: quickConnect.url(options),
            method: 'post',
        })
    
    quickConnect.form = quickConnectForm
/**
* @see \App\Http\Controllers\RouterController::testConnection
 * @see app/Http/Controllers/RouterController.php:302
 * @route '/routers/test-connection'
 */
export const testConnection = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testConnection.url(options),
    method: 'post',
})

testConnection.definition = {
    methods: ["post"],
    url: '/routers/test-connection',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RouterController::testConnection
 * @see app/Http/Controllers/RouterController.php:302
 * @route '/routers/test-connection'
 */
testConnection.url = (options?: RouteQueryOptions) => {
    return testConnection.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::testConnection
 * @see app/Http/Controllers/RouterController.php:302
 * @route '/routers/test-connection'
 */
testConnection.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testConnection.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RouterController::testConnection
 * @see app/Http/Controllers/RouterController.php:302
 * @route '/routers/test-connection'
 */
    const testConnectionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testConnection.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RouterController::testConnection
 * @see app/Http/Controllers/RouterController.php:302
 * @route '/routers/test-connection'
 */
        testConnectionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testConnection.url(options),
            method: 'post',
        })
    
    testConnection.form = testConnectionForm
/**
* @see \App\Http\Controllers\RouterController::getStats
 * @see app/Http/Controllers/RouterController.php:345
 * @route '/routers/stats'
 */
export const getStats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(options),
    method: 'get',
})

getStats.definition = {
    methods: ["get","head"],
    url: '/routers/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RouterController::getStats
 * @see app/Http/Controllers/RouterController.php:345
 * @route '/routers/stats'
 */
getStats.url = (options?: RouteQueryOptions) => {
    return getStats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::getStats
 * @see app/Http/Controllers/RouterController.php:345
 * @route '/routers/stats'
 */
getStats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RouterController::getStats
 * @see app/Http/Controllers/RouterController.php:345
 * @route '/routers/stats'
 */
getStats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RouterController::getStats
 * @see app/Http/Controllers/RouterController.php:345
 * @route '/routers/stats'
 */
    const getStatsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getStats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RouterController::getStats
 * @see app/Http/Controllers/RouterController.php:345
 * @route '/routers/stats'
 */
        getStatsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RouterController::getStats
 * @see app/Http/Controllers/RouterController.php:345
 * @route '/routers/stats'
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
* @see \App\Http\Controllers\RouterController::ping
 * @see app/Http/Controllers/RouterController.php:401
 * @route '/routers/ping'
 */
export const ping = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ping.url(options),
    method: 'post',
})

ping.definition = {
    methods: ["post"],
    url: '/routers/ping',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RouterController::ping
 * @see app/Http/Controllers/RouterController.php:401
 * @route '/routers/ping'
 */
ping.url = (options?: RouteQueryOptions) => {
    return ping.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RouterController::ping
 * @see app/Http/Controllers/RouterController.php:401
 * @route '/routers/ping'
 */
ping.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ping.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RouterController::ping
 * @see app/Http/Controllers/RouterController.php:401
 * @route '/routers/ping'
 */
    const pingForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ping.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RouterController::ping
 * @see app/Http/Controllers/RouterController.php:401
 * @route '/routers/ping'
 */
        pingForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ping.url(options),
            method: 'post',
        })
    
    ping.form = pingForm
const RouterController = { dashboard, index, store, update, destroy, connect, disconnect, reboot, quickConnect, testConnection, getStats, ping }

export default RouterController