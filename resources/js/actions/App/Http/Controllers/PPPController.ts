import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\PPPController::getStats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
export const getStats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(options),
    method: 'get',
})

getStats.definition = {
    methods: ["get","head"],
    url: '/ppp/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PPPController::getStats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
getStats.url = (options?: RouteQueryOptions) => {
    return getStats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::getStats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
getStats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PPPController::getStats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
getStats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PPPController::getStats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
    const getStatsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getStats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PPPController::getStats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
 */
        getStatsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getStats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PPPController::getStats
 * @see app/Http/Controllers/PPPController.php:100
 * @route '/ppp/stats'
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
* @see \App\Http\Controllers\PPPController::storeSecret
 * @see app/Http/Controllers/PPPController.php:124
 * @route '/ppp/secret'
 */
export const storeSecret = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSecret.url(options),
    method: 'post',
})

storeSecret.definition = {
    methods: ["post"],
    url: '/ppp/secret',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PPPController::storeSecret
 * @see app/Http/Controllers/PPPController.php:124
 * @route '/ppp/secret'
 */
storeSecret.url = (options?: RouteQueryOptions) => {
    return storeSecret.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::storeSecret
 * @see app/Http/Controllers/PPPController.php:124
 * @route '/ppp/secret'
 */
storeSecret.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSecret.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PPPController::storeSecret
 * @see app/Http/Controllers/PPPController.php:124
 * @route '/ppp/secret'
 */
    const storeSecretForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeSecret.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PPPController::storeSecret
 * @see app/Http/Controllers/PPPController.php:124
 * @route '/ppp/secret'
 */
        storeSecretForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeSecret.url(options),
            method: 'post',
        })
    
    storeSecret.form = storeSecretForm
/**
* @see \App\Http\Controllers\PPPController::updateSecret
 * @see app/Http/Controllers/PPPController.php:185
 * @route '/ppp/secret/{id}'
 */
export const updateSecret = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSecret.url(args, options),
    method: 'put',
})

updateSecret.definition = {
    methods: ["put"],
    url: '/ppp/secret/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PPPController::updateSecret
 * @see app/Http/Controllers/PPPController.php:185
 * @route '/ppp/secret/{id}'
 */
updateSecret.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateSecret.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::updateSecret
 * @see app/Http/Controllers/PPPController.php:185
 * @route '/ppp/secret/{id}'
 */
updateSecret.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSecret.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PPPController::updateSecret
 * @see app/Http/Controllers/PPPController.php:185
 * @route '/ppp/secret/{id}'
 */
    const updateSecretForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSecret.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PPPController::updateSecret
 * @see app/Http/Controllers/PPPController.php:185
 * @route '/ppp/secret/{id}'
 */
        updateSecretForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSecret.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSecret.form = updateSecretForm
/**
* @see \App\Http\Controllers\PPPController::deleteSecret
 * @see app/Http/Controllers/PPPController.php:248
 * @route '/ppp/secret/{id}'
 */
export const deleteSecret = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteSecret.url(args, options),
    method: 'delete',
})

deleteSecret.definition = {
    methods: ["delete"],
    url: '/ppp/secret/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PPPController::deleteSecret
 * @see app/Http/Controllers/PPPController.php:248
 * @route '/ppp/secret/{id}'
 */
deleteSecret.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteSecret.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::deleteSecret
 * @see app/Http/Controllers/PPPController.php:248
 * @route '/ppp/secret/{id}'
 */
deleteSecret.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteSecret.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PPPController::deleteSecret
 * @see app/Http/Controllers/PPPController.php:248
 * @route '/ppp/secret/{id}'
 */
    const deleteSecretForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteSecret.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PPPController::deleteSecret
 * @see app/Http/Controllers/PPPController.php:248
 * @route '/ppp/secret/{id}'
 */
        deleteSecretForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteSecret.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteSecret.form = deleteSecretForm
/**
* @see \App\Http\Controllers\PPPController::toggleSecret
 * @see app/Http/Controllers/PPPController.php:278
 * @route '/ppp/secret/{id}/toggle'
 */
export const toggleSecret = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleSecret.url(args, options),
    method: 'post',
})

toggleSecret.definition = {
    methods: ["post"],
    url: '/ppp/secret/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PPPController::toggleSecret
 * @see app/Http/Controllers/PPPController.php:278
 * @route '/ppp/secret/{id}/toggle'
 */
toggleSecret.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleSecret.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::toggleSecret
 * @see app/Http/Controllers/PPPController.php:278
 * @route '/ppp/secret/{id}/toggle'
 */
toggleSecret.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleSecret.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PPPController::toggleSecret
 * @see app/Http/Controllers/PPPController.php:278
 * @route '/ppp/secret/{id}/toggle'
 */
    const toggleSecretForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleSecret.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PPPController::toggleSecret
 * @see app/Http/Controllers/PPPController.php:278
 * @route '/ppp/secret/{id}/toggle'
 */
        toggleSecretForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleSecret.url(args, options),
            method: 'post',
        })
    
    toggleSecret.form = toggleSecretForm
/**
* @see \App\Http\Controllers\PPPController::disconnectActive
 * @see app/Http/Controllers/PPPController.php:312
 * @route '/ppp/active/{id}'
 */
