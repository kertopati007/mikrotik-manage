<script setup lang="ts">
import {
    Activity,
    ArrowDown,
    ArrowUp,
    Gauge,
    Loader2,
    Network,
    Pause,
    Play,
    RefreshCw,
    Shield,
    Wifi,
} from '@lucide/vue';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PPPActive, PPPTrafficData } from '@/types/router';

const props = defineProps<{
    activeUsers: PPPActive[];
    interfaces: Array<{ name: string; type?: string }>;
}>();

const selectedInterface = ref<string>('');
const isPolling = ref(true);
const isFetching = ref(false);
const trafficData = ref<PPPTrafficData>({
    interface: '',
    rx_bps: 0,
    tx_bps: 0,
    rx_formatted: '0 Bps',
    tx_formatted: '0 Bps',
    timestamp: Date.now(),
});

// Live history data points (last 15 ticks)
const history = ref<Array<{ rx: number; tx: number; time: string }>>([]);
let timer: any = null;

const initDefaultInterface = () => {
    if (props.interfaces && props.interfaces.length > 0) {
        // Try finding pppoe interface or active user interface
        const pppIface = props.interfaces.find(
            (i) => i.name.startsWith('<pppoe') || i.name.startsWith('<l2tp') || i.name.startsWith('pppoe')
        );
        selectedInterface.value = pppIface ? pppIface.name : props.interfaces[0].name;
    } else if (props.activeUsers && props.activeUsers.length > 0) {
        selectedInterface.value = `<pppoe-${props.activeUsers[0].name}>`;
    } else {
        selectedInterface.value = 'ether1-WAN';
    }
};

const fetchTraffic = async () => {
    if (!selectedInterface.value || isFetching.value) return;
    isFetching.value = true;

    try {
        const res = await fetch(`/ppp/traffic?interface=${encodeURIComponent(selectedInterface.value)}`, {
            headers: { Accept: 'application/json' },
        });

        if (res.ok) {
            const data = await res.json();
            trafficData.value = data;

            // Push to history
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            history.value.push({
                rx: data.rx_bps || 0,
                tx: data.tx_bps || 0,
                time: timeStr,
            });

            if (history.value.length > 20) {
                history.value.shift();
            }
        }
    } catch (e) {
        console.error('Failed to fetch PPP traffic:', e);
    } finally {
        isFetching.value = false;
    }
};

const startPolling = () => {
    stopPolling();
    if (isPolling.value) {
        fetchTraffic();
        timer = setInterval(fetchTraffic, 2000);
    }
};

const stopPolling = () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
};

const togglePolling = () => {
    isPolling.value = !isPolling.value;
    if (isPolling.value) {
        startPolling();
    } else {
        stopPolling();
    }
};

watch(selectedInterface, () => {
    history.value = [];
    fetchTraffic();
});

onMounted(() => {
    initDefaultInterface();
    startPolling();
});

onBeforeUnmount(() => {
    stopPolling();
});

const getMaxSpeed = () => {
    let max = 1_000_000; // Min 1 Mbps scale
    for (const h of history.value) {
        if (h.rx > max) max = h.rx;
        if (h.tx > max) max = h.tx;
    }
    return max;
};
</script>

