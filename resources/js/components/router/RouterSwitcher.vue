<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    Activity,
    Check,
    ChevronDown,
    Loader2,
    LogOut,
    Plus,
    Power,
    RefreshCw,
    Router as RouterIcon,
    Server,
    Shield,
    Wifi,
    Zap,
} from '@lucide/vue';
import { ref } from 'vue';
import RouterConnectModal from '@/components/router/RouterConnectModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Router } from '@/types/router';

const props = defineProps<{
    activeRouter: Router | null;
    routers: Router[];
    isRefreshing?: boolean;
}>();

const emit = defineEmits<{
    (e: 'refresh'): void;
}>();

const isConnecting = ref<number | null>(null);
const isRebooting = ref(false);
const showAddModal = ref(false);

const handleSwitchRouter = (routerItem: Router) => {
    if (props.activeRouter?.id === routerItem.id) return;

    isConnecting.value = routerItem.id;
    router.post(
        `/routers/${routerItem.id}/connect`,
        {},
        {
            onFinish: () => {
                isConnecting.value = null;
            },
        }
    );
};

const handleDisconnect = () => {
    if (!props.activeRouter) return;
    router.post(`/routers/${props.activeRouter.id}/disconnect`);
};

const handleReboot = async () => {
    if (!props.activeRouter) return;
    if (!confirm(`Are you sure you want to reboot ${props.activeRouter.name}?`))
        return;

    isRebooting.value = true;
    try {
        await fetch(`/routers/${props.activeRouter.id}/reboot`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
        });
        alert('Reboot command sent to router.');
    } catch (e: any) {
        alert('Failed to reboot: ' + e.message);
    } finally {
        isRebooting.value = false;
    }
};
</script>

<template>
    <div
        class="flex flex-col gap-3 rounded-xl border bg-card/60 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between"
    >
        <!-- Left: Active Router Info & Switcher Dropdown -->
        <div class="flex items-center gap-3">
            <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"
            >
                <RouterIcon class="h-6 w-6" />
            </div>

            <div>
                <div class="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 gap-1.5 px-2 text-base font-bold tracking-tight hover:bg-muted"
                            >
                                <span>{{
                                    activeRouter?.name || 'Select a Router'
                                }}</span>
                                <ChevronDown class="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent class="w-64" align="start">
                            <DropdownMenuLabel class="text-xs font-semibold text-muted-foreground"
                                >Saved Routers</DropdownMenuLabel
                            >
                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    v-for="r in routers"
                                    :key="r.id"
                                    @click="handleSwitchRouter(r)"
                                    class="flex items-center justify-between py-2 text-xs"
                                >
                                    <div class="flex flex-col">
                                        <span class="font-medium text-foreground">{{
                                            r.name
                                        }}</span>
                                        <span class="font-mono text-[10px] text-muted-foreground">
                                            {{ r.host }}:{{ r.port }}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <Loader2
                                            v-if="isConnecting === r.id"
                                            class="h-3.5 w-3.5 animate-spin text-primary"
                                        />
                                        <Check
                                            v-else-if="activeRouter?.id === r.id"
                                            class="h-4 w-4 text-primary"
                                        />
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                @click="showAddModal = true"
                                class="cursor-pointer text-xs font-medium text-primary"
                            >
                                <Plus class="mr-2 h-3.5 w-3.5" />
                                <span>Add New Router Profile</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <!-- Status Indicator Badge -->
                    <Badge
                        v-if="activeRouter"
                        variant="outline"
                        class="h-5 gap-1.5 px-2 text-[10px] font-semibold"
                        :class="
                            activeRouter.status === 'connected'
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'border-amber-500/40 bg-amber-500/10 text-amber-600'
                        "
                    >
                        <span
                            class="h-1.5 w-1.5 rounded-full"
                            :class="
                                activeRouter.status === 'connected'
                                    ? 'animate-pulse bg-emerald-500'
                                    : 'bg-amber-500'
                            "
                        />
                        <span>{{
                            activeRouter.status === 'connected'
                                ? 'Active Session'
                                : 'Disconnected'
                        }}</span>
                    </Badge>
                </div>

                <div
                    v-if="activeRouter"
                    class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground"
                >
                    <span class="font-mono"
                        >{{ activeRouter.host }}:{{ activeRouter.port }}</span
                    >
                    <span>•</span>
                    <span class="flex items-center gap-1">
                        <Shield
                            v-if="activeRouter.use_ssl"
                            class="h-3 w-3 text-emerald-500"
                        />
                        <span>User: {{ activeRouter.username }}</span>
                    </span>
                    <span v-if="activeRouter.last_connected_at">•</span>
                    <span
                        v-if="activeRouter.last_connected_at"
                        class="text-[11px]"
                    >
                        Connected: {{ activeRouter.last_connected_at }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Right: Actions (Refresh, Ping, Reboot, Disconnect) -->
        <div class="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                @click="emit('refresh')"
                :disabled="isRefreshing"
                class="h-8 gap-1.5 text-xs"
                title="Refresh Live Metrics"
            >
                <RefreshCw
                    class="h-3.5 w-3.5"
                    :class="{ 'animate-spin': isRefreshing }"
                />
                <span class="hidden sm:inline">Refresh</span>
            </Button>

            <Button
                v-if="activeRouter"
                variant="outline"
                size="sm"
                @click="handleReboot"
                :disabled="isRebooting"
                class="h-8 gap-1.5 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
                title="Reboot Router"
            >
                <Power class="h-3.5 w-3.5" />
                <span class="hidden md:inline">Reboot</span>
            </Button>

            <Button
                v-if="activeRouter"
                variant="destructive"
                size="sm"
                @click="handleDisconnect"
                class="h-8 gap-1.5 text-xs"
                title="Disconnect Router Session"
            >
                <LogOut class="h-3.5 w-3.5" />
                <span class="hidden sm:inline">Disconnect</span>
            </Button>

            <RouterConnectModal
                v-model:open="showAddModal"
                :show-trigger="false"
            />
        </div>
    </div>
</template>