export const disconnectActive = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disconnectActive.url(args, options),
    method: 'delete',
})

disconnectActive.definition = {
    methods: ["delete"],
    url: '/ppp/active/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PPPController::disconnectActive
 * @see app/Http/Controllers/PPPController.php:312
 * @route '/ppp/active/{id}'
 */
disconnectActive.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return disconnectActive.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::disconnectActive
 * @see app/Http/Controllers/PPPController.php:312
 * @route '/ppp/active/{id}'
 */
disconnectActive.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disconnectActive.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PPPController::disconnectActive
 * @see app/Http/Controllers/PPPController.php:312
 * @route '/ppp/active/{id}'
 */
    const disconnectActiveForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: disconnectActive.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PPPController::disconnectActive
 * @see app/Http/Controllers/PPPController.php:312
 * @route '/ppp/active/{id}'
 */
        disconnectActiveForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: disconnectActive.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    disconnectActive.form = disconnectActiveForm
/**
* @see \App\Http\Controllers\PPPController::storeProfile
 * @see app/Http/Controllers/PPPController.php:378
 * @route '/ppp/profile'
 */
export const storeProfile = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeProfile.url(options),
    method: 'post',
})

storeProfile.definition = {
    methods: ["post"],
    url: '/ppp/profile',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PPPController::storeProfile
 * @see app/Http/Controllers/PPPController.php:378
 * @route '/ppp/profile'
 */
storeProfile.url = (options?: RouteQueryOptions) => {
    return storeProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::storeProfile
 * @see app/Http/Controllers/PPPController.php:378
 * @route '/ppp/profile'
 */
storeProfile.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeProfile.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PPPController::storeProfile
 * @see app/Http/Controllers/PPPController.php:378
 * @route '/ppp/profile'
 */
    const storeProfileForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeProfile.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PPPController::storeProfile
 * @see app/Http/Controllers/PPPController.php:378
 * @route '/ppp/profile'
 */
        storeProfileForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeProfile.url(options),
            method: 'post',
        })
    
    storeProfile.form = storeProfileForm
/**
* @see \App\Http\Controllers\PPPController::updateProfile
 * @see app/Http/Controllers/PPPController.php:445
 * @route '/ppp/profile/{id}'
 */
export const updateProfile = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProfile.url(args, options),
    method: 'put',
})

updateProfile.definition = {
    methods: ["put"],
    url: '/ppp/profile/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PPPController::updateProfile
 * @see app/Http/Controllers/PPPController.php:445
 * @route '/ppp/profile/{id}'
 */
updateProfile.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateProfile.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::updateProfile
 * @see app/Http/Controllers/PPPController.php:445
 * @route '/ppp/profile/{id}'
 */
updateProfile.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProfile.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PPPController::updateProfile
 * @see app/Http/Controllers/PPPController.php:445
 * @route '/ppp/profile/{id}'
 */
    const updateProfileForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateProfile.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PPPController::updateProfile
 * @see app/Http/Controllers/PPPController.php:445
 * @route '/ppp/profile/{id}'
 */
        updateProfileForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateProfile.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateProfile.form = updateProfileForm
/**
* @see \App\Http\Controllers\PPPController::deleteProfile
 * @see app/Http/Controllers/PPPController.php:512
 * @route '/ppp/profile/{id}'
 */
export const deleteProfile = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteProfile.url(args, options),
    method: 'delete',
})

deleteProfile.definition = {
    methods: ["delete"],
    url: '/ppp/profile/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PPPController::deleteProfile
 * @see app/Http/Controllers/PPPController.php:512
 * @route '/ppp/profile/{id}'
 */
deleteProfile.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteProfile.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::deleteProfile
 * @see app/Http/Controllers/PPPController.php:512
 * @route '/ppp/profile/{id}'
 */
deleteProfile.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteProfile.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PPPController::deleteProfile
 * @see app/Http/Controllers/PPPController.php:512
 * @route '/ppp/profile/{id}'
 */
    const deleteProfileForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteProfile.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PPPController::deleteProfile
 * @see app/Http/Controllers/PPPController.php:512
 * @route '/ppp/profile/{id}'
 */
        deleteProfileForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteProfile.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteProfile.form = deleteProfileForm
/**
* @see \App\Http\Controllers\PPPController::getTraffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
export const getTraffic = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTraffic.url(options),
    method: 'get',
})

getTraffic.definition = {
    methods: ["get","head"],
    url: '/ppp/traffic',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PPPController::getTraffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
getTraffic.url = (options?: RouteQueryOptions) => {
    return getTraffic.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PPPController::getTraffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
getTraffic.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTraffic.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PPPController::getTraffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
getTraffic.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTraffic.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PPPController::getTraffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
    const getTrafficForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTraffic.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PPPController::getTraffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
        getTrafficForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTraffic.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PPPController::getTraffic
 * @see app/Http/Controllers/PPPController.php:342
 * @route '/ppp/traffic'
 */
        getTrafficForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTraffic.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTraffic.form = getTrafficForm
const PPPController = { index, getStats, storeSecret, updateSecret, deleteSecret, toggleSecret, disconnectActive, storeProfile, updateProfile, deleteProfile, getTraffic }

export default PPPController