<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    Activity,
    AlertCircle,
    ArrowRightLeft,
    CheckCircle2,
    Flame,
    Globe,
    ListFilter,
    Loader2,
    Network,
    Plus,
    RefreshCw,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Zap,
} from '@lucide/vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import FirewallAddressListTable from '@/components/firewall/FirewallAddressListTable.vue';
import FirewallFilterTable from '@/components/firewall/FirewallFilterTable.vue';
import FirewallNatTable from '@/components/firewall/FirewallNatTable.vue';
import RouterQuickLoginCard from '@/components/router/RouterQuickLoginCard.vue';
import RouterSwitcher from '@/components/router/RouterSwitcher.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';
import type { FirewallData, Router } from '@/types/router';

defineOptions({
    layout: AppLayout,
});

const props = defineProps<{
    activeRouter: Router | null;
    routers: Router[];
    firewallData: FirewallData | null;
    connectionError: string | null;
}>();

const liveData = ref<FirewallData | null>(props.firewallData);
const isRefreshing = ref(false);
const autoRefresh = ref(true);
const activeTab = ref<'filter' | 'nat' | 'address-list'>('filter');
let refreshTimer: any = null;

const refreshStats = async () => {
    if (!props.activeRouter) return;
    isRefreshing.value = true;

    try {
        const res = await fetch('/firewall/stats', {
            headers: {
                Accept: 'application/json',
            },
        });
        if (res.ok) {
            const data = await res.json();
            liveData.value = data;
        }
    } catch (e) {
        console.error('Failed to poll firewall data:', e);
    } finally {
        isRefreshing.value = false;
    }
};

const setupAutoRefresh = () => {
    if (refreshTimer) clearInterval(refreshTimer);
    if (autoRefresh.value && props.activeRouter) {
        refreshTimer = setInterval(() => {
            refreshStats();
        }, 6000);
    }
};

onMounted(() => {
    setupAutoRefresh();
});

onBeforeUnmount(() => {
    if (refreshTimer) clearInterval(refreshTimer);
});
</script>

