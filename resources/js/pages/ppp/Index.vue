<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock,
    KeyRound,
    Network,
    RefreshCw,
    Shield,
    Sliders,
    UserCheck,
    UserPlus,
    Users,
    Wifi,
    XCircle,
} from '@lucide/vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import PPPActiveTable from '@/components/ppp/PPPActiveTable.vue';
import PPPProfileTable from '@/components/ppp/PPPProfileTable.vue';
import PPPSecretTable from '@/components/ppp/PPPSecretTable.vue';
import PPPTrafficMonitor from '@/components/ppp/PPPTrafficMonitor.vue';
import RouterQuickLoginCard from '@/components/router/RouterQuickLoginCard.vue';
import RouterSwitcher from '@/components/router/RouterSwitcher.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';
import type { PPPData, Router } from '@/types/router';

defineOptions({
    layout: AppLayout,
});

const props = defineProps<{
    activeRouter: Router | null;
    routers: Router[];
    pppData: PPPData | null;
    connectionError: string | null;
}>();

const liveData = ref<PPPData | null>(props.pppData);
const isRefreshing = ref(false);
const autoRefresh = ref(true);
const activeTab = ref<'active' | 'secret' | 'profile' | 'traffic'>('active');
let refreshTimer: any = null;

const refreshStats = async () => {
    if (!props.activeRouter) return;
    isRefreshing.value = true;

    try {
        const res = await fetch('/ppp/stats', {
            headers: {
                Accept: 'application/json',
            },
        });
        if (res.ok) {
            const data = await res.json();
            liveData.value = data;
        }
    } catch (e) {
        console.error('Failed to poll PPP data:', e);
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
    <Head title="MikroTik PPP Management" />

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
                <AlertTitle class="text-xs font-bold">PPP Offline Preview</AlertTitle>
                <AlertDescription class="text-xs">
                    {{ liveData?.error_message || connectionError }}
                    (Showing simulated PPP data. Check router connectivity.)
                </AlertDescription>
            </Alert>

            <!-- Top PPP Summary Cards -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <!-- PPP Active Stat -->
                <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
                    <CardHeader class="flex flex-row items-center justify-between pb-2">
                        <span class="text-xs font-semibold text-muted-foreground">PPP Active Sessions</span>
                        <UserCheck class="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-black">{{ liveData?.active_users?.length || 0 }}</span>
                            <span class="text-xs text-muted-foreground">connected</span>
                        </div>
                        <div class="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                            <Badge variant="outline" class="h-4 px-1 text-[9px] border-cyan-500/40 text-cyan-600 dark:text-cyan-400">
                                {{ (liveData?.active_users || []).filter(u => u.service === 'pppoe').length }} PPPoE
                            </Badge>
                            <Badge variant="outline" class="h-4 px-1 text-[9px] border-indigo-500/40 text-indigo-600 dark:text-indigo-400">
                                {{ (liveData?.active_users || []).filter(u => u.service !== 'pppoe').length }} VPN
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <!-- PPP Secret Stat -->
                <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
                    <CardHeader class="flex flex-row items-center justify-between pb-2">
                        <span class="text-xs font-semibold text-muted-foreground">PPP Secret Users</span>
                        <KeyRound class="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-black">{{ liveData?.secrets?.length || 0 }}</span>
                            <span class="text-xs text-muted-foreground">configured</span>
                        </div>
                        <div class="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                            <Badge variant="outline" class="h-4 px-1 text-[9px] border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                                {{ (liveData?.secrets || []).filter(s => s.disabled !== 'true' && s.disabled !== true).length }} Enabled
                            </Badge>
                            <Badge variant="outline" class="h-4 px-1 text-[9px] border-rose-500/40 text-rose-600 dark:text-rose-400">
                                {{ (liveData?.secrets || []).filter(s => s.disabled === 'true' || s.disabled === true).length }} Disabled
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <!-- Profiles Stat -->
                <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
                    <CardHeader class="flex flex-row items-center justify-between pb-2">
                        <span class="text-xs font-semibold text-muted-foreground">PPP Profiles</span>
                        <Network class="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-black">{{ liveData?.profiles?.length || 0 }}</span>
                            <span class="text-xs text-muted-foreground">profiles available</span>
                        </div>
                        <div class="mt-2 text-[11px] text-muted-foreground truncate">
                            Default: {{ (liveData?.profiles || [])[0]?.name || 'default' }}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Tab Navigation Bar -->
            <div class="flex items-center gap-1 border-b border-border/80 pb-px">
                <button
                    @click="activeTab = 'active'"
                    class="flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition-all"
                    :class="
                        activeTab === 'active'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    "
                >
                    <UserCheck class="h-4 w-4" />
                    <span>PPP Active</span>
                    <Badge variant="secondary" class="ml-1 px-1.5 py-0 text-[10px]">
                        {{ liveData?.active_users?.length || 0 }}
                    </Badge>
                </button>

                <button
                    @click="activeTab = 'secret'"
                    class="flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition-all"
                    :class="
                        activeTab === 'secret'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    "
                >
                    <KeyRound class="h-4 w-4" />
                    <span>PPP Secret (Users)</span>
                    <Badge variant="secondary" class="ml-1 px-1.5 py-0 text-[10px]">
                        {{ liveData?.secrets?.length || 0 }}
                    </Badge>
                </button>

                <button
                    @click="activeTab = 'profile'"
                    class="flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition-all"
                    :class="
                        activeTab === 'profile'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    "
                >
                    <Sliders class="h-4 w-4" />
                    <span>PPP Profiles</span>
                    <Badge variant="secondary" class="ml-1 px-1.5 py-0 text-[10px]">
                        {{ liveData?.profiles?.length || 0 }}
                    </Badge>
                </button>

                <button
                    @click="activeTab = 'traffic'"
                    class="flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition-all"
                    :class="
                        activeTab === 'traffic'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    "
                >
                    <Activity class="h-4 w-4" />
                    <span>Traffic Monitor</span>
                </button>
            </div>

            <!-- Tab Content -->
            <div class="mt-2 space-y-4">
                <!-- Tab 1: PPP Active -->
                <div v-if="activeTab === 'active'">
                    <PPPActiveTable
                        :active-users="liveData?.active_users || []"
                    />
                </div>

                <!-- Tab 2: PPP Secret -->
                <div v-if="activeTab === 'secret'">
                    <PPPSecretTable
                        :secrets="liveData?.secrets || []"
                        :profiles="liveData?.profiles || []"
                    />
                </div>

                <!-- Tab 3: PPP Profiles -->
                <div v-if="activeTab === 'profile'">
                    <PPPProfileTable
                        :profiles="liveData?.profiles || []"
                    />
                </div>

                <!-- Tab 4: Traffic Monitor -->
                <div v-if="activeTab === 'traffic'">
                    <PPPTrafficMonitor
                        :active-users="liveData?.active_users || []"
                        :interfaces="liveData?.interfaces || []"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