<template>
    <div class="space-y-4">
        <!-- Interface Selector & Live Controls Card -->
        <Card class="border-border/80 bg-card/60 shadow-xs backdrop-blur">
            <CardHeader class="pb-3">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle class="flex items-center gap-2 text-base font-bold">
                        <Activity class="h-4 w-4 text-cyan-500" />
                        <span>PPP Real-time Traffic Monitor</span>
                    </CardTitle>

                    <div class="flex items-center gap-2">
                        <!-- Interface Dropdown -->
                        <div class="flex items-center gap-1.5">
                            <span class="text-xs text-muted-foreground font-medium">Interface:</span>
                            <select
                                v-model="selectedInterface"
                                class="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring font-mono"
                            >
                                <optgroup label="Active Users Dynamic Interfaces" v-if="activeUsers.length > 0">
                                    <option
                                        v-for="u in activeUsers"
                                        :key="u['.id'] || u.name"
                                        :value="`<pppoe-${u.name}>`"
                                    >
                                        {{ u.name }} ({{ u.service || 'pppoe' }} - {{ u.address || 'dynamic' }})
                                    </option>
                                </optgroup>
                                <optgroup label="Router Hardware Interfaces">
                                    <option
                                        v-for="iface in interfaces"
                                        :key="iface.name"
                                        :value="iface.name"
                                    >
                                        {{ iface.name }} {{ iface.type ? `(${iface.type})` : '' }}
                                    </option>
                                </optgroup>
                            </select>
                        </div>

                        <!-- Live Toggle Button -->
                        <Button
                            variant="outline"
                            size="sm"
                            class="h-8 gap-1.5 text-xs font-medium"
                            @click="togglePolling"
                        >
                            <Pause v-if="isPolling" class="h-3.5 w-3.5 text-amber-500" />
                            <Play v-else class="h-3.5 w-3.5 text-emerald-500" />
                            <span>{{ isPolling ? 'Pause Live' : 'Resume Live' }}</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <!-- Speed Display Cards -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- Download (Rx) Speed -->
                    <div class="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 backdrop-blur-xs">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                                Download (Rx) Speed
                            </span>
                            <div class="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                                <ArrowDown class="h-4 w-4 animate-bounce" />
                            </div>
                        </div>
                        <div class="mt-3 flex items-baseline gap-2">
                            <span class="text-3xl font-black tracking-tight text-foreground font-mono">
                                {{ trafficData.rx_formatted }}
                            </span>
                        </div>
                        <p class="mt-1 text-[11px] text-muted-foreground font-mono">
                            Raw Rate: {{ (trafficData.rx_bps || 0).toLocaleString() }} bps
                        </p>
                    </div>

                    <!-- Upload (Tx) Speed -->
                    <div class="relative overflow-hidden rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 backdrop-blur-xs">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                Upload (Tx) Speed
                            </span>
                            <div class="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
                                <ArrowUp class="h-4 w-4 animate-bounce" />
                            </div>
                        </div>
                        <div class="mt-3 flex items-baseline gap-2">
                            <span class="text-3xl font-black tracking-tight text-foreground font-mono">
                                {{ trafficData.tx_formatted }}
                            </span>
                        </div>
                        <p class="mt-1 text-[11px] text-muted-foreground font-mono">
                            Raw Rate: {{ (trafficData.tx_bps || 0).toLocaleString() }} bps
                        </p>
                    </div>
                </div>

                <!-- Live Bandwidth Chart Bars -->
                <div class="mt-6 space-y-2">
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                        <span class="font-semibold flex items-center gap-1.5">
                            <Gauge class="h-3.5 w-3.5 text-primary" />
                            Live Bandwidth Activity (Last {{ history.length }} Ticks)
                        </span>
                        <span class="font-mono text-[11px]">Polling Interval: 2s</span>
                    </div>

                    <div class="flex h-32 items-end gap-1.5 rounded-lg border border-border bg-muted/20 p-3">
                        <div
                            v-for="(point, idx) in history"
                            :key="idx"
                            class="flex flex-1 flex-col items-center h-full justify-end group relative"
                        >
                            <!-- Tooltip on hover -->
                            <div class="absolute -top-10 hidden group-hover:flex flex-col items-center bg-popover text-popover-foreground text-[10px] p-1 rounded shadow-md border z-10 whitespace-nowrap font-mono">
                                <div>Rx: {{ (point.rx / 1000000).toFixed(2) }} Mbps</div>
                                <div>Tx: {{ (point.tx / 1000000).toFixed(2) }} Mbps</div>
                            </div>

                            <div class="w-full flex items-end justify-center gap-0.5 h-full">
                                <!-- Download Bar (Cyan) -->
                                <div
                                    class="w-1/2 rounded-t-xs bg-cyan-500 transition-all duration-300"
                                    :style="{ height: Math.max(5, (point.rx / getMaxSpeed()) * 100) + '%' }"
                                ></div>
                                <!-- Upload Bar (Purple) -->
                                <div
                                    class="w-1/2 rounded-t-xs bg-purple-500 transition-all duration-300"
                                    :style="{ height: Math.max(5, (point.tx / getMaxSpeed()) * 100) + '%' }"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <!-- Legend -->
                    <div class="flex items-center justify-center gap-6 pt-1 text-xs">
                        <div class="flex items-center gap-1.5">
                            <div class="h-3 w-3 rounded-xs bg-cyan-500"></div>
                            <span class="font-medium text-muted-foreground">Download (Rx)</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <div class="h-3 w-3 rounded-xs bg-purple-500"></div>
                            <span class="font-medium text-muted-foreground">Upload (Tx)</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
