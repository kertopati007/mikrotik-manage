<script setup lang="ts">
import {
    Activity,
    Clock,
    Cpu,
    Database,
    Flame,
    HardDrive,
    Layers,
    Server,
    Zap,
} from '@lucide/vue';
import { computed } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import type { RouterDashboardData } from '@/types/router';

const props = defineProps<{
    data: RouterDashboardData;
}>();

const formatBytes = (bytesStr?: string | number) => {
    if (!bytesStr) return '0 MB';
    const bytes = typeof bytesStr === 'string' ? parseInt(bytesStr, 10) : bytesStr;
    if (isNaN(bytes)) return '0 MB';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const cpuLoad = computed(() => {
    const load = parseInt(props.data?.resource?.['cpu-load'] || '0', 10);
    return isNaN(load) ? 0 : load;
});

const memoryStats = computed(() => {
    const total = parseInt(props.data?.resource?.['total-memory'] || '0', 10);
    const free = parseInt(props.data?.resource?.['free-memory'] || '0', 10);
    const used = total - free;
    const percent = total > 0 ? Math.round((used / total) * 100) : 0;

    return {
        totalStr: formatBytes(total),
        freeStr: formatBytes(free),
        usedStr: formatBytes(used),
        percent: Math.min(100, Math.max(0, percent)),
    };
});

const hddStats = computed(() => {
    const total = parseInt(props.data?.resource?.['total-hdd-space'] || '0', 10);
    const free = parseInt(props.data?.resource?.['free-hdd-space'] || '0', 10);
    const used = total - free;
    const percent = total > 0 ? Math.round((used / total) * 100) : 0;

    return {
        totalStr: formatBytes(total),
        freeStr: formatBytes(free),
        usedStr: formatBytes(used),
        percent: Math.min(100, Math.max(0, percent)),
    };
});
</script>

<template>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- 1. CPU Load Card -->
        <Card class="relative overflow-hidden border-border/80 bg-card/60 shadow-xs backdrop-blur">
            <CardContent class="p-4">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >CPU Load</span
                    >
                    <div
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    >
                        <Cpu class="h-4 w-4" />
                    </div>
                </div>

                <div class="mt-3 flex items-baseline gap-2">
                    <span class="text-2xl font-black tracking-tight text-foreground"
                        >{{ cpuLoad }}%</span
                    >
                    <span class="text-xs text-muted-foreground font-mono">
                        {{ data?.resource?.['cpu-frequency'] ? `${data.resource['cpu-frequency']} MHz` : '' }}
                    </span>
                </div>

                <!-- Progress Bar -->
                <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="[
                            cpuLoad > 80
                                ? 'bg-destructive'
                                : cpuLoad > 50
                                  ? 'bg-amber-500'
                                  : 'bg-blue-500',
                        ]"
                        :style="{ width: `${cpuLoad}%` }"
                    />
                </div>

                <div class="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{{ data?.resource?.['cpu-count'] || '1' }} Cores</span>
                    <span class="truncate max-w-[120px] font-mono text-[10px]">{{ data?.resource?.['architecture-name'] || 'RouterOS' }}</span>
                </div>
            </CardContent>
        </Card>

        <!-- 2. Memory / RAM Card -->
        <Card class="relative overflow-hidden border-border/80 bg-card/60 shadow-xs backdrop-blur">
            <CardContent class="p-4">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >RAM Usage</span
                    >
                    <div
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                        <Layers class="h-4 w-4" />
                    </div>
                </div>

                <div class="mt-3 flex items-baseline gap-2">
                    <span class="text-2xl font-black tracking-tight text-foreground"
                        >{{ memoryStats.percent }}%</span
                    >
                    <span class="text-xs text-muted-foreground font-mono">
                        {{ memoryStats.usedStr }} / {{ memoryStats.totalStr }}
                    </span>
                </div>

                <!-- Progress Bar -->
                <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="[
                            memoryStats.percent > 85
                                ? 'bg-destructive'
                                : memoryStats.percent > 65
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500',
                        ]"
                        :style="{ width: `${memoryStats.percent}%` }"
                    />
                </div>

                <div class="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Free: {{ memoryStats.freeStr }}</span>
                    <span>Total: {{ memoryStats.totalStr }}</span>
                </div>
            </CardContent>
        </Card>

        <!-- 3. HDD Storage Card -->
        <Card class="relative overflow-hidden border-border/80 bg-card/60 shadow-xs backdrop-blur">
            <CardContent class="p-4">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >Storage (HDD)</span
                    >
                    <div
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    >
                        <HardDrive class="h-4 w-4" />
                    </div>
                </div>

                <div class="mt-3 flex items-baseline gap-2">
                    <span class="text-2xl font-black tracking-tight text-foreground"
                        >{{ hddStats.percent }}%</span
                    >
                    <span class="text-xs text-muted-foreground font-mono">
                        {{ hddStats.usedStr }} / {{ hddStats.totalStr }}
                    </span>
                </div>

                <!-- Progress Bar -->
                <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                        class="h-full rounded-full bg-purple-500 transition-all duration-500"
                        :style="{ width: `${hddStats.percent}%` }"
                    />
                </div>

                <div class="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Free: {{ hddStats.freeStr }}</span>
                    <span>Total: {{ hddStats.totalStr }}</span>
                </div>
            </CardContent>
        </Card>

        <!-- 4. Router Info & Uptime Card -->
        <Card class="relative overflow-hidden border-border/80 bg-card/60 shadow-xs backdrop-blur">
            <CardContent class="p-4">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >Router OS & Uptime</span
                    >
                    <div
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    >
                        <Clock class="h-4 w-4" />
                    </div>
                </div>

                <div class="mt-2.5 space-y-1">
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-muted-foreground">Uptime:</span>
                        <span class="font-mono text-xs font-bold text-foreground">
                            {{ data?.resource?.uptime || 'N/A' }}
                        </span>
                    </div>

                    <div class="flex items-center justify-between">
                        <span class="text-xs text-muted-foreground">Version:</span>
                        <span class="font-mono text-xs font-bold text-primary">
                            {{ data?.resource?.version || 'RouterOS' }}
                        </span>
                    </div>

                    <div class="flex items-center justify-between">
                        <span class="text-xs text-muted-foreground">Board:</span>
                        <span class="font-mono text-xs text-foreground truncate max-w-[130px]">
                            {{ data?.resource?.['board-name'] || data?.routerboard?.model || 'MikroTik' }}
                        </span>
                    </div>

                    <div
                        v-if="data?.health?.voltage || data?.health?.temperature"
                        class="flex items-center justify-between pt-1 border-t text-[11px]"
                    >
                        <span v-if="data?.health?.temperature" class="flex items-center gap-1 text-amber-600">
                            <Flame class="h-3 w-3" /> {{ data.health.temperature }}°C
                        </span>
                        <span v-if="data?.health?.voltage" class="flex items-center gap-1 text-emerald-600">
                            <Zap class="h-3 w-3" /> {{ data.health.voltage }}V
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
