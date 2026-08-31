<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock,
    Cpu,
    Flame,
    Layers,
    Loader2,
    Network,
    Plus,
    RefreshCw,
    Router as RouterIcon,
    Server,
    Shield,
    Terminal,
    Users,
    Wifi,
    Zap,
} from '@lucide/vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import RouterConnectModal from '@/components/router/RouterConnectModal.vue';
import RouterDhcpTable from '@/components/router/RouterDhcpTable.vue';
import RouterHotspotTable from '@/components/router/RouterHotspotTable.vue';
import RouterInterfacesTable from '@/components/router/RouterInterfacesTable.vue';
import RouterPingTool from '@/components/router/RouterPingTool.vue';
import RouterQuickLoginCard from '@/components/router/RouterQuickLoginCard.vue';
import RouterResourceCard from '@/components/router/RouterResourceCard.vue';
import RouterSwitcher from '@/components/router/RouterSwitcher.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { Router, RouterDashboardData } from '@/types/router';

defineOptions({
    layout: AppLayout,
});

const props = defineProps<{
    activeRouter: Router | null;
    routers: Router[];
    routerData: RouterDashboardData | null;
    connectionError: string | null;
}>();

const liveData = ref<RouterDashboardData | null>(props.routerData);
const isRefreshing = ref(false);
const autoRefresh = ref(true);
const activeTab = ref<'interfaces' | 'dhcp' | 'clients' | 'tools'>('interfaces');
let refreshTimer: any = null;

const refreshStats = async () => {
    if (!props.activeRouter) return;
    isRefreshing.value = true;

    try {
        const res = await fetch('/routers/stats', {
            headers: {
                Accept: 'application/json',
            },
        });
        if (res.ok) {
            const data = await res.json();
            liveData.value = data;
        }
    } catch (e) {
        console.error('Failed to poll stats:', e);
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
    <Head title="MikroTik Management Dashboard" />

    <div class="flex h-full flex-1 flex-col gap-5 p-4 sm:p-6">
        <!-- Case 1: No Active Router Connected -> Show Router Login & Session Selector -->
        <div v-if="!activeRouter || activeRouter.status !== 'connected'" class="my-auto">
            <RouterQuickLoginCard :saved-routers="routers" />
        </div>

        <!-- Case 2: Router Session Active -> Live Router Dashboard -->
        <div v-else class="space-y-5">
            <!-- Router Header & Fast Switcher Bar -->
            <RouterSwitcher
                :active-router="activeRouter"
                :routers="routers"
                :is-refreshing="isRefreshing"
                @refresh="refreshStats"
            />

            <!-- Connection Warning Alert if using fallback/mock or connection dropped -->
            <Alert
                v-if="liveData?.connection_failed || connectionError"
                variant="destructive"
                class="border-destructive/40 bg-destructive/10"
            >
                <AlertCircle class="h-4 w-4" />
                <AlertTitle class="text-xs font-bold">Physical Router Unreachable</AlertTitle>
                <AlertDescription class="text-xs">
                    {{ liveData?.error_message || connectionError }}
                    (Showing simulated diagnostics data for preview. Please check router IP/Port and network reachability.)
                </AlertDescription>
            </Alert>

            <!-- Top Resource Stat Cards (CPU, RAM, HDD, Uptime) -->
            <RouterResourceCard
                v-if="liveData"
                :data="liveData"
            />

            <!-- Main Data Tabs: Interfaces, DHCP, Hotspot/PPPoE, Diagnostics -->
            <div class="w-full space-y-4">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                        <button
                            type="button"
                            @click="activeTab = 'interfaces'"
                            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                            :class="activeTab === 'interfaces' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'"
                        >
                            <Activity class="h-3.5 w-3.5" />
                            <span>Interfaces ({{ liveData?.interfaces?.length || 0 }})</span>
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'dhcp'"
                            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                            :class="activeTab === 'dhcp' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'"
                        >
                            <Network class="h-3.5 w-3.5" />
                            <span>DHCP ({{ liveData?.dhcp_leases?.length || 0 }})</span>
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'clients'"
                            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                            :class="activeTab === 'clients' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'"
                        >
                            <Users class="h-3.5 w-3.5" />
                            <span>Active Users ({{ (liveData?.hotspot_active?.length || 0) + (liveData?.ppp_active?.length || 0) }})</span>
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'tools'"
                            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                            :class="activeTab === 'tools' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'"
                        >
                            <Terminal class="h-3.5 w-3.5" />
                            <span>Tools & Ping</span>
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

                <!-- Tab 1: Interfaces Table -->
                <div v-if="activeTab === 'interfaces'" class="space-y-4">
                    <RouterInterfacesTable
                        :interfaces="liveData?.interfaces || []"
                        :ip-addresses="liveData?.ip_addresses || []"
                    />
                </div>

                <!-- Tab 2: DHCP Leases -->
                <div v-if="activeTab === 'dhcp'" class="space-y-4">
                    <RouterDhcpTable
                        :leases="liveData?.dhcp_leases || []"
                    />
                </div>

                <!-- Tab 3: Hotspot & PPPoE Users -->
                <div v-if="activeTab === 'clients'" class="space-y-4">
                    <RouterHotspotTable
                        :hotspot-users="liveData?.hotspot_active || []"
                        :ppp-users="liveData?.ppp_active || []"
                    />
                </div>

                <!-- Tab 4: Diagnostics & Tools -->
                <div v-if="activeTab === 'tools'" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <RouterPingTool />

                    <!-- IP Addresses & Routing Overview -->
                    <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
                        <CardHeader class="pb-3">
                            <CardTitle class="flex items-center gap-2 text-base font-bold">
                                <Network class="h-4 w-4 text-emerald-500" />
                                <span>Configured IP Addresses</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="p-0">
                            <table class="w-full text-left text-xs">
                                <thead class="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th class="py-2.5 pl-4 pr-2">IP / Subnet</th>
                                        <th class="px-3 py-2.5">Network</th>
                                        <th class="py-2.5 pl-3 pr-4 text-right">Interface</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-border/60">
                                    <tr
                                        v-for="(ip, idx) in liveData?.ip_addresses || []"
                                        :key="idx"
                                        class="hover:bg-muted/30"
                                    >
                                        <td class="py-2.5 pl-4 pr-2 font-mono font-bold text-primary">
                                            {{ ip.address }}
                                        </td>
                                        <td class="px-3 py-2.5 font-mono text-muted-foreground">
                                            {{ ip.network || '-' }}
                                        </td>
                                        <td class="py-2.5 pl-3 pr-4 text-right font-medium">
                                            <Badge variant="outline" class="text-[10px]">
                                                {{ ip.interface }}
                                            </Badge>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>