<template>
    <Head title="MikroTik Firewall & Security" />

    <div class="flex h-full flex-1 flex-col gap-5 p-4 sm:p-6">
        <!-- Case 1: No Active Router Connected -->
        <div v-if="!activeRouter || activeRouter.status !== 'connected'" class="my-auto">
            <RouterQuickLoginCard :saved-routers="routers" />
        </div>

        <!-- Case 2: Router Connected -->
        <div v-else class="space-y-5">
            <!-- Router Header & Fast Switcher Bar -->
            <RouterSwitcher
                :active-router="activeRouter"
                :routers="routers"
                :is-refreshing="isRefreshing"
                @refresh="refreshStats"
            />

            <!-- Warning Banner if simulated/fallback -->
            <Alert
                v-if="liveData?.connection_failed || connectionError"
                variant="destructive"
                class="border-destructive/40 bg-destructive/10"
            >
                <AlertCircle class="h-4 w-4" />
                <AlertTitle class="text-xs font-bold">Firewall Offline Preview</AlertTitle>
                <AlertDescription class="text-xs">
                    {{ liveData?.error_message || connectionError }}
                    (Showing simulated firewall data. Check router connectivity.)
                </AlertDescription>
            </Alert>

            <!-- Top Firewall Stat Cards -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <!-- Filter Rules Stat -->
                <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
                    <CardHeader class="flex flex-row items-center justify-between pb-2">
                        <span class="text-xs font-semibold text-muted-foreground">Filter Rules</span>
                        <ShieldCheck class="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-black">{{ liveData?.filter_rules?.length || 0 }}</span>
                            <span class="text-xs text-muted-foreground">rules active</span>
                        </div>
                        <div class="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                            <Badge variant="outline" class="h-4 px-1 text-[9px] border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                                {{ (liveData?.filter_rules || []).filter(r => r.action === 'accept').length }} Accept
                            </Badge>
                            <Badge variant="outline" class="h-4 px-1 text-[9px] border-rose-500/40 text-rose-600 dark:text-rose-400">
                                {{ (liveData?.filter_rules || []).filter(r => r.action === 'drop' || r.action === 'reject').length }} Drop
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <!-- NAT Rules Stat -->
                <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
                    <CardHeader class="flex flex-row items-center justify-between pb-2">
                        <span class="text-xs font-semibold text-muted-foreground">NAT Rules</span>
                        <ArrowRightLeft class="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-black">{{ liveData?.nat_rules?.length || 0 }}</span>
                            <span class="text-xs text-muted-foreground">translations</span>
                        </div>
                        <div class="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                            <Badge variant="outline" class="h-4 px-1 text-[9px] border-indigo-500/40 text-indigo-600 dark:text-indigo-400">
                                {{ (liveData?.nat_rules || []).filter(r => r.action === 'masquerade').length }} Masquerade
                            </Badge>
                            <Badge variant="outline" class="h-4 px-1 text-[9px] border-sky-500/40 text-sky-600 dark:text-sky-400">
                                {{ (liveData?.nat_rules || []).filter(r => r.action === 'dst-nat').length }} Port Forward
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <!-- Address Lists Stat -->
                <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
                    <CardHeader class="flex flex-row items-center justify-between pb-2">
                        <span class="text-xs font-semibold text-muted-foreground">Address Lists</span>
                        <ListFilter class="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-black">{{ liveData?.address_lists?.length || 0 }}</span>
                            <span class="text-xs text-muted-foreground">IP entries</span>
                        </div>
                        <div class="mt-2 text-[11px] text-muted-foreground">
                            <span>Across <b>{{ new Set((liveData?.address_lists || []).map(a => a.list)).size }}</b> unique named lists</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Tab Navigation Bar -->
            <div class="space-y-4">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                        <button
                            type="button"
                            @click="activeTab = 'filter'"
                            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                            :class="activeTab === 'filter' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'"
                        >
                            <ShieldCheck class="h-3.5 w-3.5" />
                            <span>Filter Rules ({{ liveData?.filter_rules?.length || 0 }})</span>
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'nat'"
                            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                            :class="activeTab === 'nat' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'"
                        >
                            <ArrowRightLeft class="h-3.5 w-3.5" />
                            <span>NAT ({{ liveData?.nat_rules?.length || 0 }})</span>
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'address-list'"
                            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                            :class="activeTab === 'address-list' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'"
                        >
                            <ListFilter class="h-3.5 w-3.5" />
                            <span>Address Lists ({{ liveData?.address_lists?.length || 0 }})</span>
                        </button>
                    </div>

                    <div class="flex items-center gap-2 text-xs text-muted-foreground">
                        <button
                            type="button"
                            @click="autoRefresh = !autoRefresh; setupAutoRefresh()"
                            class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-muted"
                            :class="autoRefresh ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-muted-foreground'"
                        >
                            <span
                                class="h-1.5 w-1.5 rounded-full"
                                :class="autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'"
                            />
                            <span>{{ autoRefresh ? 'Auto-Refresh (6s)' : 'Auto-Refresh: Off' }}</span>
                        </button>
                    </div>
                </div>

                <!-- Tab 1: Filter Rules -->
                <div v-if="activeTab === 'filter'" class="space-y-4">
                    <FirewallFilterTable
                        :rules="liveData?.filter_rules || []"
                        :interfaces="liveData?.interfaces || []"
                        :address-lists="liveData?.address_lists || []"
                    />
                </div>

                <!-- Tab 2: NAT Rules -->
                <div v-if="activeTab === 'nat'" class="space-y-4">
                    <FirewallNatTable
                        :rules="liveData?.nat_rules || []"
                        :interfaces="liveData?.interfaces || []"
                    />
                </div>

                <!-- Tab 3: Address Lists -->
                <div v-if="activeTab === 'address-list'" class="space-y-4">
                    <FirewallAddressListTable
                        :address-lists="liveData?.address_lists || []"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
